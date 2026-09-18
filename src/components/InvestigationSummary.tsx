import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { CaseDefinition } from '../types/case';
import type { EvidenceItem } from '../types/evidence';

interface InvestigationSummaryProps {
  caseData: CaseDefinition;
  evidenceMap: Map<string, EvidenceItem>;
  pinnedIds: string[];
  hypothesisText: string;
  onHypothesisChange: (value: string) => void;
  onResetInvestigation: () => void;
}

export const InvestigationSummary: React.FC<InvestigationSummaryProps> = ({
  caseData,
  evidenceMap,
  pinnedIds,
  hypothesisText,
  onHypothesisChange,
  onResetInvestigation,
}) => {
  const criticalEvidence = caseData.groundTruth.criticalEvidenceIds
    .map((id) => evidenceMap.get(id))
    .filter((item): item is EvidenceItem => Boolean(item));

  const matchedEvidence = criticalEvidence.filter((item) => pinnedIds.includes(item.id));
  const completionPercent = Math.round((matchedEvidence.length / criticalEvidence.length) * 100);

  const timelineSteps = caseData.groundTruth.correctChronologicalSequence.map((id, index) => {
    const item = evidenceMap.get(id);
    return {
      id,
      title: item?.title ?? 'Evidence reference',
      status: pinnedIds.includes(id) ? 'included' : 'missing',
      index,
    };
  });

  return (
    <section className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyber-900/90 p-5 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col gap-3 border-b border-cyber-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400">
            Investigation findings
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">Case closure dashboard</h2>
        </div>

        <button
          type="button"
          onClick={onResetInvestigation}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-mono text-cyan-300 transition-colors hover:bg-cyan-500/20"
        >
          Reset investigation
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-cyber-700 bg-cyber-950/50 p-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Threat actor</p>
          <p className="mt-2 text-lg font-semibold text-rose-300">{caseData.groundTruth.responsibleAccount}</p>
        </div>

        <div className="rounded-xl border border-cyber-700 bg-cyber-950/50 p-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Attacker IP</p>
          <p className="mt-2 text-lg font-semibold text-cyan-300">{caseData.groundTruth.attackerIp}</p>
        </div>

        <div className="rounded-xl border border-cyber-700 bg-cyber-950/50 p-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Target</p>
          <p className="mt-2 text-lg font-semibold text-amber-300">{caseData.groundTruth.targetAsset}</p>
        </div>

        <div className="rounded-xl border border-cyber-700 bg-cyber-950/50 p-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Evidence match</p>
          <p className="mt-2 text-lg font-semibold text-emerald-300">{matchedEvidence.length}/{criticalEvidence.length}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-cyber-700 bg-cyber-950/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            Incident chain validation
          </div>

          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Critical event coverage</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-cyber-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {timelineSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-3 rounded-lg border border-cyber-800 bg-cyber-900/70 px-3 py-2"
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                  step.status === 'included'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 text-sm text-slate-200">{step.title}</div>

                <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.12em] text-slate-400">
                  {step.status === 'included' ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      included
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      missing
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cyber-700 bg-cyber-950/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <BrainCircuit className="h-4 w-4 text-cyan-400" />
            Analyst hypothesis
          </div>

          <textarea
            value={hypothesisText}
            onChange={(event) => onHypothesisChange(event.target.value)}
            placeholder="Document the likely compromise path and how the data left the environment..."
            className="h-40 w-full rounded-lg border border-cyber-700 bg-cyber-950/80 p-3 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/70 focus:outline-none"
          />

          <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs leading-relaxed text-cyan-100">
            <div className="mb-2 flex items-center gap-2 font-mono uppercase tracking-[0.12em] text-cyan-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Case conclusion
            </div>
            <p>{caseData.groundTruth.explanation}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
        <span className="rounded bg-cyber-800 px-2 py-1">Incident type: {caseData.groundTruth.incidentType}</span>
        <ArrowRight className="h-3 w-3 text-slate-500" />
        <span className="rounded bg-cyber-800 px-2 py-1">Artifact: {caseData.groundTruth.exfiltratedArtifact}</span>
      </div>
    </section>
  );
};
