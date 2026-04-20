import type { DataStructure } from "./types";

export const dataStructures: DataStructure[] = [
  {
    name: "Array",
    shape: "Array.png",
    group: "List",
    description:
      "A collection of elements, each identified by an index or a key",
    time: {
      average: {
        access: "Θ(1)",
        search: "Θ(n)",
        insertion: "Θ(n)",
        deletion: "Θ(n)",
      },
      worst: {
        access: "O(1)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "Contiguous memory is the secret. Access is O(1) because the CPU computes `base + i · stride` and prefetches the next cache line — linked lists lose on every traversal for the same Big-O because they thrash the cache. In realtime systems, pre-size the array or use a ring buffer to avoid the O(n) doubling spike that tail-latency charts will show.",
    commonTraps: [
      "Mid-array insert / delete is O(n), even though access is O(1)",
      "Treating amortized O(1) append as if every single append is O(1) — one in log₂n calls is O(n)",
    ],
    followUps: [
      "When would a linked list actually beat a dynamic array in practice?",
      "How does cache-line size (typically 64 bytes) affect the constant factor?",
    ],
  },
  {
    name: "Stack",
    shape: "Stack.png",
    group: "List",
    description: "Follows the Last-In-First-Out (LIFO) principle",
    time: {
      average: {
        access: "Θ(n)",
        search: "Θ(n)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "Recursive algorithms quietly use the program call stack as this data structure — so any recursive DFS is one stack-overflow away from the same bug that explicit iterative DFS avoids. Reach for an explicit stack when depth might exceed ~10k frames.",
    commonTraps: [
      "Not handling the empty-stack case on pop / peek (language-dependent: None vs exception)",
      "Using a stack where a monotonic stack would solve the problem in O(n) amortized",
    ],
    followUps: [
      "How would you evaluate an expression in reverse Polish notation?",
      "When would you prefer a deque over a stack for LIFO work?",
    ],
  },
  {
    name: "Queue",
    shape: "Queue.png",
    group: "List",
    description: "Follows the First-In-First-Out (FIFO) principle",
    time: {
      average: {
        access: "Θ(n)",
        search: "Θ(n)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "An unbounded queue is a latent memory leak — producers faster than consumers will consume all RAM. Production queues always have a bound, plus a policy for what to do when full (backpressure, drop-oldest, drop-newest, block).",
    commonTraps: [
      "Using a plain list as a queue in Python (`pop(0)` is O(n)) — use `collections.deque`",
      "Treating an in-process queue as a message broker without durability guarantees",
    ],
    followUps: [
      "Implement a circular queue in a fixed-size array",
      "What does a bounded queue give you that an unbounded one does not?",
    ],
  },
  {
    name: "Deque",
    shape: "Queue.png",
    group: "List",
    description:
      "A double-ended queue that allows insertion and deletion at both the front and back",
    time: {
      average: {
        access: "Θ(n)",
        search: "Θ(n)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Vector",
    shape: "Array.png",
    group: "List",
    description:
      "A dynamic array that automatically resizes itself when elements are added or removed",
    time: {
      average: {
        access: "Θ(1)",
        search: "Θ(n)",
        insertion: "Θ(n)",
        deletion: "Θ(n)",
      },
      worst: {
        access: "O(1)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Single-Linked-List",
    shape: "Single-Linked-List.png",
    group: "List",
    description:
      "Consists of nodes, each containing data and a reference to the next node. It allows efficient insertion and deletion at the head or tail",
    time: {
      average: {
        access: "Θ(n)",
        search: "Θ(n)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "The O(1) insert is only at the head (or at a known node) — arbitrary-position insert still requires an O(n) traversal to find the predecessor. The cache-unfriendly layout makes linked lists slower than arrays in practice for almost all workloads. Real wins: constant-time splicing of known nodes (LRU cache), persistent data structures, intrusive lists in kernels.",
    commonTraps: [
      "Losing the head reference while reversing — always save `next` before updating a pointer",
      "Leaking the predecessor's `next` pointer when deleting a node in the middle",
    ],
    followUps: [
      "Reverse a linked list iteratively and recursively — complexity of each?",
      "Why does LRU cache use a doubly-linked list specifically?",
    ],
  },
  {
    name: "Double-Linked-List",
    shape: "Double-Linked-List.png",
    group: "List",
    description:
      "Extends the single-linked list by having references to both the next and previous nodes. It enables bidirectional traversal",
    time: {
      average: {
        access: "Θ(n)",
        search: "Θ(n)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Skip-List",
    shape: "Skip-List.png",
    group: "List",
    description:
      "Probabilistic data structure, it uses multiple levels of linked lists",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n log(n))" },
  },
  {
    name: "Binary-Search-Tree",
    shape: "Binary-AVL-Tree.png",
    group: "Tree",
    description: "Consists of nodes, each having at most two children",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "A plain BST degrades to a linked list under sorted insertion — worst case O(n) per op. Production code always uses a self-balancing variant (Red-Black, AVL, B-tree). Java's `TreeMap` uses Red-Black because it tolerates more imbalance per rotation than AVL, giving faster writes; AVL wins on read-heavy workloads.",
    commonTraps: [
      "Using a plain BST for unsorted input without noticing the adversarial case",
      "Deleting a node with two children without the predecessor / successor swap",
    ],
    followUps: [
      "Why Red-Black over AVL in most stdlibs?",
      "How do B-trees trade node fan-out for fewer disk seeks?",
    ],
  },
  {
    name: "Cartesian-Tree",
    shape: "Cartesian-Tree.png",
    group: "Tree",
    description:
      "Binary tree where the values of nodes satisfy the heap property with respect to both the parent and the child",
    time: {
      average: {
        access: "N/A",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "N/A",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "B-Tree",
    shape: "B-Tree.png",
    group: "Tree",
    description:
      "Self-balancing tree structure that maintains sorted data and is commonly used in databases and file systems",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(log(n))",
        search: "O(log(n))",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Red-Black-Tree",
    shape: "Red-Black-Tree.png",
    group: "Tree",
    description:
      "Self-balancing binary search tree that maintains balance through color-coded nodes",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(log(n))",
        search: "O(log(n))",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Splay-Tree",
    shape: "Splay-Tree.png",
    group: "Tree",
    description:
      "Self-adjusting binary search tree. It reorganizes itself during operations to improve access times for frequently accessed nodes",
    time: {
      average: {
        access: "N/A",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "N/A",
        search: "O(log(n))",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "AVL-Tree",
    shape: "Binary-AVL-Tree.png",
    group: "Tree",
    description:
      "Self-balancing binary search tree. It ensures that the height difference between left and right subtrees is at most one",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(log(n))",
        search: "O(log(n))",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "KD-Tree",
    shape: "KD-Tree.png",
    group: "Tree",
    description:
      "Binary tree used for efficient multidimensional data search. It partitions space into regions based on data points",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Min-Heap",
    shape: "Min-Heap.png",
    group: "Tree",
    description: "The parent is less than or equal to its children",
    time: {
      average: {
        access: "Θ(1)",
        search: "Θ(n)",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(1)",
        search: "O(n)",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "Binary heaps are stored as arrays: index i has children 2i+1 and 2i+2. That's why the constant factor is tiny and the structure fits in cache. For Top-K problems, a size-K heap beats a full sort at O(n log k) — mentioning this out loud signals seniority.",
    commonTraps: [
      "Forgetting Python's `heapq` is a min-heap only — invert signs for max-heap behavior",
      "Using a heap to find the median of a stream with just one heap (two heaps are required)",
    ],
    followUps: [
      "Implement a priority queue with custom keys",
      "Streaming median: why two heaps and how do you keep them balanced?",
    ],
  },
  {
    name: "Max-Heap",
    shape: "Max-Heap.png",
    group: "Tree",
    description: "The parent is greater than or equal to its children",
    time: {
      average: {
        access: "Θ(1)",
        search: "Θ(n)",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(1)",
        search: "O(n)",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Segment-Tree",
    shape: "Binary-AVL-Tree.png",
    group: "Tree",
    description:
      "A binary tree used for storing intervals or segments, allowing efficient range queries and updates",
    time: {
      average: {
        access: "Θ(log(n))",
        search: "Θ(log(n))",
        insertion: "Θ(log(n))",
        deletion: "Θ(log(n))",
      },
      worst: {
        access: "O(log(n))",
        search: "O(log(n))",
        insertion: "O(log(n))",
        deletion: "O(log(n))",
      },
    },
    space: { worst: "O(n)" },
  },
  {
    name: "Hash-Table",
    shape: "Hash-Table.png",
    group: "Other",
    description: "Uses a hash function to map keys to indices in an array",
    time: {
      average: {
        access: "N/A",
        search: "Θ(1)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "N/A",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
    },
    space: { worst: "O(n)" },
    seniorInsight:
      "Amortized O(1), but the worst case is O(n) under collisions or adversarial input — hash-flooding DoS attacks exploit this, which is why runtimes use randomized hash seeds. Resize is O(n) and stops the world: in latency-sensitive code, pre-size with an expected capacity.",
    commonTraps: [
      "Using as an unbounded cache — memory grows without bound (see LRU / LFU)",
      "Mutating a key after insertion — the entry becomes unreachable",
      "Iteration order is not insertion order in older languages (Python 3.7+ preserves it; Go randomizes it intentionally)",
    ],
    followUps: [
      "Implement an LRU cache on top of a hash map + doubly-linked list",
      "Open addressing vs separate chaining — which is faster and when?",
      "What is hash flooding and how does SipHash mitigate it?",
    ],
  },
  {
    name: "Graph",
    shape: "Graph.png",
    group: "Other",
    description: "Consists of nodes connected by edges",
    time: {
      average: {
        access: "Θ(1)",
        search: "Θ(V + E)",
        insertion: "Θ(1)",
        deletion: "Θ(1)",
      },
      worst: {
        access: "O(1)",
        search: "O(V + E)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
    },
    space: { worst: "O(V + E)" },
    seniorInsight:
      "Representation choice dominates complexity. Adjacency list is O(V + E) space — right for sparse graphs. Adjacency matrix is O(V²) space with O(1) edge-existence checks — right for dense graphs or when you're doing many edge queries.",
    commonTraps: [
      "Using BFS on a weighted graph for shortest path — it's wrong; use Dijkstra",
      "Forgetting that undirected edges must be added in both directions in an adjacency list",
    ],
    followUps: [
      "When does Bellman-Ford beat Dijkstra?",
      "Detect a cycle in a directed vs undirected graph — different approaches, why?",
    ],
  },
];

// Helper to get unique groups
export const dataStructureGroups = [
  ...new Set(dataStructures.map((ds) => ds.group)),
];
