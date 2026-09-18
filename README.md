# Digital Forensics Lab

A compact React + TypeScript investigation simulator for exploring a fictional cyber incident. Analysts can browse forensic evidence, tag suspicious events to an incident timeline, save notes, and validate whether they reconstructed the correct compromise chain.

## What this app does

- Displays a mock incident case with log evidence grouped by category
- Lets investigators filter events by keyword and type
- Supports pinning suspicious evidence into a timeline
- Includes raw log inspection and note-taking for individual artifacts
- Tracks case-closure progress against the known attack chain
- Persists analyst notes and timeline state in the browser with `localStorage`

## Project structure

```text
src/
  App.tsx                     # main workspace shell
  components/
    CaseHeader.tsx           # case metadata and briefing
    EvidenceCard.tsx         # card for an individual forensic record
    EvidenceDetailModal.tsx  # raw artifact viewer and note editor
    EvidenceFilters.tsx      # search and category controls
    EvidencePanel.tsx        # main evidence grid and filter logic
    InvestigationSummary.tsx # case closure, hypothesis, and summary dashboard
    Timeline.tsx             # pinned chronology of suspicious clues
  data/cases/case0147.ts     # the sample incident dataset
  types/
    case.ts                  # case metadata model
    evidence.ts              # evidence and clue typing
```

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build the app for production:

```bash
npm run build
```

## Available scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and create a production build
- `npm run lint` — run the project linter
- `npm run preview` — preview the production build locally

## Case scenario

The current case simulates a payroll server compromise where an external attacker uses SSH brute-force access, reads sensitive payroll data, archives it, and exfiltrates it over port 443.

Use the interface to reconstruct the chain of compromise and compare your timeline against the known conclusion in the investigation summary panel.

## Notes for contributors

- Prefer typed models in `src/types/` when extending evidence or case definitions.
- Keep new evidence entries realistic and consistent with the mock forensic log format.
- When adding new features, favor small, focused components over large monolithic views.
- The investigation dashboard intentionally aligns to the `groundTruth` metadata already defined in the case data so the simulator remains educational and testable.
