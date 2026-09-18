import type { EvidenceItem } from '../types/evidence';
import { Clock, ArrowDown, Trash2, ArrowUpDown, AlertCircle, CheckCircle2, ListX } from 'lucide-react';

interface TimelineProps {
  pinnedIds: string[];
  evidenceMap: Map<string, EvidenceItem>;
  onRemovePinned: (id: string) => void;
  onAutoSort: () => void;
  onClearPinned: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  pinnedIds,
  evidenceMap,
  onRemovePinned,
  onAutoSort,
  onClearPinned,
}) => {
  // Convert pinned IDs to evidence items
  const timelineItems = pinnedIds
    .map((id) => evidenceMap.get(id))
    .filter((item): item is EvidenceItem => Boolean(item));

  // Helper to calculate seconds difference between two "HH:MM:SS" timestamps
  const getSecondsDifference = (timeA: string, timeB: string): number => {
    const parse = (t: string) => {
      const [h, m, s] = t.split(':').map(Number);
      return h * 3600 + m * 60 + s;
    };
    return parse(timeB) - parse(timeA);
  };

  return (
    <aside className="w-full lg:w-96 bg-cyber-900/90 border border-cyber-700/60 rounded-xl flex flex-col h-fit lg:sticky lg:top-24 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-cyber-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Incident Timeline
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {timelineItems.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {timelineItems.length > 1 && (
            <button
              onClick={onAutoSort}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 px-2 py-1 rounded bg-cyber-800 hover:bg-cyber-700 border border-cyber-700 transition-colors"
              title="Auto sort events chronologically"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Sort</span>
            </button>
          )}

          {timelineItems.length > 0 && (
            <button
              onClick={onClearPinned}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-rose-300 px-2 py-1 rounded bg-cyber-800 hover:bg-cyber-700 border border-cyber-700 transition-colors"
              title="Clear timeline"
            >
              <ListX className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Body / Timeline Nodes */}
      <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto space-y-2">
        {timelineItems.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-cyber-800 rounded-lg">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-xs font-mono font-semibold text-slate-300">
              Timeline is empty
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Review the evidence on the left. Click <strong className="text-cyan-400 font-mono">+ TIMELINE</strong> on suspect events to reconstruct the attack sequence.
            </p>
          </div>
        ) : (
          <div className="relative pl-4 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/80 before:via-indigo-500/50 before:to-cyber-700">
            {timelineItems.map((item, index) => {
              const prevItem = index > 0 ? timelineItems[index - 1] : null;
              const deltaSeconds = prevItem ? getSecondsDifference(prevItem.timestamp, item.timestamp) : null;

              return (
                <div key={item.id} className="relative group">
                  {/* Delta indicator if elapsed time */}
                  {deltaSeconds !== null && (
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 py-1 pl-2">
                      <ArrowDown className="w-2.5 h-2.5 text-slate-600" />
                      <span>
                        {deltaSeconds >= 0 ? `+${deltaSeconds}s elapsed` : `${deltaSeconds}s (out of order!)`}
                      </span>
                    </div>
                  )}

                  {/* Node Dot */}
                  <div className="absolute -left-[21px] top-3.5 w-3.5 h-3.5 rounded-full bg-cyber-950 border-2 border-cyan-400 group-hover:border-white transition-colors shadow-sm shadow-cyan-400/50" />

                  {/* Card */}
                  <div className="bg-cyber-850/90 border border-cyber-700/80 hover:border-cyan-500/50 p-3 rounded-lg text-xs shadow-md transition-all">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-cyan-300 text-[11px]">
                        {item.timestamp}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyber-900 text-slate-400 border border-cyber-800">
                          {item.category.replace('_LOG', '')}
                        </span>
                        <button
                          onClick={() => onRemovePinned(item.id)}
                          className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                          title="Remove event from timeline"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="font-semibold text-slate-200 line-clamp-1">
                      {item.title}
                    </div>

                    {item.source && (
                      <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1 truncate">
                        <span className="text-slate-500">Src:</span>
                        <span className="text-cyan-400">{item.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {timelineItems.length > 0 && (
        <div className="p-3 bg-cyber-950/80 border-t border-cyber-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sequence active
          </span>
          <span className="text-slate-500">
            {timelineItems.length} key clues isolated
          </span>
        </div>
      )}
    </aside>
  );
};
