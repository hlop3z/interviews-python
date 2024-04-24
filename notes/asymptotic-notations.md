## Asymptotic Notations

| Notation | Name         | Definition                                         |
| -------- | ------------ | -------------------------------------------------- |
| O        | Big-O        | Upper bound (worst-case time complexity)           |
| Ω        | Big-Omega    | Lower bound (best-case time complexity)            |
| Θ        | Big-Theta    | Tight bound (average-case time complexity)         |
| o        | Little-o     | Strictly smaller than upper bound (non-asymptotic) |
| ω        | Little-Omega | Strictly greater than lower bound (non-asymptotic) |

## Examples (1)

| Notation   | Complexity        | Example                     |
| ---------- | ----------------- | --------------------------- |
| O(1)       | Constant time     | Accessing an array element  |
| O(log n)   | Logarithmic time  | Binary search               |
| O(n)       | Linear time       | Finding maximum in an array |
| O(n log n) | Linearithmic time | Merge sort                  |
| O(n^2)     | Quadratic time    | Bubble sort                 |
| O(n^c)     | Polynomial time   | Matrix multiplication       |
| O(c^n)     | Exponential time  | Brute-force search          |
| O(n!)      | Factorial time    | Finding all permutations    |

## Examples (2)

| Notation   | Name         | Definition                        | Example                                             |
| ---------- | ------------ | --------------------------------- | --------------------------------------------------- |
| O(1)       | Big-O        | Upper bound                       | Accessing an array element                          |
| Ω(1)       | Big-Omega    | Lower bound                       | Insertion into a sorted array                       |
| Θ(1)       | Big-Theta    | Tight bound                       | Finding the minimum in a heap                       |
| o(n)       | Little-o     | Strictly smaller than upper bound | Finding the maximum in an array                     |
| ω(n)       | Little-Omega | Strictly greater than lower bound | Any non-constant function                           |
| O(log n)   | Big-O        | Upper bound                       | Binary search                                       |
| Ω(log n)   | Big-Omega    | Lower bound                       | Finding an element in a sorted array                |
| Θ(log n)   | Big-Theta    | Tight bound                       | AVL tree operations                                 |
| o(n log n) | Little-o     | Strictly smaller than upper bound | Comparison-based sorting algorithms                 |
| ω(n log n) | Little-Omega | Strictly greater than lower bound | Non-comparison-based sorting algorithms             |
| O(n)       | Big-O        | Upper bound                       | Linear search in an unsorted array                  |
| Ω(n)       | Big-Omega    | Lower bound                       | Finding the maximum in an unsorted array            |
| Θ(n)       | Big-Theta    | Tight bound                       | Selection sort                                      |
| o(n^2)     | Little-o     | Strictly smaller than upper bound | Insertion sort                                      |
| ω(n^2)     | Little-Omega | Strictly greater than lower bound | Any non-quadratic function                          |
| O(n^2)     | Big-O        | Upper bound                       | Bubble sort                                         |
| Ω(n^2)     | Big-Omega    | Lower bound                       | Comparison-based sorting algorithms                 |
| Θ(n^2)     | Big-Theta    | Tight bound                       | Insertion sort                                      |
| o(2^n)     | Little-o     | Strictly smaller than upper bound | Tower of Hanoi                                      |
| ω(2^n)     | Little-Omega | Strictly greater than lower bound | Any non-exponential function                        |
| O(2^n)     | Big-O        | Upper bound                       | Brute-force solution for subset sum problem         |
| Ω(2^n)     | Big-Omega    | Lower bound                       | Subset sum problem                                  |
| Θ(2^n)     | Big-Theta    | Tight bound                       | Subset sum problem                                  |
| o(n!)      | Little-o     | Strictly smaller than upper bound | Any factorial function                              |
| ω(n!)      | Little-Omega | Strictly greater than lower bound | Any non-factorial function                          |
| O(n!)      | Big-O        | Upper bound                       | Brute-force solution for traveling salesman problem |
| Ω(n!)      | Big-Omega    | Lower bound                       | Traveling salesman problem                          |
| Θ(n!)      | Big-Theta    | Tight bound                       | Traveling salesman problem                          |
