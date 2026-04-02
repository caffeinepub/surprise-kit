import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import type { ChallengeData } from "../../backend.d";
import { PRESET_CHALLENGES } from "../../lib/curated-data";

interface Props {
  value: ChallengeData;
  onChange: (v: ChallengeData) => void;
}

export default function ChallengeBuilder({ value, onChange }: Props) {
  const selectedId = value.challenges[0]?.id || null;
  const [customPrompt, setCustomPrompt] = useState("");
  const [customReward, setCustomReward] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const selectPreset = (id: string) => {
    const preset = PRESET_CHALLENGES.find((p) => p.id === id);
    if (!preset) return;
    onChange({
      challenges: [
        {
          id: preset.id,
          challengeType: preset.type,
          prompt: preset.prompt,
          rewardMessage: preset.rewardMessage,
        },
      ],
    });
  };

  const addCustom = () => {
    if (!customPrompt.trim()) return;
    onChange({
      challenges: [
        {
          id: `custom_${Date.now()}`,
          challengeType: "custom",
          prompt: customPrompt,
          rewardMessage: customReward,
        },
      ],
    });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">Challenge Zone</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Give your recipient a fun little challenge to complete before revealing
        a reward!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {PRESET_CHALLENGES.map((c, i) => {
          const isSelected = selectedId === c.id;
          return (
            <button
              type="button"
              key={c.id}
              onClick={() => selectPreset(c.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-all relative ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
              data-ocid={`challenge.item.${i + 1}`}
            >
              <p className="font-semibold text-sm mb-1">{c.prompt}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                🎁 {c.rewardMessage}
              </p>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="border border-border rounded-2xl p-4">
        <button
          type="button"
          className="flex items-center gap-2 font-semibold text-sm mb-3 text-primary"
          onClick={() => setShowCustom(!showCustom)}
          data-ocid="challenge.toggle"
        >
          <Plus className="w-4 h-4" /> Create Custom Challenge
        </button>
        {showCustom && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold mb-1 block">
                Challenge Prompt
              </Label>
              <Input
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., Do 5 jumping jacks then come back!"
                className="rounded-xl text-sm"
                data-ocid="challenge.input"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1 block">
                Reward Message (shown after completion)
              </Label>
              <Textarea
                value={customReward}
                onChange={(e) => setCustomReward(e.target.value)}
                placeholder="Amazing! You did it! Here's your reward..."
                className="rounded-xl text-sm resize-none"
                rows={3}
                data-ocid="challenge.textarea"
              />
            </div>
            <Button
              type="button"
              onClick={addCustom}
              disabled={!customPrompt.trim()}
              className="rounded-full"
              data-ocid="challenge.primary_button"
            >
              Add Custom Challenge
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
