'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  Cpu,
  Shield,
  Activity,
  CheckCircle2,
  Terminal,
  Code2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { LampContainer } from '@/components/ui/lamp';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';

export function DesignEngineeringLab() {
  // Refs for Animated Beam demo
  const containerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground space-y-16 pb-32">
      {/* ============================================================
       * 1. TOP EXPERIMENTAL NOTICE & NAVIGATION BAR
       * ============================================================ */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-foreground tracking-wider">
              EXPERIMENTAL_LAB // $6,000 DESIGN ENGINEERING
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/feedback-v2"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-foreground transition-colors font-bangla-ui flex items-center gap-1.5"
            >
              <span>Discussion 2 দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors font-bangla-ui"
            >
              ড্যাশবোর্ড
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
       * 2. ACETERNITY UI SIGNATURE HERO: LAMP EFFECT
       * ============================================================ */}
      <LampContainer className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="text-center space-y-5 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SILICON-VALLEY DESIGN ENGINEERING // DEMO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-bangla-ui tracking-tight bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            গভীরভাবে বোঝো, মুখস্থ নয়
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground font-bangla leading-relaxed max-w-2xl mx-auto">
            যে ডিজাইন সিস্টেম দিয়ে শীর্ষ সিলিকন ভ্যালি স্টার্টআপরা লাখ টাকার সফটওয়্যার সেল করে—সেই{' '}
            <strong className="text-foreground">Aceternity UI</strong>,{' '}
            <strong className="text-foreground">Magic UI</strong> এবং{' '}
            <strong className="text-foreground">shadcn/ui</strong>-এর জীবন্ত ইন্টারেক্টিভ ডেমো ল্যাব।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <ShimmerButton onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="font-bangla-ui">কম্পোনেন্টগুলো পরীক্ষা করুন</span>
            </ShimmerButton>

            <Link
              href="/feedback-v2"
              className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-white/10 text-xs font-bangla-ui font-semibold text-foreground transition-all flex items-center gap-2"
            >
              <span>Discussion 2 (v2)-এ দেখুন</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </motion.div>
      </LampContainer>

      {/* ============================================================
       * 3. MAGIC UI ANIMATED BEAM: PIPELINE ENERGY PULSE
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            MAGIC UI // ANIMATED BEAM
          </span>
          <h2 className="text-2xl font-bold text-foreground font-bangla-ui">
            জীবন্ত আর্কিটেকচার এনার্জি পালস (Animated Beam)
          </h2>
          <p className="text-xs text-muted-foreground font-bangla">
            SVG Bézier কার্ভের ওপর দিয়ে স্বয়ংক্রিয়ভাবে লেজার আলো ছুটে চলে—ইঞ্জিনিয়ারিং আর্কিটেকচার দেখানোর জন্য বিশ্বের সেরা ইফেক্ট।
          </p>
        </div>

        {/* Animated Beam Node Container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl border border-white/[0.08] bg-surface p-10 flex flex-col sm:flex-row items-center justify-between gap-8 overflow-hidden min-h-[220px]"
        >
          {/* Node 1: Browser WASM */}
          <div
            ref={node1Ref}
            className="relative z-10 p-4 rounded-2xl bg-surface-elevated border border-white/[0.1] text-center space-y-2 shadow-lg w-48 shrink-0"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs font-bold text-foreground">CPython 3.12</div>
            <div className="text-[11px] font-bangla text-muted-foreground">WebAssembly Worker</div>
          </div>

          {/* Node 2: EventBus Central Hub */}
          <div
            ref={node2Ref}
            className="relative z-10 p-5 rounded-2xl bg-primary/10 border-2 border-primary/40 text-center space-y-2 shadow-xl w-52 shrink-0"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div className="font-mono text-xs font-bold text-primary">EVENTBUS_HUB</div>
            <div className="text-[11px] font-bangla text-foreground-muted">২৩টি ডোমেইন ইভেন্ট ব্রিজ</div>
          </div>

          {/* Node 3: Rule 24 AST Checker */}
          <div
            ref={node3Ref}
            className="relative z-10 p-4 rounded-2xl bg-surface-elevated border border-white/[0.1] text-center space-y-2 shadow-lg w-48 shrink-0"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs font-bold text-foreground">RULE 24 AST</div>
            <div className="text-[11px] font-bangla text-muted-foreground">Closed-World Confinement</div>
          </div>

          {/* Connected Beams */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={node1Ref}
            toRef={node2Ref}
            duration={4}
            gradientStartColor="#10b981"
            gradientStopColor="#06b6d4"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={node2Ref}
            toRef={node3Ref}
            duration={4.5}
            gradientStartColor="#06b6d4"
            gradientStopColor="#10b981"
          />
        </div>
      </section>

      {/* ============================================================
       * 4. BENTO GRID ARCHITECTURE (Apple / Linear Signature)
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            BENTO GRID // MODULAR ARCHITECTURE
          </span>
          <h2 className="text-2xl font-bold text-foreground font-bangla-ui">
            অ্যাপল ও লিনিয়ার স্টাইল বেন্টো গ্রিড (Bento Grid)
          </h2>
          <p className="text-xs text-muted-foreground font-bangla">
            একঘেয়ে ৩টা কার্ডের বদলে প্রতিটি বক্সে ভিন্ন সাইজ ও লাইভ ইন্টারেকশন।
          </p>
        </div>

        <BentoGrid>
          {/* Bento Card 1: Border Beam Highlight */}
          <BentoCard
            title="Border Beam লেজার পেরিমিটার"
            subtitle="কার্ডের চারপাশ দিয়ে লেজার রশ্মি ছুটে বেড়ায়। কোনো ভারী শ্যাডো ছাড়াই এটি ভিজিটরের নজর কাড়ে।"
            badge="MAGIC UI // LASER"
            icon={<Zap className="w-4 h-4" />}
            hasBeam={true}
          >
            <div className="p-3 rounded-xl bg-background/60 border border-white/5 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
              <span>laser_pulse.orbit()</span>
              <span className="text-muted-foreground">60 FPS</span>
            </div>
          </BentoCard>

          {/* Bento Card 2: Shimmer Physics Button */}
          <BentoCard
            title="স্পেকুলার শিমার রিফ্লেকশন বাটন"
            subtitle="ক্লিকের সাথে সাথে আলো প্রতিফলিত হয়। হাই-কনভার্সন অ্যাকশন বাটনের জন্য আন্তর্জাতিক স্ট্যান্ডার্ড।"
            badge="SPECULAR SHIMMER"
            icon={<Sparkles className="w-4 h-4" />}
          >
            <div className="pt-2">
              <ShimmerButton className="w-full">
                <span>Shimmer Button Demo</span>
              </ShimmerButton>
            </div>
          </BentoCard>

          {/* Bento Card 3: Deep Obsidian Depth */}
          <BentoCard
            title="অবসিডিয়ান লেয়ার্ড কনট্রাস্ট"
            subtitle="কুচকুচে কালো নয়—#09090b থেকে #18181c পর্যন্ত ৩টি স্তরে ডেপথ তৈরি করা হয়।"
            badge="OBSIDIAN // 3-LAYER"
            icon={<Layers className="w-4 h-4" />}
          >
            <div className="space-y-1.5 pt-1">
              <div className="h-6 rounded-lg bg-surface border border-white/10 flex items-center px-3 text-[10px] font-mono text-muted-foreground">
                Base Surface: #09090b
              </div>
              <div className="h-6 rounded-lg bg-surface-elevated border border-white/15 flex items-center px-3 text-[10px] font-mono text-emerald-400">
                Elevated Card: #121215
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* ============================================================
       * 5. SIDE-BY-SIDE COMPARISON: $200 SITE VS $6,000 SITE
       * ============================================================ */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
            VALUATION & PERCEPTION // COMPARISON
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground font-bangla-ui">
            $২০০ সাধারণ সাইট বনাম $৬,০০০ ডিজাইন ইঞ্জিনিয়ারিং সাইট
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amateur Card */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700/60 space-y-4 opacity-80">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>AMATEUR SITE ($200)</span>
              <span>STANDALONE</span>
            </div>
            <h3 className="text-base font-bold text-white font-bangla-ui">
              সাধারণ ও সস্তা ডিজাইনের লক্ষণ:
            </h3>
            <ul className="space-y-2 text-xs font-bangla text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>ফ্ল্যাট কুচকুচে কালো কালার—কোনো ভিজ্যুয়াল ডেপথ বা আলোর ছোঁয়া নেই।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>মোটা ২px সস্তা বর্ডার এবং অতিরিক্ত ড্রপ শ্যাডো।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>কাঠখোট্টা অ্যানিমেশন (`transition: ease`)—কোনো ফিজিক্স নেই।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>৩টি একঘেয়ে সমান সাইজের বক্স—কোনো বেন্টো গ্রিড বা লাইভ ডেমো নেই।</span>
              </li>
            </ul>
          </div>

          {/* $6000 High-Ticket Card */}
          <div className="relative p-6 rounded-2xl bg-surface border border-emerald-500/40 space-y-4 shadow-xl overflow-hidden">
            <BorderBeam duration={6} colorFrom="#10b981" colorTo="#06b6d4" />
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
              <span>DESIGN ENGINEERING ($6,000)</span>
              <span>SILICON-VALLEY TIER</span>
            </div>
            <h3 className="text-base font-bold text-foreground font-bangla-ui">
              টপ-ক্লাস হাই-টিকেট ডিজাইনের রহস্য:
            </h3>
            <ul className="space-y-2 text-xs font-bangla text-foreground-muted leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Obsidian Layering:</strong> গভীর অবসিডিয়ান ও মাইক্রো-স্পটলাইট গ্লো।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Border Beam:</strong> 1px সাব-পিক্সেল বর্ডার বেষ্টিত চলমান লেজার আলো।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Spring Physics:</strong> Framer Motion-এর প্রাকৃতিক স্প্রিং মুভমেন্ট।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bento Grid:</strong> অ্যাপলের মতো অ্যাসিমেট্রিক ইন্টারেক্টিভ টাইলস।</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
       * 6. BOTTOM CALL-TO-ACTION & DECISION
       * ============================================================ */}
      <div className="max-w-xl mx-auto text-center px-4 space-y-4 pt-6">
        <h3 className="text-lg font-bold text-foreground font-bangla-ui">
          পছন্দ হলে রাখবে, না হলে ১০ সেকেন্ডে রিমুভ করে দেব!
        </h3>
        <p className="text-xs text-muted-foreground font-bangla">
          তুমি এই পেজটি ব্রাউজারে দেখো। তোমার যদি ভালো লাগে, আমরা এই একই কম্পোনেন্টগুলো নেক্সাস একাডেমির হোমপেজে বা ড্যাশবোর্ডে রেখে দেব। আর যদি মনে হয় দরকার নেই, সাথে সাথে মুছে দেব।
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/feedback-v2"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold font-bangla-ui shadow-sm transition-all flex items-center gap-2"
          >
            <span>Discussion 2 দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
