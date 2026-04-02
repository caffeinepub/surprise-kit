import { Check, Pause, Play, Volume2 } from "lucide-react";

import { useAmbientAudio } from "../../hooks/useAmbientAudio";
import { BG_MUSIC } from "../../lib/curated-data";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

function MusicPreviewButton({ musicId }: { musicId: string }) {
  const { isPlaying, toggle } = useAmbientAudio(musicId, false);
  return (
    <button
      type="button"
      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
        isPlaying
          ? "border-primary bg-primary/10 animate-pulse"
          : "border-border hover:border-primary/50"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      aria-label={isPlaying ? "Stop preview" : "Play preview"}
    >
      {isPlaying ? (
        <Pause className="w-3 h-3 text-primary" />
      ) : (
        <Play className="w-3 h-3" />
      )}
    </button>
  );
}

export default function MusicSelector({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">
        Background Ambience
      </h2>
      <p className="text-muted-foreground text-sm mb-2">
        Set the mood with a soft ambient soundscape.
      </p>
      <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
        <Volume2 className="w-3 h-3" /> Click the play button to preview — this
        sound will play for your recipient.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BG_MUSIC.map((m, i) => {
          const isSelected = value === m.id;
          return (
            <button
              type="button"
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`rounded-2xl border-2 p-4 text-left flex items-center gap-3 transition-all relative ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
              data-ocid={`music.item.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-xl flex-shrink-0">
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {m.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <MusicPreviewButton musicId={m.id} />
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
