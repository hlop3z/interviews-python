// Structured content for the Interview Playbook page.
// Kept as typed data so sections stay consistent and are searchable via Pagefind.

export interface PlaybookStep {
  step: number;
  title: string;
  goal: string;
  say: string[]; // what to say out loud
  write: string[]; // what to put on the board / in code comments
  avoid: string[]; // failure modes
}

export interface SignalRow {
  signal: string;
  candidates: string[]; // pattern names, free-form so we don't hard-depend on Pattern.id yet
}

export interface ComplexityRecipe {
  shape: string; // e.g. "T(n) = 2·T(n/2) + O(n)"
  result: string; // e.g. "O(n log n)"
  example: string;
}

export interface StarPart {
  letter: string;
  label: string;
  budget: string; // word/sentence budget
  hint: string;
}

export const playbookSteps: PlaybookStep[] = [
  {
    step: 1,
    title: 'Clarify',
    goal: 'Convert an ambiguous problem statement into a precise contract before you touch code.',
    say: [
      '"Let me restate the problem to make sure I understand..."',
      '"A few assumptions I want to confirm..."',
    ],
    write: [
      'Input/output types and shapes',
      'Size bounds (n, value range)',
      'Duplicates allowed? Sorted? Negative values? Empty input?',
      'Is there a memory or latency budget?',
    ],
    avoid: [
      'Jumping to code before bounds are known',
      'Silently assuming distinct / sorted / non-empty inputs',
    ],
  },
  {
    step: 2,
    title: 'Examples',
    goal: 'Anchor the contract with concrete cases — especially edge cases.',
    say: [
      '"Let me walk through a small example and then an edge case..."',
    ],
    write: [
      'One happy-path example',
      'One edge case (empty, single element, all duplicates, max size)',
      'Expected output for each',
    ],
    avoid: [
      'Only using the example from the prompt',
      'Skipping the edge case — the interviewer will bring it up later anyway',
    ],
  },
  {
    step: 3,
    title: 'Brute force first',
    goal: 'Get any correct answer on the board to establish a baseline and unblock discussion.',
    say: [
      '"The obvious approach is O(n²) — let me state it so we have a baseline, then I will optimize."',
    ],
    write: [
      'Brute-force complexity (time + space)',
      'A one-line description, not full code',
    ],
    avoid: [
      'Implementing the brute force in full — waste of time',
      'Acting as if the brute force is beneath you; interviewers want to see the jump',
    ],
  },
  {
    step: 4,
    title: 'Optimize',
    goal: 'Identify what is wasted in the brute force and pick a pattern.',
    say: [
      '"The brute force recomputes X — I can cache it with a hash map."',
      '"The input is sorted, which suggests two pointers or binary search."',
    ],
    write: [
      'The wasted work in one sentence',
      'The pattern you are reaching for and why',
      'Target complexity before coding',
    ],
    avoid: [
      'Optimizing by guessing a data structure without a reason',
      'Jumping past multiple better solutions to an exotic one',
    ],
  },
  {
    step: 5,
    title: 'Code',
    goal: 'Translate the chosen approach to clean, running code.',
    say: [
      '"I will use meaningful names and extract helpers where it aids clarity."',
    ],
    write: [
      'Invariants as comments at the top of loops',
      'Inputs validated at the boundary only',
    ],
    avoid: [
      'Premature micro-optimizations',
      'Silent mutation of input arguments',
      'Off-by-one errors in loop bounds — state the half-open vs closed convention',
    ],
  },
  {
    step: 6,
    title: 'Test',
    goal: 'Trace through examples to catch off-by-ones and bad edge behavior.',
    say: [
      '"Let me trace through the happy path, then the edge case."',
    ],
    write: [
      'Dry-run state changes on the edge case',
      'Flag any lines you are unsure about and fix before moving on',
    ],
    avoid: [
      'Declaring done without any trace',
      'Only testing the happy path',
    ],
  },
  {
    step: 7,
    title: 'Complexity',
    goal: 'State final time and space complexity with a one-line justification.',
    say: [
      '"Time is O(n log n) because we sort once and scan once; space is O(n) for the hash map."',
    ],
    write: [
      'Time complexity + dominant term reasoning',
      'Space complexity including recursion stack',
      'Amortized vs worst-case if they differ',
    ],
    avoid: [
      'Quoting a complexity without reasoning',
      'Forgetting recursion-stack space in DFS solutions',
    ],
  },
];

export const signalRows: SignalRow[] = [
  {
    signal: 'Sorted array / asked to find a pair / asked to remove duplicates in-place',
    candidates: ['Two pointers (opposite ends, same direction)'],
  },
  {
    signal: 'Contiguous subarray / substring with a property / "longest ... with at most K"',
    candidates: ['Sliding window (fixed or variable)'],
  },
  {
    signal: 'Linked list cycle / find middle node / Nth from the end',
    candidates: ['Fast/slow pointers'],
  },
  {
    signal: '"Find X in O(log n)" / sorted input / "smallest value such that predicate is true"',
    candidates: ['Binary search (classic, first-true, answer-space)'],
  },
  {
    signal: 'Unweighted graph shortest path / level-order traversal',
    candidates: ['BFS'],
  },
  {
    signal: 'Exhaustively explore / tree traversal / topological problems on DAGs',
    candidates: ['DFS'],
  },
  {
    signal: 'Generate all combinations / permutations / valid configurations',
    candidates: ['Backtracking'],
  },
  {
    signal: '"Next greater / smaller element" / histogram rectangle / daily temperatures',
    candidates: ['Monotonic stack'],
  },
  {
    signal: 'Dynamic connectivity / merge groups / "are A and B in the same set?"',
    candidates: ['Union-Find'],
  },
  {
    signal: '"Top K" / K most frequent / median from stream',
    candidates: ['Heap / Quickselect'],
  },
  {
    signal: 'Task ordering with dependencies / "is there a cycle in a DAG?"',
    candidates: ['Topological sort (Kahn / DFS)'],
  },
  {
    signal: 'Overlapping intervals / merge intervals / minimum rooms',
    candidates: ['Sort-by-start + sweep'],
  },
  {
    signal: '"Count the number of ways" / optimal sub-structure / overlapping subproblems',
    candidates: ['Dynamic programming'],
  },
  {
    signal: '"Minimum / maximum in a greedy local choice"',
    candidates: ['Greedy (prove exchange argument)'],
  },
  {
    signal: 'XOR to find unique / count set bits / subset enumeration via bitmask',
    candidates: ['Bit manipulation'],
  },
];

export const edgeCaseChecklist: string[] = [
  'Empty input',
  'Single element',
  'All identical elements',
  'Already sorted / reverse sorted',
  'Duplicate values',
  'Negative values and zero',
  'Very large input (integer overflow risk in mid = (lo + hi) / 2 — use lo + (hi - lo) / 2)',
  'Cycles (in graphs and linked lists)',
  'Disconnected graph components',
  'Recursion depth on pathological inputs',
];

export const complexityRecipes: ComplexityRecipe[] = [
  {
    shape: 'T(n) = T(n/2) + O(1)',
    result: 'O(log n)',
    example: 'Binary search',
  },
  {
    shape: 'T(n) = 2·T(n/2) + O(n)',
    result: 'O(n log n)',
    example: 'Merge sort, quicksort (average)',
  },
  {
    shape: 'T(n) = 2·T(n/2) + O(1)',
    result: 'O(n)',
    example: 'Tree traversal of balanced tree',
  },
  {
    shape: 'T(n) = T(n - 1) + O(n)',
    result: 'O(n²)',
    example: 'Selection sort, naive insertion sort',
  },
  {
    shape: 'T(n) = T(n - 1) + O(1)',
    result: 'O(n)',
    example: 'Linked list traversal',
  },
  {
    shape: 'T(n) = 2·T(n - 1) + O(1)',
    result: 'O(2ⁿ)',
    example: 'Naive Fibonacci without memoization',
  },
];

export const stuckPhrases: string[] = [
  '"Let me re-read the problem and check my assumptions."',
  '"I want to try a smaller example to see the pattern."',
  '"What if I sort first — does that unlock a pattern?"',
  '"Can I trade space for time here?" (e.g., hash map for lookup)',
  '"Is there a way to precompute something so the inner loop is constant time?"',
  '"Let me state the invariant I want to maintain, then design toward it."',
];

export const starTemplate: StarPart[] = [
  {
    letter: 'S',
    label: 'Situation',
    budget: '1–2 sentences',
    hint: 'Context the interviewer needs — team, stakes, constraints. Not your whole org chart.',
  },
  {
    letter: 'T',
    label: 'Task',
    budget: '1 sentence',
    hint: 'What you specifically had to do. Use "I", not "we".',
  },
  {
    letter: 'A',
    label: 'Action',
    budget: '3–5 sentences',
    hint: 'The decisions and trade-offs. This is the heart — spend most of your time here.',
  },
  {
    letter: 'R',
    label: 'Result',
    budget: '1–2 sentences',
    hint: 'Concrete outcome. Numbers when honest, qualitative when not. End with a lesson if you have one.',
  },
];

export const questionsForInterviewer: string[] = [
  'What does a great engineer on your team look like 12 months in?',
  'What is the single biggest technical challenge the team is facing right now?',
  'How are architectural decisions made and documented here?',
  'What is the on-call rotation like, and how do you balance feature work with reliability?',
  'What would success in the first 30 / 60 / 90 days look like for this role?',
];
