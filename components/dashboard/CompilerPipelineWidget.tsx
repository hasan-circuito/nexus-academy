'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, CheckCircle2, Terminal, Sparkles, Activity } from 'lucide-react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { cn } from '@/lib/utils';

export function CompilerPipelineWidget({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const astRef = useRef<HTMLDivElement>(null);
  const wasmRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-5 overflow-hidden backdrop-blur-xl shadow-lg',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>WASM Compiler Pipeline</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                0ms LATENCY
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Real-time in-browser CPython 3.12 WebAssembly stream
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          Rule 24 AST: PASS
        </span>
      </div>

      {/* Nodes Row with Animated Beams */}
      <div className="relative flex items-center justify-between gap-2 sm:gap-4 py-4 px-2">
        {/* Node 1: Code Editor */}
        <div
          ref={editorRef}
          className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-md group hover:border-cyan-500/50 transition-colors"
        >
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono font-medium text-zinc-300">Editor</span>
        </div>

        {/* Node 2: AST Validator */}
        <div
          ref={astRef}
          className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-md group hover:border-amber-500/50 transition-colors"
        >
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono font-medium text-zinc-300">AST</span>
        </div>

        {/* Node 3: Pyodide WASM Runtime */}
        <div
          ref={wasmRef}
          className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-md group hover:border-purple-500/50 transition-colors"
        >
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono font-medium text-zinc-300">WASM</span>
        </div>

        {/* Node 4: Terminal Output */}
        <div
          ref={terminalRef}
          className="z-10 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-md group hover:border-emerald-500/50 transition-colors"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-mono font-medium text-zinc-300">Terminal</span>
        </div>

        {/* Animated Beams connecting nodes */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={editorRef}
          toRef={astRef}
          duration={3}
          gradientStartColor="#06b6d4"
          gradientStopColor="#f59e0b"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={astRef}
          toRef={wasmRef}
          duration={3}
          delay={0.8}
          gradientStartColor="#f59e0b"
          gradientStopColor="#a855f7"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={wasmRef}
          toRef={terminalRef}
          duration={3}
          delay={1.6}
          gradientStartColor="#a855f7"
          gradientStopColor="#10b981"
        />
      </div>

      {/* Terminal log snippet */}
      <div className="mt-2 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
        <span className="text-zinc-500">&gt; Pyodide CPython 3.12 initialized in isolated worker</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 60 FPS
        </span>
      </div>
    </div>
  );
}
