'use client';
import type { ReflectionStep, CriticalThinkingQuestion, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { Brain, CheckCircle, ChevronDown, Cpu, Lightbulb, PenTool, ArrowRight } from 'lucide-react';
import { EventBus } from '@/engines/events/EventBus';
import { saveStepEvidence } from '@/hooks/useProgress';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pure Critical Thinking Question Card (No Answers Leaked)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CriticalThinkingQuestionCard({
  item,
  index,
  isThought,
  onToggleThought,
}: {
  item: CriticalThinkingQuestion;
  index: number;
  isThought: boolean;
  onToggleThought: () => void;
}) {
  return (
    <div
      className={`w-full rounded-2xl border transition-all duration-300 p-6 space-y-4 ${
        isThought
          ? 'bg-card border-primary/40 shadow-md'
          : 'bg-surface border-border hover:border-primary/20 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
            isThought
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-primary/10 text-primary border border-primary/20'
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary block mb-1">
            Question {index + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground font-bangla leading-relaxed">
            {item.question}
          </h3>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-surface-elevated/70 border border-border/60 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-muted-foreground font-bangla leading-relaxed">
          বাস্তব সফটওয়্যার ডিজাইনে এই সিদ্ধান্তের গুরুত্ব কী? নিজের মতো কিছুক্ষণ গভীরভাবে চিন্তা করো। তোমার চিন্তা তৈরি হলে নিচের বাটনে ক্লিক করো।
        </p>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onToggleThought}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bangla text-sm font-semibold transition-all duration-200 shadow-sm ${
            isThought
              ? 'bg-success/15 text-success border border-success/30 hover:bg-success/20'
              : 'bg-primary/10 text-primary border border-primary/25 hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          {isThought ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>চিন্তা সম্পন্ন হয়েছে ✓</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>আমি বিষয়টি নিয়ে চিন্তা করেছি</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main ReflectionStep Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ReflectionStepComponent({
  step,
  missionData,
}: {
  step: ReflectionStep;
  missionData: MissionData;
}) {
  const [completedThoughts, setCompletedThoughts] = useState<Set<number>>(new Set());
  const [isDone, setIsDone] = useState(false);

  // 🔹 Critical Thinking Lab mode 🔹
  if (step.criticalThinkingQuestions && step.criticalThinkingQuestions.length > 0) {
    const questions = step.criticalThinkingQuestions;

    const toggleThought = (index: number) => {
      const next = new Set(completedThoughts);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      setCompletedThoughts(next);
      saveStepEvidence(missionData.id, 'reflection', { completed: true });
    };

    return (
      <div className="w-full max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-3xl flex items-center justify-center border-2 border-primary/20 shadow-inner">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla-ui text-foreground">
            {step.title}
          </h2>
          <p className="text-muted-foreground font-bangla text-base max-w-xl mx-auto">
            {step.instruction || 'এখন কোডের বাইরে তাকিয়ে ভাবো। এই মিশনে তুমি যা যা তৈরি করেছ, তার পেছনের স্থাপত্য দর্শন নিয়ে নিচের প্রশ্নগুলো চিন্তা করো।'}
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <CriticalThinkingQuestionCard
              key={i}
              item={q}
              index={i}
              isThought={completedThoughts.has(i)}
              onToggleThought={() => toggleThought(i)}
            />
          ))}
        </div>

        {/* Transition card once questions are reflected upon */}
        <div className="pt-6 border-t border-border/50">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
              <span>🎁 চিফ আর্কিটেক্টের উপহার পরবর্তী ধাপে অপেক্ষা করছে!</span>
            </div>
            <p className="font-bangla text-sm text-foreground-muted max-w-lg mx-auto">
              প্রশ্নগুলো নিয়ে তোমার নিজস্ব ভাবনা প্রস্তুত। পরবর্তী ধাপে চিফ আর্কিটেক্ট তোমার জন্য একটি বিশেষ গিফট বক্স রেখেছেন—সেখানে এই প্রশ্নগুলোর সম্পূর্ণ ইন্ডাস্ট্রিয়াল সমাধান তোমার জন্য উন্মোচিত হবে! নিচের <b>Next</b> বাটনে ক্লিক করে গিফট কার্ডে প্রবেশ করো।
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Simple (legacy) mode 🔹
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
