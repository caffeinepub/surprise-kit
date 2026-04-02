import { useEffect, useRef, useState } from "react";
import type { Challenge } from "../../backend.d";

interface Props {
  challenge: Challenge;
  primaryColor?: string;
  surfaceColor?: string;
  onComplete?: () => void;
}

const CONFETTI_ITEMS = Array.from({ length: 40 }, (_, i) => `ci-${i}`);

function Confetti({ primaryColor }: { primaryColor: string }) {
  const COLORS = [
    primaryColor,
    "#F4A8A8",
    "#6BBFCC",
    "#FFBF70",
    "#C9A8E0",
    "#8BBF85",
  ];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_ITEMS.map((id, i) => {
        const tx = (Math.random() - 0.5) * 600;
        const ty = Math.random() * -600;
        const rot = Math.random() * 720;
        const delay = Math.random() * 0.5;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return (
          <div
            key={id}
            className="absolute w-2.5 h-2.5 rounded-sm"
            style={
              {
                left: `${40 + (i % 20) * 1}%`,
                top: "50%",
                background: color,
                animation: `confetti-fall 1.2s ease-out ${delay}s forwards`,
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
                "--rot": `${rot}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export default function ChallengePlayer({
  challenge,
  primaryColor = "#5F887C",
  surfaceColor = "#FBF7F1",
  onComplete,
}: Props) {
  const [state, setState] = useState<"idle" | "active" | "done">("idle");
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setState("active");
    setCountdown(5);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setState("done");
          onComplete?.();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (challenge.challengeType !== "shake" || state !== "active") return;
    let lastAcc = 0;
    const handler = (e: DeviceMotionEvent) => {
      const acc = e.acceleration;
      if (!acc) return;
      const total =
        Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
      if (total > 20 && lastAcc > 0) {
        clearInterval(timerRef.current!);
        setState("done");
        onComplete?.();
      }
      lastAcc = total;
    };
    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [challenge.challengeType, state, onComplete]);

  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{ background: surfaceColor }}
    >
      {state === "done" && <Confetti primaryColor={primaryColor} />}

      {state === "idle" && (
        <>
          <div className="text-4xl mb-3">⚡</div>
          <p className="font-semibold mb-2">Challenge Time!</p>
          <p className="text-sm mb-5" style={{ opacity: 0.7 }}>
            {challenge.prompt}
          </p>
          <button
            type="button"
            onClick={start}
            className="px-8 py-3 rounded-full text-white font-medium"
            style={{ background: primaryColor }}
            data-ocid="challenge.primary_button"
          >
            Accept Challenge!
          </button>
        </>
      )}

      {state === "active" && (
        <>
          {challenge.challengeType === "breathe" && (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 animate-breathe"
              style={{ background: primaryColor, opacity: 0.7 }}
            />
          )}
          <p
            className="text-5xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            {countdown}
          </p>
          <p className="text-sm" style={{ opacity: 0.7 }}>
            {challenge.challengeType === "breathe"
              ? "Breathe deeply..."
              : "Hang on..."}
          </p>
          {challenge.challengeType === "shake" && (
            <button
              type="button"
              onClick={() => {
                clearInterval(timerRef.current!);
                setState("done");
                onComplete?.();
              }}
              className="mt-4 px-6 py-2 rounded-full text-white text-sm"
              style={{ background: primaryColor }}
              data-ocid="challenge.primary_button"
            >
              📱 Shake / Tap to complete
            </button>
          )}
        </>
      )}

      {state === "done" && (
        <>
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-bold text-lg mb-2">Challenge Complete!</p>
          <p className="text-sm" style={{ opacity: 0.8 }}>
            {challenge.rewardMessage}
          </p>
        </>
      )}
    </div>
  );
}
