import type { SortingAlgorithm } from './types';

export const sortingAlgorithms: SortingAlgorithm[] = [
  {
    name: 'Heap',
    description: 'Uses a binary heap to extract the maximum (or minimum) element and place it in the sorted array.',
    time: { best: 'Ω(n log(n))', average: 'Θ(n log(n))', worst: 'O(n log(n))' },
    space: { worst: 'O(1)' },
    seniorInsight:
      'The only O(n log n) comparison sort that is strictly in-place (O(1) aux). Not stable. Loses to merge-sort and quicksort in wall-clock time because of poor cache behavior — the sift-down jumps around the array.',
    commonTraps: [
      'Assuming it is stable — it is not',
      'Using it when the array fits in cache and quicksort would be ~2× faster',
    ],
    followUps: [
      'Why is heap-sort slower than quicksort in practice despite the same asymptotic bound?',
    ],
  },
  {
    name: 'Merge',
    description: 'Divides the array, recursively sorts halves, and merges them.',
    time: { best: 'Ω(n log(n))', average: 'Θ(n log(n))', worst: 'O(n log(n))' },
    space: { worst: 'O(n)' },
    seniorInsight:
      'Stable and O(n log n) worst-case — the canonical choice when stability matters or you need guaranteed performance. The O(n) extra space rules it out for memory-constrained environments. External sort (sorting data that does not fit in RAM) is always merge-based.',
    commonTraps: [
      'Allocating a new temp array on every recursive call — allocate once at the top',
      'Forgetting that the merge itself is O(n) — the "log n" comes from the recursion depth, not the merge',
    ],
    followUps: [
      'How would you sort a 100 GB file on a machine with 16 GB of RAM?',
      'What makes merge-sort stable, and what would break that?',
    ],
  },
  {
    name: 'Quick',
    description: 'Chooses a pivot, partitions the array, and recursively sorts partitions.',
    time: { best: 'Ω(n log(n))', average: 'Θ(n log(n))', worst: 'O(n²)' },
    space: { worst: 'O(log(n))' },
    seniorInsight:
      'Fastest comparison sort in practice on random data — cache-friendly, in-place (ignoring the O(log n) stack). The worst-case O(n²) is what pivot-choice strategies (median-of-three, randomized) defend against. Not stable.',
    commonTraps: [
      'Using the first / last element as pivot on already-sorted input — degrades to O(n²)',
      'Recursing on the larger partition first — blows the stack; always recurse on the smaller',
      'Claiming stability — quicksort is not stable unless you go out of your way',
    ],
    followUps: [
      'How does Introsort combine quicksort with heapsort to guarantee O(n log n)?',
      'Implement quickselect — how does it differ from quicksort in complexity?',
    ],
  },
  {
    name: 'Tree',
    description: 'A sorting algorithm that builds a binary search tree from the elements to be sorted, then traverses the tree to retrieve the elements in sorted order.',
    time: { best: 'Ω(n log(n))', average: 'Θ(n log(n))', worst: 'O(n²)' },
    space: { worst: 'O(n)' },
  },
  {
    name: 'Comb',
    description: 'Improves upon bubble sort by using a gap sequence to eliminate turtles, or small values near the end of the list, which slows down the sorting process in bubble sort.',
    time: { best: 'Ω(n log(n))', average: 'Θ(n²)', worst: 'O(n²)' },
    space: { worst: 'O(1)' },
  },
  {
    name: 'Shell',
    description: 'Extension of insertion sort that allows the exchange of items that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reduces the gap between elements to be compared.',
    time: { best: 'Ω(n log(n))', average: 'Θ((n log(n))²)', worst: 'O(n(log(n))²)' },
    space: { worst: 'O(1)' },
  },
  {
    name: 'Cube',
    description: 'Operates by recursively dividing the array into sub-cubes, sorting each cube individually, and then merging them back together, offering a balance between time complexity and space complexity.',
    time: { best: 'Ω(n)', average: 'Θ(n log(n))', worst: 'O(n log(n))' },
    space: { worst: 'O(n)' },
  },
  {
    name: 'Tim',
    description: 'A hybrid sorting algorithm derived from merge sort and insertion sort, designed to perform well on real-world data and exploit existing order in the input sequence.',
    time: { best: 'Ω(n)', average: 'Θ(n log(n))', worst: 'O(n log(n))' },
    space: { worst: 'O(n)' },
    seniorInsight:
      'The default sort in Python, Java (objects), and V8. Exploits "runs" — already-sorted subsequences — giving O(n) on nearly-sorted input. Stable, which is why Java uses it for objects but Dual-Pivot Quicksort for primitives.',
    commonTraps: [
      'Writing a custom comparator that is not a total order — Timsort (and every comparison sort) will misbehave',
    ],
    followUps: [
      'Why does Java use Timsort for Object[] but Dual-Pivot Quicksort for int[]?',
      'What is a "run" in Timsort and how does it accelerate nearly-sorted input?',
    ],
  },
  {
    name: 'Bubble',
    description: 'Repeatedly compares adjacent elements and swaps them if they are in the wrong order.',
    time: { best: 'Ω(n)', average: 'Θ(n²)', worst: 'O(n²)' },
    space: { worst: 'O(1)' },
  },
  {
    name: 'Insertion',
    description: 'Builds the final sorted array one element at a time by inserting each element into its position.',
    time: { best: 'Ω(n)', average: 'Θ(n²)', worst: 'O(n²)' },
    space: { worst: 'O(1)' },
  },
  {
    name: 'Selection',
    description: 'Finds the smallest (or largest) element and places it at the beginning (or end) of the array.',
    time: { best: 'Ω(n²)', average: 'Θ(n²)', worst: 'O(n²)' },
    space: { worst: 'O(1)' },
  },
  {
    name: 'Bucket',
    description: 'Divides the input array into a number of buckets, each of which is then sorted individually, typically with another sorting algorithm or by recursively applying bucket sort.',
    time: { best: 'Ω(n + k)', average: 'Θ(n + k)', worst: 'O(n²)' },
    space: { worst: 'O(n)' },
  },
  {
    name: 'Counting',
    description: 'An integer sorting algorithm that works by determining the number of objects having distinct key values and using arithmetic to determine their position in the output array.',
    time: { best: 'Ω(n + k)', average: 'Θ(n + k)', worst: 'O(n + k)' },
    space: { worst: 'O(k)' },
  },
  {
    name: 'Radix',
    description: 'Sorts based on individual digits or characters, from least to most significant.',
    time: { best: 'Ω(nk)', average: 'Θ(nk)', worst: 'O(nk)' },
    space: { worst: 'O(n + k)' },
  },
];
