'use client';
import type { ReflectionStep, CriticalThinkingQuestion, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { Brain, CheckCircle, ChevronDown, Cpu, Lightbulb, PenTool, ArrowRight } from 'lucide-react';
import { EventBus } from '@/engines/events/EventBus';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Expandable Accordion Item for Critical Thinking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CriticalThinkingAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
  onThinkComplete
}: {
  item: CriticalThinkingQuestion;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onThinkComplete: () => void;
}) {
  const [hasThought, setHasThought] = useState(false);

  const handleThink = () => {
    setHasThought(true);
    onThinkComplete();
  };

  return (
    <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-card border-primary/40 shadow-lg' : 'bg-surface border-border hover:border-primary/30 shadow-sm'}`}>
      
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-6 text-left focus:outline-none"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="text-xl font-semibold text-foreground font-bangla leading-relaxed pr-4">{item.question}</p>
        </div>
        <ChevronDown className={`w-6 h-6 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {/* Accordion Body */}
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 border-t border-border/50 bg-card/50">
          
          {!hasThought ? (
            <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="font-bangla text-muted-foreground mb-6">প্রশ্নটি নিয়ে একটু চিন্তা করুন। আপনি কি জানেন উত্তর কী হতে পারে?</p>
              <button
                onClick={handleThink}
                className="flex mx-auto items-center justify-center gap-3 py-3 px-8 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg text-lg group"
              >
                <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                আমি চিন্তা করেছি, উত্তর দেখাও!
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-6 animate-in slide-in-from-top-4 duration-700">
              {/* Expert Thinking */}
              <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl group-hover:w-2 transition-all" />
                <div className="flex items-center gap-3 mb-3 pl-4">
                  <Brain className="w-6 h-6 text-primary" />
                  <span className="font-bold text-foreground text-lg uppercase tracking-wider text-primary">Expert Thinking</span>
                </div>
                <div className="pl-4 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line text-lg">
                  {item.expertThinking}
                </div>
              </div>

              {/* Real-world Engineering */}
              <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-success/30 transition-colors">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-success rounded-l-2xl group-hover:w-2 transition-all" />
                <div className="flex items-center gap-3 mb-3 pl-4">
                  <Cpu className="w-6 h-6 text-success" />
                  <span className="font-bold text-foreground text-lg uppercase tracking-wider text-success">Real-world Engineering</span>
                </div>
                <div className="pl-4 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line text-lg">
                  {item.realWorldEngineering}
                </div>
              </div>

              {/* Beyond Programming */}
              <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-level/30 transition-colors">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-level rounded-l-2xl group-hover:w-2 transition-all" />
                <div className="flex items-center gap-3 mb-3 pl-4">
                  <Lightbulb className="w-6 h-6 text-level" />
                  <span className="font-bold text-foreground text-lg uppercase tracking-wider text-level">Beyond Programming</span>
                </div>
                <div className="pl-4 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line text-lg">
                  {item.beyondProgramming}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// End Screen
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main ReflectionStep Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ReflectionStepComponent({ step, missionData }: { step: ReflectionStep; missionData: MissionData }) {
  const [isDone, setIsDone] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First accordion open by default
  const [completedThoughts, setCompletedThoughts] = useState<Set<number>>(new Set());

  // 🔹 Critical Thinking Lab mode 🔹
  if (step.criticalThinkingQuestions && step.criticalThinkingQuestions.length > 0) {
    const questions = step.criticalThinkingQuestions;

    if (isDone) {
      return (
        <div className="w-full max-w-2xl mx-auto p-4 text-center text-success font-semibold flex items-center justify-center gap-2 bg-success/10 rounded-xl border border-success/30 animate-in fade-in duration-500">
          <CheckCircle className="w-5 h-5" /> Critical Thinking Lab Completed
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

    const handleThinkComplete = (index: number) => {
      const newSet = new Set(completedThoughts);
      newSet.add(index);
      setCompletedThoughts(newSet);
      
      // Auto open next uncompleted accordion
      if (index < questions.length - 1 && !newSet.has(index + 1)) {
        setTimeout(() => setOpenIndex(index + 1), 500);
      }
    };

    const handleFinishLab = () => {
      if (step.endScreen) {
        setShowEndScreen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        EventBus.emit({ type: 'REFLECTION_COMPLETED', payload: { missionId: missionData.id, promptsAnswered: questions.length, totalPrompts: questions.length, timestamp: new Date().toISOString() } });
        setIsDone(true);
      }
    };

    return (
      <div className="w-full max-w-3xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 mx-auto bg-primary/10 text-primary rounded-3xl flex items-center justify-center border-2 border-primary/20 shadow-inner">
            <Brain className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
          <p className="text-muted-foreground font-bangla text-lg max-w-xl mx-auto">{step.instruction}</p>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <CriticalThinkingAccordionItem
              key={i}
              item={q}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              onThinkComplete={() => handleThinkComplete(i)}
            />
          ))}
        </div>

        {/* Finish Button appears only when all thoughts are completed */}
        {completedThoughts.size === questions.length && (
          <div className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 border-t border-border/50">
            <button
              onClick={handleFinishLab}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-success text-white font-bold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg text-lg group"
            >
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Complete Lab
            </button>
          </div>
        )}
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
