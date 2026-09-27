/**
 * Anomaly Detection & Statistical Analysis
 * 
 * Identifies unusual or suspicious activity in forensic evidence.
 * Uses rule-based and statistical approaches (not ML models).
 */

import type { EvidenceItem } from '../types/evidence';
import type { AnomalyScore } from '../types/analysis';

/**
 * Computes anomaly score for a single evidence item
 * within the context of the entire case evidence set.
 */
export function scoreEvidence(
  item: EvidenceItem,
  allEvidence: EvidenceItem[]
): AnomalyScore {
  const reasons: string[] = [];
  let score = 0;
  const relatedEvidenceIds: string[] = [];

  // Rule 1: Failed SSH attempts followed by success = credential access
  if (item.eventType === 'LOGIN_FAILED' || item.eventType === 'LOGIN_SUCCESS') {
    const isFromExternalIp = item.source && item.source.startsWith('185.');
    if (isFromExternalIp) {
      reasons.push('Connection from external/unknown IP address');
      score += 0.25;
      relatedEvidenceIds.push(item.id);
    }

    if (item.eventType === 'LOGIN_FAILED') {
      // Look for other failed attempts from same source around same time
      const failedCount = countConsecutiveFailedLogins(item, allEvidence);
      if (failedCount >= 2) {
        reasons.push(`${failedCount} failed SSH attempts detected (brute force indicator)`);
        score += 0.3;
      }
    }

    if (item.eventType === 'LOGIN_SUCCESS' && isFromExternalIp) {
      reasons.push('Successful authentication from external IP after failed attempts');
      score += 0.4;

      // Link to preceding failed attempts
      const relatedFailed = allEvidence.filter(
        (e) =>
          e.eventType === 'LOGIN_FAILED' &&
          e.source === item.source &&
          e.user === item.user &&
          parseInt(e.timestamp) < parseInt(item.timestamp)
      );
      relatedEvidenceIds.push(...relatedFailed.map((e) => e.id));
    }
  }

  // Rule 2: File access to sensitive locations (payroll, finance, personnel)
  if (item.eventType === 'FILE_ACCESS' || item.eventType === 'FILE_CREATED') {
    const file = item.file || '';
    const sensitivePatterns = ['payroll', 'finance', 'personnel', 'secret', 'credential', 'password'];
    if (sensitivePatterns.some((p) => file.toLowerCase().includes(p))) {
      reasons.push(`Access to sensitive file: ${file}`);
      score += 0.25;
      relatedEvidenceIds.push(item.id);
    }
  }

  // Rule 3: Archive creation (indicates data staging)
  if (item.eventType === 'FILE_CREATED' && (item.file?.endsWith('.zip') || item.file?.endsWith('.tar'))) {
    reasons.push(`Archive file created: ${item.file} (data staging indicator)`);
    score += 0.3;
    relatedEvidenceIds.push(item.id);

    // Link to preceding file access
    const relatedAccess = allEvidence.filter(
      (e) =>
        e.eventType === 'FILE_ACCESS' &&
        e.user === item.user &&
        parseInt(e.timestamp) < parseInt(item.timestamp)
    );
    relatedEvidenceIds.push(...relatedAccess.map((e) => e.id).slice(0, 3));
  }

  // Rule 4: Outbound network connection to non-standard IP (exfiltration)
  if (item.eventType === 'NETWORK_CONNECTION' || item.eventType === 'OUTBOUND_TRANSFER') {
    const destination = item.destination || '';
    // Flag connections to external/suspicious IPs
    if (
      destination.startsWith('185.') ||
      destination.startsWith('192.168.') === false ||
      destination.includes(':443') ||
      destination.includes(':8443')
    ) {
      reasons.push(`Outbound connection to external endpoint: ${destination}`);
      score += 0.35;
      relatedEvidenceIds.push(item.id);

      // Link to preceding file/archive activity
      const relatedFiles = allEvidence.filter(
        (e) =>
          (e.eventType === 'FILE_CREATED' || e.eventType === 'FILE_ACCESS') &&
          e.user === item.user &&
          parseInt(e.timestamp) < parseInt(item.timestamp)
      );
      relatedEvidenceIds.push(...relatedFiles.map((e) => e.id).slice(0, 2));
    }
  }

  // Rule 5: High volume outbound transfer (exfiltration)
  if (item.eventType === 'OUTBOUND_TRANSFER') {
    const payload = item.rawPayload || '';
    const bytesMatch = payload.match(/(\d+)\s*bytes/i);
    if (bytesMatch) {
      const bytes = parseInt(bytesMatch[1]);
      if (bytes > 1000000) {
        // > 1MB
        reasons.push(`Large data transfer: ${formatBytes(bytes)}`);
        score += 0.25;
      }
    }
  }

  // Rule 6: Suspicious process names (archive.exe, 7z.exe, etc.)
  if (item.process) {
    const suspiciousProcesses = [
      'archive.exe',
      'zip.exe',
      '7z.exe',
      'rar.exe',
      'curl.exe',
      'wget.exe',
      'nc.exe',
      'netcat',
      'mimikatz',
    ];
    if (suspiciousProcesses.some((p) => item.process?.toLowerCase().includes(p))) {
      reasons.push(`Suspicious process executed: ${item.process}`);
      score += 0.3;
      relatedEvidenceIds.push(item.id);
    }
  }

  // Rule 7: Privileged account activity outside normal hours
  if (item.user === 'admin' || item.user === 'root') {
    const timeStr = item.timestamp.split(':')[0];
    const hour = parseInt(timeStr);
    // Outside 6am-6pm business hours
    if (hour < 6 || hour > 18) {
      reasons.push(`Privileged account activity outside business hours (${item.timestamp})`);
      score += 0.15;
    }
  }

  // Clamp score to [0, 1]
  score = Math.min(score, 0.99);
  if (score < 0.01) {
    score = 0;
  }

  // Determine severity level
  let severity: AnomalyScore['severity'];
  if (score >= 0.8) severity = 'critical';
  else if (score >= 0.6) severity = 'high';
  else if (score >= 0.4) severity = 'medium';
  else if (score >= 0.2) severity = 'low';
  else severity = 'normal';

  // Deduplicate and limit related evidence
  const uniqueRelated = Array.from(new Set(relatedEvidenceIds)).filter((id) => id !== item.id);

  return {
    score,
    severity,
    reasons: reasons.length > 0 ? reasons : ['No significant anomalies detected'],
    relatedEvidenceIds: uniqueRelated.slice(0, 5), // Limit to 5 most relevant
  };
}

/**
 * Scores all evidence items in a case.
 */
export function scoreAllEvidence(evidence: EvidenceItem[]): Map<string, AnomalyScore> {
  const scores = new Map<string, AnomalyScore>();
  for (const item of evidence) {
    scores.set(item.id, scoreEvidence(item, evidence));
  }
  return scores;
}

/**
 * Helper: Count consecutive failed login attempts from same source/user.
 */
function countConsecutiveFailedLogins(item: EvidenceItem, allEvidence: EvidenceItem[]): number {
  if (item.eventType !== 'LOGIN_FAILED') return 0;

  const sameSource = allEvidence.filter(
    (e) =>
      e.eventType === 'LOGIN_FAILED' &&
      e.source === item.source &&
      e.user === item.user &&
      parseInt(e.timestamp) <= parseInt(item.timestamp) + 60 && // Within 60 seconds
      parseInt(e.timestamp) >= parseInt(item.timestamp) - 60
  );

  return sameSource.length;
}

/**
 * Helper: Format bytes to human-readable format.
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get evidence items by severity level.
 */
export function getEvidenceBySeverity(
  scores: Map<string, AnomalyScore>,
  severity: AnomalyScore['severity']
): string[] {
  return Array.from(scores.entries())
    .filter(([_, score]) => score.severity === severity)
    .map(([id, _]) => id);
}

/**
 * Build an evidence attack chain based on anomaly relationships.
 */
export function inferAttackChain(
  scores: Map<string, AnomalyScore>,
  evidence: EvidenceItem[]
): string[] {
  // Sort by timestamp and anomaly score
  const sorted = evidence
    .map((e) => ({
      id: e.id,
      timestamp: e.timestamp,
      score: scores.get(e.id)?.score || 0,
    }))
    .filter((e) => e.score > 0.3) // Only anomalous items
    .sort((a, b) => {
      const timeA = parseInt(a.timestamp.replace(/:/g, ''));
      const timeB = parseInt(b.timestamp.replace(/:/g, ''));
      return timeA - timeB;
    });

  return sorted.map((e) => e.id);
}
