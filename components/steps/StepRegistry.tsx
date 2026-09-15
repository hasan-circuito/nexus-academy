import type { MissionStep, MissionData } from '@/types/mission.types';
import { IntroStepComponent } from './IntroStep';
import { StoryStepComponent } from './StoryStep';
import { AnalogyStepComponent } from './AnalogyStep';
import { ConceptStepComponent } from './ConceptStep';
import { VisualizationStepComponent } from './VisualizationStep';
import { CodeExampleStepComponent } from './CodeExampleStep';
import { EEEExampleStepComponent } from './EEEExampleStep';
import { AIExampleStepComponent } from './AIExampleStep';
import { PracticeStepComponent } from './PracticeStep';
import { QuizStepComponent } from './QuizStep';
import { DebugChallengeStepComponent } from './DebugChallengeStep';
import { ReflectionStepComponent } from './ReflectionStep';
import { ArchitectGiftStepComponent } from './ArchitectGiftStep';
import { MissionCompleteStepComponent } from './MissionCompleteStep';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, React.FC<{ step: any; missionData: any }>> = {
  intro: IntroStepComponent,
  story: StoryStepComponent,
  analogy: AnalogyStepComponent,
  concept: ConceptStepComponent,
  visualization: VisualizationStepComponent,
  code_example: CodeExampleStepComponent,
  eee_example: EEEExampleStepComponent,
  ai_example: AIExampleStepComponent,
  practice: PracticeStepComponent,
  quiz: QuizStepComponent,
  debug_challenge: DebugChallengeStepComponent,
  reflection: ReflectionStepComponent,
  architect_gift: ArchitectGiftStepComponent,
  mission_complete: MissionCompleteStepComponent,
};

interface Props {
  step: MissionStep;
  missionData: MissionData;
}

export function StepRegistry({ step, missionData }: Props) {
  const Component = registry[step.type];
  if (!Component) {
    return <div className="text-destructive font-mono p-4 border border-destructive bg-destructive/10 rounded-lg">Error: Unknown step type &apos;{step.type}&apos;</div>;
  }
  return (
    <div className="pb-32">
      <Component step={step} missionData={missionData} />
    </div>
  );
}
