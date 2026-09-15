'use client';
import type { MissionCompleteStep, MissionData, ReflectionStep } from '@/types/mission.types';
import {
  Target,
  Trophy,
  Star,
  Copy,
  Bot,
  CheckCircle2,
  Unlock,
  Lock,
  AlertTriangle,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Gift,
  Brain,
  Cpu,
  Lightbulb,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { XPEngine } from '@/engines/xp/XPEngine';
import { storage } from '@/services/LocalStorageDataService';
import { ProgressEngine } from '@/engines/progress/ProgressEngine';
import { MissionProgressGate } from '@/services/MissionProgressGate';

export function MissionCompleteStepComponent({ step, missionData }: { step: MissionCompleteStep; missionData: MissionData }) {
  const router = useRouter();
  const { progress, isClient } = useProgress();
  const [copied, setCopied] = useState(false);
  const [openGiftIndex, setOpenGiftIndex] = useState<number | null>(0);

  // Extract Critical Thinking / Reflection questions as Architect's Gift
  const reflectionStep = missionData?.steps?.find((s) => s.type === 'reflection') as ReflectionStep | undefined;
  const reflectionQuestions = reflectionStep?.criticalThinkingQuestions || [];

  const isComplete = isClient && progress.missions[missionData.id]?.status === 'complete';
  const incompleteSteps = isClient ? MissionProgressGate.getIncompleteSteps(missionData) : [];
  const projected = isClient ? ProgressEngine.calculateProjectedScore(missionData) : { score: 0, xp: 0 };
  
  const xpEarned = isComplete ? (progress.missions[missionData.id].xpEarned || 0) : projected.xp;
  const score = isComplete ? (progress.missions[missionData.id].understandingScore || 0) : projected.score;

  const projectedXP = isClient ? (progress.xp + (isComplete ? 0 : xpEarned)) : 0;
  const projectedXPState = isClient
    ? new XPEngine(storage).computeXPState(projectedXP)
    : { level: 1, percentToNextLevel: 0, levelName: 'Learner' };

  // Calculate next mission number from missionData.id
  const currentMissionNum = parseInt(missionData.id, 10);
  const nextMissionNum = currentMissionNum + 1;
  const nextMissionLabel = `Mission ${String(nextMissionNum).padStart(3, '0')}`;

  const promptText = `Act as an expert Python mentor for a beginner.
I just completed the mission: "${missionData.title}".
My Understanding Score was ${score}/100.
Can you give me a brief summary of what I should review next based on this topic, and ask me one follow-up question to test my knowledge?`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 text-success mb-2">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
        <p className="text-xl font-bangla text-muted-foreground max-w-2xl mx-auto">{step.summary}</p>
      </div>

      {/* Incomplete Steps Action Card */}
      {!isComplete && incompleteSteps.length > 0 && (
        <div className="p-6 rounded-2xl bg-warning/10 border border-warning/30 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warning/20 text-warning shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground font-bangla-ui">
                মিশন সমাপ্তির জন্য বাকি ধাপসমূহ:
              </h3>
              <p className="text-sm text-muted-foreground font-bangla">
                মিশনটি ফিনিশ ও পরবর্তী মিশন আনলক করার জন্য নিচের {incompleteSteps.length}টি ধাপ সফলভাবে সম্পন্ন করুন:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {incompleteSteps.map((s) => (
              <div
                key={s.index}
                className="p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-3 shadow-sm hover:border-primary/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-warning px-2 py-0.5 rounded-full bg-warning/10 inline-block mb-1">
                    {s.category}
                  </span>
                  <p className="text-sm font-medium text-foreground truncate font-bangla">
                    ধাপ {s.stepNumber}: {s.title}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/mission/mission-${missionData.id}/step/${s.index}`)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>যাও</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎁 Architect's Gift: Reflection Insights & Solutions (Step 10 Answers) */}
      {reflectionQuestions.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-primary/10 border border-primary/30 space-y-6 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-inner border border-primary/30">
                <Gift className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                    🎁 Special Gift For You
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">Step 10 Solutions</span>
                </div>
                <h3 className="font-bold text-xl text-foreground font-bangla-ui mt-0.5">
                  চিফ আর্কিটেক্টের গিফট: স্টেপ ১০-এর গভীর প্রশ্ন ও অর্থপূর্ণ সমাধান
                </h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-bangla max-w-sm leading-relaxed">
              স্টেপ ১০-এ তুমি যে প্রশ্নগুলো নিয়ে চিন্তা করেছিলে, সফটওয়্যার আর্কিটেক্টরা বাস্তব ইন্ডাস্ট্রিতে কীভাবে তার সমাধান করেন তা এক নজরে দেখে নাও:
            </p>
          </div>

          <div className="space-y-4">
            {reflectionQuestions.map((q, idx) => {
              const isOpen = openGiftIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'bg-card border-primary/40 shadow-lg' : 'bg-surface/60 border-border hover:border-primary/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenGiftIndex(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between gap-4 p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                        isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-0.5 font-mono">
                          Architecture Question {idx + 1}
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
                          <div className="flex items-center gap-2.5 mb-2 pl-3">
                            <Brain className="w-5 h-5 text-primary" />
                            <span className="font-bold text-primary text-xs uppercase tracking-wider font-mono">
                              Expert Thinking & Meaningful Answer
                            </span>
                          </div>
                          <div className="pl-3 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {q.expertThinking}
                          </div>
                        </div>
                      )}

                      {/* Real-world Engineering */}
                      {q.realWorldEngineering && (
                        <div className="relative p-5 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-success/30 transition-colors">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-success rounded-l-2xl group-hover:w-2 transition-all" />
                          <div className="flex items-center gap-2.5 mb-2 pl-3">
                            <Cpu className="w-5 h-5 text-success" />
                            <span className="font-bold text-success text-xs uppercase tracking-wider font-mono">
                              Real-World Engineering In Action
                            </span>
                          </div>
                          <div className="pl-3 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {q.realWorldEngineering}
                          </div>
                        </div>
                      )}

                      {/* Beyond Programming */}
                      {q.beyondProgramming && (
                        <div className="relative p-5 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-amber-500/30 transition-colors">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-l-2xl group-hover:w-2 transition-all" />
                          <div className="flex items-center gap-2.5 mb-2 pl-3">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                            <span className="font-bold text-amber-500 text-xs uppercase tracking-wider font-mono">
                              Beyond Programming & Life Principles
                            </span>
                          </div>
                          <div className="pl-3 font-bangla text-foreground-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
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
        </div>
      )}

      {/* Key Learnings */}
      {step.keyLearnings && step.keyLearnings.length > 0 && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider border-b border-border pb-2">Key Takeaways</h3>
          <ul className="space-y-2">
            {step.keyLearnings.map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-bangla text-foreground-muted">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Engineering Frontier: Current Limitation & Next Mission Bridge */}
      {(step.currentLimitation || step.nextMissionBridge) && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider flex items-center gap-2 font-bangla-ui">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Engineering Frontier: বর্তমান সীমাবদ্ধতা ও পরবর্তী ধাপ
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Architecture Bridge</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {step.currentLimitation && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground font-bangla-ui">
                    {step.currentLimitation.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground font-bangla leading-relaxed">
                  {step.currentLimitation.description}
                </p>
                {step.currentLimitation.technicalReason && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Technical Reason:</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                      {step.currentLimitation.technicalReason}
                    </span>
                  </div>
                )}
              </div>
            )}

            {step.nextMissionBridge && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground font-bangla-ui">
                    {step.nextMissionBridge.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground font-bangla leading-relaxed">
                  {step.nextMissionBridge.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-primary font-semibold">
                    Target: Mission {step.nextMissionBridge.targetMissionId}
                  </span>
                  <button
                    onClick={() => router.push(`/mission/mission-${step.nextMissionBridge?.targetMissionId}/step/0`)}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium font-bangla"
                  >
                    <span>পরবর্তী মিশন দেখো</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-full bg-success/10 text-success"><Target className="w-6 h-6" /></div>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Understanding</p>
          <p className="text-3xl font-bold text-foreground">{score}%</p>
          <p className="text-xs text-success font-medium">{score >= 90 ? 'Deep Understanding' : score >= 70 ? 'Solid Grasp' : 'Keep Practicing'}</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Star className="w-24 h-24" /></div>
          <div className="p-3 rounded-full bg-xp/10 text-xp"><Star className="w-6 h-6 fill-current" /></div>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">XP Earned</p>
          <p className="text-3xl font-bold text-foreground">+{xpEarned}</p>
          <p className="text-xs text-xp font-medium">Mission Complete!</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-full bg-level/10 text-level"><Trophy className="w-6 h-6" /></div>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Current Level</p>
          <p className="text-3xl font-bold text-foreground">Level {isClient ? projectedXPState.level : 1}</p>
          <p className="text-xs text-level font-medium">{isClient ? projectedXPState.levelName : 'Learner'}</p>
          <div className="w-full space-y-1 mt-2">
            <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
              <div className="h-full bg-level rounded-full" style={{ width: `${isClient ? projectedXPState.percentToNextLevel : 0}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">{isClient ? projectedXPState.percentToNextLevel : 0}% to next</p>
          </div>
        </div>
      </div>

      {/* Next Mission Unlock Notification — dynamic based on mission ID and completion state */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
        isComplete 
          ? 'bg-primary/5 border-primary/20 shadow-sm' 
          : 'bg-muted/20 border-border/80 opacity-80'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            isComplete ? 'bg-primary/20 text-primary' : 'bg-muted/40 text-muted-foreground'
          }`}>
            {isComplete ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              {isComplete ? `${nextMissionLabel} Unlocked!` : `${nextMissionLabel} (লকড)`}
            </h4>
            <p className="text-sm text-muted-foreground font-bangla">
              {isComplete 
                ? (missionData.curiosity?.nextMissionPreview || 'The next mission is now available.')
                : 'বর্তমান মিশনের বাকি ধাপগুলো সফলভাবে সম্পন্ন করলে পরবর্তী মিশনটি স্বয়ংক্রিয়ভাবে আনলক হবে।'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Mentor Handoff */}
      <div className="p-6 rounded-2xl border border-border bg-card/50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Bot className="w-5 h-5" /></div>
          <div>
            <h3 className="font-semibold text-foreground">Ask AI Mentor</h3>
            <p className="text-sm text-muted-foreground">Paste this prompt into ChatGPT or Claude to deepen your understanding of this mission.</p>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 rounded-xl bg-surface border border-border text-sm text-foreground-muted whitespace-pre-wrap font-mono">
            {promptText}
          </pre>
          <button
            onClick={copyPrompt}
            className="absolute top-3 right-3 p-2 rounded-lg bg-card border border-border hover:bg-surface text-foreground shadow-sm transition-colors flex items-center gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
