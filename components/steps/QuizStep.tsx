'use client';
import type { QuizStep, QuizQuestion } from '@/types/mission.types';
import type { MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react';
import { saveStepEvidence } from '@/hooks/useProgress';

interface Props {
  step: QuizStep;
  missionData: MissionData;
}

export function QuizStepComponent({ step, missionData: _missionData }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(step.questions.length).fill(null)
  );

  const q: QuizQuestion = step.questions[currentQuestion];
  const isCorrect = selected === q.correctOptionIndex;
  const totalQuestions = step.questions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (selected === q.correctOptionIndex) {
      setScore(prev => prev + 1);
    }
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selected;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      // Persist quiz evidence to localStorage
      const finalScore = selected === q.correctOptionIndex ? score + 1 : score;
      const pct = Math.round((finalScore / totalQuestions) * 100);
      saveStepEvidence(_missionData.id, 'quiz', {
        passed: pct >= step.passingScore,
        score: pct,
        totalQuestions,
        correctAnswers: finalScore,
      });
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / totalQuestions) * 100);
    const passed = pct >= step.passingScore;
    return (
      <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
        <div className={`p-8 rounded-2xl text-center space-y-4 border ${passed ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
          <Trophy className={`w-14 h-14 mx-auto ${passed ? 'text-success' : 'text-warning'}`} />
          <p className="text-4xl font-bold text-foreground">{pct}%</p>
          <p className={`font-semibold ${passed ? 'text-success' : 'text-warning'}`}>
            {passed ? 'Quiz Passed!' : `Needs Review (passing: ${step.passingScore}%)`}
          </p>
          <p className="text-muted-foreground text-sm">{score} / {totalQuestions} correct</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
        <span className="text-sm text-muted-foreground font-medium">{currentQuestion + 1} / {totalQuestions}</span>
      </div>
      <p className="text-muted-foreground font-bangla">{step.instructions}</p>

      {/* Question progress dots */}
      <div className="flex gap-2">
        {step.questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < currentQuestion ? 'bg-success' :
              i === currentQuestion ? 'bg-primary' : 'bg-surface-elevated'
            }`}
          />
        ))}
      </div>

      <div className="p-8 bg-card border border-border rounded-xl shadow-sm space-y-6">
        <div className="flex items-start gap-3">
          <span className={`shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
            q.difficulty === 'easy' ? 'bg-success/10 text-success' :
            q.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
          }`}>{q.difficulty}</span>
          <h3 className="text-xl font-bangla font-medium text-foreground">{q.question}</h3>
        </div>

        <div className="space-y-3">
          {q.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all font-bangla ${
                submitted
                  ? i === q.correctOptionIndex
                    ? 'bg-success/10 border-success text-success font-semibold'
                    : i === selected
                    ? 'bg-destructive/10 border-destructive text-destructive'
                    : 'bg-surface border-border opacity-50'
                  : selected === i
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border hover:border-primary/50 text-foreground'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                  selected === i && !submitted ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>

        {submitted && (
          <div className={`p-4 rounded-lg border flex gap-3 animate-in fade-in duration-300 ${
            isCorrect ? 'bg-success/10 border-success/30 text-success' : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="font-bangla text-sm font-medium">{q.explanation}</p>
          </div>
        )}

        {!submitted ? (
          <button
            disabled={selected === null}
            onClick={handleSubmit}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-50 transition-colors hover:bg-primary-hover"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg transition-colors hover:bg-primary-hover flex items-center justify-center gap-2"
          >
            {currentQuestion < totalQuestions - 1 ? (
              <>Next Question <ChevronRight className="w-4 h-4" /></>
            ) : (
              <>See Results <Trophy className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
