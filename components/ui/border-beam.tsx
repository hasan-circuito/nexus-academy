'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  strokeWidth?: number;
  variant?: 'fire' | 'emerald' | 'cyan' | 'custom';
  sparks?: boolean;
  heatAura?: boolean;
  size?: number;
  borderRadius?: number;
}

/**
 * Living Fire / Plasma Border Beam
 * Features thermodynamic Planck-radiation fire colors, multi-stage bloom,
 * dual-head flame plume, trailing micro-ember sparks, and atmospheric heat haze.
 */
export function BorderBeam({
  className,
  duration = 6,
  colorFrom,
  colorTo,
  strokeWidth = 2,
  variant = 'fire',
  sparks = true,
  heatAura = true,
  size = 220,
  borderRadius = 16,
}: BorderBeamProps) {
  const isFire = variant === 'fire';

  // Fallback / Custom colors
  const primaryColorFrom = colorFrom || (isFire ? '#ffb703' : variant === 'cyan' ? '#06b6d4' : '#10b981');
  const primaryColorTo = colorTo || (isFire ? '#ff1a1a' : variant === 'cyan' ? '#3b82f6' : '#06b6d4');

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden',
        className
      )}
    >
      {/* 1. Atmospheric Heat Haze Aura (Fiery Warmth Breathing on Card Edges) */}
      {isFire && heatAura && (
        <div
          className="pointer-events-none absolute -inset-3 opacity-45 blur-2xl transition-opacity duration-700"
          style={{
            borderRadius: `${borderRadius + 8}px`,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255, 107, 0, 0.35) 0%, rgba(255, 26, 26, 0.15) 45%, transparent 75%)',
            animation: 'border-heat-pulse 4s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* 2. Living Fire Motion-Path Heads (GPU-Accelerated 60 FPS Orbit) */}
      {isFire && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Primary Incandescent Flame Head */}
          <div
            className="absolute"
            style={{
              width: `${size}px`,
              height: '38px',
              borderRadius: '19px',
              offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
              offsetRotate: 'auto',
              animation: `border-beam-orbit ${duration}s linear infinite`,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(133, 0, 0, 0.25) 20%, #850000 40%, #ff1a1a 65%, #ff6b00 82%, #ffb703 94%, #ffffff 100%)',
              filter:
                'drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px #ffb703) drop-shadow(0 0 22px #ff6b00) drop-shadow(0 0 35px #ff1a1a)',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Secondary Harmonic Flare (Lagging Flame Tongue) */}
          <div
            className="absolute opacity-85"
            style={{
              width: `${Math.round(size * 0.55)}px`,
              height: '30px',
              borderRadius: '15px',
              offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
              offsetRotate: 'auto',
              animation: `border-beam-orbit ${duration}s linear infinite`,
              animationDelay: `-${duration * 0.08}s`,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(180, 0, 0, 0.25) 25%, #ff3300 70%, #ffaa00 92%, #fff4c2 100%)',
              filter: 'drop-shadow(0 0 8px #ff5500) drop-shadow(0 0 16px #ff1a1a)',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Trailing Micro-Embers (Flying Spark Particles) */}
          {sparks && (
            <>
              {/* Spark 1: White-Hot Core Spark */}
              <div
                className="absolute h-2 w-2 rounded-full bg-white"
                style={{
                  offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
                  animation: `border-beam-orbit ${duration}s linear infinite`,
                  animationDelay: `-${duration * 0.15}s`,
                  boxShadow: '0 0 8px #ffffff, 0 0 14px #ffb703, 0 0 22px #ff6b00',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Spark 2: Solar Gold Spark */}
              <div
                className="absolute h-1.5 w-1.5 rounded-full bg-amber-300"
                style={{
                  offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
                  animation: `border-beam-orbit ${duration}s linear infinite`,
                  animationDelay: `-${duration * 0.22}s`,
                  boxShadow: '0 0 6px #ffb703, 0 0 12px #ff4500',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Spark 3: Crimson Cooling Spark */}
              <div
                className="absolute h-1 w-1 rounded-full bg-red-500"
                style={{
                  offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
                  animation: `border-beam-orbit ${duration}s linear infinite`,
                  animationDelay: `-${duration * 0.28}s`,
                  boxShadow: '0 0 4px #ff1a1a',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </>
          )}
        </div>
      )}

      {/* 3. Razor-Sharp SVG Border Track (Ensures Perfect 2px Perimeter Definition) */}
      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <filter id="border-beam-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isFire ? 2.5 : 1.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {isFire ? (
              <>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#ffb703" stopOpacity="1" />
                <stop offset="55%" stopColor="#ff6b00" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#ff1a1a" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#850000" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={primaryColorFrom} stopOpacity="1" />
                <stop offset="50%" stopColor={primaryColorTo} stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Outer Glow Stroke */}
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={Math.max(1, borderRadius - 1)}
          fill="none"
          stroke="url(#beam-gradient)"
          strokeWidth={isFire ? strokeWidth * 2.2 : strokeWidth}
          strokeDasharray={isFire ? '200 800' : '160 800'}
          filter="url(#border-beam-glow)"
          initial={{ strokeDashoffset: 1000 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
          opacity={isFire ? 0.8 : 1}
        />

        {/* Crisp Inner Laser Stroke */}
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={Math.max(1, borderRadius - 1)}
          fill="none"
          stroke={isFire ? '#ffffff' : 'url(#beam-gradient)'}
          strokeWidth={Math.max(1, strokeWidth * 0.75)}
          strokeDasharray={isFire ? '60 940' : '160 800'}
          initial={{ strokeDashoffset: 1000 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
          opacity={isFire ? 0.95 : 1}
        />
      </svg>

      {/* Embedded 60 FPS Compositor Keyframes */}
      <style jsx global>{`
        @keyframes border-beam-orbit {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }
        @keyframes border-heat-pulse {
          0% {
            transform: scale(0.98);
            opacity: 0.35;
          }
          100% {
            transform: scale(1.03);
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
}

