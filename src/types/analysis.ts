/**
 * AI Analysis & Anomaly Detection Types
 */

export interface AnomalyScore {
  score: number; // 0.0 to 1.0, where 1.0 is most anomalous
  severity: 'critical' | 'high' | 'medium' | 'low' | 'normal';
  reasons: string[];
  relatedEvidenceIds: string[];
}

export type EntityType = 'user' | 'ip_address' | 'file' | 'process' | 'account' | 'event';

export interface Entity {
  id: string;
  type: EntityType;
  label: string;
  description?: string;
  relatedEvidenceIds: string[];
}

export type RelationshipType =
  | 'logged_into'
  | 'accessed'
  | 'created'
  | 'modified'
  | 'downloaded'
  | 'connected_from'
  | 'transferred_to'
  | 'executed'
  | 'followed_by'
  | 'related_to';

export interface Relationship {
  id: string;
  sourceId: string; // entity ID
  targetId: string; // entity ID
  type: RelationshipType;
  label?: string;
  supportingEvidenceIds: string[];
}

export interface MentorMessage {
  id: string;
  type: 'question' | 'hint' | 'feedback' | 'praise' | 'challenge';
  content: string;
  suggestedAction?: string;
  relatedEvidenceIds?: string[];
  timestamp: number;
}

export interface InvestigationEvaluation {
  evidenceCoverage: {
    found: number;
    total: number;
    percentComplete: number;
    missingIds: string[];
  };
  timelineAccuracy: {
    correct: number;
    total: number;
    percentAccurate: number;
    outOfOrderIds: string[];
  };
  reasoning: {
    isSupported: boolean;
    correctElements: string[];
    unsupportedClaims: string[];
    falseAssumptions: string[];
  };
  verdict: 'success' | 'partial' | 'failed';
  summary: string;
  learning: string[];
}
