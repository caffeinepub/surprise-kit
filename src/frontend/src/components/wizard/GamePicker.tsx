import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

const MEMORY_CARD_IDS = [
  "mc-0",
  "mc-1",
  "mc-2",
  "mc-3",
  "mc-4",
  "mc-5",
  "mc-6",
  "mc-7",
];
const SCRAMBLE_ITEMS = [
  { id: "sl-0", letter: "S" },
  { id: "sl-1", letter: "U" },
  { id: "sl-2", letter: "R" },
  { id: "sl-3", letter: "I" },
  { id: "sl-4", letter: "P" },
  { id: "sl-5", letter: "E" },
  { id: "sl-6", letter: "S" },
  { id: "sl-7", letter: "R" },
];
const BUBBLE_COLORS = [
  { id: "bb-f4", color: "#F4A8A8" },
  { id: "bb-6b", color: "#6BBFCC" },
  { id: "bb-c9", color: "#C9A8E0" },
  { id: "bb-8b", color: "#8BBF85" },
  { id: "bb-ff", color: "#FFBF70" },
  { id: "bb-fb", color: "#FFB8D0" },
];

const GAMES = [
  {
    id: "memory",
    name: "Memory Cards",
    emoji: "🃏",
    description:
      "Flip cards to find matching pairs. A classic memory challenge!",
    preview: () => (
      <div className="grid grid-cols-4 gap-1.5 p-2">
        {MEMORY_CARD_IDS.map((id) => (
          <div
            key={id}
            className="aspect-square rounded-lg bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xs font-bold text-primary/50"
          >
            ?
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "scramble",
    name: "Word Scramble",
    emoji: "🔤",
    description:
      "Unscramble the letters to form words. Fun and brain-tickling!",
    preview: () => (
      <div className="p-3 text-center">
        <p className="text-xs text-muted-foreground mb-2">Unscramble:</p>
        <div className="flex gap-1.5 justify-center flex-wrap">
          {SCRAMBLE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-xs font-bold"
            >
              {item.letter}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "bubble",
    name: "Bubble Pop",
    emoji: "🧧",
    description: "Pop all the bubbles! A satisfying click-fest.",
    preview: () => (
      <div className="p-3 flex flex-wrap gap-2 justify-center">
        {BUBBLE_COLORS.map((b) => (
          <div
            key={b.id}
            className="w-8 h-8 rounded-full opacity-80"
            style={{ background: b.color }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "tictactoe",
    name: "Tic-Tac-Toe",
    emoji: "⭕",
    description: "Classic X vs O — play against the computer!",
    preview: () => (
      <div className="p-3">
        <div className="grid grid-cols-3 gap-1 max-w-[90px] mx-auto">
          <div
            key="ttt-0"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
            style={{ color: "#5F887C" }}
          >
            X
          </div>
          <div
            key="ttt-1"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
          />
          <div
            key="ttt-2"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
            style={{ color: "#F4A8A8" }}
          >
            O
          </div>
          <div
            key="ttt-3"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
          />
          <div
            key="ttt-4"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
            style={{ color: "#5F887C" }}
          >
            X
          </div>
          <div
            key="ttt-5"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
          />
          <div
            key="ttt-6"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
            style={{ color: "#F4A8A8" }}
          >
            O
          </div>
          <div
            key="ttt-7"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
          />
          <div
            key="ttt-8"
            className="w-7 h-7 border border-border rounded flex items-center justify-center text-xs font-bold"
          />
        </div>
      </div>
    ),
  },
  {
    id: "numguess",
    name: "Number Guess",
    emoji: "🔢",
    description: "Guess the secret number between 1–100!",
    preview: () => (
      <div className="p-3 text-center">
        <p className="text-3xl font-bold text-primary/30">?</p>
        <p className="text-xs text-muted-foreground mt-1">1 — 100</p>
      </div>
    ),
  },
  {
    id: "emojireaction",
    name: "Emoji Reaction",
    emoji: "⚡",
    description: "Tap the emoji before it disappears!",
    preview: () => (
      <div className="p-3 flex gap-2 justify-center flex-wrap">
        {["🌟", "🔥", "✨", "🎈"].map((e) => (
          <span
            key={e}
            className="text-2xl animate-bounce"
            style={{ animationDelay: `${Math.random() * 0.5}s` }}
          >
            {e}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "colormatch",
    name: "Color Match",
    emoji: "🎨",
    description: "Match the color name shown — fast!",
    preview: () => (
      <div className="p-3 text-center">
        <p className="text-xl font-bold" style={{ color: "#6BBFCC" }}>
          RED
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          What color is the text?
        </p>
      </div>
    ),
  },
];

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function GamePicker({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">Pick a Mini Game</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Add an interactive game to your surprise kit.
      </p>

      <div className="space-y-4">
        {GAMES.map((game, i) => {
          const isSelected = value === game.id;
          const showPrev = preview === game.id;
          return (
            <div
              key={game.id}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${
                isSelected
                  ? "border-primary"
                  : "border-border hover:border-primary/40"
              }`}
              data-ocid={`game.item.${i + 1}`}
            >
              <button
                type="button"
                className="w-full flex items-center gap-4 p-4 text-left"
                onClick={() => onChange(game.id)}
              >
                <div className="text-3xl">{game.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold">{game.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {game.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(showPrev ? null : game.id);
                    }}
                    data-ocid={`game.toggle.${i + 1}`}
                  >
                    {showPrev ? "Hide" : "Preview"}
                  </Button>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
              {showPrev && (
                <div className="border-t border-border bg-muted/30">
                  <game.preview />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
