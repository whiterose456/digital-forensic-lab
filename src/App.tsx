import { useState, useMemo } from 'react';
import { case0147 } from './data/cases/case0147';
import type { EvidenceItem } from './types/evidence';
import { CaseHeader } from './components/CaseHeader';
import { EvidencePanel } from './components/EvidencePanel';
import { Timeline } from './components/Timeline';
import { Terminal } from 'lucide-react';

export function App() {
  const [currentCase] = useState(case0147);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Fast lookup map for evidence
  const evidenceMap = useMemo(() => {
    const map = new Map<string, EvidenceItem>();
    currentCase.evidence.forEach((item) => map.set(item.id, item));
    return map;
  }, [currentCase.evidence]);

  // Toggle pinning evidence to timeline
  const handleTogglePin = (id: string) => {
    setPinnedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Remove specific pinned item
  const handleRemovePinned = (id: string) => {
    setPinnedIds((prev) => prev.filter((item) => item !== id));
  };

  // Chronological auto-sort based on timestamp
  const handleAutoSort = () => {
    const sorted = [...pinnedIds].sort((a, b) => {
      const itemA = evidenceMap.get(a);
      const itemB = evidenceMap.get(b);
      if (!itemA || !itemB) return 0;
      return itemA.timestamp.localeCompare(itemB.timestamp);
    });
    setPinnedIds(sorted);
  };

  // Save note on specific evidence
  const handleSaveNote = (evidenceId: string, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [evidenceId]: note,
    }));
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-200 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Application Bar */}
      <nav className="bg-cyber-900 border-b border-cyber-800 px-6 py-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>DIGITAL FORENSICS LAB</span>
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">INCIDENT WORKSPACE</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span className="hidden sm:inline">ANALYST: <strong className="text-slate-300">CADET-09</strong></span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            SIEM LOG FEED READY
          </span>
        </div>
      </nav>

      {/* Case Header & Briefing Bar */}
      <CaseHeader
        caseData={currentCase}
        pinnedCount={pinnedIds.length}
        totalEvidenceCount={currentCase.evidence.length}
      />

      {/* Main Forensic Investigation Lab Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left/Center: Evidence Browsing & Log Analysis */}
        <EvidencePanel
          evidence={currentCase.evidence}
          pinnedIds={pinnedIds}
          onTogglePin={handleTogglePin}
          notes={notes}
          onSaveNote={handleSaveNote}
        />

        {/* Right: Interactive Incident Timeline */}
        <Timeline
          pinnedIds={pinnedIds}
          evidenceMap={evidenceMap}
          onRemovePinned={handleRemovePinned}
          onAutoSort={handleAutoSort}
        />
      </main>

      {/* Lab Footer */}
      <footer className="border-t border-cyber-800/80 bg-cyber-900/60 py-3 px-6 text-center text-xs font-mono text-slate-500">
        Digital Forensics Lab — Educational Investigation Simulator • Hackathon Edition • Case #0147 (The Vanishing Server)
      </footer>
    </div>
  );
}

export default App;
