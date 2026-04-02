import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Link,
  Music,
  Pause,
  Play,
  Search,
  Upload,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SONGS, VIBES, type Vibe } from "../../lib/curated-data";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export default function SongSelector({ value, onChange }: Props) {
  const [vibe, setVibe] = useState<Vibe | "Custom">("Upbeat");
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  const filtered =
    vibe === "Custom"
      ? []
      : SONGS.filter(
          (s) =>
            s.vibe === vibe &&
            (search === "" ||
              s.title.toLowerCase().includes(search.toLowerCase()) ||
              s.artist.toLowerCase().includes(search.toLowerCase())),
        );

  const handleSaveCustom = () => {
    if (!customUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    const ytId = extractYouTubeId(customUrl);
    const title = customTitle || "Custom Song";
    const artist = customArtist || "Unknown Artist";
    if (ytId) {
      onChange(`custom:youtube:${ytId}:${title}|${artist}`);
    } else {
      onChange(`custom:audio:${customUrl}:${title}|${artist}`);
    }
    toast.success("Custom song saved!");
  };

  const allVibes = [...VIBES, "Custom" as const];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">Choose a Song</h2>
      <p className="text-muted-foreground text-sm mb-5">
        Pick the perfect track for this moment.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {allVibes.map((v) => (
          <button
            type="button"
            key={v}
            onClick={() => setVibe(v as Vibe | "Custom")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all border ${
              vibe === v
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/50"
            }`}
            data-ocid="song.tab"
          >
            {v === "Custom" ? "➕ Custom" : v}
          </button>
        ))}
      </div>

      {vibe !== "Custom" && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs or artists..."
            className="pl-9 rounded-full"
            data-ocid="song.search_input"
          />
        </div>
      )}

      {vibe === "Custom" ? (
        <div className="space-y-4 rounded-2xl border border-border p-5">
          <div>
            <Label className="text-xs font-semibold mb-1.5 block">
              Song Title
            </Label>
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. My Favourite Song"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold mb-1.5 block">
              Artist Name
            </Label>
            <Input
              value={customArtist}
              onChange={(e) => setCustomArtist(e.target.value)}
              placeholder="e.g. Taylor Swift"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold mb-1.5 block">
              YouTube URL or Direct Audio URL
            </Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or .mp3 URL"
                className="pl-9 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Paste a YouTube link or a direct audio file URL
            </p>
          </div>
          {customUrl && extractYouTubeId(customUrl) && (
            <div className="rounded-xl overflow-hidden border border-border aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(customUrl)}`}
                title="YouTube Preview"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          {value.startsWith("custom:") && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Custom song saved
              </span>
            </div>
          )}
          <Button
            onClick={handleSaveCustom}
            className="w-full rounded-full gap-2"
            data-ocid="song.primary_button"
          >
            <Music className="w-4 h-4" /> Save Custom Song
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {filtered.map((song, i) => {
            const isSelected = value === song.id;
            const isPlayingThis = playing === song.id;
            return (
              <div key={song.id}>
                <button
                  type="button"
                  className={`w-full flex items-center gap-3 rounded-xl p-3 text-left cursor-pointer transition-all border ${
                    isSelected
                      ? "border-primary bg-accent/30"
                      : "border-border hover:border-primary/40 hover:bg-accent/10"
                  }`}
                  onClick={() => onChange(song.id)}
                  data-ocid={`song.item.${i + 1}`}
                >
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaying(isPlayingThis ? null : song.id);
                    }}
                    aria-label={isPlayingThis ? "Close preview" : "Preview"}
                    data-ocid={`song.toggle.${i + 1}`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-3.5 h-3.5 text-primary" />
                    ) : song.youtubeId ? (
                      <Youtube className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{song.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {song.duration}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
                {isPlayingThis && song.youtubeId && (
                  <div className="rounded-b-xl overflow-hidden border border-t-0 border-border aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`}
                      title={song.title}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}
                {isPlayingThis && !song.youtubeId && (
                  <div className="p-3 rounded-b-xl bg-muted/30 border border-t-0 border-border text-center">
                    <p className="text-xs text-muted-foreground">
                      Preview not available for this track
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
