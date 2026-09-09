'use client';
import type { AnalogyStep } from '@/types/mission.types';
import {
  ArrowRightLeft, Factory, TerminalSquare, Cpu, Database, Wifi,
  Code2, BookOpen, Box, Lightbulb, Globe, Layers, Zap, FlaskConical,
  Cog, Network, ShieldCheck, BrainCircuit, Binary, Monitor, FileText,
  Image as ImageIcon, FileDigit
} from 'lucide-react';

// Full icon registry — expand as needed
const ICON_REGISTRY: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory, TerminalSquare, Cpu, Database, Wifi, Code2, BookOpen,
  Box, Lightbulb, Globe, Layers, Zap, FlaskConical, Cog, Network,
  ShieldCheck, BrainCircuit, Binary, Monitor, FileText, Image: ImageIcon,
  FileDigit,
};

function FormattedAnalogyText({ text, isPython }: { text: string; isPython?: boolean }) {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className="space-y-2.5 text-left font-bangla w-full">
      {lines.map((line, idx) => {
        const isBullet = line.startsWith('•') || line.startsWith('-');
        const cleanLine = isBullet ? line.replace(/^[•-]\s*/, '') : line;
        const parts = cleanLine.split(/(`[^`]+`)/g);

        return (
          <div key={idx} className={`flex items-start gap-2 ${isBullet ? 'pl-2 py-0.5' : ''}`}>
            {isBullet && (
              <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isPython ? 'bg-primary' : 'bg-muted-foreground'}`} />
            )}
            <p className={`text-sm leading-relaxed ${isPython ? 'text-foreground/90' : 'text-muted-foreground'}`}>
              {parts.map((part, partIdx) => {
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code
                      key={partIdx}
                      className="font-mono text-xs px-1.5 py-0.5 mx-0.5 rounded bg-surface border border-border text-primary font-semibold inline-block"
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return part;
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function AnalogyStepComponent({ step }: { step: AnalogyStep }) {
  const RealIcon = ICON_REGISTRY[step.realWorld.icon] ?? Factory;
  const PyIcon = ICON_REGISTRY[step.pythonConcept.icon] ?? TerminalSquare;

  return (
    <div className="w-full max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-bold font-bangla-ui text-center text-foreground">{step.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative items-stretch">
        <div className="p-8 rounded-xl bg-card border border-border flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-elevated flex items-center justify-center shrink-0">
            <RealIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold font-bangla text-foreground">{step.realWorld.label}</h3>
          <FormattedAnalogyText text={step.realWorld.description} isPython={false} />
        </div>

        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border items-center justify-center text-primary shadow-md">
          <ArrowRightLeft className="w-5 h-5" />
        </div>

        <div className="p-8 rounded-xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <PyIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-bangla text-foreground">{step.pythonConcept.label}</h3>
          <FormattedAnalogyText text={step.pythonConcept.description} isPython={true} />
        </div>
      </div>

      <div className="text-center p-6 bg-surface rounded-xl border border-border space-y-2">
        <p className="font-bangla font-semibold text-foreground text-lg">{step.connection}</p>
        {step.deeperInsight && (
          <p className="font-bangla text-muted-foreground mt-3 text-sm border-t border-border pt-3">{step.deeperInsight}</p>
        )}
      </div>
    </div>
  );
}
