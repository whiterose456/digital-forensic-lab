import { useState, useMemo } from 'react';
import type { EvidenceItem, EvidenceCategory } from '../types/evidence';
import { EvidenceCard } from './EvidenceCard';
import { EvidenceFilters } from './EvidenceFilters';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { Database } from 'lucide-react';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
  notes: Record<string, string>;
  onSaveNote: (evidenceId: string, note: string) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  pinnedIds,
  onTogglePin,
  notes,
  onSaveNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<EvidenceItem | null>(null);

  // Filter evidence dynamically
  const filteredEvidence = useMemo(() => {
    return evidence.filter((item) => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Pinned only filter
      if (showPinnedOnly && !pinnedIds.includes(item.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesType = item.eventType.toLowerCase().includes(query);
        const matchesRaw = item.rawPayload.toLowerCase().includes(query);
        const matchesUser = item.user?.toLowerCase().includes(query) || false;
        const matchesSource = item.source?.toLowerCase().includes(query) || false;
        const matchesDest = item.destination?.toLowerCase().includes(query) || false;
        const matchesProcess = item.process?.toLowerCase().includes(query) || false;
        const matchesFile = item.file?.toLowerCase().includes(query) || false;
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesType && !matchesRaw && !matchesUser && !matchesSource && !matchesDest && !matchesProcess && !matchesFile && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [evidence, selectedCategory, showPinnedOnly, searchQuery, pinnedIds]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Filters Toolbar */}
      <EvidenceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showPinnedOnly={showPinnedOnly}
        onTogglePinnedOnly={setShowPinnedOnly}
        totalCount={evidence.length}
        filteredCount={filteredEvidence.length}
        pinnedCount={pinnedIds.length}
      />

      {/* Evidence Cards Grid */}
      {filteredEvidence.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl bg-cyber-900/40 border border-cyber-800 border-dashed">
          <Database className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-mono text-slate-300 font-semibold">No forensic records match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Try adjusting your search terms or clearing the active category filters to inspect all system telemetry.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setShowPinnedOnly(false);
            }}
            className="mt-4 px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-cyan-400 text-xs font-mono border border-cyber-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-8">
          {filteredEvidence.map((item) => (
            <EvidenceCard
              key={item.id}
              item={item}
              isPinned={pinnedIds.includes(item.id)}
              onTogglePin={onTogglePin}
              onInspect={setInspectingItem}
              userNote={notes[item.id]}
              onEditNote={() => setInspectingItem(item)}
            />
          ))}
        </div>
      )}

      {/* Raw Payload Inspector Modal */}
      {inspectingItem && (
        <EvidenceDetailModal
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
          isPinned={pinnedIds.includes(inspectingItem.id)}
          onTogglePin={onTogglePin}
          userNote={notes[inspectingItem.id] || ''}
          onSaveNote={onSaveNote}
        />
      )}
    </div>
  );
};
