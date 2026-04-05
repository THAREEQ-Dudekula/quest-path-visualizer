import type { QuizQuestion } from '@/types';

export interface AlgorithmInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  category: 'uninformed' | 'informed' | 'optimal';
  weighted: boolean;
  guaranteesShortestPath: boolean;
  dataStructure: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string[];
  pseudocode: string;
  advantages: string[];
  limitations: string[];
  whenToUse: string[];
  realWorldUse: string[];
}

export const algorithmData: Record<string, AlgorithmInfo> = {
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search',
    shortName: 'BFS',
    description: 'Explores all neighbors level by level using a queue. Guarantees shortest path in unweighted graphs.',
    icon: '🌊',
    color: 'hsl(200, 70%, 40%)',
    category: 'uninformed',
    weighted: false,
    guaranteesShortestPath: true,
    dataStructure: 'Queue (FIFO)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    explanation: [
      'BFS starts at the source node and explores all neighboring nodes at the current depth before moving to nodes at the next depth level.',
      'It uses a queue (FIFO) to keep track of which nodes to visit next.',
      'Each node is visited exactly once, and the algorithm guarantees finding the shortest path in an unweighted graph.',
      'BFS expands outward like ripples in a pond — visiting all nodes at distance 1, then distance 2, and so on.',
    ],
    pseudocode: `function BFS(start, goal):
  queue ← [start]
  visited ← {start}
  parent ← {}

  while queue is not empty:
    node ← queue.dequeue()
    if node == goal:
      return reconstructPath(parent, goal)

    for each neighbor of node:
      if neighbor not in visited and not wall:
        visited.add(neighbor)
        parent[neighbor] ← node
        queue.enqueue(neighbor)

  return "no path found"`,
    advantages: ['Guarantees shortest path in unweighted graphs', 'Complete — will always find a solution if one exists', 'Simple to implement and understand'],
    limitations: ['High memory usage — stores all nodes at current level', 'Slow on large graphs with many branches', 'Does not consider edge weights'],
    whenToUse: ['Finding shortest path in unweighted graphs', 'Level-order traversal of trees', 'Finding all nodes within a connected component'],
    realWorldUse: ['GPS navigation (unweighted roads)', 'Social network friend suggestions', 'Web crawlers', 'Puzzle solving (Rubik\'s cube, sliding puzzles)'],
  },
  dfs: {
    id: 'dfs', name: 'Depth-First Search', shortName: 'DFS',
    description: 'Explores as deep as possible along each branch before backtracking. Uses a stack.',
    icon: '🔍', color: 'hsl(280, 60%, 50%)', category: 'uninformed', weighted: false,
    guaranteesShortestPath: false, dataStructure: 'Stack (LIFO)',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)',
    explanation: [
      'DFS starts at the source and explores as far as possible along each branch before backtracking.',
      'It uses a stack (LIFO) — either explicitly or via recursion — to track the exploration path.',
      'DFS does NOT guarantee the shortest path. It may find a longer path before a shorter one.',
      'It is memory-efficient compared to BFS as it only stores nodes along the current path.',
    ],
    pseudocode: `function DFS(start, goal):
  stack ← [start]
  visited ← {}
  parent ← {}

  while stack is not empty:
    node ← stack.pop()
    if node in visited: continue
    visited.add(node)

    if node == goal:
      return reconstructPath(parent, goal)

    for each neighbor of node:
      if neighbor not in visited and not wall:
        parent[neighbor] ← node
        stack.push(neighbor)

  return "no path found"`,
    advantages: ['Low memory usage compared to BFS', 'Can be implemented with recursion', 'Good for exploring all possible paths'],
    limitations: ['Does NOT guarantee shortest path', 'Can get stuck in deep branches or cycles', 'May explore unnecessary areas'],
    whenToUse: ['Detecting cycles in graphs', 'Topological sorting', 'Solving mazes (finding any path)', 'When memory is limited'],
    realWorldUse: ['File system traversal', 'Maze generation algorithms', 'Detecting cycles in dependency graphs', 'Game AI for decision trees'],
  },
  dijkstra: {
    id: 'dijkstra', name: "Dijkstra's Algorithm", shortName: 'Dijkstra',
    description: 'Finds shortest path considering edge weights using a priority queue.',
    icon: '⚖️', color: 'hsl(30, 80%, 50%)', category: 'optimal', weighted: true,
    guaranteesShortestPath: true, dataStructure: 'Priority Queue (Min-Heap)',
    timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)',
    explanation: [
      "Dijkstra's algorithm finds the shortest path from a source to all other nodes in a weighted graph.",
      'It uses a priority queue to always process the node with the smallest known distance first.',
      'The algorithm relaxes edges — if a shorter path to a neighbor is found, it updates the distance.',
      'It is optimal for graphs with non-negative edge weights.',
    ],
    pseudocode: `function Dijkstra(start, goal):
  dist ← {start: 0}
  pq ← [(0, start)]
  visited ← {}
  parent ← {}

  while pq is not empty:
    (d, node) ← pq.extractMin()
    if node in visited: continue
    visited.add(node)

    if node == goal:
      return reconstructPath(parent, goal)

    for each neighbor of node:
      newDist ← d + weight(node, neighbor)
      if newDist < dist[neighbor]:
        dist[neighbor] ← newDist
        parent[neighbor] ← node
        pq.insert((newDist, neighbor))

  return "no path found"`,
    advantages: ['Guarantees shortest path with non-negative weights', 'Works with weighted graphs', 'Optimal and complete'],
    limitations: ['Slower than BFS for unweighted graphs', 'Cannot handle negative edge weights', 'Priority queue adds overhead'],
    whenToUse: ['Weighted shortest path problems', 'Network routing protocols', 'When edge costs vary'],
    realWorldUse: ['GPS navigation systems', 'Network routing (OSPF protocol)', 'Airline route optimization', 'Robot path planning'],
  },
  astar: {
    id: 'astar', name: 'A* Algorithm', shortName: 'A*',
    description: 'Uses heuristics to guide search toward the goal. Most efficient for grid pathfinding.',
    icon: '⭐', color: 'hsl(45, 90%, 55%)', category: 'informed', weighted: true,
    guaranteesShortestPath: true, dataStructure: 'Priority Queue (Min-Heap)',
    timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)',
    explanation: [
      'A* combines the actual cost from the start (g-score) with an estimated cost to the goal (h-score).',
      'It uses f(n) = g(n) + h(n) to prioritize which nodes to explore, where h is a heuristic function.',
      'With an admissible heuristic (never overestimates), A* guarantees the shortest path.',
      'Manhattan distance is commonly used as the heuristic for grid-based pathfinding.',
    ],
    pseudocode: `function AStar(start, goal):
  gScore ← {start: 0}
  fScore ← {start: heuristic(start, goal)}
  pq ← [(fScore[start], start)]
  visited ← {}
  parent ← {}

  while pq is not empty:
    (f, node) ← pq.extractMin()
    if node in visited: continue
    visited.add(node)

    if node == goal:
      return reconstructPath(parent, goal)

    for each neighbor of node:
      g ← gScore[node] + weight(node, neighbor)
      if g < gScore[neighbor]:
        gScore[neighbor] ← g
        fScore[neighbor] ← g + heuristic(neighbor, goal)
        parent[neighbor] ← node
        pq.insert((fScore[neighbor], neighbor))

  return "no path found"`,
    advantages: ['Most efficient informed search algorithm', 'Guarantees shortest path with admissible heuristic', 'Explores fewer nodes than Dijkstra'],
    limitations: ['Heuristic quality affects performance', 'Higher memory usage than DFS', 'More complex to implement'],
    whenToUse: ['Grid-based pathfinding (games, robotics)', 'When a good heuristic is available', 'When efficiency matters more than simplicity'],
    realWorldUse: ['Video game NPC pathfinding', 'Robot navigation', 'Route planning applications', 'Puzzle solving with known goal state'],
  },
  greedy: {
    id: 'greedy', name: 'Greedy Best-First Search', shortName: 'Greedy',
    description: 'Always expands the node closest to the goal by heuristic. Fast but not optimal.',
    icon: '🎯', color: 'hsl(320, 70%, 50%)', category: 'informed', weighted: false,
    guaranteesShortestPath: false, dataStructure: 'Priority Queue (Min-Heap)',
    timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)',
    explanation: [
      'Greedy Best-First Search uses only the heuristic h(n) to decide which node to expand next.',
      'It always picks the node that appears closest to the goal, ignoring the actual cost so far.',
      'This makes it very fast in open spaces but it does NOT guarantee the shortest path.',
      'It can get trapped in dead ends or find suboptimal paths when obstacles block the direct route.',
    ],
    pseudocode: `function GreedyBFS(start, goal):
  pq ← [(heuristic(start, goal), start)]
  visited ← {}
  parent ← {}

  while pq is not empty:
    (h, node) ← pq.extractMin()
    if node in visited: continue
    visited.add(node)

    if node == goal:
      return reconstructPath(parent, goal)

    for each neighbor of node:
      if neighbor not in visited and not wall:
        parent[neighbor] ← node
        pq.insert((heuristic(neighbor, goal), neighbor))

  return "no path found"`,
    advantages: ['Very fast — explores fewer nodes than BFS/Dijkstra', 'Simple heuristic-based approach', 'Good for open graphs with few obstacles'],
    limitations: ['Does NOT guarantee shortest path', 'Can get trapped by obstacles', 'Highly dependent on heuristic quality'],
    whenToUse: ['When speed matters more than optimality', 'Open environments with few obstacles', 'Quick approximation of shortest path'],
    realWorldUse: ['Real-time game AI when speed is critical', 'Quick route estimates', 'Heuristic-guided exploration'],
  },
  bidirectional: {
    id: 'bidirectional', name: 'Bidirectional Search', shortName: 'Bidir.',
    description: 'Searches from both start and goal simultaneously. Meets in the middle.',
    icon: '🔄', color: 'hsl(170, 60%, 45%)', category: 'uninformed', weighted: false,
    guaranteesShortestPath: true, dataStructure: 'Two Queues',
    timeComplexity: 'O(b^(d/2))', spaceComplexity: 'O(b^(d/2))',
    explanation: [
      'Bidirectional Search runs two simultaneous BFS searches — one from start, one from goal.',
      'When the two searches meet (visit a common node), the path is found.',
      'This dramatically reduces the search space compared to single-direction BFS.',
      'It is particularly effective on large graphs where the branching factor is high.',
    ],
    pseudocode: `function BidirectionalSearch(start, goal):
  queueF ← [start], queueB ← [goal]
  visitedF ← {start}, visitedB ← {goal}
  parentF ← {}, parentB ← {}

  while queueF and queueB not empty:
    // Expand forward
    node ← queueF.dequeue()
    if node in visitedB:
      return mergePaths(parentF, parentB, node)
    for neighbor of node:
      if neighbor not in visitedF:
        visitedF.add(neighbor)
        parentF[neighbor] ← node
        queueF.enqueue(neighbor)

    // Expand backward (similar)
    ...

  return "no path found"`,
    advantages: ['Much faster than single-direction BFS on large graphs', 'Reduces search space exponentially', 'Guarantees shortest path (with BFS)'],
    limitations: ['More complex to implement', 'Requires knowing the goal node in advance', 'Path merging logic can be tricky'],
    whenToUse: ['Large graphs where BFS is too slow', 'When both start and goal are known', 'Reducing exponential search space'],
    realWorldUse: ['Social network shortest connections', 'Large map navigation', 'Peer-to-peer network routing'],
  },
};

export const quizQuestions: QuizQuestion[] = [
  // BFS
  { id: 'q1', algorithm: 'bfs', type: 'mcq', question: 'What data structure does BFS use?', options: ['Stack', 'Queue', 'Priority Queue', 'Array'], correctIndex: 1, explanation: 'BFS uses a Queue (FIFO) to explore nodes level by level.' },
  { id: 'q2', algorithm: 'bfs', type: 'true-false', question: 'BFS guarantees the shortest path in an unweighted graph.', options: ['True', 'False'], correctIndex: 0, explanation: 'BFS explores all nodes at distance d before distance d+1, guaranteeing shortest path in unweighted graphs.' },
  { id: 'q10', algorithm: 'bfs', type: 'mcq', question: 'What is the time complexity of BFS?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'], correctIndex: 2, explanation: 'BFS visits every vertex and edge once, giving O(V + E) time complexity.' },
  { id: 'q13', algorithm: 'bfs', type: 'mcq', question: 'In BFS, nodes at distance k are visited before nodes at distance...', options: ['k-1', 'k', 'k+1', 'k+2'], correctIndex: 2, explanation: 'BFS visits all nodes at distance k before any node at distance k+1.' },
  { id: 'q14', algorithm: 'bfs', type: 'true-false', question: 'BFS can be used for weighted shortest path problems.', options: ['True', 'False'], correctIndex: 1, explanation: 'BFS only works for unweighted graphs. Use Dijkstra for weighted graphs.' },
  { id: 'q15', algorithm: 'bfs', type: 'mcq', question: 'What happens if you use a stack instead of a queue in BFS?', options: ['Same result', 'It becomes DFS', 'It becomes A*', 'It crashes'], correctIndex: 1, explanation: 'Replacing the queue with a stack changes BFS into DFS.' },
  // DFS
  { id: 'q3', algorithm: 'dfs', type: 'mcq', question: 'What data structure does DFS use?', options: ['Queue', 'Stack', 'Heap', 'Hash Map'], correctIndex: 1, explanation: 'DFS uses a Stack (LIFO) — either explicitly or via recursion.' },
  { id: 'q4', algorithm: 'dfs', type: 'true-false', question: 'DFS always finds the shortest path.', options: ['True', 'False'], correctIndex: 1, explanation: 'DFS does NOT guarantee the shortest path. It may find a longer path first.' },
  { id: 'q16', algorithm: 'dfs', type: 'mcq', question: 'DFS can be implemented using:', options: ['Only iteration', 'Only recursion', 'Both iteration and recursion', 'Neither'], correctIndex: 2, explanation: 'DFS can use an explicit stack (iterative) or the call stack (recursive).' },
  { id: 'q17', algorithm: 'dfs', type: 'mcq', question: 'What is the space complexity of DFS?', options: ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'], correctIndex: 1, explanation: 'DFS stores at most V nodes on the stack in the worst case.' },
  { id: 'q18', algorithm: 'dfs', type: 'true-false', question: 'DFS is commonly used for topological sorting.', options: ['True', 'False'], correctIndex: 0, explanation: 'DFS is the standard approach for topological sorting of DAGs.' },
  // Dijkstra
  { id: 'q5', algorithm: 'dijkstra', type: 'mcq', question: "What makes Dijkstra's algorithm different from BFS?", options: ['Uses a stack', 'Considers edge weights', 'Uses heuristics', 'Only works on trees'], correctIndex: 1, explanation: "Dijkstra's algorithm considers edge weights using a priority queue." },
  { id: 'q6', algorithm: 'dijkstra', type: 'true-false', question: "Dijkstra's algorithm can handle negative edge weights.", options: ['True', 'False'], correctIndex: 1, explanation: "Dijkstra's requires non-negative edge weights. Use Bellman-Ford for negative weights." },
  { id: 'q19', algorithm: 'dijkstra', type: 'mcq', question: 'What does "relaxation" mean in Dijkstra\'s algorithm?', options: ['Removing a node', 'Updating a shorter distance', 'Adding a wall', 'Skipping neighbors'], correctIndex: 1, explanation: 'Relaxation means updating the distance to a node when a shorter path is found.' },
  { id: 'q20', algorithm: 'dijkstra', type: 'mcq', question: "Dijkstra's is equivalent to BFS when all edge weights are:", options: ['0', '1', 'Negative', 'Random'], correctIndex: 1, explanation: 'With uniform weight 1, Dijkstra behaves identically to BFS.' },
  // A*
  { id: 'q7', algorithm: 'astar', type: 'mcq', question: 'What is the formula A* uses to prioritize nodes?', options: ['f(n) = g(n)', 'f(n) = h(n)', 'f(n) = g(n) + h(n)', 'f(n) = g(n) * h(n)'], correctIndex: 2, explanation: 'A* uses f(n) = g(n) + h(n), where g is actual cost and h is heuristic estimate.' },
  { id: 'q8', algorithm: 'astar', type: 'mcq', question: 'Which heuristic is commonly used for grid pathfinding in A*?', options: ['Euclidean distance', 'Manhattan distance', 'Chebyshev distance', 'Hamming distance'], correctIndex: 1, explanation: 'Manhattan distance (|dx| + |dy|) is used because grid movement is restricted to 4 directions.' },
  { id: 'q12', algorithm: 'astar', type: 'true-false', question: 'A* with an admissible heuristic always finds the optimal path.', options: ['True', 'False'], correctIndex: 0, explanation: 'An admissible heuristic never overestimates the true cost, so A* finds the optimal path.' },
  { id: 'q21', algorithm: 'astar', type: 'mcq', question: 'What happens if A* uses h(n) = 0 for all nodes?', options: ['It becomes BFS', 'It becomes Dijkstra', 'It becomes DFS', 'It fails'], correctIndex: 1, explanation: 'With h=0, A* degrades to Dijkstra since f(n) = g(n).' },
  { id: 'q22', algorithm: 'astar', type: 'true-false', question: 'An inadmissible heuristic can cause A* to find a suboptimal path.', options: ['True', 'False'], correctIndex: 0, explanation: 'If h overestimates, A* may skip the optimal path and find a suboptimal one.' },
  // Greedy
  { id: 'q9', algorithm: 'greedy', type: 'true-false', question: 'Greedy Best-First Search guarantees the shortest path.', options: ['True', 'False'], correctIndex: 1, explanation: 'Greedy BFS only considers h(n), so it can find suboptimal paths.' },
  { id: 'q23', algorithm: 'greedy', type: 'mcq', question: 'Greedy BFS evaluates nodes using:', options: ['f = g + h', 'f = g', 'f = h', 'f = g * h'], correctIndex: 2, explanation: 'Greedy uses only the heuristic h(n) — no actual cost considered.' },
  { id: 'q24', algorithm: 'greedy', type: 'mcq', question: 'In which scenario does Greedy BFS perform best?', options: ['Dense mazes', 'Open spaces with few walls', 'Weighted graphs', 'Cyclic graphs'], correctIndex: 1, explanation: 'Greedy excels in open spaces where the heuristic can guide directly toward the goal.' },
  { id: 'q25', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS and A* use the same evaluation function.', options: ['True', 'False'], correctIndex: 1, explanation: 'Greedy uses f=h, A* uses f=g+h. They differ in considering actual cost.' },
  // Bidirectional
  { id: 'q11', algorithm: 'bidirectional', type: 'mcq', question: 'How does Bidirectional Search reduce search space?', options: ['Uses DFS instead of BFS', 'Searches from both ends simultaneously', 'Skips wall nodes', 'Uses a heuristic'], correctIndex: 1, explanation: 'Bidirectional Search runs two BFS from start and goal, meeting in the middle.' },
  { id: 'q26', algorithm: 'bidirectional', type: 'mcq', question: 'Bidirectional BFS reduces time complexity from O(b^d) to approximately:', options: ['O(b^d)', 'O(b^(d/2))', 'O(d)', 'O(log d)'], correctIndex: 1, explanation: 'By meeting in the middle, each search only goes half the depth.' },
  { id: 'q27', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search requires knowing the goal node in advance.', options: ['True', 'False'], correctIndex: 0, explanation: 'The backward search starts from the goal, so it must be known.' },
  // Cross-algorithm
  { id: 'q28', algorithm: 'bfs', type: 'mcq', question: 'Which algorithms guarantee shortest path in unweighted graphs?', options: ['BFS and DFS', 'BFS and Bidirectional', 'DFS and Greedy', 'Only A*'], correctIndex: 1, explanation: 'Both BFS and Bidirectional BFS guarantee shortest paths in unweighted graphs.' },
  { id: 'q29', algorithm: 'dijkstra', type: 'mcq', question: 'Which is faster for grid pathfinding: Dijkstra or A*?', options: ['Dijkstra', 'A*', 'Same speed', 'Depends on grid'], correctIndex: 1, explanation: 'A* uses a heuristic to focus the search, visiting fewer nodes than Dijkstra.' },
  { id: 'q30', algorithm: 'dfs', type: 'mcq', question: 'Which algorithm uses the least memory?', options: ['BFS', 'DFS', 'Dijkstra', 'A*'], correctIndex: 1, explanation: 'DFS only stores nodes along the current path, using O(depth) memory.' },
];
