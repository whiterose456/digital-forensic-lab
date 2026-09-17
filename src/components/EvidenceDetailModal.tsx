import { useState } from 'react';
import type { EvidenceItem } from '../types/evidence';
import { X, Copy, Check, Terminal, FileText, Save } from 'lucide-react';

interface EvidenceDetailModalProps {
  item: EvidenceItem | null;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  userNote: string;
  onSaveNote: (evidenceId: string, note: string) => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({
  item,
  onClose,
  isPinned,
  onTogglePin,
  userNote,
  onSaveNote,
}) => {
  if (!item) return null;

  const [copied, setCopied] = useState(false);
  const [noteText, setNoteText] = useState(userNote || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.rawPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    onSaveNote(item.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-cyber-900 border border-cyber-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-800 bg-cyber-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">#{item.id}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyber-800 text-cyan-300 border border-cyber-700">
                  {item.category}
                </span>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {item.timestamp} UTC
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{item.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Investigator Event Summary
            </h4>
            <p className="text-sm text-slate-200 bg-cyber-850/70 p-3 rounded-lg border border-cyber-700/60 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Structured Attributes Grid */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Parsed Entities & Context
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-cyber-950/80 p-3 rounded-lg border border-cyber-800">
                <span className="text-slate-500 block text-[10px]">EVENT CLASSIFICATION</span>
                <span className="text-amber-300 font-semibold text-sm">{item.eventType}</span>
              </div>
              <div className="bg-cyber-950/80 p-3 rounded-lg border border-cyber-800">
                <span className="text-slate-500 block text-[10px]">ASSOCIATED USER</span>
                <span className="text-emerald-400 font-semibold text-sm">{item.user || 'None (System Daemon)'}</span>
              </div>
              <div className="bg-cyber-950/80 p-3 rounded-lg border border-cyber-800">
                <span className="text-slate-500 block text-[10px]">NETWORK SOURCE</span>
                <span className="text-cyan-300 font-semibold">{item.source || 'N/A (Local socket)'}</span>
              </div>
              <div className="bg-cyber-950/80 p-3 rounded-lg border border-cyber-800">
                <span className="text-slate-500 block text-[10px]">NETWORK DESTINATION</span>
                <span className="text-indigo-300 font-semibold">{item.destination || 'N/A'}</span>
              </div>
              {item.process && (
                <div className="bg-cyber-950/80 p-3 rounded-lg border border-cyber-800">
                  <span className="text-slate-500 block text-[10px]">PROCESS / COMMAND</span>
                  <span className="text-purple-300 font-semibold">{item.process}</span>
                </div>
              )}
              {item.file && (
                <div className="bg-cyber-950/80 p-3 rounded-lg border border-cyber-800">
                  <span className="text-slate-500 block text-[10px]">FILE TARGET</span>
                  <span className="text-amber-300 font-semibold underline">{item.file}</span>
                </div>
              )}
            </div>
          </div>

          {/* Raw Syslog / Auditd Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Raw System Artifact / Payload
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white bg-cyber-800 px-2 py-1 rounded border border-cyber-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-black font-mono text-xs text-emerald-400 border border-cyber-700/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {item.rawPayload}
              </pre>
            </div>
          </div>

          {/* Forensic Notes for this evidence */}
          <div className="pt-2 border-t border-cyber-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Investigator Case Notes for this Clue
            </h4>
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Document your hypothesis, suspect IP addresses, or relevance of this log..."
                className="w-full h-20 bg-cyber-950 border border-cyber-700 rounded-lg p-3 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-700 hover:bg-cyber-600 text-white text-xs font-mono transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>{noteSaved ? 'Note Saved!' : 'Save Clue Note'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-800 bg-cyber-950/80">
          <button
            onClick={() => onTogglePin(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isPinned
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-cyber-800 hover:bg-cyber-700 text-white border border-cyber-600'
            }`}
          >
            {isPinned ? '✓ INCLUDED IN TIMELINE' : '+ ADD TO TIMELINE LEADS'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
