import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpload } from "../../hooks/useUpload";

const CAPTION_SUGGESTIONS = [
  "When life gives you lemons 🍋",
  "This is fine 🔥",
  "Me explaining to my mom why I need more sleep 😴",
  "Big brain time 🧠",
  "Nobody: / Me at 3am:",
  "That feeling when everything goes right 🙌",
  "My face when I see food 😍",
  "Me pretending to work vs. actually working 💼",
  "When the WiFi drops for 0.1 seconds 😤",
  "Monday vs. Friday energy 📅",
  "It's not a bug, it's a feature ✨",
  "Adulting is overrated 🧸",
  "Plot twist incoming 🌀",
  "When the plan actually works 🎯",
  "Sending you good vibes only 🌈",
  "No thoughts, just vibes 🎵",
  "Current mood: unbeatable 🏆",
  "Level up unlocked 🎮",
  "Zero regrets, full send 🚀",
  "Today's forecast: 100% shenanigans ☀️",
];

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function MemeSelector({ value, onChange }: Props) {
  const [customUrl, setCustomUrl] = useState("");
  const [customCaption, setCustomCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { upload, isUploading } = useUpload();

  // Pre-populate from existing saved value
  const isSaved = value.startsWith("custom:");

  const handleSaveCustom = () => {
    const url = previewUrl || customUrl;
    if (!url) {
      toast.error("Please provide an image");
      return;
    }
    onChange(`custom:${url}|${customCaption || "My custom meme"}`);
    toast.success("Meme saved!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    try {
      const url = await upload(file);
      setPreviewUrl(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    try {
      const url = await upload(file);
      setPreviewUrl(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    }
  };

  const suggestCaption = () => {
    const pick =
      CAPTION_SUGGESTIONS[
        Math.floor(Math.random() * CAPTION_SUGGESTIONS.length)
      ];
    setCustomCaption(pick);
  };

  const displayUrl = previewUrl || customUrl;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">Add Your Meme</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Upload your own photo and add a caption to create a personal meme.
      </p>

      <div className="space-y-5 rounded-2xl border border-border p-5">
        {/* Upload Area */}
        <div>
          <Label className="text-xs font-semibold mb-2 block">Meme Photo</Label>
          <motion.label
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            data-ocid="meme.dropzone"
            whileHover={{ scale: 1.01 }}
          >
            {isUploading ? (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <Upload className="w-7 h-7 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">
                  Drag & drop or click to upload
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, GIF — max 5MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              data-ocid="meme.upload_button"
            />
          </motion.label>

          {displayUrl && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 relative"
            >
              <img
                src={displayUrl}
                alt="Meme preview"
                className="w-full max-h-52 object-cover rounded-xl border border-border"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl("");
                  setCustomUrl("");
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70"
                aria-label="Remove image"
              >
                ✕
              </button>
            </motion.div>
          )}
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or paste URL</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* URL Input */}
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            Image URL
          </Label>
          <Input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/funny-meme.jpg"
            className="rounded-xl"
            data-ocid="meme.input"
          />
        </div>

        {/* Caption with AI suggest */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs font-semibold">Caption</Label>
            <button
              type="button"
              onClick={suggestCaption}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              data-ocid="meme.secondary_button"
            >
              <Sparkles className="w-3 h-3" />✨ Suggest Caption
            </button>
          </div>
          <Input
            value={customCaption}
            onChange={(e) => setCustomCaption(e.target.value)}
            placeholder="Add a funny caption..."
            className="rounded-xl"
            data-ocid="meme.textarea"
          />
          {customCaption && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 text-xs text-muted-foreground italic px-1"
            >
              Preview: &ldquo;{customCaption}&rdquo;
            </motion.p>
          )}
        </div>

        {/* Saved badge */}
        {isSaved && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Meme saved ✓
            </span>
          </div>
        )}

        <Button
          onClick={handleSaveCustom}
          className="w-full rounded-full"
          disabled={isUploading || !displayUrl}
          data-ocid="meme.primary_button"
        >
          Save Meme
        </Button>
      </div>
    </div>
  );
}
