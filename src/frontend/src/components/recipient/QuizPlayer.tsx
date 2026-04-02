import { useRef, useState } from "react";
import type { QuizData } from "../../backend.d";

interface Props {
  quiz: QuizData;
  primaryColor?: string;
  surfaceColor?: string;
}

export default function QuizPlayer({
  quiz,
  primaryColor = "#5F887C",
  surfaceColor = "#FBF7F1",
}: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(quiz.questions.length).fill(""),
  );
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (quiz.questions.length === 0) return null;

  const q = quiz.questions[current];
  const currentAnswer = answers[current] ?? "";

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = val;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!currentAnswer.trim()) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent((c) => c + 1);
      setSubmitted(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="p-6 text-center" style={{ background: surfaceColor }}>
        <div className="text-5xl mb-3">🎉</div>
        <p className="text-xl font-bold mb-1">Quiz Complete!</p>
        <p className="text-sm mt-1" style={{ opacity: 0.7 }}>
          Thanks for sharing your thoughts!
        </p>
        <button
          type="button"
          onClick={() => {
            setCurrent(0);
            setAnswers(Array(quiz.questions.length).fill(""));
            setSubmitted(false);
            setDone(false);
          }}
          className="mt-4 px-6 py-2 rounded-full text-white text-sm font-medium"
          style={{ background: primaryColor }}
          data-ocid="quiz.primary_button"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-5" style={{ background: surfaceColor }}>
      <div
        className="flex justify-between text-xs mb-4"
        style={{ opacity: 0.6 }}
      >
        <span>
          Question {current + 1}/{quiz.questions.length}
        </span>
      </div>

      <p className="font-semibold mb-5">{q.questionText}</p>

      <div className="space-y-3 mb-5">
        {!submitted ? (
          <>
            <textarea
              ref={textareaRef}
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onFocus={(e) =>
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
              placeholder="Type your answer here..."
              rows={4}
              tabIndex={0}
              inputMode="text"
              enterKeyHint="done"
              autoComplete="off"
              autoCorrect="on"
              spellCheck={true}
              style={{
                display: "block",
                width: "100%",
                borderRadius: "12px",
                padding: "12px",
                fontSize: "16px",
                border: `2px solid ${primaryColor}40`,
                background: "white",
                color: "#1a1a1a",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
                WebkitAppearance: "none",
                touchAction: "auto",
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!currentAnswer.trim()}
              className="w-full py-2.5 rounded-full text-white text-sm font-medium disabled:opacity-50"
              style={{ background: primaryColor }}
              data-ocid="quiz.primary_button"
            >
              Submit Answer
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">💬</div>
            <p className="font-medium text-sm">Thanks for your answer!</p>
            <p className="text-xs mt-1" style={{ opacity: 0.6 }}>
              Your response has been noted.
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-4 w-full py-2.5 rounded-full text-white text-sm font-medium"
              style={{ background: primaryColor }}
              data-ocid="quiz.primary_button"
            >
              {current < quiz.questions.length - 1
                ? "Next Question →"
                : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
