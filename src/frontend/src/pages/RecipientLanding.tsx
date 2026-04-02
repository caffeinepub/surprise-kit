import { Float, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import AudioPlayer from "../components/recipient/AudioPlayer";
import ChallengePlayer from "../components/recipient/ChallengePlayer";
import GamePlayer from "../components/recipient/GamePlayer";
import QuizPlayer from "../components/recipient/QuizPlayer";
import { useAmbientAudio } from "../hooks/useAmbientAudio";
import { useGetPackageByToken, useGetPackageExtras } from "../hooks/useQueries";
import { BG_MUSIC, MEMES, SONGS } from "../lib/curated-data";
import { getTheme } from "../lib/themes";

const CONFETTI_KEYS = Array.from({ length: 50 }, (_, i) => `conf-${i}`);

function parseMemeId(memeId: string, memes: typeof MEMES) {
  if (memeId.startsWith("custom:")) {
    const rest = memeId.slice(7);
    const pipeIdx = rest.lastIndexOf("|");
    if (pipeIdx === -1) return { imageUrl: rest, caption: "" };
    return {
      imageUrl: rest.slice(0, pipeIdx),
      caption: rest.slice(pipeIdx + 1),
    };
  }
  const found = memes.find((m) => m.id === memeId);
  return found ? { imageUrl: found.imageUrl, caption: found.caption } : null;
}

function parseSongId(songId: string, songs: typeof SONGS) {
  if (songId.startsWith("custom:")) {
    const rest = songId.slice(7);
    if (rest.startsWith("youtube:")) {
      const r2 = rest.slice(8);
      const colonIdx = r2.indexOf(":");
      const ytId = colonIdx === -1 ? r2 : r2.slice(0, colonIdx);
      const meta = colonIdx === -1 ? "" : r2.slice(colonIdx + 1);
      const pipeIdx = meta.indexOf("|");
      const title = pipeIdx === -1 ? meta : meta.slice(0, pipeIdx);
      const artist = pipeIdx === -1 ? "" : meta.slice(pipeIdx + 1);
      return {
        type: "youtube" as const,
        ytId,
        title: title || "Custom Song",
        artist: artist || "",
      };
    }
    if (rest.startsWith("audio:")) {
      const r2 = rest.slice(6);
      const colonIdx = r2.indexOf(":");
      const url = colonIdx === -1 ? r2 : r2.slice(0, colonIdx);
      const meta = colonIdx === -1 ? "" : r2.slice(colonIdx + 1);
      const pipeIdx = meta.indexOf("|");
      const title = pipeIdx === -1 ? meta : meta.slice(0, pipeIdx);
      const artist = pipeIdx === -1 ? "" : meta.slice(pipeIdx + 1);
      return {
        type: "audio" as const,
        url,
        title: title || "Custom Song",
        artist: artist || "",
      };
    }
  }
  const found = songs.find((s) => s.id === songId);
  if (found) return { type: "curated" as const, song: found };
  return null;
}

function Particles({ color }: { color: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 80;
  const dummy = new THREE.Object3D();
  const posData = useRef(
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10,
      speed: 0.002 + Math.random() * 0.005,
      phase: Math.random() * Math.PI * 2,
      size: 0.05 + Math.random() * 0.15,
    })),
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    posData.current.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(state.clock.elapsedTime * p.speed + p.phase) * 2,
        p.y + Math.cos(state.clock.elapsedTime * p.speed * 0.7 + p.phase) * 1.5,
        p.z,
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

function FloatingGift({ color }: { color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function ConfettiBurst({
  active,
  primaryColor,
}: { active: boolean; primaryColor: string }) {
  if (!active) return null;
  const COLORS = [primaryColor, "#F4A8A8", "#6BBFCC", "#FFBF70", "#C9A8E0"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_KEYS.map((key, i) => {
        const tx = (Math.random() - 0.5) * 800;
        const ty = Math.random() * -700 - 100;
        const rot = Math.random() * 720 - 360;
        const delay = Math.random() * 0.4;
        const color = COLORS[i % COLORS.length];
        const size = 6 + (i % 5) * 2;
        return (
          <div
            key={key}
            className="absolute rounded-sm"
            style={
              {
                left: `${45 + (i % 10)}%`,
                top: "50%",
                width: size,
                height: size,
                background: color,
                animation: `confetti-fall 1.5s ease-out ${delay}s forwards`,
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

function SongSection({
  songId,
  theme,
  onPlay,
  onStop,
}: {
  songId: string;
  theme: ReturnType<typeof getTheme>;
  onPlay: () => void;
  onStop: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const parsed = parseSongId(songId, SONGS);

  if (!parsed) return null;

  const title =
    parsed.type === "curated"
      ? parsed.song.title
      : parsed.type === "youtube" || parsed.type === "audio"
        ? parsed.title
        : "Song";
  const artist =
    parsed.type === "curated"
      ? parsed.song.artist
      : parsed.type === "youtube" || parsed.type === "audio"
        ? parsed.artist
        : "";
  const duration = parsed.type === "curated" ? parsed.song.duration : "";
  const ytId =
    parsed.type === "youtube"
      ? parsed.ytId
      : parsed.type === "curated" && parsed.song.youtubeId
        ? parsed.song.youtubeId
        : null;
  const audioUrl = parsed.type === "audio" ? parsed.url : "";
  const ytWatchUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : null;

  return (
    <div
      className="rounded-3xl p-5 card-shadow"
      style={{ background: theme.colors.surface }}
    >
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: theme.colors.primary }}
      >
        🎵 Song for You
      </p>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: theme.colors.secondary }}
        >
          🎵
        </div>
        <div>
          <p className="font-bold" style={{ color: theme.colors.text }}>
            {title}
          </p>
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>
            {artist}
            {duration ? ` • ${duration}` : ""}
          </p>
        </div>
      </div>

      {ytId ? (
        <div>
          {!playing ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setPlaying(true);
                  onPlay();
                }}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: theme.colors.primary }}
              >
                ▶️ Play Song
              </button>
              {ytWatchUrl && (
                <a
                  href={ytWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border"
                  style={{
                    color: theme.colors.textMuted,
                    borderColor: `${theme.colors.primary}30`,
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                  Watch on YouTube
                </a>
              )}
            </div>
          ) : (
            <div>
              <div className="rounded-2xl overflow-hidden aspect-video mb-2 relative">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              {/* Fallback link in case embed is blocked */}
              {ytWatchUrl && (
                <a
                  href={ytWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 mb-2"
                  style={{ color: theme.colors.textMuted }}
                >
                  <ExternalLink className="w-3 h-3" />
                  Video not loading? Open on YouTube
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  onStop();
                }}
                className="w-full py-2 rounded-xl text-sm"
                style={{ color: theme.colors.textMuted }}
              >
                ⏹ Stop
              </button>
            </div>
          )}
        </div>
      ) : audioUrl ? (
        <AudioPlayer
          src={audioUrl}
          label={`${title} - ${artist}`}
          primaryColor={theme.colors.primary}
          surfaceColor={theme.colors.background}
        />
      ) : (
        <div className="text-center py-3">
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>
            Audio preview not available for this track.
          </p>
        </div>
      )}
    </div>
  );
}

export default function RecipientLanding() {
  const { token } = useParams({ from: "/s/$token" });
  const { data: pkg, isLoading, isError } = useGetPackageByToken(token);
  const { data: extras } = useGetPackageExtras(pkg?.id || "");
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(false);

  const theme = getTheme(pkg?.themeId || "");

  const {
    isPlaying: bgIsPlaying,
    toggle: toggleBgMusic,
    mute: muteBg,
    unmute: unmuteBg,
  } = useAmbientAudio(pkg?.bgMusicId || "", bgMusicEnabled);

  const handleSurprise = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);
    setTimeout(() => {
      setRevealed(true);
      if (pkg?.bgMusicId) setBgMusicEnabled(true);
    }, 600);
  };

  const handleSongPlay = useCallback(() => {
    muteBg();
  }, [muteBg]);

  const handleSongStop = useCallback(() => {
    unmuteBg();
  }, [unmuteBg]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      unmuteBg();
      setCurrentPage(newPage);
    },
    [unmuteBg],
  );

  const sections: { key: string; label: string }[] = [];
  if (pkg) {
    if (pkg.message || pkg.photoUrl) {
      sections.push({ key: "message", label: "💌 Message" });
    }
    if (pkg.memeId) sections.push({ key: "meme", label: "😄 Meme" });
    if (pkg.songId) sections.push({ key: "song", label: "🎵 Song" });
    if (pkg.gameType) sections.push({ key: "game", label: "🎮 Game" });
    if (extras?.quiz && extras.quiz.questions.length > 0)
      sections.push({ key: "quiz", label: "📝 Quiz" });
    if (pkg.voiceNoteUrl) sections.push({ key: "voice", label: "🎤 Voice" });
    if (extras?.challengeData && extras.challengeData.challenges.length > 0)
      sections.push({ key: "challenge", label: "🌟 Challenge" });
    sections.push({ key: "end", label: "💛 Done" });
  }

  const goNext = () => {
    if (currentPage < sections.length - 1) {
      setDirection(1);
      handlePageChange(currentPage + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      handlePageChange(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.colors.background }}
      >
        <div className="text-center">
          <div className="text-5xl animate-bounce-gentle mb-4">🎁</div>
          <p
            className="font-display text-xl"
            style={{ color: theme.colors.text }}
          >
            Loading your surprise...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.colors.background }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">😢</div>
          <p
            className="font-display text-xl mb-2"
            style={{ color: theme.colors.text }}
          >
            Oops, package not found
          </p>
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>
            This link may have expired or is invalid.
          </p>
        </div>
      </div>
    );
  }

  const memeData = pkg.memeId ? parseMemeId(pkg.memeId, MEMES) : null;

  return (
    <div
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        minHeight: "100vh",
      }}
    >
      <ConfettiBurst active={confetti} primaryColor={theme.colors.primary} />

      {!revealed && (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <pointLight
                position={[5, 5, 5]}
                intensity={0.8}
                color={theme.colors.primary}
              />
              <Suspense fallback={null}>
                <Stars
                  radius={60}
                  depth={50}
                  count={800}
                  factor={3}
                  saturation={0}
                  fade
                  speed={1}
                />
                <Particles color={theme.colors.primary} />
                <FloatingGift color={theme.colors.primary} />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative z-10 text-center px-6 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="text-6xl mb-6 animate-float">🎁</div>
              <h1
                className="font-display text-3xl sm:text-4xl font-bold mb-3 leading-tight"
                style={{
                  color: theme.colors.text,
                  textShadow: "0 2px 20px rgba(0,0,0,0.1)",
                }}
              >
                Have a Great Day with
                <br />
                This Surprise! 🎉
              </h1>
              <p
                className="text-base mb-10"
                style={{ color: theme.colors.textMuted }}
              >
                Someone special made this just for you.
              </p>
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                onClick={handleSurprise}
                className="relative px-10 py-4 rounded-full text-white font-bold text-lg uppercase tracking-wider shadow-2xl animate-pulse-glow"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                }}
                data-ocid="recipient.primary_button"
              >
                ✨ Surprise!
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}

      {revealed && sections.length > 0 && (
        <div
          className="relative min-h-screen flex flex-col"
          style={{ background: theme.colors.background }}
        >
          {/* Progress bar */}
          <div
            className="sticky top-0 z-20 px-4 pt-4 pb-2"
            style={{ background: theme.colors.background }}
          >
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div
                  className="text-sm font-medium"
                  style={{ color: theme.colors.primary }}
                >
                  {sections[currentPage]?.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: theme.colors.textMuted }}
                >
                  {currentPage + 1} / {sections.length}
                </div>
              </div>
              <div className="flex gap-1">
                {sections.map((_, i) => (
                  <div
                    key={`prog-sec-${sections[i]?.key}`}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i <= currentPage
                          ? theme.colors.primary
                          : `${theme.colors.primary}30`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section content - overflow-y-auto allows keyboard scroll on mobile */}
          <div className="flex-1 flex items-start justify-center px-5 py-6 overflow-y-auto">
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={sections[currentPage]?.key}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {sections[currentPage]?.key === "message" && (
                    <div
                      className="rounded-3xl p-6 card-shadow"
                      style={{
                        background: theme.colors.surface,
                        borderLeft: `4px solid ${theme.colors.primary}`,
                      }}
                    >
                      <p
                        className="text-sm font-semibold mb-3"
                        style={{ color: theme.colors.primary }}
                      >
                        💌 Personal Message
                      </p>
                      <p
                        className="leading-relaxed text-base"
                        style={{ color: theme.colors.text }}
                      >
                        {pkg.message}
                      </p>
                      {pkg.photoUrl && (
                        <img
                          src={pkg.photoUrl}
                          alt="A moment captured"
                          className="mt-4 w-full rounded-2xl object-cover max-h-72"
                        />
                      )}
                    </div>
                  )}

                  {sections[currentPage]?.key === "meme" && memeData && (
                    <div
                      className="rounded-3xl overflow-hidden card-shadow"
                      style={{ border: `2px solid ${theme.colors.border}` }}
                    >
                      <img
                        src={memeData.imageUrl}
                        alt={memeData.caption}
                        className="w-full object-cover max-h-64"
                      />
                      <div
                        className="p-4 text-center"
                        style={{ background: theme.colors.surface }}
                      >
                        <p
                          className="font-medium text-sm"
                          style={{ color: theme.colors.text }}
                        >
                          {memeData.caption}
                        </p>
                      </div>
                    </div>
                  )}

                  {sections[currentPage]?.key === "song" && pkg.songId && (
                    <SongSection
                      songId={pkg.songId}
                      theme={theme}
                      onPlay={handleSongPlay}
                      onStop={handleSongStop}
                    />
                  )}

                  {sections[currentPage]?.key === "game" && pkg.gameType && (
                    <div className="rounded-3xl overflow-hidden card-shadow">
                      <div
                        className="px-5 pt-5"
                        style={{ background: theme.colors.surface }}
                      >
                        <p
                          className="text-sm font-semibold mb-1"
                          style={{ color: theme.colors.primary }}
                        >
                          🎮 Mini Game
                        </p>
                      </div>
                      <GamePlayer
                        gameType={pkg.gameType}
                        primaryColor={theme.colors.primary}
                        surfaceColor={theme.colors.surface}
                      />
                    </div>
                  )}

                  {sections[currentPage]?.key === "quiz" &&
                    extras?.quiz &&
                    extras.quiz.questions.length > 0 && (
                      <div className="rounded-3xl overflow-hidden card-shadow">
                        <div
                          className="px-5 pt-5 pb-2"
                          style={{ background: theme.colors.surface }}
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{ color: theme.colors.primary }}
                          >
                            📝 Quiz Time!
                          </p>
                        </div>
                        <QuizPlayer
                          quiz={extras.quiz}
                          primaryColor={theme.colors.primary}
                          surfaceColor={theme.colors.surface}
                        />
                      </div>
                    )}

                  {sections[currentPage]?.key === "voice" &&
                    pkg.voiceNoteUrl && (
                      <div
                        className="rounded-3xl p-5 card-shadow"
                        style={{ background: theme.colors.surface }}
                      >
                        <p
                          className="text-sm font-semibold mb-3"
                          style={{ color: theme.colors.primary }}
                        >
                          🎤 Voice Message
                        </p>
                        <AudioPlayer
                          src={pkg.voiceNoteUrl}
                          label="Voice Note"
                          primaryColor={theme.colors.primary}
                          surfaceColor={theme.colors.background}
                        />
                      </div>
                    )}

                  {sections[currentPage]?.key === "challenge" &&
                    extras?.challengeData &&
                    extras.challengeData.challenges.length > 0 && (
                      <ChallengePlayer
                        challenge={extras.challengeData.challenges[0]}
                        primaryColor={theme.colors.primary}
                        surfaceColor={theme.colors.surface}
                      />
                    )}

                  {sections[currentPage]?.key === "end" && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💛</div>
                      <h2
                        className="font-display text-2xl font-bold mb-2"
                        style={{ color: theme.colors.primary }}
                      >
                        That's all!
                      </h2>
                      <p
                        className="text-sm mb-6"
                        style={{ color: theme.colors.textMuted }}
                      >
                        Hope this made your day special. ✨
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.colors.textMuted }}
                      >
                        Made with love using{" "}
                        <a
                          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          style={{ color: theme.colors.primary }}
                        >
                          Surprise Kit
                        </a>
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div
            className="sticky bottom-0 z-20 px-4 pb-6 pt-3"
            style={{ background: `${theme.colors.background}ee` }}
          >
            <div className="flex items-center justify-between max-w-lg mx-auto gap-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all disabled:opacity-30"
                style={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                }}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="text-center">
                <div
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.textMuted }}
                >
                  {currentPage + 1} of {sections.length}
                </div>
              </div>
              <button
                type="button"
                onClick={goNext}
                disabled={currentPage >= sections.length - 1}
                className="flex items-center gap-1 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all disabled:opacity-30"
                style={{ background: theme.colors.primary }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BG Music control */}
          {pkg.bgMusicId && (
            <div className="fixed bottom-24 right-4 z-30">
              <button
                type="button"
                onClick={toggleBgMusic}
                className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white transition-all"
                style={{
                  background: bgIsPlaying
                    ? theme.colors.primary
                    : `${theme.colors.primary}80`,
                }}
                aria-label={bgIsPlaying ? "Mute music" : "Play music"}
                title={
                  bgIsPlaying
                    ? "Mute background music"
                    : "Play background music"
                }
              >
                {bgIsPlaying ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
