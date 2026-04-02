import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  var nextCounter = 1;

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  type GiftPackageId = Text;
  type ShareToken = Text;

  type GiftPackageContent = {
    id : GiftPackageId;
    creatorId : Principal;
    title : Text;
    themeId : Text;
    message : Text;
    photoUrl : Text;
    memeId : Text;
    songId : Text;
    gameType : Text;
    voiceNoteUrl : Text;
    bgMusicId : Text;
    shareToken : ShareToken;
    status : { #draft; #published };
    createdAt : Int;
    updatedAt : Int;
    extraSections : [ExtraSection];
  };

  type QuizQuestion = {
    id : Text;
    questionText : Text;
    choices : [Text];
    imageUrls : [Text];
    correctIndex : Nat;
    aiSuggested : Bool;
  };

  type Challenge = {
    id : Text;
    challengeType : Text;
    prompt : Text;
    rewardMessage : Text;
  };

  type ExtraSection = {
    id : Text;
    sectionLabel : Text;
    content : Text;
    sectionType : Text;
  };

  type QuizData = { questions : [QuizQuestion] };
  type ChallengeData = { challenges : [Challenge] };

  type PackageExtras = {
    quiz : QuizData;
    challengeData : ChallengeData;
  };

  type CreatorSettings = {
    customSectionLabels : [Text];
    stepOrder : [Text];
  };

  let packages = Map.empty<GiftPackageId, GiftPackageContent>();
  let extras = Map.empty<GiftPackageId, PackageExtras>();
  let shareTokens = Map.empty<ShareToken, GiftPackageId>();
  let creatorSettings = Map.empty<Principal, CreatorSettings>();

  module GiftPackageContent {
    public func compare(a : GiftPackageContent, b : GiftPackageContent) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  // Auto-register any authenticated caller as a user on first action
  func ensureRegistered(caller : Principal) {
    if (caller.isAnonymous()) { return };
    switch (accessControlState.userRoles.get(caller)) {
      case (?_) {};
      case (null) {
        if (not accessControlState.adminAssigned) {
          accessControlState.userRoles.add(caller, #admin);
          accessControlState.adminAssigned := true;
        } else {
          accessControlState.userRoles.add(caller, #user);
        };
      };
    };
  };

  func getPackageInternal(caller : Principal, id : GiftPackageId) : GiftPackageContent {
    switch (packages.get(id)) {
      case (null) { Runtime.trap("Package not found") };
      case (?package) {
        if (package.creatorId != caller) {
          Runtime.trap("You are not the owner of this package");
        };
        package;
      };
    };
  };

  public shared ({ caller }) func createPackage(title : Text) : async {
    #ok : GiftPackageContent;
    #err : Text;
  } {
    ensureRegistered(caller);
    if (caller.isAnonymous()) { return #err("Please log in to create a kit") };

    let id = caller.toText() # "-" # nextCounter.toText();
    nextCounter += 1;

    let package : GiftPackageContent = {
      id;
      creatorId = caller;
      title;
      themeId = "";
      message = "";
      photoUrl = "";
      memeId = "";
      songId = "";
      gameType = "";
      voiceNoteUrl = "";
      bgMusicId = "";
      shareToken = "";
      status = #draft;
      createdAt = Time.now();
      updatedAt = Time.now();
      extraSections = [];
    };

    packages.add(id, package);
    #ok package;
  };

  public shared ({ caller }) func updatePackage(id : GiftPackageId, title : Text, themeId : Text, message : Text, photoUrl : Text, memeId : Text, songId : Text, gameType : Text, voiceNoteUrl : Text, bgMusicId : Text, extraSections : [ExtraSection]) : async { #ok : GiftPackageContent; #err : Text } {
    ensureRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let existingPackage = getPackageInternal(caller, id);
    let updatedPackage : GiftPackageContent = {
      existingPackage with
      title; themeId; message; photoUrl; memeId; songId; gameType; voiceNoteUrl; bgMusicId; extraSections;
      updatedAt = Time.now();
    };
    packages.add(id, updatedPackage);
    #ok updatedPackage;
  };

  public shared ({ caller }) func updatePackageExtras(id : GiftPackageId, quiz : QuizData, challengeData : ChallengeData) : async {
    #ok : Bool;
    #err : Text;
  } {
    ensureRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let package = getPackageInternal(caller, id);
    extras.add(id, { quiz; challengeData });
    #ok true;
  };

  public shared ({ caller }) func publishPackage(id : GiftPackageId) : async {
    #ok : Text;
    #err : Text;
  } {
    ensureRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (packages.get(id)) {
      case (null) { #err("Package not found") };
      case (?package) {
        if (package.creatorId != caller) { return #err("Unauthorized") };
        let token = id # "-token-" # Time.now().toText();
        let updatedPackage : GiftPackageContent = { package with shareToken = token; status = #published };
        packages.add(id, updatedPackage);
        shareTokens.add(token, id);
        #ok(token);
      };
    };
  };

  public query ({ caller }) func getPackage(id : GiftPackageId) : async { #ok : GiftPackageContent; #err : Text } {
    if (caller.isAnonymous()) { return #err("Please log in") };
    switch (packages.get(id)) {
      case (null) { #err("Package does not exist") };
      case (?p) {
        if (p.creatorId != caller) { return #err("Unauthorized") };
        #ok p;
      };
    };
  };

  public query ({ caller }) func getPackageByToken(token : ShareToken) : async {
    #ok : GiftPackageContent;
    #err : Text;
  } {
    switch (shareTokens.get(token)) {
      case (null) { #err("Invalid token") };
      case (?packageId) {
        switch (packages.get(packageId)) {
          case (null) { #err("Package not found") };
          case (?package) { #ok package };
        };
      };
    };
  };

  public query ({ caller }) func getPackageExtras(id : GiftPackageId) : async {
    #ok : PackageExtras;
    #err : Text;
  } {
    switch (packages.get(id)) {
      case (null) { #err("Package not found") };
      case (?package) {
        if (package.creatorId != caller) {
          switch (package.status) {
            case (#draft) { return #err("Unauthorized") };
            case (#published) {};
          };
        };
        switch (extras.get(id)) {
          case (null) { #err("Extras not found") };
          case (?e) { #ok e };
        };
      };
    };
  };

  public query ({ caller }) func listMyPackages() : async [GiftPackageContent] {
    if (caller.isAnonymous()) { return [] };
    packages.values().toArray().filter(func(p) { p.creatorId == caller }).sort();
  };

  public shared ({ caller }) func deletePackage(id : GiftPackageId) : async {
    #ok : Bool;
    #err : Text;
  } {
    ensureRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let package = getPackageInternal(caller, id);
    if (package.creatorId != caller) { return #err("Unauthorized") };
    packages.remove(id);
    extras.remove(id);
    #ok true;
  };

  public query ({ caller }) func getCreatorSettings() : async CreatorSettings {
    if (caller.isAnonymous()) { return { customSectionLabels = []; stepOrder = [] } };
    switch (creatorSettings.get(caller)) {
      case (null) { { customSectionLabels = []; stepOrder = [] } };
      case (?settings) { settings };
    };
  };

  public shared ({ caller }) func updateCreatorSettings(settings : CreatorSettings) : async {
    #ok : Bool;
    #err : Text;
  } {
    ensureRegistered(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    creatorSettings.add(caller, settings);
    #ok true;
  };

  public query ({ caller }) func suggestQuizQuestions(topic : Text) : async [Text] {
    switch (topic, topic) {
      case ("relationships", _) { ["What's your partner's favorite vacation destination?", "What is your partner's go-to comfort food?", "What song reminds you of your relationship?", "Which memory makes your partner smile instantly?", "What's your partner's guilty pleasure movie?"] };
      case ("friendship", _) { ["What's your friend's most embarrassing moment?", "Which inside joke always cracks them up?", "What trip have you two always wanted to take together?", "What is their hidden talent?", "Which song perfectly describes your friendship?"] };
      case ("family", _) { ["What is your favorite family tradition?", "Which family member makes you laugh the most?", "What weird family ritual do you have?", "What's your go-to meal for family gatherings?", "Name a movie that your whole family loves."] };
      case ("memories", _) { ["What is your earliest childhood memory?", "Which trip changed your perspective on life?", "Share a hilarious school story.", "What song instantly brings back memories for you?", "Describe a memory you'd relive all over again."] };
      case (_, _) { ["What is the best surprise you've ever received?", "What song always puts you in a good mood?", "Describe your dream vacation destination.", "What food brings back childhood memories?", "What's a movie that never gets old for you?"] };
    };
  };
};
