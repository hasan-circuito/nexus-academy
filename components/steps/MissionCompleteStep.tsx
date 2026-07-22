'use client';
import type { MissionCompleteStep, MissionData } from '@/types/mission.types';
import { Target, Trophy, Star, Copy, Bot, CheckCircle2, Unlock } from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { XPEngine } from '@/engines/xp/XPEngine';
import { storage } from '@/services/LocalStorageDataService';

export function MissionCompleteStepComponent({ step, missionData }: { step: MissionCompleteStep; missionData: MissionData }) {
  const { progress, isClient } = useProgress();
  const [copied, setCopied] = useState(false);

  const isComplete = isClient && progress.missions[missionData.id]?.status === 'complete';
  const xpEarned = isComplete ? (progress.missions[missionData.id].xpEarned || missionData.curiosity ? 400 : 0) : 400;
  const score = isComplete ? progress.missions[missionData.id].understandingScore : 85;

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

      {/* Next Mission Unlock Notification — dynamic based on mission ID */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{nextMissionLabel} Unlocked!</h4>
            <p className="text-sm text-muted-foreground font-bangla">{missionData.curiosity?.nextMissionPreview || 'The next mission is now available.'}</p>
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
