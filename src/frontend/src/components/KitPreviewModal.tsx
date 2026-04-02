import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BG_MUSIC, MEMES, SONGS } from "../lib/curated-data";
import { getTheme } from "../lib/themes";
import type { PackageState } from "../pages/KitCreator";

interface Props {
  pkg: PackageState;
  onClose: () => void;
}

export default function KitPreviewModal({ pkg, onClose }: Props) {
  const theme = getTheme(pkg.themeId);
  const meme = MEMES.find((m) => m.id === pkg.memeId);
  const song = SONGS.find((s) => s.id === pkg.songId);
  const bgMusic = BG_MUSIC.find((b) => b.id === pkg.bgMusicId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="preview.modal"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close preview"
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{
          background: theme.colors.background,
          color: theme.colors.text,
        }}
      >
        <div
          className="sticky top-0 flex items-center justify-between p-4 border-b"
          style={{
            borderColor: theme.colors.border,
            background: theme.colors.surface,
          }}
        >
          <span className="font-display font-bold text-lg">
            Package Preview
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="rounded-full"
            data-ocid="preview.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center">
            <div className="text-4xl mb-2">🎁</div>
            <h1 className="font-display text-2xl font-bold">
              {pkg.title || "My Surprise Kit"}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: theme.colors.textMuted }}
            >
              A special package just for you
            </p>
          </div>

          {pkg.message && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: theme.colors.surface,
                borderColor: theme.colors.border,
                border: "1px solid",
              }}
            >
              <p className="text-sm leading-relaxed">{pkg.message}</p>
              {pkg.photoUrl && (
                <img
                  src={pkg.photoUrl}
                  alt="Your package"
                  className="mt-3 w-full rounded-xl object-cover max-h-48"
                />
              )}
            </div>
          )}

          {meme && pkg.showMeme && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid", borderColor: theme.colors.border }}
            >
              <img
                src={meme.imageUrl}
                alt={meme.caption}
                className="w-full object-cover h-40"
              />
              <div className="p-3" style={{ background: theme.colors.surface }}>
                <p className="text-sm text-center font-medium">
                  {meme.caption}
                </p>
              </div>
            </div>
          )}

          {song && pkg.showSong && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: theme.colors.surface,
                border: "1px solid",
                borderColor: theme.colors.border,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: theme.colors.secondary }}
              >
                🎵
              </div>
              <div>
                <p className="font-semibold text-sm">{song.title}</p>
                <p
                  className="text-xs"
                  style={{ color: theme.colors.textMuted }}
                >
                  {song.artist} • {song.duration}
                </p>
              </div>
            </div>
          )}

          {pkg.gameType && pkg.showGame && (
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                background: theme.colors.surface,
                border: "1px solid",
                borderColor: theme.colors.border,
              }}
            >
              <div className="text-3xl mb-2">
                {pkg.gameType === "memory"
                  ? "🃏"
                  : pkg.gameType === "scramble"
                    ? "🔤"
                    : "🧧"}
              </div>
              <p className="font-semibold text-sm">
                {pkg.gameType === "memory"
                  ? "Memory Cards"
                  : pkg.gameType === "scramble"
                    ? "Word Scramble"
                    : "Bubble Pop"}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.colors.textMuted }}
              >
                Interactive game included
              </p>
            </div>
          )}

          {pkg.quiz.questions.length > 0 && pkg.showQuiz && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: theme.colors.surface,
                border: "1px solid",
                borderColor: theme.colors.border,
              }}
            >
              <p className="font-semibold text-sm mb-1">📝 Quiz Time!</p>
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                {pkg.quiz.questions.length} question
                {pkg.quiz.questions.length !== 1 ? "s" : ""} ready
              </p>
            </div>
          )}

          {pkg.voiceNoteUrl && pkg.showVoice && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: theme.colors.surface,
                border: "1px solid",
                borderColor: theme.colors.border,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: theme.colors.secondary }}
              >
                🎤
              </div>
              <div>
                <p className="font-semibold text-sm">Voice Message</p>
                <p
                  className="text-xs"
                  style={{ color: theme.colors.textMuted }}
                >
                  A personal voice note from the creator
                </p>
              </div>
            </div>
          )}

          {pkg.challengeData.challenges.length > 0 && pkg.showChallenge && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: theme.colors.surface,
                border: "1px solid",
                borderColor: theme.colors.border,
              }}
            >
              <p className="font-semibold text-sm mb-1">⚡ Challenge Zone</p>
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                {pkg.challengeData.challenges[0].prompt}
              </p>
            </div>
          )}

          {bgMusic && (
            <div
              className="rounded-2xl p-3 flex items-center gap-2"
              style={{
                background: theme.colors.surface,
                border: "1px solid",
                borderColor: theme.colors.border,
              }}
            >
              <span className="text-xl">{bgMusic.emoji}</span>
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                Background: {bgMusic.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
