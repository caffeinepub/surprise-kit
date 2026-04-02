import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChallengeData, ExtraSection, QuizData } from "../backend.d";
import KitPreviewModal from "../components/KitPreviewModal";
import WizardStepper from "../components/WizardStepper";
import ChallengeBuilder from "../components/wizard/ChallengeBuilder";
import GamePicker from "../components/wizard/GamePicker";
import MemeSelector from "../components/wizard/MemeSelector";
import MessageComposer from "../components/wizard/MessageComposer";
import MusicSelector from "../components/wizard/MusicSelector";
import QuizBuilder from "../components/wizard/QuizBuilder";
import SettingsFinish from "../components/wizard/SettingsFinish";
import SongSelector from "../components/wizard/SongSelector";
import ThemeSelector from "../components/wizard/ThemeSelector";
import VoiceRecorder from "../components/wizard/VoiceRecorder";
import {
  useGetPackage,
  useGetPackageExtras,
  useUpdatePackage,
  useUpdatePackageExtras,
} from "../hooks/useQueries";
import { getTheme } from "../lib/themes";

export interface PackageState {
  id: string;
  title: string;
  themeId: string;
  message: string;
  photoUrl: string;
  memeId: string;
  songId: string;
  gameType: string;
  voiceNoteUrl: string;
  bgMusicId: string;
  extraSections: ExtraSection[];
  quiz: QuizData;
  challengeData: ChallengeData;
  showMeme: boolean;
  showSong: boolean;
  showGame: boolean;
  showQuiz: boolean;
  showVoice: boolean;
  showChallenge: boolean;
}

const DEFAULT_STATE: PackageState = {
  id: "",
  title: "My Surprise Kit",
  themeId: "rose_garden",
  message: "",
  photoUrl: "",
  memeId: "",
  songId: "",
  gameType: "",
  voiceNoteUrl: "",
  bgMusicId: "",
  extraSections: [],
  quiz: { questions: [] },
  challengeData: { challenges: [] },
  showMeme: true,
  showSong: true,
  showGame: true,
  showQuiz: true,
  showVoice: true,
  showChallenge: true,
};

export default function KitCreator() {
  const { id } = useParams({ from: "/create/$id" });
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState<PackageState>({ ...DEFAULT_STATE, id });
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");
  const initializedRef = useRef(false);

  const { data: remotePackage } = useGetPackage(id);
  const { data: remoteExtras } = useGetPackageExtras(id);
  const updatePackage = useUpdatePackage();
  const updateExtras = useUpdatePackageExtras();

  // Initialize state from backend
  useEffect(() => {
    if (remotePackage && !initializedRef.current) {
      initializedRef.current = true;
      setPkg((prev) => ({
        ...prev,
        id: remotePackage.id,
        title: remotePackage.title || "My Surprise Kit",
        themeId: remotePackage.themeId || "rose_garden",
        message: remotePackage.message || "",
        photoUrl: remotePackage.photoUrl || "",
        memeId: remotePackage.memeId || "",
        songId: remotePackage.songId || "",
        gameType: remotePackage.gameType || "",
        voiceNoteUrl: remotePackage.voiceNoteUrl || "",
        bgMusicId: remotePackage.bgMusicId || "",
        extraSections: remotePackage.extraSections || [],
      }));
    }
  }, [remotePackage]);

  useEffect(() => {
    if (remoteExtras && !initializedRef.current) {
      setPkg((prev) => ({
        ...prev,
        quiz: remoteExtras.quiz || { questions: [] },
        challengeData: remoteExtras.challengeData || { challenges: [] },
      }));
    }
  }, [remoteExtras]);

  // Auto-save with debounce
  const triggerSave = useCallback(
    (state: PackageState) => {
      const stateKey = JSON.stringify(state);
      if (stateKey === lastSavedRef.current) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaveStatus("saving");
      saveTimerRef.current = setTimeout(async () => {
        try {
          await Promise.all([
            updatePackage.mutateAsync({
              id: state.id,
              title: state.title,
              themeId: state.themeId,
              message: state.message,
              photoUrl: state.photoUrl,
              memeId: state.memeId,
              songId: state.songId,
              gameType: state.gameType,
              voiceNoteUrl: state.voiceNoteUrl,
              bgMusicId: state.bgMusicId,
              extraSections: state.extraSections,
            }),
            updateExtras.mutateAsync({
              id: state.id,
              quiz: state.quiz,
              challengeData: state.challengeData,
            }),
          ]);
          lastSavedRef.current = stateKey;
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 3000);
        } catch {
          setSaveStatus("idle");
        }
      }, 2000);
    },
    [updatePackage, updateExtras],
  );

  const updatePkg = useCallback(
    (updates: Partial<PackageState>) => {
      setPkg((prev) => {
        const next = { ...prev, ...updates };
        triggerSave(next);
        return next;
      });
    },
    [triggerSave],
  );

  const theme = getTheme(pkg.themeId);

  const stepComponents: Record<number, React.ReactNode> = {
    1: (
      <ThemeSelector
        value={pkg.themeId}
        onChange={(v) => updatePkg({ themeId: v })}
      />
    ),
    2: (
      <MessageComposer
        message={pkg.message}
        photoUrl={pkg.photoUrl}
        onChange={(m, p) =>
          updatePkg({ message: m, photoUrl: p ?? pkg.photoUrl })
        }
      />
    ),
    3: (
      <MemeSelector
        value={pkg.memeId}
        onChange={(v) => updatePkg({ memeId: v })}
      />
    ),
    4: (
      <SongSelector
        value={pkg.songId}
        onChange={(v) => updatePkg({ songId: v })}
      />
    ),
    5: (
      <GamePicker
        value={pkg.gameType}
        onChange={(v) => updatePkg({ gameType: v })}
      />
    ),
    6: (
      <QuizBuilder
        quiz={pkg.quiz}
        packageTitle={pkg.title}
        onChange={(q) => updatePkg({ quiz: q })}
      />
    ),
    7: (
      <VoiceRecorder
        value={pkg.voiceNoteUrl}
        onChange={(v) => updatePkg({ voiceNoteUrl: v })}
      />
    ),
    8: (
      <ChallengeBuilder
        value={pkg.challengeData}
        onChange={(v) => updatePkg({ challengeData: v })}
      />
    ),
    9: (
      <MusicSelector
        value={pkg.bgMusicId}
        onChange={(v) => updatePkg({ bgMusicId: v })}
      />
    ),
    10: (
      <SettingsFinish
        pkg={pkg}
        onChange={updatePkg}
        onPreview={() => setShowPreview(true)}
      />
    ),
  };

  // Preview panel completion indicators
  const filled = {
    theme: !!pkg.themeId,
    message: !!pkg.message,
    meme: !!pkg.memeId,
    song: !!pkg.songId,
    game: !!pkg.gameType,
    quiz: pkg.quiz.questions.length > 0,
    voice: !!pkg.voiceNoteUrl,
    challenge: pkg.challengeData.challenges.length > 0,
    music: !!pkg.bgMusicId,
  };

  return (
    <div className="min-h-screen paper-texture">
      {/* Header */}
      <header className="blush-gradient border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5"
            onClick={() => navigate({ to: "/" })}
            data-ocid="wizard.back_button"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> My Kits
          </Button>
          <span className="font-display font-bold text-base truncate max-w-[200px]">
            {pkg.title}
          </span>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-primary flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => setShowPreview(true)}
              data-ocid="wizard.preview_button"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Stepper */}
        <div className="mb-6">
          <WizardStepper currentStep={step} onStepClick={setStep} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: step content */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-2xl card-shadow border border-border p-6 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {stepComponents[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                className="rounded-full gap-1.5"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                data-ocid="wizard.pagination_prev"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              {step < 10 ? (
                <Button
                  className="rounded-full gap-1.5 bg-primary text-primary-foreground"
                  onClick={() => setStep((s) => Math.min(10, s + 1))}
                  data-ocid="wizard.pagination_next"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="rounded-full gap-1.5 bg-primary text-primary-foreground"
                  onClick={() => setShowPreview(true)}
                  data-ocid="wizard.preview_button"
                >
                  <Eye className="w-4 h-4" /> Preview & Share
                </Button>
              )}
            </div>
          </div>

          {/* Right: preview panel */}
          <div className="lg:w-72 xl:w-80">
            <div className="bg-card rounded-2xl card-shadow border border-border p-5 sticky top-24">
              <h3 className="font-display font-bold text-base mb-4">
                Current Kit Preview
              </h3>
              <div className="space-y-2 mb-6">
                {Object.entries(filled).map(([key, ok]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${ok ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"}`}
                    >
                      {ok ? "✓" : "·"}
                    </div>
                    <span
                      className={
                        ok
                          ? "text-foreground"
                          : "text-muted-foreground capitalize"
                      }
                    >
                      {key}
                    </span>
                  </div>
                ))}
              </div>

              {/* Theme preview */}
              <div className="rounded-xl overflow-hidden border border-border mb-4">
                <div
                  className="h-16"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.secondary})`,
                  }}
                >
                  <div className="h-full flex items-center justify-center text-2xl">
                    {getTheme(pkg.themeId).emoji}
                  </div>
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium">{theme.name}</p>
                </div>
              </div>

              <Button
                className="w-full rounded-full bg-primary text-primary-foreground"
                onClick={() => setShowPreview(true)}
                data-ocid="wizard.preview_panel_button"
              >
                <Eye className="w-4 h-4 mr-1.5" /> Preview Package
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <KitPreviewModal pkg={pkg} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
