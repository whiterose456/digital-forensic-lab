import type { EvidenceItem } from './evidence';

export type CaseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ServerInfo {
  hostname: string;
  ip: string;
  os: string;
  role: string;
}

export interface CaseGroundTruth {
  incidentType: string;
  responsibleAccount: string;
  attackerIp: string;
  targetAsset: string;
  exfiltratedArtifact: string;
  criticalEvidenceIds: string[];
  correctChronologicalSequence: string[];
  explanation: string;
}

export interface CaseDefinition {
  id: string;
  caseNumber: string;
  title: string;
  difficulty: CaseDifficulty;
  timestampRange: string;
  shortDescription: string;
  briefing: string;
  serverInfo: ServerInfo;
  evidence: EvidenceItem[];
  groundTruth: CaseGroundTruth;
}

export interface InvestigationState {
  caseId: string;
  pinnedTimelineIds: string[];
  notes: Record<string, string>; // evidenceId -> analyst note
  investigationNotes: string; // general freeform notes
  hypothesisText: string;
  selectedActor: string;
  selectedAttackType: string;
  isSubmitted: boolean;
}
