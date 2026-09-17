import type { EvidenceCategory } from '../types/evidence';
import { Search, Filter, Key, FileCode, Network, Terminal, User, ListFilter, X } from 'lucide-react';

interface EvidenceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: EvidenceCategory | 'ALL';
  onSelectCategory: (category: EvidenceCategory | 'ALL') => void;
  showPinnedOnly: boolean;
  onTogglePinnedOnly: (val: boolean) => void;
  totalCount: number;
  filteredCount: number;
  pinnedCount: number;
}

export const EvidenceFilters: React.FC<EvidenceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  showPinnedOnly,
  onTogglePinnedOnly,
  totalCount,
  filteredCount,
  pinnedCount,
}) => {
  const categories: { key: EvidenceCategory | 'ALL'; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'All Logs', icon: <ListFilter className="w-3.5 h-3.5" /> },
    { key: 'AUTH_LOG', label: 'Authentication', icon: <Key className="w-3.5 h-3.5" /> },
    { key: 'NETWORK_LOG', label: 'Network', icon: <Network className="w-3.5 h-3.5" /> },
    { key: 'FILE_LOG', label: 'File Activity', icon: <FileCode className="w-3.5 h-3.5" /> },
    { key: 'SYSTEM_LOG', label: 'System', icon: <Terminal className="w-3.5 h-3.5" /> },
    { key: 'USER_ACCOUNT', label: 'User Activity', icon: <User className="w-3.5 h-3.5" /> },
  ];

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'ALL' || showPinnedOnly;

  return (
    <div className="bg-cyber-900/80 border border-cyber-700/60 rounded-xl p-4 mb-4 shadow-lg backdrop-blur-sm">
      {/* Top row: Search input + Pinned Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by IP, username, process (archive.exe), file, timestamp, or keyword..."
            className="w-full bg-cyber-950/80 border border-cyber-700/70 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pinned Leads Filter Toggle */}
        <button
          onClick={() => onTogglePinnedOnly(!showPinnedOnly)}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono border transition-all whitespace-nowrap ${
            showPinnedOnly
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
              : 'bg-cyber-850 hover:bg-cyber-800 text-slate-400 border-cyber-700/60'
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Timeline Clues ({pinnedCount})</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono transition-all whitespace-nowrap ${
              selectedCategory === cat.key
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                : 'bg-cyber-950/50 hover:bg-cyber-800/80 text-slate-400 border border-cyber-800/80 hover:text-slate-200'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}

        {/* Reset filters button if any */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('ALL');
              onTogglePinnedOnly(false);
            }}
            className="flex items-center gap-1 ml-auto text-[11px] font-mono text-amber-400 hover:text-amber-300 px-2 py-1 rounded hover:bg-amber-400/10 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Telemetry Status Line */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-cyber-800/60 mt-2">
        <span>
          Showing <strong className="text-slate-300">{filteredCount}</strong> of <strong className="text-slate-300">{totalCount}</strong> forensic events
        </span>
        {hasActiveFilters && (
          <span className="text-cyan-400/80">Active Filter Applied</span>
        )}
      </div>
    </div>
  );
};
