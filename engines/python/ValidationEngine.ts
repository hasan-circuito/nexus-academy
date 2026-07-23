// engines/python/ValidationEngine.ts
import type { ValidationConfig, ValidationStrategy } from '@/types/mission.types';
import type { ExecutionResult, ComparisonResult, EvaluationResult, IValidationStrategy } from './python.types';

import { ExactOutputStrategy } from './strategies/ExactOutputStrategy';
import { ContainsOutputStrategy } from './strategies/ContainsOutputStrategy';
import { RegexOutputStrategy } from './strategies/RegexOutputStrategy';
import { AnyNonEmptyOutputStrategy } from './strategies/AnyNonEmptyOutputStrategy';

export class ValidationEngine {
  private static strategies: Record<ValidationStrategy, IValidationStrategy> = {
    'exact_output': new ExactOutputStrategy(),
    'contains_output': new ContainsOutputStrategy(),
    'regex_output': new RegexOutputStrategy(),
    'any_non_empty_output': new AnyNonEmptyOutputStrategy(),
  };

  public static evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig
  ): EvaluationResult {
    const strategy = this.strategies[config.type];
    
    if (!strategy) {
      throw new Error(`Unknown validation strategy: ${config.type}`);
    }

    return strategy.evaluate(executionResult, comparisonResult, config);
  }
}
