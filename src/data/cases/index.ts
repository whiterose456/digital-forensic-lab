import { case0147 } from './case0147';
import type { CaseDefinition } from '../../types/case';

export const allCases: CaseDefinition[] = [
  case0147,
];

export const getCaseById = (id: string): CaseDefinition | undefined => {
  return allCases.find((c) => c.id === id);
};

export { case0147 };
