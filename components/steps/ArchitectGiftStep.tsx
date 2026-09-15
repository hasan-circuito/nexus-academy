'use client';

import type { ArchitectGiftStep, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, ChevronDown, Brain, Cpu, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveStepEvidence } from '@/hooks/useProgress';

export function ArchitectGiftStepComponent({
  step,
  missionData,
}: {
  step: ArchitectGiftStep;
  missionData: MissionData;
}) {
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(false);
  const [isReadDone, setIsReadDone] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const solutions = step.solutions || step.questions || [];

  const handleOpenGift = () => {
    setIsOpened(true);
  };

  const handleConfirmReadDone = () => {
    setIsReadDone(true);
    saveStepEvidence(missionData.id, 'architect_gift', { completed: true });
  };

  const handleGoToNextStep = () => {
    const currentIdx = missionData.steps.findIndex((s) => s.type === 'architect_gift');
    const targetIdx = currentIdx !== -1 ? currentIdx + 1 : missionData.steps.length - 1;
    router.push(`/mission/mission-${missionData.id}/step/${targetIdx}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Milestone Reward</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-bangla-ui text-foreground">
          {step.title || '🎁 চিফ আর্কিটেক্টের সারপ্রাইজ গিফট'}
        </h2>
        <p className="text-muted-foreground font-bangla text-base max-w-xl mx-auto">
          {step.subtitle || 'স্টেপ ১০-এর গভীর চিন্তার আর্কিটেকচার সমাধান'}
        </p>
      </div>

      {/* Unopened State: The Gift Card Box */}
      {!isOpened ? (
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-card via-surface to-card border-2 border-primary/30 shadow-2xl text-center space-y-6 overflow-hidden group hover:border-primary/50 transition-all duration-500">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-primary/20 via-purple-500/20 to-primary/20 border-2 border-primary/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Gift className="w-12 h-12 text-primary animate-bounce" />
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-foreground font-bangla-ui">
              উপহারের বাক্সটি তোমার জন্য প্রস্তুত!
            </h3>
            <p className="text-muted-foreground font-bangla text-sm leading-relaxed">
              {step.instruction ||
                'স্টেপ ১০-এ তুমি যে গুরুত্বপূর্ণ প্রশ্নগুলো নিয়ে চিন্তা করেছিলে, শীর্ষ সফটওয়্যার আর্কিটেক্টরা বাস্তব ইন্ডাস্ট্রিতে কীভাবে তার সমাধান করেন তা দেখতে উপহারের বাক্সটি খোলো।'}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenGift}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-102 transition-all duration-200 text-lg font-bangla"
            >
              <Gift className="w-5 h-5" />
              <span>উপহারের বাক্সটি খুলুন (Open Gift)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Opened State: The Solutions Reveal */
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          {/* Unlocked Banner */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground font-bangla-ui text-base">
                  ✨ উপহার আনলক হয়েছে!
                </h4>
                <p className="text-xs text-muted-foreground font-bangla">
                  আর্কিটেক্টের ৩টি এক্সক্লুসিভ ইন্ডাস্ট্রিয়াল সমাধান এক নজরে দেখে নাও:
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/15 text-primary">
              {solutions.length} Master Solutions
            </span>
          </div>

          {/* Solutions Accordion / Cards */}
          <div className="space-y-4">
            {solutions.map((q, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'bg-card border-primary/40 shadow-lg' : 'bg-surface/70 border-border hover:border-primary/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between gap-4 p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                          isOpen ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-0.5 font-mono">
                          Architect Solution {idx + 1}
                        </span>
                        <h4 className="font-semibold text-base sm:text-lg text-foreground font-bangla leading-relaxed">
                          {q.question}
                        </h4>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 mt-1 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-border/50 space-y-4 bg-card/40 animate-in fade-in duration-300">
                      {/* Expert Thinking */}
                      {q.expertThinking && (
                        <div className="relative p-5 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-primary/30 transition-colors">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl group-hover:w-2 transition-all" />
                          <div className="flex items-center gap-2.5 mb-2.5 pl-3">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                              <Brain className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider text-primary font-mono">
                              Expert Thinking (আর্কিটেকচার অন্তর্দৃষ্টি)
                            </span>
                          </div>
                          <div className="pl-3 font-bangla text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {q.expertThinking}
                          </div>
                        </div>
                      )}

                      {/* Real-world Engineering */}
                      {q.realWorldEngineering && (
                        <div className="relative p-5 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-success/30 transition-colors">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-success rounded-l-2xl group-hover:w-2 transition-all" />
                          <div className="flex items-center gap-2.5 mb-2.5 pl-3">
                            <div className="p-1.5 rounded-lg bg-success/10 text-success">
                              <Cpu className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider text-success font-mono">
                              Real-world Engineering (বাস্তব প্রোডাকশন সিস্টেম)
                            </span>
                          </div>
                          <div className="pl-3 font-bangla text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {q.realWorldEngineering}
                          </div>
                        </div>
                      )}

                      {/* Beyond Programming */}
                      {q.beyondProgramming && (
                        <div className="relative p-5 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-amber-400/30 transition-colors">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 rounded-l-2xl group-hover:w-2 transition-all" />
                          <div className="flex items-center gap-2.5 mb-2.5 pl-3">
                            <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider text-amber-400 font-mono">
                              Beyond Programming (চিন্তার গভীর দর্শন)
                            </span>
                          </div>
                          <div className="pl-3 font-bangla text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {q.beyondProgramming}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Confirmation Card: Read Done */}
          <div className="pt-4 border-t border-border/60">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-card to-surface-elevated border border-border shadow-md space-y-4 text-center">
              {!isReadDone ? (
                <>
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-foreground font-bangla-ui">
                      সমাধানগুলো কি মনোযোগ দিয়ে পড়া শেষ হয়েছে?
                    </h4>
                    <p className="text-xs text-muted-foreground font-bangla max-w-md mx-auto">
                      আর্কিটেক্টের প্রতিটি ব্যাখ্যা আত্মস্থ করা হলে নিচের বোতামে ক্লিক করে নিশ্চিত করো। এরপরই চূড়ান্ত ফলাফল আনলক হবে।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmReadDone}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-200 text-base font-bangla"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>পড়া সম্পন্ন হয়েছে (Read Done)</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-success/15 text-success flex items-center justify-center border border-success/30 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-success font-bangla-ui">
                      পড়া সম্পন্ন হয়েছে!
                    </h4>
                    <p className="text-xs text-muted-foreground font-bangla max-w-md mx-auto">
                      তুমি সফলভাবে আর্কিটেক্টের সবগুলো সমাধান আয়ত্ত করেছ। এবার চূড়ান্ত ফলাফল ও পরবর্তী মিশনের ফ্রন্টিয়ার দেখার পালা।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoToNextStep}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-success text-white font-bold rounded-xl hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 text-base font-bangla group"
                  >
                    <span>চূড়ান্ত ফলাফলে যাও (Continue to Final Step)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
