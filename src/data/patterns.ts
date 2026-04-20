import type { Pattern, PatternCategory } from './types';

// Patterns ordered by interview frequency and conceptual dependency.
// `usesDataStructures` references DataStructure.name slugified for
// future cross-linking (Phase 7 will validate these).

export const patterns: Pattern[] = [
  {
    id: 'two-pointer',
    name: 'Two Pointers',
    category: 'two-pointer',
    signals: [
      'Input is sorted or can be sorted cheaply',
      'Looking for a pair or triple with a property (sum, difference)',
      '"Remove duplicates in-place" / "partition" / "reverse" on an array or string',
    ],
    whenToUse:
      'Two indices walking the array — either from opposite ends (sorted pair-sum) or in the same direction (partition / dedupe). Replaces a nested loop with a single pass.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    templateId: 'tpl-two-pointer',
    pitfalls: [
      'Using on an unsorted array without justification — the invariant collapses',
      'Off-by-one when moving both pointers on equality: decide up front which direction to advance',
    ],
    examples: [
      { title: 'Two Sum II — sorted array', leetcodeNum: 167 },
      { title: '3Sum', leetcodeNum: 15 },
      { title: 'Valid Palindrome', leetcodeNum: 125 },
      { title: 'Remove Duplicates from Sorted Array', leetcodeNum: 26 },
    ],
    usesDataStructures: ['Array'],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'sliding-window',
    signals: [
      '"Contiguous subarray / substring with property X"',
      '"Longest / shortest window such that …"',
      '"At most K distinct" / "sum ≥ target" / "contains all of …"',
    ],
    whenToUse:
      'Maintain a window [left, right] and an invariant about its contents. Expand right each step; shrink left while the invariant breaks.',
    complexity: { time: 'O(n)', space: 'O(k) — usually the window alphabet' },
    templateId: 'tpl-sliding-window',
    pitfalls: [
      'Forgetting to remove the left element from the auxiliary counter when shrinking',
      'Confusing fixed-size windows (always width K) with variable-size (width varies by invariant)',
    ],
    examples: [
      { title: 'Longest Substring Without Repeating Characters', leetcodeNum: 3 },
      { title: 'Minimum Window Substring', leetcodeNum: 76 },
      { title: 'Longest Substring with At Most K Distinct Characters', leetcodeNum: 340 },
      { title: 'Maximum Sum Subarray of Size K', note: 'fixed window' },
    ],
    usesDataStructures: ['Array', 'Hash-Table'],
  },
  {
    id: 'fast-slow',
    name: 'Fast / Slow Pointers',
    category: 'fast-slow',
    signals: [
      'Linked-list cycle detection',
      '"Find the middle / Nth-from-end" of a linked list in one pass',
      'Happy-number / sequence-cycle problems on functional graphs',
    ],
    whenToUse:
      'Two pointers on the same structure moving at different speeds. The fast one laps the slow one iff there is a cycle; when the fast one reaches the end the slow one is at the midpoint.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    templateId: 'tpl-fast-slow',
    pitfalls: [
      'Checking `fast` without also checking `fast.next` — null-deref on odd-length lists',
      'Claiming a cycle exists when what you actually detected is a meet point inside one',
    ],
    examples: [
      { title: 'Linked List Cycle', leetcodeNum: 141 },
      { title: 'Linked List Cycle II — find cycle start', leetcodeNum: 142 },
      { title: 'Middle of the Linked List', leetcodeNum: 876 },
      { title: 'Happy Number', leetcodeNum: 202 },
    ],
    usesDataStructures: ['Single-Linked-List'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'binary-search',
    signals: [
      'Sorted input + O(log n) target',
      '"Smallest / largest X such that predicate(X) is true" — even when the array is not sorted',
      'Search on the answer space (min capacity, min days, min speed)',
    ],
    whenToUse:
      'Any time a monotone predicate splits the search space into no / … / no / yes / … / yes. Use the "first true" form — it generalizes cleaner than the classic low/high/mid with three branches.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    templateId: 'tpl-binary-search',
    pitfalls: [
      'Integer overflow in `(lo + hi) / 2` — use `lo + (hi - lo) / 2`',
      'Infinite loop from `lo = mid` instead of `lo = mid + 1` when the predicate is false at mid',
      'Forgetting the monotonicity requirement — predicate must go from false → true exactly once',
    ],
    examples: [
      { title: 'Binary Search', leetcodeNum: 704 },
      { title: 'Find First and Last Position of Element in Sorted Array', leetcodeNum: 34 },
      { title: 'Koko Eating Bananas', leetcodeNum: 875, note: 'answer-space search' },
      { title: 'Capacity to Ship Packages Within D Days', leetcodeNum: 1011 },
    ],
    usesDataStructures: ['Array'],
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'bfs',
    signals: [
      'Shortest path in an unweighted graph or grid',
      '"Minimum number of steps / transformations"',
      'Level-order traversal on a tree',
    ],
    whenToUse:
      'Explore the graph layer by layer using a queue. First time you reach the target, you have the shortest path in terms of edges.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    templateId: 'tpl-bfs',
    pitfalls: [
      'Forgetting to mark nodes as seen at enqueue time — same node goes on the queue multiple times and memory explodes',
      'Using on weighted graphs — BFS solves unweighted shortest path only. Weighted → Dijkstra',
    ],
    examples: [
      { title: 'Binary Tree Level Order Traversal', leetcodeNum: 102 },
      { title: 'Word Ladder', leetcodeNum: 127 },
      { title: 'Rotting Oranges', leetcodeNum: 994 },
      { title: 'Shortest Path in Binary Matrix', leetcodeNum: 1091 },
    ],
    usesDataStructures: ['Queue', 'Graph'],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'dfs',
    signals: [
      'Tree / graph traversal where depth matters or you need full exploration',
      '"Count connected components" / "is there a path from A to B?"',
      'Tree recursion (subtree properties, path sums)',
    ],
    whenToUse:
      'Explore as deep as possible before backtracking. Recursive form is concise but watch the call-stack depth; iterative with an explicit stack is safer for large inputs.',
    complexity: { time: 'O(V + E)', space: 'O(V) — recursion stack or explicit stack' },
    templateId: 'tpl-dfs',
    pitfalls: [
      'Stack overflow on deep recursive DFS — switch to iterative or raise the recursion limit explicitly',
      'Mutating the visited set across unrelated branches in recursion — pass copies or restore state',
    ],
    examples: [
      { title: 'Number of Islands', leetcodeNum: 200 },
      { title: 'Clone Graph', leetcodeNum: 133 },
      { title: 'Path Sum', leetcodeNum: 112 },
      { title: 'Validate Binary Search Tree', leetcodeNum: 98 },
    ],
    usesDataStructures: ['Stack', 'Graph', 'Binary-Search-Tree'],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'backtracking',
    signals: [
      '"Generate all combinations / permutations / subsets"',
      '"Find all valid configurations" (N-Queens, sudoku, word break)',
      'Constraint satisfaction over a small search space',
    ],
    whenToUse:
      'Enumerate candidates via a recursive choose → explore → unchoose pattern. Prune aggressively; the base is usually "candidate is complete" or "candidate violates a constraint".',
    complexity: { time: 'Exponential — O(b^d) where b = branching, d = depth', space: 'O(d) recursion depth' },
    templateId: 'tpl-backtracking',
    pitfalls: [
      'Appending the mutable path to the results list instead of a copy — all outputs end up equal',
      'Missing the unchoose step — state leaks into the next branch',
      'No pruning — the search explodes on inputs where pruning would have been cheap',
    ],
    examples: [
      { title: 'Subsets', leetcodeNum: 78 },
      { title: 'Permutations', leetcodeNum: 46 },
      { title: 'Combination Sum', leetcodeNum: 39 },
      { title: 'N-Queens', leetcodeNum: 51 },
    ],
    usesDataStructures: [],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'monotonic-stack',
    signals: [
      '"Next greater / next smaller element"',
      '"Largest rectangle in histogram"',
      'Problems about spans, temperatures, or visibility',
    ],
    whenToUse:
      'Maintain a stack whose values are strictly increasing or decreasing. Pop while the incoming value breaks the invariant — the popped elements have found their answer.',
    complexity: { time: 'O(n) — amortized; each index pushed and popped at most once', space: 'O(n)' },
    templateId: 'tpl-monotonic-stack',
    pitfalls: [
      'Storing values instead of indices when indices are what you need for span / distance questions',
      'Using `<` vs `<=` incorrectly — strict vs non-strict changes the behavior on duplicates',
    ],
    examples: [
      { title: 'Daily Temperatures', leetcodeNum: 739 },
      { title: 'Next Greater Element I', leetcodeNum: 496 },
      { title: 'Largest Rectangle in Histogram', leetcodeNum: 84 },
      { title: 'Trapping Rain Water', leetcodeNum: 42 },
    ],
    usesDataStructures: ['Stack'],
  },
  {
    id: 'union-find',
    name: 'Union-Find (DSU)',
    category: 'union-find',
    signals: [
      'Dynamic connectivity — "are A and B in the same group?"',
      'Count connected components under incremental unions',
      'Kruskal\'s MST, cycle detection in an undirected graph',
    ],
    whenToUse:
      'Each element points to a parent; `find` returns the root (with path compression); `union` merges two trees (by rank). Near-O(1) per op amortized with both optimizations.',
    complexity: { time: 'O(α(n)) per op — effectively constant', space: 'O(n)' },
    templateId: 'tpl-union-find',
    pitfalls: [
      'Omitting path compression — single operations degrade to O(log n), worst-case O(n)',
      'Reading from `parent[x]` directly instead of calling `find(x)` — gives a stale root',
    ],
    examples: [
      { title: 'Number of Provinces', leetcodeNum: 547 },
      { title: 'Graph Valid Tree', leetcodeNum: 261 },
      { title: 'Accounts Merge', leetcodeNum: 721 },
      { title: 'Redundant Connection', leetcodeNum: 684 },
    ],
    usesDataStructures: [],
  },
  {
    id: 'top-k-heap',
    name: 'Top-K / Heap',
    category: 'top-k-heap',
    signals: [
      '"K largest / smallest / most frequent"',
      'Streaming median',
      '"Merge K sorted lists"',
    ],
    whenToUse:
      'Min-heap of size K for K largest (invariant: heap holds the K biggest seen so far). Two heaps for a streaming median (max-heap of lower half, min-heap of upper half).',
    complexity: { time: 'O(n log k)', space: 'O(k)' },
    templateId: 'tpl-top-k-heap',
    pitfalls: [
      'Using a full sort when a size-K heap would be O(n log k) — pointing this out signals seniority',
      'Forgetting that Python\'s `heapq` is a min-heap — invert signs for a max-heap',
    ],
    examples: [
      { title: 'Top K Frequent Elements', leetcodeNum: 347 },
      { title: 'Kth Largest Element in an Array', leetcodeNum: 215 },
      { title: 'Merge k Sorted Lists', leetcodeNum: 23 },
      { title: 'Find Median from Data Stream', leetcodeNum: 295 },
    ],
    usesDataStructures: ['Min-Heap', 'Max-Heap'],
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'topological-sort',
    signals: [
      'Tasks with dependencies / prerequisite relationships',
      '"Is this schedule possible?" / "Order tasks so each runs after its deps"',
      'Build systems, course schedules, package managers',
    ],
    whenToUse:
      'DAG only — a cycle makes a topological order impossible. Kahn\'s BFS variant also detects cycles (returned order shorter than N).',
    complexity: { time: 'O(V + E)', space: 'O(V + E)' },
    templateId: 'tpl-topo-sort',
    pitfalls: [
      'Running on a graph that might not be a DAG without checking — infinite loop or wrong answer',
      'Using DFS variant and forgetting to reverse the post-order',
    ],
    examples: [
      { title: 'Course Schedule', leetcodeNum: 207 },
      { title: 'Course Schedule II', leetcodeNum: 210 },
      { title: 'Alien Dictionary', leetcodeNum: 269 },
      { title: 'Minimum Height Trees', leetcodeNum: 310 },
    ],
    usesDataStructures: ['Graph', 'Queue'],
  },
  {
    id: 'intervals',
    name: 'Interval Merge / Sweep',
    category: 'intervals',
    signals: [
      'Inputs are ranges / intervals / events',
      '"Merge overlapping"',
      '"Minimum rooms / CPUs / resources"',
    ],
    whenToUse:
      'Sort by start time, then iterate with a running accumulator. For resource-count problems, process start and end events separately as a two-pointer sweep.',
    complexity: { time: 'O(n log n) — dominated by the sort', space: 'O(n)' },
    templateId: 'tpl-intervals',
    pitfalls: [
      'Forgetting to sort first — correctness collapses',
      'Treating touching intervals [1, 2] and [2, 3] as non-overlapping when the problem wants them merged',
    ],
    examples: [
      { title: 'Merge Intervals', leetcodeNum: 56 },
      { title: 'Insert Interval', leetcodeNum: 57 },
      { title: 'Meeting Rooms II', leetcodeNum: 253 },
      { title: 'Non-overlapping Intervals', leetcodeNum: 435 },
    ],
    usesDataStructures: ['Array'],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    category: 'dp',
    signals: [
      '"Count the number of ways" / "Minimum cost to ..." / "Longest ..."',
      'Optimal substructure + overlapping subproblems',
      'Recursion with repeated subtrees',
    ],
    whenToUse:
      'Identify the state (inputs that uniquely determine the subproblem), then the transition. Two canonical shapes: 0/1 knapsack (rolling 1-D array, iterate reverse) and LIS/LCS (2-D table or patience-sort trick).',
    complexity: { time: 'O(n · W) for knapsack-shape; O(n²) for LIS/LCS', space: 'O(W) rolling array' },
    templateId: 'tpl-dp-knapsack',
    pitfalls: [
      'Forward iteration in 0/1 knapsack — an item gets picked multiple times (becomes unbounded knapsack)',
      'Getting the base case wrong — dp[0] for "at most 0 capacity" is not the same as dp[0] for "exactly 0"',
      'Top-down memoization without hashing all state variables — wrong answers from cache collisions',
    ],
    examples: [
      { title: 'Climbing Stairs', leetcodeNum: 70 },
      { title: 'Coin Change', leetcodeNum: 322 },
      { title: 'Longest Increasing Subsequence', leetcodeNum: 300 },
      { title: 'Partition Equal Subset Sum', leetcodeNum: 416, note: '0/1 knapsack' },
      { title: 'Edit Distance', leetcodeNum: 72, note: 'LCS-shape' },
    ],
    usesDataStructures: ['Array'],
  },
  {
    id: 'greedy',
    name: 'Greedy',
    category: 'greedy',
    signals: [
      'You can justify a local choice that is always safe',
      'Sorting the input unlocks an obvious rule (earliest deadline, smallest cost)',
      'Interval scheduling / activity selection',
    ],
    whenToUse:
      'Prove an exchange argument: swapping a non-greedy choice for the greedy one never makes the solution worse. Without the proof, greedy is a guess — mention you would verify with small cases.',
    complexity: { time: 'O(n log n) — usually dominated by a sort', space: 'O(1)' },
    templateId: 'tpl-greedy',
    pitfalls: [
      'Applying greedy where DP is required — counterexample exists but is not obvious on small inputs',
      'Sorting by the wrong key (end time vs start time) — interval scheduling needs end-time sort',
    ],
    examples: [
      { title: 'Assign Cookies', leetcodeNum: 455 },
      { title: 'Jump Game', leetcodeNum: 55 },
      { title: 'Gas Station', leetcodeNum: 134 },
      { title: 'Task Scheduler', leetcodeNum: 621 },
    ],
    usesDataStructures: ['Array'],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    category: 'bit-manipulation',
    signals: [
      '"Every element appears twice except one" — XOR',
      'Subset enumeration via bitmask (n ≤ ~20)',
      'Packing / unpacking small integers into a single machine word',
    ],
    whenToUse:
      'When the state fits in a word and the problem has a natural XOR or bitmask structure. Bit tricks are rare in general SWE interviews but appear in systems-leaning rounds.',
    complexity: { time: 'O(n) or O(n · 2ⁿ) for subset DP', space: 'O(1) or O(2ⁿ)' },
    templateId: 'tpl-bit',
    pitfalls: [
      'Mixing signed and unsigned arithmetic — right shift differs (arithmetic vs logical)',
      'Forgetting operator precedence — `(x & mask) == y` needs parens in C-family languages',
    ],
    examples: [
      { title: 'Single Number', leetcodeNum: 136 },
      { title: 'Number of 1 Bits', leetcodeNum: 191 },
      { title: 'Maximum XOR of Two Numbers in an Array', leetcodeNum: 421 },
      { title: 'Counting Bits', leetcodeNum: 338 },
    ],
    usesDataStructures: [],
  },
];

export const patternMap: Record<string, Pattern> = Object.fromEntries(
  patterns.map((p) => [p.id, p]),
);

export const patternCategoryLabels: Record<PatternCategory, string> = {
  'two-pointer': 'Array Traversal',
  'sliding-window': 'Array Traversal',
  'fast-slow': 'Linked List & Cycles',
  'binary-search': 'Divide & Conquer',
  bfs: 'Graph Traversal',
  dfs: 'Graph Traversal',
  backtracking: 'Search',
  'monotonic-stack': 'Stack-Based',
  'union-find': 'Graph — Connectivity',
  'top-k-heap': 'Heap',
  'topological-sort': 'Graph — Ordering',
  intervals: 'Sorting & Sweep',
  dp: 'Dynamic Programming',
  greedy: 'Greedy',
  'bit-manipulation': 'Bits',
};

// High-level section order for rendering on the page.
export const patternSections: { title: string; patternIds: string[] }[] = [
  {
    title: 'Array & String Traversal',
    patternIds: ['two-pointer', 'sliding-window', 'fast-slow'],
  },
  {
    title: 'Divide & Conquer',
    patternIds: ['binary-search'],
  },
  {
    title: 'Graph Traversal',
    patternIds: ['bfs', 'dfs', 'topological-sort', 'union-find'],
  },
  {
    title: 'Search',
    patternIds: ['backtracking'],
  },
  {
    title: 'Stack & Heap',
    patternIds: ['monotonic-stack', 'top-k-heap'],
  },
  {
    title: 'Sort & Sweep',
    patternIds: ['intervals', 'greedy'],
  },
  {
    title: 'Dynamic Programming',
    patternIds: ['dp'],
  },
  {
    title: 'Bit Manipulation',
    patternIds: ['bit-manipulation'],
  },
];
