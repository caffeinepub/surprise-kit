import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Theme", emoji: "🎨" },
  { id: 2, label: "Message", emoji: "✉️" },
  { id: 3, label: "Meme", emoji: "🤣" },
  { id: 4, label: "Song", emoji: "🎵" },
  { id: 5, label: "Game", emoji: "🎮" },
  { id: 6, label: "Quiz", emoji: "📝" },
  { id: 7, label: "Voice", emoji: "🎤" },
  { id: 8, label: "Challenge", emoji: "⚡" },
  { id: 9, label: "Music", emoji: "🎶" },
  { id: 10, label: "Settings", emoji: "⚙️" },
];

interface Props {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function WizardStepper({ currentStep, onStepClick }: Props) {
  return (
    <div className="w-full overflow-x-auto" data-ocid="wizard.stepper">
      <div className="flex items-center min-w-max px-2 py-3">
        {STEPS.map((step, i) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="flex flex-col items-center gap-1 group"
                data-ocid={`wizard.step.${step.id}`}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 border-2",
                    isActive &&
                      "bg-primary text-primary-foreground border-primary scale-110 shadow-md",
                    isCompleted &&
                      "bg-primary/20 text-primary border-primary/40",
                    !isActive &&
                      !isCompleted &&
                      "bg-card text-muted-foreground border-border group-hover:border-primary/40",
                  )}
                >
                  {isCompleted ? "✓" : step.emoji}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-primary/70",
                    !isActive && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px w-8 mx-1 transition-colors",
                    step.id < currentStep ? "bg-primary/40" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
