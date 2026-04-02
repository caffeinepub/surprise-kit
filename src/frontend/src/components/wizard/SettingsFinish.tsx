import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Copy, Eye, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePublishPackage } from "../../hooks/useQueries";
import type { PackageState } from "../../pages/KitCreator";

interface Props {
  pkg: PackageState;
  onChange: (updates: Partial<PackageState>) => void;
  onPreview: () => void;
}

const TOGGLES = [
  { key: "showMeme", label: "Show Meme", emoji: "🤣" },
  { key: "showSong", label: "Show Song Player", emoji: "🎵" },
  { key: "showGame", label: "Show Mini Game", emoji: "🎮" },
  { key: "showQuiz", label: "Show Quiz", emoji: "📝" },
  { key: "showVoice", label: "Show Voice Message", emoji: "🎤" },
  { key: "showChallenge", label: "Show Challenge", emoji: "⚡" },
] as const;

export default function SettingsFinish({ pkg, onChange, onPreview }: Props) {
  const publishMutation = usePublishPackage();
  const [shareToken, setShareToken] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePublish = async () => {
    try {
      const token = await publishMutation.mutateAsync(pkg.id);
      setShareToken(token);
      toast.success("Package published! Share the link below.");
    } catch {
      toast.error("Failed to publish. Please try again.");
    }
  };

  const shareUrl = shareToken
    ? `${window.location.origin}/s/${shareToken}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">
        Settings & Finish
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Final touches before you share your kit.
      </p>

      <div className="space-y-6">
        {/* Package title */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">
            Package Title
          </Label>
          <Input
            value={pkg.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="My Surprise Kit"
            className="rounded-xl"
            data-ocid="settings.input"
          />
        </div>

        {/* Toggles */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">
            Visible Sections
          </Label>
          <div className="space-y-3">
            {TOGGLES.map((t, i) => (
              <div
                key={t.key}
                className="flex items-center justify-between"
                data-ocid={`settings.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <span>{t.emoji}</span>
                  <Label className="text-sm cursor-pointer">{t.label}</Label>
                </div>
                <Switch
                  checked={!!pkg[t.key]}
                  onCheckedChange={(v) => onChange({ [t.key]: v })}
                  data-ocid={`settings.switch.${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="rounded-full flex-1 gap-2"
            onClick={onPreview}
            data-ocid="settings.secondary_button"
          >
            <Eye className="w-4 h-4" /> Preview Package
          </Button>
          <Button
            className="rounded-full flex-1 gap-2 bg-primary text-primary-foreground"
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            data-ocid="settings.primary_button"
          >
            {publishMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {publishMutation.isPending ? "Publishing..." : "Publish & Share"}
          </Button>
        </div>

        {/* Share link */}
        {shareUrl && (
          <div
            className="bg-primary/10 rounded-2xl p-4"
            data-ocid="settings.success_state"
          >
            <p className="text-sm font-semibold text-primary mb-2">
              🎉 Your kit is live!
            </p>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="rounded-xl text-xs flex-1 bg-card"
                data-ocid="settings.input"
              />
              <Button
                size="icon"
                variant="outline"
                className="rounded-xl flex-shrink-0"
                onClick={copyLink}
                data-ocid="settings.save_button"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
