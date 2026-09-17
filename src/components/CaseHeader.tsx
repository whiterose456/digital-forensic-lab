import { useState } from 'react';
import type { CaseDefinition } from '../types/case';
import { ShieldAlert, Server, Clock, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface CaseHeaderProps {
  caseData: CaseDefinition;
  pinnedCount: number;
  totalEvidenceCount: number;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({
  caseData,
  pinnedCount,
  totalEvidenceCount,
}) => {
  const [showBriefing, setShowBriefing] = useState(false);

  return (
    <header className="bg-cyber-900/90 border-b border-cyber-700/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Case Identity */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mt-1 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/30 tracking-wider">
                {caseData.caseNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                LEVEL: {caseData.difficulty.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {caseData.timestampRange}
              </span>
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
              {caseData.title}
            </h1>
            
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-0.5">
              {caseData.shortDescription}
            </p>
          </div>
        </div>

        {/* Right: Target Host & Investigation Telemetry */}
        <div className="flex items-center gap-4 flex-wrap self-end md:self-auto">
          {/* Target Host Badge */}
          <div className="bg-cyber-850/80 border border-cyber-700/80 px-3.5 py-2 rounded-lg flex items-center gap-3 text-xs">
            <Server className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">Target Node</div>
              <div className="text-slate-200 font-mono font-medium">{caseData.serverInfo.hostname}</div>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {caseData.serverInfo.ip}
            </div>
          </div>

          {/* Timeline Counter */}
          <div className="bg-cyber-850/80 border border-cyber-700/80 px-3.5 py-2 rounded-lg text-xs">
            <div className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">Timeline Leads</div>
            <div className="font-mono font-semibold flex items-center gap-1.5 mt-0.5">
              <span className={pinnedCount > 0 ? "text-cyan-300 font-bold" : "text-slate-400"}>
                {pinnedCount}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{totalEvidenceCount} events</span>
            </div>
          </div>

          {/* Incident Briefing Toggle */}
          <button
            onClick={() => setShowBriefing(!showBriefing)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyber-700/50 hover:bg-cyber-600/60 text-slate-200 text-xs font-medium border border-cyber-600/50 transition-colors shadow-sm"
            title="Read Incident Dispatch Briefing"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Case Brief</span>
            {showBriefing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Case Briefing Box */}
      {showBriefing && (
        <div className="max-w-7xl mx-auto mt-4 p-4 rounded-lg bg-cyber-850 border border-amber-500/30 text-xs text-slate-300 shadow-xl transition-all">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" />
            OFFICIAL INCIDENT DISPATCH BRIEFING
          </div>
          <pre className="font-mono whitespace-pre-wrap leading-relaxed text-slate-300 bg-cyber-900/90 p-3.5 rounded border border-cyber-700/60">
            {caseData.briefing}
          </pre>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-cyber-700/40">
            <span>Operating System: <strong className="text-slate-300 font-mono">{caseData.serverInfo.os}</strong></span>
            <span>Role: <strong className="text-slate-300 font-mono">{caseData.serverInfo.role}</strong></span>
          </div>
        </div>
      )}
    </header>
  );
};
