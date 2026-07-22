'use client';
import Link from 'next/link';
import { Play, Lock, BookOpen, Star, Target, Flame, Trophy, Activity, ArrowRight, BookMarked, Code2 } from 'lucide-react';
import mission001 from '@/data/missions/mission-001.json';
import { useProgress } from '@/hooks/useProgress';

// Metadata removed for client component

export default function DashboardPage() {
  const { progress, xpState, isClient } = useProgress();

  const missions = [
    { 
      ...mission001, 
      isLocked: isClient ? progress.missions[mission001.id]?.status === 'locked' : false,
      isCompleted: isClient ? progress.missions[mission001.id]?.status === 'complete' : false
    },
    ...Array.from({ length: 9 }).map((_, i) => {
      const mId = String(i + 2).padStart(3, '0');
      // If it exists in persisted state, read its status. 
      // If not, it defaults to true because by default later missions are locked.
      const persistedMission = progress.missions[mId];
      const isLocked = isClient 
        ? (persistedMission ? (persistedMission.status !== 'unlocked' && persistedMission.status !== 'complete' && persistedMission.status !== 'in_progress') : true)
        : true;
      return {
        id: mId,
        title: isLocked ? `Locked Mission ${i + 2}` : `Mission ${i + 2}`,
        description: isLocked ? "Complete the previous mission to unlock this content." : "Ready to learn!",
        isLocked,
        isCompleted: isClient ? progress.missions[mId]?.status === 'complete' : false,
        estimatedMinutes: 20
      };
    })
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Welcome Hero */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Learner</h1>
        <p className="text-foreground-muted">Ready to master the Python mindset today?</p>
      </section>

      {/* Continue Learning */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" /> Continue Learning
        </h2>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            
            {(() => {
              const activeMission = missions.find(m => !m.isLocked && !m.isCompleted) || missions[0];
              const displayId = `Mission ${activeMission.id}`;
              const url = `/mission/mission-${activeMission.id}/step/0`;
              return (
                <>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{displayId}</span>
                      {activeMission.isCompleted ? (
                        <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">Completed</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">In Progress</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground">{activeMission.title}</h3>
                    <p className="text-muted-foreground text-sm max-w-2xl">{('description' in activeMission ? activeMission.description : activeMission.banglaSubtitle)}</p>
                    
                    <div className="flex items-center gap-6 mt-4 pt-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Progress</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 rounded-full bg-surface-elevated overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: activeMission.isCompleted ? '100%' : '0%' }} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{activeMission.isCompleted ? '100%' : '0%'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Steps</span>
                        <span className="text-sm font-medium text-foreground">{activeMission.isCompleted ? ('steps' in activeMission ? activeMission.steps.length : 10) : 0} / {'steps' in activeMission ? activeMission.steps.length : 10}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Time</span>
                        <span className="text-sm font-medium text-foreground">~{('cognitiveLoadEstimate' in activeMission ? activeMission.cognitiveLoadEstimate.estimatedTotalMinutes : 20)} mins</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={url}
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover h-11 rounded-md px-8 shrink-0"
                  >
                    {activeMission.isCompleted ? 'Review Mission' : 'Start Learning'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </>
              );
            })()}

          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Understanding", value: `${isClient ? Math.round(Object.values(progress.missions).reduce((a,b)=>a+(b.understandingScore||0),0) / Math.max(1, Object.values(progress.missions).filter(m=>m.status==='complete').length)) : 0}%`, icon: Target, color: "text-success", bg: "bg-success/10" },
          { label: "Total XP", value: isClient ? progress.xp.toString() : "0", icon: Star, color: "text-xp", bg: "bg-xp/10" },
          { label: "Current Level", value: isClient ? (
            <div className="flex flex-col">
              <span>Level {xpState.level}</span>
              <span className="text-sm text-level font-medium">{xpState.levelName}</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span>Level 1</span>
              <span className="text-sm text-level font-medium">Learner</span>
            </div>
          ), icon: Trophy, color: "text-level", bg: "bg-level/10" },
          { label: "Current Streak", value: `${isClient ? progress.streak.current : 0} Days`, icon: Flame, color: "text-warning", bg: "bg-warning/10" }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <div className={`p-1.5 rounded-md ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{stat.value}</div>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mission List */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Path to Mastery
          </h2>
          <div className="space-y-3">
            {missions.map((mission) => (
              <div 
                key={mission.id} 
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  mission.isLocked 
                    ? "bg-surface/50 border-border/50 opacity-60" 
                    : "bg-card border-border hover:border-primary/50 cursor-pointer"
                }`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
                  mission.isLocked ? "bg-surface-elevated text-foreground-faint" : "bg-primary/10 text-primary"
                }`}>
                  {mission.isLocked ? <Lock className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{mission.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{('description' in mission ? mission.description : mission.banglaSubtitle)}</p>
                </div>
                {!mission.isLocked && (
                  <Link 
                    href={`/mission/mission-${mission.id}/step/0`}
                    className="text-sm font-medium text-primary hover:text-primary-hover px-4 py-2"
                  >
                    {mission.isCompleted ? 'Review' : 'Start'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Today's Goal */}
          <section className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Today&apos;s Goal
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Missions Completed</span>
                <span className="font-medium text-foreground">{isClient ? Object.values(progress.missions).filter(m=>m.status==='complete').length : 0} / 3</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${isClient ? Math.min(100, (Object.values(progress.missions).filter(m=>m.status==='complete').length / 3) * 100) : 0}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">Complete 3 missions to maintain your streak.</p>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {isClient && progress.activityHistory && progress.activityHistory.length > 0 ? (
                progress.activityHistory.slice(0, 5).map((activity, i) => (
                  <div key={activity.id || i} className="flex gap-3 text-sm animate-in fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="mt-0.5 flex-shrink-0">
                      {activity.type === 'mission_completed' && <Target className="w-4 h-4 text-success" />}
                      {activity.type === 'xp_earned' && <Star className="w-4 h-4 text-xp" />}
                      {activity.type === 'level_up' && <Trophy className="w-4 h-4 text-level" />}
                      {activity.type === 'mission_unlocked' && <BookOpen className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
                    <BookMarked className="w-6 h-6 text-foreground-faint" />
                  </div>
                  <p className="text-sm">No activity yet.</p>
                  <p className="text-xs mt-1">Start your first mission!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Development / QA Tools */}
      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => {
            localStorage.removeItem('nexus_progress');
            window.location.href = '/dashboard';
          }}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 px-3 py-1 rounded-full hover:bg-destructive/10 transition-colors"
        >
          Reset Progress (Dev Only)
        </button>
      </div>
    </div>
  );
}
