import { useEffect, useRef, useState } from "react";
import { SCRAMBLE_WORDS } from "../../lib/curated-data";

interface Props {
  gameType: string;
  primaryColor?: string;
  surfaceColor?: string;
}

const CARD_EMOJIS = ["🌸", "🌟", "🦄", "⚡", "🌊", "🎉", "🍐", "🌈"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type CardItem = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

function MemoryCards({ primaryColor }: { primaryColor: string }) {
  const [cards, setCards] = useState<CardItem[]>(() =>
    shuffle(
      [...CARD_EMOJIS, ...CARD_EMOJIS].map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false,
      })),
    ),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const flip = (id: number) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || selected.length >= 2) return;
    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    );
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected.map((sid) => cards.find((c) => c.id === sid)!);
      if (a.emoji === b.emoji) {
        const updatedCards = cards.map((c) =>
          newSelected.includes(c.id)
            ? { ...c, matched: true, flipped: true }
            : c,
        );
        setCards(updatedCards);
        setSelected([]);
        if (updatedCards.filter((c) => !c.matched).length === 0) setWon(true);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) && !c.matched
                ? { ...c, flipped: false }
                : c,
            ),
          );
          setSelected([]);
        }, 900);
      }
    }
  };

  const reset = () => {
    setCards(
      shuffle(
        [...CARD_EMOJIS, ...CARD_EMOJIS].map((emoji, i) => ({
          id: i,
          emoji,
          flipped: false,
          matched: false,
        })),
      ),
    );
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-3 text-sm">
        <span style={{ opacity: 0.6 }}>Moves: {moves}</span>
        {won && (
          <span className="font-bold" style={{ color: primaryColor }}>
            🎉 You won!
          </span>
        )}
        <button
          type="button"
          onClick={reset}
          className="text-xs underline"
          style={{ color: primaryColor }}
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            type="button"
            key={card.id}
            onClick={() => flip(card.id)}
            className="aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-300 border-2"
            style={{
              background: card.flipped || card.matched ? "white" : primaryColor,
              borderColor: card.matched ? primaryColor : "transparent",
              opacity: card.matched ? 0.5 : 1,
            }}
            data-ocid="game.card"
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}

function WordScramble({ primaryColor }: { primaryColor: string }) {
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);

  const current = SCRAMBLE_WORDS[idx % SCRAMBLE_WORDS.length];
  const scrambled = shuffle(current.word.split("")).join("");

  const check = () => {
    if (guess.toUpperCase() === current.word) {
      setResult("correct");
      setScore((s) => s + 1);
      setTimeout(() => {
        setIdx((i) => i + 1);
        setGuess("");
        setResult(null);
      }, 1000);
    } else {
      setResult("wrong");
      setTimeout(() => setResult(null), 800);
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-between text-sm" style={{ opacity: 0.6 }}>
        <span>
          Word {(idx % SCRAMBLE_WORDS.length) + 1}/{SCRAMBLE_WORDS.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <p className="text-sm" style={{ opacity: 0.7 }}>
        {current.hint}
      </p>
      <div className="flex gap-1.5 justify-center flex-wrap">
        {scrambled.split("").map((l, i) => (
          <div
            key={`${l}-${i}-${idx}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white"
            style={{ background: primaryColor }}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="flex gap-2 max-w-xs mx-auto">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Your answer..."
          maxLength={current.word.length}
          className="flex-1 px-3 py-2 rounded-xl border text-sm text-center uppercase tracking-widest"
          style={{
            borderColor:
              result === "correct"
                ? primaryColor
                : result === "wrong"
                  ? "#E07B7B"
                  : "#D8CEC4",
          }}
          data-ocid="game.input"
        />
        <button
          type="button"
          onClick={check}
          className="px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ background: primaryColor }}
          data-ocid="game.primary_button"
        >
          Check
        </button>
      </div>
      {result === "correct" && (
        <p className="text-sm font-bold" style={{ color: primaryColor }}>
          ✓ Correct!
        </p>
      )}
      {result === "wrong" && (
        <p className="text-sm font-bold text-red-500">Try again! 💪</p>
      )}
    </div>
  );
}

type BubbleItem = {
  id: number;
  color: string;
  popped: boolean;
  x: number;
  y: number;
  size: number;
};

function BubblePop({ primaryColor }: { primaryColor: string }) {
  const COLORS = [
    "#F4A8A8",
    "#6BBFCC",
    "#C9A8E0",
    "#8BBF85",
    "#FFBF70",
    "#FFB8D0",
    "#5F887C",
    "#FF9A3C",
  ];
  const [bubbles, setBubbles] = useState<BubbleItem[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      popped: false,
      x: (i % 4) * 22 + 5,
      y: Math.floor(i / 4) * 22 + 5,
      size: 36 + (i % 3) * 8,
    })),
  );
  const [score, setScore] = useState(0);
  const pop = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b)),
    );
    setScore((s) => s + 1);
  };
  const allPopped = bubbles.every((b) => b.popped);

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-3 text-sm">
        <span style={{ opacity: 0.6 }}>
          Pop them all! {score}/{bubbles.length}
        </span>
        {allPopped && (
          <span className="font-bold" style={{ color: primaryColor }}>
            🎉 All popped!
          </span>
        )}
        {allPopped && (
          <button
            type="button"
            onClick={() => {
              setBubbles((prev) => prev.map((b) => ({ ...b, popped: false })));
              setScore(0);
            }}
            className="text-xs underline"
            style={{ color: primaryColor }}
          >
            Reset
          </button>
        )}
      </div>
      <div
        className="relative w-full h-56 rounded-2xl overflow-hidden"
        style={{ background: `${primaryColor}15` }}
      >
        {bubbles.map((b) => (
          <button
            type="button"
            key={b.id}
            onClick={() => !b.popped && pop(b.id)}
            className="absolute rounded-full transition-all duration-200"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              background: b.popped ? "transparent" : b.color,
              transform: b.popped ? "scale(0)" : "scale(1)",
              opacity: b.popped ? 0 : 0.85,
              cursor: b.popped ? "default" : "pointer",
            }}
            data-ocid="game.canvas_target"
          />
        ))}
      </div>
    </div>
  );
}

function TicTacToe({ primaryColor }: { primaryColor: string }) {
  const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");

  const checkWinner = (b: ("X" | "O" | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, bi, c] of lines)
      if (b[a] && b[a] === b[bi] && b[a] === b[c]) return b[a];
    return b.every(Boolean) ? "draw" : null;
  };

  const computerMove = (b: ("X" | "O" | null)[]) => {
    // Try to win, then block, then random
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, bi, c] of lines) {
      const vals = [b[a], b[bi], b[c]];
      if (vals.filter((v) => v === "O").length === 2 && vals.includes(null)) {
        return [a, bi, c][vals.indexOf(null)];
      }
    }
    for (const [a, bi, c] of lines) {
      const vals = [b[a], b[bi], b[c]];
      if (vals.filter((v) => v === "X").length === 2 && vals.includes(null)) {
        return [a, bi, c][vals.indexOf(null)];
      }
    }
    if (b[4] === null) return 4;
    const empties = b
      .map((v, i) => (v === null ? i : -1))
      .filter((i) => i !== -1);
    return empties[Math.floor(Math.random() * empties.length)];
  };

  const handleClick = (idx: number) => {
    if (board[idx] || status) return;
    const newBoard = [...board];
    newBoard[idx] = "X";
    const winner = checkWinner(newBoard);
    if (winner) {
      setBoard(newBoard);
      setStatus(winner === "draw" ? "draw" : `${winner} wins`);
      return;
    }
    setXIsNext(false);
    // Computer move
    setTimeout(() => {
      const move = computerMove(newBoard);
      if (move !== undefined) {
        newBoard[move] = "O";
        const w = checkWinner(newBoard);
        setBoard([...newBoard]);
        if (w) setStatus(w === "draw" ? "draw" : `${w} wins`);
        else setXIsNext(true);
      }
    }, 300);
    setBoard(newBoard);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus("");
  };

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-3 text-sm">
        <span style={{ opacity: 0.6 }}>
          {status
            ? status === "draw"
              ? "🤝 Draw!"
              : status === "X wins"
                ? "🎉 You win!"
                : "🤖 Computer wins"
            : xIsNext
              ? "Your turn (X)"
              : "Computer thinking..."}
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-xs underline"
          style={{ color: primaryColor }}
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
        {([0, 1, 2, 3, 4, 5, 6, 7, 8] as const).map((pos) => (
          <button
            type="button"
            key={`ttt-pos-${pos}`}
            onClick={() => handleClick(pos)}
            className="aspect-square rounded-xl text-2xl font-bold flex items-center justify-center border-2 transition-all hover:bg-muted/50"
            style={{
              borderColor: board[pos]
                ? board[pos] === "X"
                  ? primaryColor
                  : "#F4A8A8"
                : "#D8CEC4",
              color: board[pos] === "X" ? primaryColor : "#E07B7B",
            }}
            data-ocid="game.card"
          >
            {board[pos]}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberGuess({ primaryColor }: { primaryColor: string }) {
  const [secret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);

  const check = () => {
    const n = Number.parseInt(guess);
    if (Number.isNaN(n) || n < 1 || n > 100) {
      setHint("Enter a number between 1–100");
      return;
    }
    setAttempts((a) => a + 1);
    if (n === secret) {
      setWon(true);
      setHint(`🎉 Correct in ${attempts + 1} guesses!`);
    } else if (n < secret) setHint("🔼 Too low! Try higher.");
    else setHint("🔽 Too high! Try lower.");
    setGuess("");
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-4xl font-bold" style={{ color: `${primaryColor}40` }}>
        ?
      </p>
      <p className="text-sm" style={{ opacity: 0.7 }}>
        Guess the secret number between 1 and 100
      </p>
      {hint && (
        <p
          className="text-sm font-medium"
          style={{ color: won ? primaryColor : undefined }}
        >
          {hint}
        </p>
      )}
      {!won && (
        <div className="flex gap-2 max-w-xs mx-auto">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Your guess..."
            min={1}
            max={100}
            className="flex-1 px-3 py-2 rounded-xl border text-sm text-center"
            style={{ borderColor: "#D8CEC4" }}
            data-ocid="game.input"
          />
          <button
            type="button"
            onClick={check}
            className="px-4 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: primaryColor }}
            data-ocid="game.primary_button"
          >
            Guess
          </button>
        </div>
      )}
      <p className="text-xs" style={{ opacity: 0.5 }}>
        Attempts: {attempts}
      </p>
    </div>
  );
}

const REACTION_EMOJIS = [
  "🌟",
  "🔥",
  "✨",
  "🎈",
  "🎉",
  "💥",
  "⚡",
  "💖",
  "🌈",
  "🥳",
];

function EmojiReaction({ primaryColor }: { primaryColor: string }) {
  const [active, setActive] = useState<{
    emoji: string;
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idRef = useRef(0);

  const spawnEmoji = () => {
    if (gameOver) return;
    idRef.current += 1;
    setActive({
      emoji:
        REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)],
      x: 10 + Math.random() * 70,
      y: 10 + Math.random() * 70,
      id: idRef.current,
    });
    timerRef.current = setTimeout(() => {
      setActive((prev) => {
        if (prev && prev.id === idRef.current) {
          setLives((l) => {
            const newL = l - 1;
            if (newL <= 0) setGameOver(true);
            return newL;
          });
          return null;
        }
        return prev;
      });
      if (!gameOver) setTimeout(spawnEmoji, 200);
    }, 1500);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional initialization only
  useEffect(() => {
    spawnEmoji();
    countdownRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          clearInterval(countdownRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTap = (id: number) => {
    if (active?.id !== id) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setActive(null);
    setScore((s) => s + 1);
    setTimeout(spawnEmoji, 300);
  };

  if (gameOver) {
    return (
      <div className="text-center space-y-3">
        <p className="text-4xl">
          {score >= 15 ? "🌟" : score >= 8 ? "💪" : "😉"}
        </p>
        <p className="font-bold">Game Over!</p>
        <p className="text-sm" style={{ opacity: 0.7 }}>
          Score: {score}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: primaryColor }}>Score: {score}</span>
        <span>{Array.from({ length: lives }, (_) => "❤️").join("")}</span>
        <span style={{ opacity: 0.6 }}>{timeLeft}s</span>
      </div>
      <div className="relative w-full h-48 rounded-2xl bg-muted/30 border border-border overflow-hidden">
        {active && (
          <button
            type="button"
            key={active.id}
            onClick={() => handleTap(active.id)}
            className="absolute text-3xl cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${active.x}%`,
              top: `${active.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            data-ocid="game.canvas_target"
          >
            {active.emoji}
          </button>
        )}
      </div>
      <p className="text-xs mt-2" style={{ opacity: 0.5 }}>
        Tap the emoji before it disappears!
      </p>
    </div>
  );
}

const COLORS_LIST = [
  { name: "RED", color: "#E07B7B" },
  { name: "BLUE", color: "#6BBFCC" },
  { name: "GREEN", color: "#8BBF85" },
  { name: "PURPLE", color: "#C9A8E0" },
  { name: "ORANGE", color: "#FFBF70" },
  { name: "PINK", color: "#FFB8D0" },
];

function ColorMatch({ primaryColor }: { primaryColor: string }) {
  const getRound = () => {
    const shuffled = shuffle(COLORS_LIST);
    const textColor = shuffled[0]; // the actual answer
    const displayColor = shuffled[1]; // the color the text is shown in (distractor)
    const options = shuffle(COLORS_LIST).slice(0, 4);
    if (!options.find((o) => o.name === textColor.name)) options[0] = textColor;
    return { textColor, displayColor, options: shuffle(options) };
  };

  const [round, setRound] = useState(() => getRound());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  const handleAnswer = (name: string) => {
    if (feedback) return;
    const correct = name === round.textColor.name;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    const newTotal = total + 1;
    setTotal(newTotal);
    setTimeout(() => {
      setFeedback(null);
      if (newTotal >= 10) {
        setDone(true);
        return;
      }
      setRound(getRound());
    }, 800);
  };

  if (done) {
    return (
      <div className="text-center space-y-3">
        <p className="text-4xl">
          {score >= 8 ? "🎨" : score >= 5 ? "💪" : "😉"}
        </p>
        <p className="font-bold">Done!</p>
        <p className="text-sm" style={{ opacity: 0.7 }}>
          Score: {score}/10
        </p>
        <button
          type="button"
          onClick={() => {
            setScore(0);
            setTotal(0);
            setDone(false);
            setRound(getRound());
            setFeedback(null);
          }}
          className="px-5 py-2 rounded-full text-white text-sm"
          style={{ background: primaryColor }}
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-between text-sm">
        <span style={{ opacity: 0.6 }}>Round {total + 1}/10</span>
        <span style={{ color: primaryColor }}>Score: {score}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        What color is the TEXT? (not the color it appears in)
      </p>
      <p
        className="text-4xl font-black py-2"
        style={{ color: round.displayColor.color }}
      >
        {round.textColor.name}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {round.options.map((opt) => (
          <button
            type="button"
            key={opt.name}
            onClick={() => handleAnswer(opt.name)}
            className="rounded-xl py-2.5 font-semibold text-sm text-white transition-all"
            style={{
              background: opt.color,
              opacity: feedback && opt.name !== round.textColor.name ? 0.5 : 1,
              outline:
                feedback === "correct" && opt.name === round.textColor.name
                  ? `2px solid ${primaryColor}`
                  : "none",
            }}
            data-ocid="game.card"
          >
            {opt.name}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className="text-sm font-bold"
          style={{ color: feedback === "correct" ? primaryColor : "#E07B7B" }}
        >
          {feedback === "correct"
            ? "✓ Correct!"
            : `✗ It was ${round.textColor.name}`}
        </p>
      )}
    </div>
  );
}

export default function GamePlayer({
  gameType,
  primaryColor = "#5F887C",
  surfaceColor = "#FBF7F1",
}: Props) {
  const titles: Record<string, string> = {
    memory: "🃏 Memory Cards",
    scramble: "🔤 Word Scramble",
    bubble: "🧧 Bubble Pop",
    tictactoe: "⭕ Tic-Tac-Toe",
    numguess: "🔢 Number Guess",
    emojireaction: "⚡ Emoji Reaction",
    colormatch: "🎨 Color Match",
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: surfaceColor }}>
      <h3 className="font-bold text-center mb-4">
        {titles[gameType] || "🎮 Game"}
      </h3>
      {gameType === "memory" && <MemoryCards primaryColor={primaryColor} />}
      {gameType === "scramble" && <WordScramble primaryColor={primaryColor} />}
      {gameType === "bubble" && <BubblePop primaryColor={primaryColor} />}
      {gameType === "tictactoe" && <TicTacToe primaryColor={primaryColor} />}
      {gameType === "numguess" && <NumberGuess primaryColor={primaryColor} />}
      {gameType === "emojireaction" && (
        <EmojiReaction primaryColor={primaryColor} />
      )}
      {gameType === "colormatch" && <ColorMatch primaryColor={primaryColor} />}
    </div>
  );
}
