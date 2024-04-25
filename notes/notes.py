# https://docs.python.org/3/library/heapq.html#module-heapq
# https://docs.python.org/3/library/bisect.html#module-bisect
# https://docs.python.org/3/library/collections.html#module-collections
# https://docs.python.org/3/library/queue.html#module-queue

# Import heapq module for heap operations
import heapq

# Import bisect module for binary search and insertion
import bisect

# Import collections module for specialized container datatypes
import collections

# Import queue module for thread-safe FIFO queues
import queue

# Example usage of heapq module
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 2)
heapq.heappush(heap, 8)
print(heap)  # Output: [2, 5, 8]

# Example usage of bisect module
sorted_list = [1, 3, 5, 7, 9]
index = bisect.bisect_left(sorted_list, 6)
print(index)  # Output: 3 (index where 6 would be inserted to maintain sorted order)

# Example usage of collections module
counter = collections.Counter(["a", "b", "c", "a", "b", "a"])
print(counter)  # Output: Counter({'a': 3, 'b': 2, 'c': 1})

# Example usage of queue module
q = queue.Queue()
q.put(1)
q.put(2)
q.put(3)
print(q.get())  # Output: 1 (FIFO order)
