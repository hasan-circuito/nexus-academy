'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI Signature Lamp Effect
 * An ambient overhead light cone illuminating high-impact hero typography.
 */
export function LampContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden bg-background w-full rounded-2xl z-0 pt-16 pb-12',
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left Light Cone */}
        <motion.div
          initial={{ opacity: 0.5, width: '12rem' }}
          whileInView={{ opacity: 1, width: '26rem' }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-48 overflow-visible w-[26rem] bg-gradient-conic from-emerald-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right Light Cone */}
        <motion.div
          initial={{ opacity: 0.5, width: '12rem' }}
          whileInView={{ opacity: 1, width: '26rem' }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-48 w-[26rem] bg-gradient-conic from-transparent via-transparent to-emerald-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Backdrop radial blur glow */}
        <div className="absolute top-1/2 h-40 w-full translate-y-12 scale-x-150 bg-background blur-2xl" />
        <div className="absolute top-1/2 z-50 h-40 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-32 w-[24rem] -translate-y-1/2 rounded-full bg-emerald-500 opacity-40 blur-3xl" />
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '18rem' }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-auto z-30 h-28 w-64 -translate-y-[5rem] rounded-full bg-cyan-400 opacity-40 blur-2xl"
        />
        <motion.div
          initial={{ width: '12rem' }}
          whileInView={{ width: '26rem' }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-auto z-50 h-0.5 w-[26rem] -translate-y-[6rem] bg-emerald-400"
        />

        <div className="absolute inset-auto z-40 h-40 w-full -translate-y-[11.5rem] bg-background" />
      </div>

      <div className="relative z-50 flex -translate-y-20 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
