'use client';
import type { ReflectionStep, CriticalThinkingQuestion, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { Brain, CheckCircle, ChevronDown, Cpu, Lightbulb, PenTool, ArrowRight } from 'lucide-react';
import { EventBus } from '@/engines/events/EventBus';

// ─────────────────────────────────────────────────────────────
// Critical Thinking Lab — single question card
// ─────────────────────────────────────────────────────────────
function CriticalThinkingCard({
  item,
  index,
  total,
  onComplete,
}: {
  item: CriticalThinkingQuestion;
  index: number;
  total: number;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<'question' | 'expert' | 'realworld' | 'beyond'>('question');

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      {/* Question header */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground font-semibold uppercase tracking-wider">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
          {index + 1}
        </span>
        <span>Question {index + 1} of {total}</span>
      </div>

      {/* Question card */}
      <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 mt-1">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Critical Question</p>
            <p className="text-xl font-semibold text-foreground leading-relaxed">{item.question}</p>
          </div>
        </div>
      </div>

      {/* Phase: Think */}
      {phase === 'question' && (
        <button
          onClick={() => setPhase('expert')}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg text-lg group"
        >
          <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
          🧠 I&apos;ve Thought About It
        </button>
      )}

      {/* Phase: Expert Thinking */}
      {(phase === 'expert' || phase === 'realworld' || phase === 'beyond') && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-2xl" />
            <div className="flex items-center gap-2 mb-4 pl-4">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Expert Thinking</span>
            </div>
            <div className="pl-4 font-bangla text-foreground-muted leading-relaxed space-y-3 whitespace-pre-line">
              {item.expertThinking}
            </div>
            {phase === 'expert' && (
              <button
                onClick={() => setPhase('realworld')}
                className="mt-6 ml-4 flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl hover:bg-surface text-foreground font-semibold text-sm transition-colors"
              >
                Next <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Phase: Real-world Engineering */}
      {(phase === 'realworld' || phase === 'beyond') && (
        <div className="animate-in fade-in duration-500">
          <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-success rounded-l-2xl" />
            <div className="flex items-center gap-2 mb-4 pl-4">
              <Cpu className="w-5 h-5 text-success" />
              <span className="font-bold text-foreground">Real-world Engineering</span>
            </div>
            <div className="pl-4 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line">
              {item.realWorldEngineering}
            </div>
            {phase === 'realworld' && (
              <button
                onClick={() => setPhase('beyond')}
                className="mt-6 ml-4 flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl hover:bg-surface text-foreground font-semibold text-sm transition-colors"
              >
                Next <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Phase: Beyond Programming */}
      {phase === 'beyond' && (
        <div className="animate-in fade-in duration-500 space-y-4">
          <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-level rounded-l-2xl" />
            <div className="flex items-center gap-2 mb-4 pl-4">
              <Lightbulb className="w-5 h-5 text-level" />
              <span className="font-bold text-foreground">Beyond Programming</span>
            </div>
            <div className="pl-4 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line">
              {item.beyondProgramming}
            </div>
          </div>
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-success text-white font-bold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md text-lg group"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {index < total - 1 ? 'Next Question' : 'See Mission Reflection'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// End Screen
// ─────────────────────────────────────────────────────────────
function EndScreen({
  endScreen,
  onDone,
}: {
  endScreen: { title: string; message: string; conclusion: string };
  onDone: () => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 text-center">
      <div className="space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">{endScreen.title}</h2>
        <p className="font-bangla text-muted-foreground text-lg leading-relaxed whitespace-pre-line max-w-xl mx-auto">
          {endScreen.message}
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-left">
        <p className="font-bangla text-foreground leading-relaxed whitespace-pre-line">
          {endScreen.conclusion}
        </p>
      </div>

      <button
        onClick={onDone}
        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm text-lg"
      >
        Continue Mission
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main ReflectionStep Component
// ─────────────────────────────────────────────────────────────
export function ReflectionStepComponent({ step, missionData }: { step: ReflectionStep; missionData: MissionData }) {
  const [isDone, setIsDone] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);

  // ── Critical Thinking Lab mode ──────────────────────────────
  if (step.criticalThinkingQuestions && step.criticalThinkingQuestions.length > 0) {
    const questions = step.criticalThinkingQuestions;

    if (isDone) {
      return (
        <div className="w-full max-w-2xl mx-auto p-4 text-center text-success font-semibold flex items-center justify-center gap-2 bg-success/10 rounded-xl border border-success/30 animate-in fade-in duration-500">
          <CheckCircle className="w-5 h-5" /> Reflection Complete
        </div>
      );
    }

    if (showEndScreen && step.endScreen) {
      return (
        <EndScreen
          endScreen={step.endScreen}
          onDone={() => {
            EventBus.emit({ type: 'REFLECTION_COMPLETED', payload: { missionId: missionData.id, promptsAnswered: questions.length, totalPrompts: questions.length, timestamp: new Date().toISOString() } });
            setIsDone(true);
          }}
        />
      );
    }

    const handleQuestionComplete = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(q => q + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step.endScreen) {
        setShowEndScreen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        EventBus.emit({ type: 'REFLECTION_COMPLETED', payload: { missionId: missionData.id, promptsAnswered: questions.length, totalPrompts: questions.length, timestamp: new Date().toISOString() } });
        setIsDone(true);
      }
    };

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
          <p className="text-muted-foreground font-bangla">{step.instruction}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < currentQuestion ? 'bg-success' : i === currentQuestion ? 'bg-primary w-6' : 'bg-border'}`}
            />
          ))}
        </div>

        <CriticalThinkingCard
          key={currentQuestion}
          item={questions[currentQuestion]}
          index={currentQuestion}
          total={questions.length}
          onComplete={handleQuestionComplete}
        />
      </div>
    );
  }

  // ── Simple (legacy) mode ────────────────────────────────────
  return (
    <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
          <PenTool className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
        <p className="text-muted-foreground font-bangla">{step.instruction}</p>
      </div>

      <div className="space-y-4">
        {step.prompts.map((p, i) => (
          <div key={i} className={`p-6 rounded-xl border transition-all ${isDone ? 'bg-surface opacity-50' : 'bg-card border-border shadow-sm'}`}>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">Prompt {i + 1}</span>
            <p className="font-bangla font-medium text-foreground text-lg">{p}</p>
          </div>
        ))}
      </div>

      {!isDone ? (
        <button onClick={() => setIsDone(true)} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm text-lg">
          Complete Reflection
        </button>
      ) : (
        <div className="w-full p-4 text-center text-success font-semibold flex items-center justify-center gap-2 bg-success/10 rounded-xl border border-success/30">
          <CheckCircle className="w-5 h-5" /> Reflection Recorded
        </div>
      )}
    </div>
  );
}
