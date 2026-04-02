import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  label?: string;
  primaryColor?: string;
  surfaceColor?: string;
  compact?: boolean;
}

export default function AudioPlayer({
  src,
  label = "Audio",
  primaryColor = "#5F887C",
  surfaceColor = "#FBF7F1",
  compact = false,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const seek = (pct: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (pct / 100) * duration;
  };

  const handleVolume = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || Number.isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* biome-ignore lint/a11y/useMediaCaption: decorative audio player */}
        <audio ref={audioRef} src={src} />
        <button
          type="button"
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ background: primaryColor }}
          data-ocid="audio.toggle"
        >
          {playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          <div
            className="h-1.5 rounded-full mt-1"
            style={{ background: surfaceColor }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: primaryColor }}
            />
          </div>
        </div>
        <span className="text-xs" style={{ opacity: 0.6 }}>
          {fmt(currentTime)}
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: surfaceColor }}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: decorative audio player */}
      <audio ref={audioRef} src={src} />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0 transition-transform hover:scale-105"
          style={{ background: primaryColor }}
          data-ocid="audio.toggle"
        >
          {playing ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1 space-y-1.5">
          <div
            className="flex justify-between text-xs"
            style={{ opacity: 0.7 }}
          >
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
          <div
            className="relative h-2 rounded-full cursor-pointer"
            style={{ background: `${primaryColor}30` }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - rect.left) / rect.width) * 100);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(Math.min(100, progress + 5));
              if (e.key === "ArrowLeft") seek(Math.max(0, progress - 5));
            }}
            role="slider"
            tabIndex={0}
            aria-label="Seek audio"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: primaryColor }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          data-ocid="audio.toggle"
        >
          {muted ? (
            <VolumeX className="w-4 h-4" style={{ opacity: 0.5 }} />
          ) : (
            <Volume2 className="w-4 h-4" style={{ opacity: 0.7 }} />
          )}
        </button>
        <div className="w-24">
          <Slider
            value={[muted ? 0 : volume]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={handleVolume}
          />
        </div>
      </div>
    </div>
  );
}
