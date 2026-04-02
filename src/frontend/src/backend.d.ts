import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChallengeData {
    challenges: Array<Challenge>;
}
export interface QuizQuestion {
    id: string;
    imageUrls: Array<string>;
    correctIndex: bigint;
    questionText: string;
    aiSuggested: boolean;
    choices: Array<string>;
}
export interface PackageExtras {
    quiz: QuizData;
    challengeData: ChallengeData;
}
export interface Challenge {
    id: string;
    rewardMessage: string;
    challengeType: string;
    prompt: string;
}
export interface CreatorSettings {
    customSectionLabels: Array<string>;
    stepOrder: Array<string>;
}
export interface ExtraSection {
    id: string;
    content: string;
    sectionType: string;
    sectionLabel: string;
}
export type GiftPackageId = string;
export interface GiftPackageContent {
    id: GiftPackageId;
    memeId: string;
    status: Variant_published_draft;
    title: string;
    songId: string;
    createdAt: bigint;
    voiceNoteUrl: string;
    shareToken: ShareToken;
    creatorId: Principal;
    photoUrl: string;
    updatedAt: bigint;
    bgMusicId: string;
    message: string;
    gameType: string;
    themeId: string;
    extraSections: Array<ExtraSection>;
}
export interface QuizData {
    questions: Array<QuizQuestion>;
}
export type ShareToken = string;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_published_draft {
    published = "published",
    draft = "draft"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPackage(title: string): Promise<{
        __kind__: "ok";
        ok: GiftPackageContent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deletePackage(id: GiftPackageId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCallerUserRole(): Promise<UserRole>;
    getCreatorSettings(): Promise<CreatorSettings>;
    getPackage(id: GiftPackageId): Promise<{
        __kind__: "ok";
        ok: GiftPackageContent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPackageByToken(token: ShareToken): Promise<{
        __kind__: "ok";
        ok: GiftPackageContent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPackageExtras(id: GiftPackageId): Promise<{
        __kind__: "ok";
        ok: PackageExtras;
    } | {
        __kind__: "err";
        err: string;
    }>;
    isCallerAdmin(): Promise<boolean>;
    listMyPackages(): Promise<Array<GiftPackageContent>>;
    publishPackage(id: GiftPackageId): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    suggestQuizQuestions(topic: string): Promise<Array<string>>;
    updateCreatorSettings(settings: CreatorSettings): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePackage(id: GiftPackageId, title: string, themeId: string, message: string, photoUrl: string, memeId: string, songId: string, gameType: string, voiceNoteUrl: string, bgMusicId: string, extraSections: Array<ExtraSection>): Promise<{
        __kind__: "ok";
        ok: GiftPackageContent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePackageExtras(id: GiftPackageId, quiz: QuizData, challengeData: ChallengeData): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
