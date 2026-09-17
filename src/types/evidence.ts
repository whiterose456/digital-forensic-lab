export type EvidenceCategory = 
  | 'AUTH_LOG'
  | 'FILE_LOG'
  | 'NETWORK_LOG'
  | 'SYSTEM_LOG'
  | 'USER_ACCOUNT';

export type ClueType = 
  | 'initial_access'
  | 'credential_access'
  | 'collection'
  | 'exfiltration'
  | 'benign_noise';

export interface EvidenceItem {
  id: string;
  timestamp: string; // e.g. "09:31:42"
  category: EvidenceCategory;
  eventType: string; // e.g. "LOGIN_FAILED", "FILE_ACCESS"
  title: string;
  description: string;
  source?: string;
  destination?: string;
  user?: string;
  process?: string;
  file?: string;
  rawPayload: string; // Realistic log output for deep inspection
  tags: string[];
  
  // Ground truth evaluation metadata (internal use for scoring, never exposed directly in UI)
  isCritical?: boolean;
  clueType?: ClueType;
}

export interface TimelineEventItem {
  evidenceId: string;
  order: number;
  userNote?: string;
  addedAt: number;
}
