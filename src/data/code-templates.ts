import type { CodeTemplate } from './types';

// Canonical, interview-grade templates. Kept short so they fit on one screen
// and are memorizable. Each is the minimal correct shape of the pattern, not
// a fully-featured library version.

export const codeTemplates: CodeTemplate[] = [
  {
    id: 'tpl-two-pointer',
    patternId: 'two-pointer',
    languages: [
      {
        lang: 'python',
        code: `# Opposite-ends: pair sum in a sorted array.
def two_sum_sorted(nums: list[int], target: int) -> tuple[int, int] | None:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return (lo, hi)
        if s < target:
            lo += 1
        else:
            hi -= 1
    return None`,
      },
      {
        lang: 'typescript',
        code: `// Opposite-ends: pair sum in a sorted array.
function twoSumSorted(nums: number[], target: number): [number, number] | null {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const s = nums[lo] + nums[hi];
    if (s === target) return [lo, hi];
    if (s < target) lo++;
    else hi--;
  }
  return null;
}`,
      },
    ],
  },
  {
    id: 'tpl-sliding-window',
    patternId: 'sliding-window',
    languages: [
      {
        lang: 'python',
        code: `# Variable-size window: longest substring with at most K distinct chars.
from collections import defaultdict

def longest_k_distinct(s: str, k: int) -> int:
    counts: dict[str, int] = defaultdict(int)
    left = best = 0
    for right, ch in enumerate(s):
        counts[ch] += 1
        while len(counts) > k:
            counts[s[left]] -= 1
            if counts[s[left]] == 0:
                del counts[s[left]]
            left += 1
        best = max(best, right - left + 1)
    return best`,
      },
      {
        lang: 'typescript',
        code: `// Variable-size window: longest substring with at most K distinct chars.
function longestKDistinct(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
    while (counts.size > k) {
      const lc = s[left];
      counts.set(lc, counts.get(lc)! - 1);
      if (counts.get(lc) === 0) counts.delete(lc);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
    ],
  },
  {
    id: 'tpl-fast-slow',
    patternId: 'fast-slow',
    languages: [
      {
        lang: 'python',
        code: `# Floyd's cycle detection on a linked list.
class Node:
    def __init__(self, val: int, nxt: 'Node | None' = None):
        self.val, self.next = val, nxt

def has_cycle(head: Node | None) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
      },
      {
        lang: 'typescript',
        code: `// Floyd's cycle detection on a linked list.
class Node {
  constructor(public val: number, public next: Node | null = null) {}
}

function hasCycle(head: Node | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      },
    ],
  },
  {
    id: 'tpl-binary-search',
    patternId: 'binary-search',
    languages: [
      {
        lang: 'python',
        code: `# "First true" — generalized binary search on a monotone predicate.
# Works for the classic case and for "answer space" problems.
def first_true(lo: int, hi: int, pred) -> int:
    # Invariant: pred(hi) must be True; result is in [lo, hi].
    while lo < hi:
        mid = lo + (hi - lo) // 2  # overflow-safe form
        if pred(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      {
        lang: 'typescript',
        code: `// "First true" — generalized binary search on a monotone predicate.
function firstTrue(lo: number, hi: number, pred: (x: number) => boolean): number {
  // Invariant: pred(hi) must be true; result is in [lo, hi].
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2); // overflow-safe form
    if (pred(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
      },
    ],
  },
  {
    id: 'tpl-bfs',
    patternId: 'bfs',
    languages: [
      {
        lang: 'python',
        code: `# Shortest path in an unweighted graph (adjacency list).
from collections import deque

def shortest_path(graph: dict[int, list[int]], src: int, dst: int) -> int:
    if src == dst:
        return 0
    seen = {src}
    q: deque[tuple[int, int]] = deque([(src, 0)])
    while q:
        node, dist = q.popleft()
        for nxt in graph.get(node, []):
            if nxt == dst:
                return dist + 1
            if nxt not in seen:
                seen.add(nxt)
                q.append((nxt, dist + 1))
    return -1`,
      },
      {
        lang: 'typescript',
        code: `// Shortest path in an unweighted graph (adjacency list).
function shortestPath(graph: Map<number, number[]>, src: number, dst: number): number {
  if (src === dst) return 0;
  const seen = new Set<number>([src]);
  const q: [number, number][] = [[src, 0]];
  let head = 0;
  while (head < q.length) {
    const [node, dist] = q[head++];
    for (const nxt of graph.get(node) ?? []) {
      if (nxt === dst) return dist + 1;
      if (!seen.has(nxt)) {
        seen.add(nxt);
        q.push([nxt, dist + 1]);
      }
    }
  }
  return -1;
}`,
      },
    ],
  },
  {
    id: 'tpl-dfs',
    patternId: 'dfs',
    languages: [
      {
        lang: 'python',
        code: `# DFS on a graph with visited set — iterative with explicit stack.
def dfs(graph: dict[int, list[int]], start: int) -> list[int]:
    seen, order, stack = {start}, [], [start]
    while stack:
        node = stack.pop()
        order.append(node)
        for nxt in graph.get(node, []):
            if nxt not in seen:
                seen.add(nxt)
                stack.append(nxt)
    return order`,
      },
      {
        lang: 'typescript',
        code: `// DFS on a graph with visited set — iterative with explicit stack.
function dfs(graph: Map<number, number[]>, start: number): number[] {
  const seen = new Set<number>([start]);
  const order: number[] = [];
  const stack: number[] = [start];
  while (stack.length) {
    const node = stack.pop()!;
    order.push(node);
    for (const nxt of graph.get(node) ?? []) {
      if (!seen.has(nxt)) {
        seen.add(nxt);
        stack.push(nxt);
      }
    }
  }
  return order;
}`,
      },
    ],
  },
  {
    id: 'tpl-backtracking',
    patternId: 'backtracking',
    languages: [
      {
        lang: 'python',
        code: `# Generate all subsets via choose / explore / unchoose.
def subsets(nums: list[int]) -> list[list[int]]:
    out: list[list[int]] = []
    path: list[int] = []

    def backtrack(start: int) -> None:
        out.append(path.copy())
        for i in range(start, len(nums)):
            path.append(nums[i])          # choose
            backtrack(i + 1)              # explore
            path.pop()                    # unchoose

    backtrack(0)
    return out`,
      },
      {
        lang: 'typescript',
        code: `// Generate all subsets via choose / explore / unchoose.
function subsets(nums: number[]): number[][] {
  const out: number[][] = [];
  const path: number[] = [];

  const backtrack = (start: number): void => {
    out.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);        // choose
      backtrack(i + 1);          // explore
      path.pop();                // unchoose
    }
  };

  backtrack(0);
  return out;
}`,
      },
    ],
  },
  {
    id: 'tpl-monotonic-stack',
    patternId: 'monotonic-stack',
    languages: [
      {
        lang: 'python',
        code: `# Next greater element for each index (-1 if none).
def next_greater(nums: list[int]) -> list[int]:
    out = [-1] * len(nums)
    stack: list[int] = []  # indices with strictly-decreasing values
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            out[stack.pop()] = x
        stack.append(i)
    return out`,
      },
      {
        lang: 'typescript',
        code: `// Next greater element for each index (-1 if none).
function nextGreater(nums: number[]): number[] {
  const out = new Array(nums.length).fill(-1);
  const stack: number[] = []; // indices with strictly-decreasing values
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      out[stack.pop()!] = nums[i];
    }
    stack.push(i);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'tpl-union-find',
    patternId: 'union-find',
    languages: [
      {
        lang: 'python',
        code: `# Union-Find with path compression and union by rank.
class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
      },
      {
        lang: 'typescript',
        code: `// Union-Find with path compression and union by rank.
class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]]; // path compression
      x = this.parent[x];
    }
    return x;
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    return true;
  }
}`,
      },
    ],
  },
  {
    id: 'tpl-top-k-heap',
    patternId: 'top-k-heap',
    languages: [
      {
        lang: 'python',
        code: `# K largest elements — min-heap of size K.
import heapq

def top_k(nums: list[int], k: int) -> list[int]:
    heap: list[int] = []
    for x in nums:
        if len(heap) < k:
            heapq.heappush(heap, x)
        elif x > heap[0]:
            heapq.heapreplace(heap, x)
    return heap  # K smallest-of-the-top, unordered`,
      },
      {
        lang: 'typescript',
        code: `// K largest elements via an array-backed min-heap — O(n log k).
class MinHeap {
  h: number[] = [];
  size() { return this.h.length; }
  peek() { return this.h[0]; }
  push(x: number) {
    this.h.push(x);
    for (let i = this.h.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop(): number {
    const top = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      for (let i = 0; ; ) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < this.h.length && this.h[l] < this.h[m]) m = l;
        if (r < this.h.length && this.h[r] < this.h[m]) m = r;
        if (m === i) break;
        [this.h[i], this.h[m]] = [this.h[m], this.h[i]];
        i = m;
      }
    }
    return top;
  }
}

function topK(nums: number[], k: number): number[] {
  const heap = new MinHeap();
  for (const x of nums) {
    if (heap.size() < k) heap.push(x);
    else if (x > heap.peek()) { heap.pop(); heap.push(x); }
  }
  return heap.h; // K largest, unordered
}`,
      },
    ],
  },
  {
    id: 'tpl-topo-sort',
    patternId: 'topological-sort',
    languages: [
      {
        lang: 'python',
        code: `# Kahn's algorithm: topological order of a DAG. Returns [] if a cycle exists.
from collections import deque

def topo_sort(n: int, edges: list[tuple[int, int]]) -> list[int]:
    graph: dict[int, list[int]] = {i: [] for i in range(n)}
    indeg = [0] * n
    for u, v in edges:
        graph[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order: list[int] = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in graph[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return order if len(order) == n else []`,
      },
      {
        lang: 'typescript',
        code: `// Kahn's algorithm: topological order of a DAG. Returns [] if a cycle exists.
function topoSort(n: number, edges: [number, number][]): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v] of edges) {
    graph[u].push(v);
    indeg[v]++;
  }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  let head = 0;
  while (head < q.length) {
    const node = q[head++];
    order.push(node);
    for (const nxt of graph[node]) {
      if (--indeg[nxt] === 0) q.push(nxt);
    }
  }
  return order.length === n ? order : [];
}`,
      },
    ],
  },
  {
    id: 'tpl-intervals',
    patternId: 'intervals',
    languages: [
      {
        lang: 'python',
        code: `# Merge overlapping intervals.
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda iv: iv[0])
    merged: list[list[int]] = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
      },
      {
        lang: 'typescript',
        code: `// Merge overlapping intervals.
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}`,
      },
    ],
  },
  {
    id: 'tpl-dp-knapsack',
    patternId: 'dp',
    languages: [
      {
        lang: 'python',
        code: `# 0/1 knapsack with a 1-D rolling array.
# Key trick: iterate capacity in REVERSE so each item is used at most once.
def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for w, v in zip(weights, values):
        for c in range(capacity, w - 1, -1):  # reverse!
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[capacity]`,
      },
      {
        lang: 'typescript',
        code: `// 0/1 knapsack with a 1-D rolling array.
// Key trick: iterate capacity in REVERSE so each item is used at most once.
function knapsack(weights: number[], values: number[], capacity: number): number {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    for (let c = capacity; c >= w; c--) {   // reverse!
      dp[c] = Math.max(dp[c], dp[c - w] + v);
    }
  }
  return dp[capacity];
}`,
      },
    ],
  },
  {
    id: 'tpl-greedy',
    patternId: 'greedy',
    languages: [
      {
        lang: 'python',
        code: `# Meeting-room count: the classic greedy-over-sorted-events pattern.
def min_meeting_rooms(intervals: list[list[int]]) -> int:
    starts = sorted(iv[0] for iv in intervals)
    ends = sorted(iv[1] for iv in intervals)
    rooms = max_rooms = 0
    j = 0
    for s in starts:
        if s < ends[j]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
        else:
            j += 1
    return max_rooms`,
      },
      {
        lang: 'typescript',
        code: `// Meeting-room count: the classic greedy-over-sorted-events pattern.
function minMeetingRooms(intervals: number[][]): number {
  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);
  const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b);
  let rooms = 0, maxRooms = 0, j = 0;
  for (const s of starts) {
    if (s < ends[j]) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
    } else {
      j++;
    }
  }
  return maxRooms;
}`,
      },
    ],
  },
  {
    id: 'tpl-bit',
    patternId: 'bit-manipulation',
    languages: [
      {
        lang: 'python',
        code: `# Essential bit idioms.
def count_bits(x: int) -> int:                # popcount
    c = 0
    while x:
        x &= x - 1                            # clears lowest set bit
        c += 1
    return c

def lowest_bit(x: int) -> int:                # isolate lowest set bit
    return x & -x

def single_number(nums: list[int]) -> int:    # every value appears twice except one
    out = 0
    for x in nums:
        out ^= x
    return out`,
      },
      {
        lang: 'typescript',
        code: `// Essential bit idioms.
function countBits(x: number): number {       // popcount
  let c = 0;
  while (x) { x &= x - 1; c++; }              // clears lowest set bit
  return c;
}

function lowestBit(x: number): number {       // isolate lowest set bit
  return x & -x;
}

function singleNumber(nums: number[]): number {  // every value appears twice except one
  let out = 0;
  for (const x of nums) out ^= x;
  return out;
}`,
      },
    ],
  },
];

export const codeTemplateMap: Record<string, CodeTemplate> = Object.fromEntries(
  codeTemplates.map((t) => [t.id, t]),
);
