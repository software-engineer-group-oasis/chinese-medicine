// src/types/evaluation.ts
export interface EvaluationRecord {
  id: string;
  herbName: string;
  evaluationDate: string;
  evaluator: string;
  standardName: string;
  standardVersion: string;
  appearanceScore: number;
  contentScore: number;
  sourceChannel: string;
  storageCondition: string;
  overallResult: string;
  hasEvidence: boolean;
}