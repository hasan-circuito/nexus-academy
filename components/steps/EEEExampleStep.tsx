import type { EEEExampleStep } from '@/types/mission.types';
import { Cpu } from 'lucide-react';
export function EEEExampleStepComponent({ step }: { step: EEEExampleStep }) {
  return (
    <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-warning/10 rounded-xl border border-warning/20">
          <Cpu className="w-6 h-6 text-warning" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
          {(step.hardware || step.domain) && (
            <span className="text-xs font-semibold text-warning uppercase tracking-wider">
              {step.hardware || 'Hardware'} • {step.domain ? step.domain.replace('_', ' ') : 'Domain'}
            </span>
          )}
        </div>
      </div>

      <p className="font-bangla text-muted-foreground">{step.context || (step as any).scenario}</p>
      
      <div className="rounded-xl overflow-hidden border border-border font-mono text-sm shadow-md">
        <div className="bg-[#0d1117] p-6 text-blue-300"><pre><code>{step.code}</code></pre></div>
        <div className="bg-[#05070a] p-4 text-green-400 border-t border-border/50">{step.output}</div>
      </div>

      <p className="font-bangla text-foreground font-medium p-4 bg-surface rounded-lg border border-border">{step.explanation}</p>
      {step.realDeviceNote && <p className="text-sm font-bangla text-muted-foreground italic border-l-2 border-warning pl-4">{step.realDeviceNote}</p>}
    </div>
  );
}
