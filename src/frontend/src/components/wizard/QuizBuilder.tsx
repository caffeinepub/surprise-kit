import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Image,
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { QuizData, QuizQuestion } from "../../backend.d";
import { useSuggestQuizQuestions } from "../../hooks/useQueries";
import { useUpload } from "../../hooks/useUpload";

interface Props {
  quiz: QuizData;
  packageTitle: string;
  onChange: (quiz: QuizData) => void;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyQuestion(): QuizQuestion {
  return {
    id: makeId(),
    questionText: "",
    choices: ["", "", "", ""],
    correctIndex: BigInt(0),
    imageUrls: ["", "", "", ""],
    aiSuggested: false,
  };
}

function commentQuestion(): QuizQuestion {
  return {
    id: makeId(),
    questionText: "",
    choices: ["__comment__", "", "", ""],
    correctIndex: BigInt(0),
    imageUrls: ["", "", "", ""],
    aiSuggested: false,
  };
}

const CHOICE_IDS = ["a", "b", "c", "d"];

export default function QuizBuilder({ quiz, packageTitle, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const suggestMutation = useSuggestQuizQuestions();
  const { upload } = useUpload();
  const uploadChoiceRef = useRef<{ qid: string; cidx: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addQuestion = () => {
    const q = emptyQuestion();
    onChange({ questions: [...quiz.questions, q] });
    setExpandedId(q.id);
  };

  const addCommentQuestion = () => {
    const q = commentQuestion();
    onChange({ questions: [...quiz.questions, q] });
    setExpandedId(q.id);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    onChange({
      questions: quiz.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q,
      ),
    });
  };

  const deleteQuestion = (id: string) => {
    onChange({ questions: quiz.questions.filter((q) => q.id !== id) });
  };

  const handleSuggest = async () => {
    try {
      const suggestions = await suggestMutation.mutateAsync(
        packageTitle || "Surprise Kit",
      );
      const newQuestions: QuizQuestion[] = suggestions.map((s) => ({
        id: makeId(),
        questionText: s,
        choices: ["", "", "", ""],
        correctIndex: BigInt(0),
        imageUrls: ["", "", "", ""],
        aiSuggested: true,
      }));
      onChange({ questions: [...quiz.questions, ...newQuestions] });
      toast.success(`Added ${suggestions.length} AI suggestions!`);
    } catch {
      toast.error("Could not fetch suggestions");
    }
  };

  const handleChoiceImageUpload = async (
    file: File,
    qid: string,
    cidx: number,
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    try {
      const url = await upload(file);
      const q = quiz.questions.find((qItem) => qItem.id === qid);
      if (!q) return;
      const newUrls = [...q.imageUrls];
      newUrls[cidx] = url;
      updateQuestion(qid, { imageUrls: newUrls });
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">Build a Quiz</h2>
      <p className="text-muted-foreground text-sm mb-5">
        Create fun questions for your recipient to answer.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        <Button
          onClick={addQuestion}
          className="rounded-full gap-1.5"
          data-ocid="quiz.primary_button"
        >
          <Plus className="w-4 h-4" /> Add Question
        </Button>
        <Button
          variant="outline"
          onClick={addCommentQuestion}
          className="rounded-full gap-1.5"
          data-ocid="quiz.secondary_button"
        >
          <MessageSquare className="w-4 h-4" /> Comment Question
        </Button>
        <Button
          variant="outline"
          onClick={handleSuggest}
          disabled={suggestMutation.isPending}
          className="rounded-full gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          {suggestMutation.isPending ? "Thinking..." : "AI Suggest"}
        </Button>
      </div>

      {quiz.questions.length === 0 && (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="quiz.empty_state"
        >
          <div className="text-4xl mb-2">📝</div>
          <p className="text-sm">
            No questions yet. Add one or use AI suggestions!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {quiz.questions.map((q, qi) => {
          const isOpen = expandedId === q.id;
          const isComment = q.choices[0] === "__comment__";
          return (
            <div
              key={q.id}
              className="border border-border rounded-xl overflow-hidden"
              data-ocid={`quiz.item.${qi + 1}`}
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(isOpen ? null : q.id)}
                aria-expanded={isOpen}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                  {qi + 1}
                </div>
                <p className="flex-1 text-sm font-medium truncate">
                  {q.questionText || "New Question"}
                </p>
                {isComment && (
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                    💬 Comment
                  </span>
                )}
                {q.aiSuggested && (
                  <span className="text-xs bg-accent text-accent-foreground rounded-full px-2 py-0.5">
                    AI
                  </span>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-7 h-7 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(q.id);
                  }}
                  data-ocid={`quiz.delete_button.${qi + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </button>

              {isOpen && (
                <div className="border-t border-border p-4 space-y-4 bg-muted/20">
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">
                      Question
                    </Label>
                    <Input
                      value={q.questionText}
                      onChange={(e) =>
                        updateQuestion(q.id, { questionText: e.target.value })
                      }
                      placeholder={
                        isComment
                          ? "What would you like them to comment on?"
                          : "What's your favourite season?"
                      }
                      className="rounded-xl text-sm"
                      data-ocid="quiz.input"
                    />
                  </div>
                  {isComment ? (
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        This is a comment question. The recipient will type
                        their own free-text answer.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">
                        Answer Choices
                      </Label>
                      <div className="space-y-2">
                        {q.choices.map((choice, cidx) => (
                          <div
                            key={`${q.id}-${CHOICE_IDS[cidx]}`}
                            className="flex items-center gap-2"
                          >
                            <button
                              type="button"
                              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                Number(q.correctIndex) === cidx
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                              onClick={() =>
                                updateQuestion(q.id, {
                                  correctIndex: BigInt(cidx),
                                })
                              }
                              aria-label={`Mark choice ${cidx + 1} as correct`}
                              data-ocid="quiz.radio"
                            >
                              {Number(q.correctIndex) === cidx && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </button>
                            <Input
                              value={choice}
                              onChange={(e) => {
                                const nc = [...q.choices];
                                nc[cidx] = e.target.value;
                                updateQuestion(q.id, { choices: nc });
                              }}
                              placeholder={`Choice ${cidx + 1}`}
                              className="rounded-xl text-sm flex-1"
                              data-ocid="quiz.input"
                            />
                            <button
                              type="button"
                              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                              onClick={() => {
                                uploadChoiceRef.current = { qid: q.id, cidx };
                                fileRef.current?.click();
                              }}
                              aria-label="Upload choice image"
                            >
                              {q.imageUrls[cidx] ? (
                                <img
                                  src={q.imageUrls[cidx]}
                                  alt=""
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Image className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && uploadChoiceRef.current) {
            handleChoiceImageUpload(
              f,
              uploadChoiceRef.current.qid,
              uploadChoiceRef.current.cidx,
            );
            uploadChoiceRef.current = null;
          }
        }}
      />
    </div>
  );
}
