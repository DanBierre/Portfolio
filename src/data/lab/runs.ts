// Agent X-ray: DEMO runs, written to show the format. Replace with real recorded traces
// (same shape) when available. The page labels these as demo runs.
export type StepKind = 'think' | 'tool' | 'result' | 'backtrack';
export type Step = { kind: StepKind; label: string; tool?: string; ms: number; cents: number };
export type Run = { id: string; question: string; steps: Step[] };

export const runs: Run[] = [
  {
    id: 'summer',
    question: 'Find three reference images for a summer drinks campaign.',
    steps: [
      { kind: 'think', label: 'Break the brief into a search plan: mood, colour, setting.', ms: 900, cents: 0.3 },
      { kind: 'tool', tool: 'search_images', label: 'summer drinks, golden hour, outdoor', ms: 2100, cents: 0.1 },
      { kind: 'result', label: '24 candidates', ms: 300, cents: 0 },
      { kind: 'think', label: 'Most are studio shots; the brief asks for outdoors.', ms: 700, cents: 0.2 },
      { kind: 'backtrack', label: 'Drop the studio results and refine the query.', ms: 200, cents: 0 },
      { kind: 'tool', tool: 'search_images', label: 'picnic, citrus drinks, natural light', ms: 1900, cents: 0.1 },
      { kind: 'result', label: '18 candidates', ms: 200, cents: 0 },
      { kind: 'tool', tool: 'rank_images', label: 'match brand palette and composition', ms: 2600, cents: 0.6 },
      { kind: 'think', label: 'Check the licences before recommending anything.', ms: 500, cents: 0.2 },
      { kind: 'tool', tool: 'check_licence', label: '3 shortlisted images', ms: 1400, cents: 0.1 },
      { kind: 'result', label: 'Three references, each with its licence and a one-line note.', ms: 400, cents: 0.3 },
    ],
  },
  {
    id: 'shotlist',
    question: 'Turn this brief into a shot list.',
    steps: [
      { kind: 'think', label: 'Read the brief: 30-second spot, three locations, one hero product.', ms: 800, cents: 0.4 },
      { kind: 'tool', tool: 'extract_beats', label: 'brief.pdf', ms: 1700, cents: 0.5 },
      { kind: 'result', label: '6 story beats', ms: 200, cents: 0 },
      { kind: 'think', label: 'Beat 4 needs night exteriors; the schedule only has day.', ms: 600, cents: 0.2 },
      { kind: 'backtrack', label: 'Rewrite beat 4 for golden hour instead of night.', ms: 300, cents: 0.1 },
      { kind: 'tool', tool: 'draft_shots', label: '6 beats × locations', ms: 2400, cents: 0.8 },
      { kind: 'tool', tool: 'estimate_time', label: '14 shots', ms: 900, cents: 0.1 },
      { kind: 'result', label: 'A 14-shot list, grouped by location, with timings.', ms: 300, cents: 0.2 },
    ],
  },
];

export const totals = (steps: Step[]) =>
  steps.reduce((t, s) => ({ ms: t.ms + s.ms, cents: t.cents + s.cents }), { ms: 0, cents: 0 });

export const formatSeconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
export const formatCost = (cents: number) => `$${(cents / 100).toFixed(3)}`;
