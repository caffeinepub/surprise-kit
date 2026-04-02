import { Button } from "@/components/ui/button";
import { Check, Mic, Pause, Play, Square, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUpload } from "../../hooks/useUpload";
import AudioPlayer from "../recipient/AudioPlayer";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function VoiceRecorder({ value, onChange }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "stopped">("idle");
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { upload, isUploading } = useUpload();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      toast.error("Microphone not supported in this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        for (const track of stream.getTracks()) {
          track.stop();
        }
        setState("stopped");
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    if (audioBlob.size > MAX_AUDIO_BYTES) {
      toast.error("Recording must be under 10MB");
      return;
    }
    try {
      const file = new File([audioBlob], "voice-note.webm", {
        type: "audio/webm",
      });
      const url = await upload(file);
      onChange(url);
      toast.success("Voice message uploaded!");
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">
        Record a Voice Message
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Leave a personal audio note for extra warmth.
      </p>

      <div className="flex flex-col items-center gap-6">
        {state !== "stopped" && (
          <button
            type="button"
            onClick={state === "idle" ? startRecording : stopRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${state === "recording" ? "bg-destructive text-destructive-foreground animate-record-pulse" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            data-ocid="voice.toggle"
            aria-label={
              state === "recording" ? "Stop recording" : "Start recording"
            }
          >
            {state === "recording" ? (
              <Square className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        )}

        {state === "recording" && (
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-destructive">
              {fmt(duration)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Recording... tap to stop
            </p>
          </div>
        )}

        {state === "idle" && (
          <p className="text-sm text-muted-foreground">
            Tap the mic to start recording
          </p>
        )}

        {state === "stopped" && audioUrl && (
          <div className="w-full max-w-sm bg-muted/40 rounded-2xl p-5 space-y-4">
            {/* biome-ignore lint/a11y/useMediaCaption: voice note playback */}
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="flex items-center gap-4 justify-center">
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
                data-ocid="voice.toggle"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <div>
                <p className="font-medium text-sm">Voice Recording</p>
                <p className="text-xs text-muted-foreground">
                  {fmt(duration)} • webm audio
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full flex-1 text-xs"
                onClick={() => {
                  setState("idle");
                  setAudioUrl(null);
                  setAudioBlob(null);
                  setDuration(0);
                }}
                data-ocid="voice.secondary_button"
              >
                Re-record
              </Button>
              {value ? (
                <div className="rounded-full flex-1 bg-primary/10 text-primary flex items-center justify-center gap-1.5 text-xs font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved ✓
                </div>
              ) : (
                <Button
                  className="rounded-full flex-1 text-xs"
                  onClick={handleUpload}
                  disabled={isUploading}
                  data-ocid="voice.upload_button"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />{" "}
                  {isUploading ? "Uploading..." : "Save to Kit"}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Show saved voice note playback when value is set and not currently in a new recording session */}
        {value && state !== "stopped" && (
          <div className="w-full max-w-sm space-y-3">
            <div className="bg-primary/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-primary">
                  Voice note saved!
                </p>
                <p className="text-xs text-muted-foreground">
                  Your voice message is in the kit
                </p>
              </div>
            </div>
            {/* Playback of the saved voice note */}
            <AudioPlayer
              src={value}
              label="Your Voice Note"
              primaryColor="var(--primary)"
              compact={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
