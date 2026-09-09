'use client';
import type { VisualizationStep } from '@/types/mission.types';
import { MonitorPlay, FileCode, Cpu, Binary, PlayCircle, GitBranch, Database, Layers, ArrowRight } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-8 h-8 mb-2" />,
  Cpu: <Cpu className="w-8 h-8 mb-2" />,
  Binary: <Binary className="w-8 h-8 mb-2" />,
  PlayCircle: <PlayCircle className="w-8 h-8 mb-2" />,
  GitBranch: <GitBranch className="w-8 h-8 mb-2" />,
  Database: <Database className="w-8 h-8 mb-2" />,
  Layers: <Layers className="w-8 h-8 mb-2" />,
};

const NODE_COLOR_CLASSES = [
  'text-primary',
  'text-warning',
  'text-destructive',
  'text-success',
  'text-indigo-400',
  'text-pink-400',
];

function getNodeIcon(node: string, index: number): React.ReactNode {
  // Try to match known keywords
  if (node.includes('Source') || node.includes('Code') || node.includes('File')) return <FileCode className={`w-8 h-8 mb-2 ${NODE_COLOR_CLASSES[index % NODE_COLOR_CLASSES.length]}`} />;
  if (node.includes('Interpreter') || node.includes('CPU') || node.includes('Process')) return <Cpu className={`w-8 h-8 mb-2 ${NODE_COLOR_CLASSES[index % NODE_COLOR_CLASSES.length]}`} />;
  if (node.includes('Machine') || node.includes('Binary') || node.includes('Byte')) return <Binary className={`w-8 h-8 mb-2 ${NODE_COLOR_CLASSES[index % NODE_COLOR_CLASSES.length]}`} />;
  if (node.includes('Output') || node.includes('Run') || node.includes('Result')) return <PlayCircle className={`w-8 h-8 mb-2 ${NODE_COLOR_CLASSES[index % NODE_COLOR_CLASSES.length]}`} />;
  if (node.includes('Data') || node.includes('Variable')) return <Database className={`w-8 h-8 mb-2 ${NODE_COLOR_CLASSES[index % NODE_COLOR_CLASSES.length]}`} />;
  // Generic fallback by index
  const icons = [FileCode, Cpu, Binary, PlayCircle, Database, Layers];
  const Icon = icons[index % icons.length];
  return <Icon className={`w-8 h-8 mb-2 ${NODE_COLOR_CLASSES[index % NODE_COLOR_CLASSES.length]}`} />;
}

// Render a flow diagram (array of step labels)
function FlowDiagram({ nodes, caption }: { nodes: string[]; caption: string }) {
  return (
    <div className="space-y-8 text-center w-full">
      <div className="relative p-8 md:p-12 rounded-2xl bg-card border border-border shadow-lg flex flex-col md:flex-row items-center justify-center gap-2 overflow-hidden flex-wrap">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        {nodes.map((node, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center relative z-10">
            <div className="flex flex-col items-center p-6 rounded-xl bg-surface border border-border shadow-sm min-w-[130px] transition-transform hover:scale-105 duration-300">
              {getNodeIcon(node, i)}
              <span className="font-mono text-sm font-semibold text-foreground text-center">{node}</span>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex items-center justify-center w-8 h-8 my-3 md:my-0 md:mx-3 text-muted-foreground animate-pulse">
                <ArrowRight className="w-5 h-5 md:block hidden" />
                <ArrowRight className="w-5 h-5 md:hidden rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-surface-elevated border border-border text-sm font-medium text-foreground">
        <MonitorPlay className="w-5 h-5 text-primary" />
        <span className="font-bangla">{caption}</span>
      </div>
    </div>
  );
}

// Render key-value pairs
function KeyValueDiagram({ data, caption }: { data: Record<string, string>; caption: string }) {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value], i) => (
          <div key={i} className={`p-5 rounded-xl bg-surface border border-border flex flex-col gap-2 transition-transform hover:scale-[1.02] duration-200`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${NODE_COLOR_CLASSES[i % NODE_COLOR_CLASSES.length]}`}>{key}</span>
            <span className="font-bangla text-foreground">{value}</span>
          </div>
        ))}
      </div>
      <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-surface-elevated border border-border text-sm font-medium text-foreground">
        <MonitorPlay className="w-5 h-5 text-primary" />
        <span className="font-bangla">{caption}</span>
      </div>
    </div>
  );
}

// Render an icon-grid list
function IconGridDiagram({ items, caption }: { items: Array<{ icon?: string; label: string; description?: string }>; caption: string }) {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border flex flex-col gap-2 text-center transition-transform hover:scale-[1.02] duration-200">
            {ICON_MAP[item.icon || ''] ?? <PlayCircle className={`w-8 h-8 mb-1 mx-auto ${NODE_COLOR_CLASSES[i % NODE_COLOR_CLASSES.length]}`} />}
            <span className="font-semibold text-foreground">{item.label}</span>
            {item.description && <span className="text-sm text-muted-foreground font-bangla">{item.description}</span>}
          </div>
        ))}
      </div>
      <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-surface-elevated border border-border text-sm font-medium text-foreground">
        <MonitorPlay className="w-5 h-5 text-primary" />
        <span className="font-bangla">{caption}</span>
      </div>
    </div>
  );
}

export function VisualizationStepComponent({ step }: { step: VisualizationStep }) {
  const data = (step.data || {}) as Record<string, unknown>;

  const renderVisualization = () => {
    const type = step.visualizationType as string;

    // Flow diagram: data.steps = string[]
    if (type === 'flow_diagram' || (data && Array.isArray(data.steps))) {
      const nodes = (data.steps as string[]) || [];
      return <FlowDiagram nodes={nodes} caption={step.caption} />;
    }

    // Key-value grid: data.pairs or data.items = {key: value}
    if (type === 'comparison' || (data.pairs && typeof data.pairs === 'object')) {
      return <KeyValueDiagram data={data.pairs as Record<string, string>} caption={step.caption} />;
    }

    // Icon grid: data.items = [{icon, label, description}]
    if (Array.isArray(data.items)) {
      return <IconGridDiagram items={data.items as Array<{ icon?: string; label: string; description?: string }>} caption={step.caption} />;
    }

    // Generic fallback: render all data keys as cards
    return <KeyValueDiagram data={Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))} caption={step.caption} />;
  };

  return (
    <div className="w-full max-w-4xl space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
        <p className="text-lg font-bangla text-muted-foreground">{step.description}</p>
      </div>
      {renderVisualization()}
    </div>
  );
}
