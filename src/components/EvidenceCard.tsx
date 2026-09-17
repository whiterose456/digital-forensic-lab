import type { EvidenceItem } from '../types/evidence';
import { 
  Key, 
  FileCode, 
  Network, 
  Terminal, 
  User, 
  Plus, 
  Check, 
  Code2, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface EvidenceCardProps {
  item: EvidenceItem;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onInspect: (item: EvidenceItem) => void;
  userNote?: string;
  onEditNote?: (id: string) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  isPinned,
  onTogglePin,
  onInspect,
  userNote,
  onEditNote,
}) => {
  const getCategoryConfig = (category: EvidenceItem['category']) => {
    switch (category) {
      case 'AUTH_LOG':
        return {
          label: 'AUTH',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          icon: <Key className="w-3.5 h-3.5" />,
        };
      case 'FILE_LOG':
        return {
          label: 'FILE',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          icon: <FileCode className="w-3.5 h-3.5" />,
        };
      case 'NETWORK_LOG':
        return {
          label: 'NETWORK',
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          icon: <Network className="w-3.5 h-3.5" />,
        };
      case 'SYSTEM_LOG':
        return {
          label: 'SYSTEM',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          icon: <Terminal className="w-3.5 h-3.5" />,
        };
      case 'USER_ACCOUNT':
        return {
          label: 'USER',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          icon: <User className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: 'LOG',
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
          icon: <Terminal className="w-3.5 h-3.5" />,
        };
    }
  };

  const config = getCategoryConfig(item.category);

  return (
    <div 
      className={`relative group rounded-xl border transition-all duration-200 bg-cyber-900/70 hover:bg-cyber-850/90 shadow-md ${
        isPinned 
          ? 'border-cyan-500/60 ring-1 ring-cyan-500/30 bg-cyber-850/90' 
          : 'border-cyber-700/60 hover:border-cyber-600'
      }`}
    >
      <div className="p-4 flex flex-col justify-between h-full">
        {/* Top bar: Category + Timestamp + ID + Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border ${config.color}`}>
              {config.icon}
              {config.label}
            </span>
            <span className="font-mono text-xs text-cyan-300 font-bold tracking-tight bg-cyber-950/80 px-2 py-0.5 rounded border border-cyber-700/50">
              {item.timestamp}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              #{item.id}
            </span>
          </div>

          {/* Quick Pin Toggle Button */}
          <button
            onClick={() => onTogglePin(item.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              isPinned
                ? 'bg-cyan-500 text-black font-bold shadow-cyan-500/20 shadow-lg'
                : 'bg-cyber-800 hover:bg-cyber-700 text-slate-300 hover:text-white border border-cyber-600/50'
            }`}
            title={isPinned ? "Remove from Timeline" : "Pin as Clue to Timeline"}
          >
            {isPinned ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>PINNED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>TIMELINE</span>
              </>
            )}
          </button>
        </div>

        {/* Title and Event Type */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              {item.eventType}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors mt-0.5">
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Technical Attributes Chips */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] font-mono text-slate-300 border-t border-cyber-800/80 my-2">
          {item.user && (
            <div className="truncate flex items-center gap-1 text-slate-400">
              <span className="text-slate-500">User:</span>
              <span className="text-emerald-400 font-semibold">{item.user}</span>
            </div>
          )}
          {item.process && (
            <div className="truncate flex items-center gap-1 text-slate-400">
              <span className="text-slate-500">Proc:</span>
              <span className="text-amber-300">{item.process}</span>
            </div>
          )}
          {item.source && (
            <div className="truncate flex items-center gap-1 text-slate-400 col-span-2">
              <span className="text-slate-500">Src:</span>
              <span className="text-cyan-300 font-medium">{item.source}</span>
              {item.destination && (
                <>
                  <ArrowRight className="w-3 h-3 text-slate-600 inline shrink-0" />
                  <span className="text-indigo-300 font-medium truncate">{item.destination}</span>
                </>
              )}
            </div>
          )}
          {item.file && (
            <div className="truncate flex items-center gap-1 text-slate-400 col-span-2">
              <span className="text-slate-500">File:</span>
              <span className="text-amber-200 font-mono underline decoration-amber-500/40 truncate">{item.file}</span>
            </div>
          )}
        </div>

        {/* User Note display if present */}
        {userNote && (
          <div className="bg-cyber-950/70 border border-cyan-500/20 rounded p-2 text-xs text-cyan-200 mb-2 font-mono flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{userNote}</span>
          </div>
        )}

        {/* Footer actions: Inspect Raw Log & Add Note */}
        <div className="flex items-center justify-between pt-2 border-t border-cyber-800/60 text-xs">
          <div className="flex items-center gap-1 flex-wrap">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-800/60 text-slate-400">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onEditNote && (
              <button
                onClick={() => onEditNote(item.id)}
                className="text-slate-400 hover:text-cyan-300 text-xs p-1 rounded hover:bg-cyber-800 transition-colors"
                title="Add/Edit Note"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            )}
            
            <button
              onClick={() => onInspect(item)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-mono bg-cyber-800/50 hover:bg-cyber-700/60 px-2 py-1 rounded border border-cyber-700/50 transition-colors"
            >
              <Code2 className="w-3 h-3 text-cyan-400" />
              <span>Raw</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
