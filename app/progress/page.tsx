'use client';

import { Target, Star, Flame, Trophy, Activity, Brain, Code, TerminalSquare } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

export default function ProgressPage() {
  const { progress, xpState, isClient } = useProgress();

  if (!isClient) return null; // Prevent hydration mismatch

  // Calculate stats
  const completedMissions = Object.values(progress.missions).filter(m => m.status === 'complete');
  const numCompleted = completedMissions.length;
  
  // Mock total missions for V1 demo
  const TOTAL_MISSIONS_IN_DEMO = 5; 
  const overallProgressPercent = Math.min(100, Math.round((numCompleted / TOTAL_MISSIONS_IN_DEMO) * 100));

  // Analytics
  let averageUnderstanding = '--';
  if (numCompleted > 0) {
    const totalScore = completedMissions.reduce((acc, m) => acc + (m.understandingScore || 0), 0);
    averageUnderstanding = Math.round(totalScore / numCompleted).toString();
  }

  // Debug Success & Practice Completion (Mocked dynamically for completed missions)
  const debugSuccess = numCompleted > 0 ? '92' : '--';
  const practiceCompletion = numCompleted > 0 ? '100' : '--';

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Your Journey</h1>
        <p className="text-muted-foreground">Track your learning progress and mastery.</p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Progress", value: `${overallProgressPercent}%`, icon: Target, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total XP", value: progress.xp.toString(), icon: Star, color: "text-xp", bg: "bg-xp/10" },
          { label: "Current Level", value: xpState.levelName, icon: Trophy, color: "text-level", bg: "bg-level/10" },
          { label: "Day Streak", value: progress.streak.current.toString(), icon: Flame, color: "text-warning", bg: "bg-warning/10" }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <div className={`p-1.5 rounded-md ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-foreground mt-2">{stat.value}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Analytics Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4 text-success" /> Avg. Understanding
                </span>
                <span className="text-sm font-bold text-success">{averageUnderstanding}{averageUnderstanding !== '--' ? '%' : ''}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${averageUnderstanding === '--' ? 0 : averageUnderstanding}%` }} />
              </div>
            </div>
            
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TerminalSquare className="w-4 h-4 text-info" /> Debug Success
                </span>
                <span className="text-sm font-bold text-info">{debugSuccess}{debugSuccess !== '--' ? '%' : ''}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div className="h-full bg-info rounded-full transition-all duration-1000" style={{ width: `${debugSuccess === '--' ? 0 : debugSuccess}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" /> Practice Completion
                </span>
                <span className="text-sm font-bold text-primary">{practiceCompletion}{practiceCompletion !== '--' ? '%' : ''}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${practiceCompletion === '--' ? 0 : practiceCompletion}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Mission History
          </h2>
          
          <div className="p-5 rounded-xl border border-border bg-card min-h-[220px] flex flex-col gap-3">
            {numCompleted === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full flex-1">
                <Trophy className="w-12 h-12 text-muted-foreground opacity-20 mb-3" />
                <p className="text-sm text-muted-foreground">Complete a mission to unlock detailed performance insights.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(progress.missions)
                  .filter(([_, data]) => data.status === 'complete')
                  .sort((a, b) => (b[1].completedAt || '').localeCompare(a[1].completedAt || ''))
                  .map(([missionId, data]) => (
                    <div key={missionId} className="flex justify-between items-center p-3 rounded-lg border border-border bg-surface">
                      <div>
                        <p className="font-semibold text-sm text-foreground">Mission {missionId}</p>
                        <p className="text-xs text-muted-foreground">Score: {data.understandingScore}%</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-xp/10 text-xp text-xs font-bold rounded-md">+{data.xpEarned} XP</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
