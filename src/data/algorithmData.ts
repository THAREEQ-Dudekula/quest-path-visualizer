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
    id: 'bfs', name: 'Breadth-First Search', shortName: 'BFS',
    description: 'Explores all neighbors level by level using a queue. Guarantees shortest path in unweighted graphs.',
    icon: '🌊', color: 'hsl(200, 70%, 40%)', category: 'uninformed', weighted: false,
    guaranteesShortestPath: true, dataStructure: 'Queue (FIFO)',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)',
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
  // ===================== BFS (20+ questions) =====================
  { id: 'q1', algorithm: 'bfs', type: 'mcq', question: 'What data structure does BFS use?', options: ['Stack', 'Queue', 'Priority Queue', 'Array'], correctIndex: 1, explanation: 'BFS uses a Queue (FIFO) to explore nodes level by level.' },
  { id: 'q2', algorithm: 'bfs', type: 'true-false', question: 'BFS guarantees the shortest path in an unweighted graph.', options: ['True', 'False'], correctIndex: 0, explanation: 'BFS explores all nodes at distance d before distance d+1, guaranteeing shortest path in unweighted graphs.' },
  { id: 'q10', algorithm: 'bfs', type: 'mcq', question: 'What is the time complexity of BFS?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'], correctIndex: 2, explanation: 'BFS visits every vertex and edge once, giving O(V + E) time complexity.' },
  { id: 'q13', algorithm: 'bfs', type: 'mcq', question: 'In BFS, nodes at distance k are visited before nodes at distance...', options: ['k-1', 'k', 'k+1', 'k+2'], correctIndex: 2, explanation: 'BFS visits all nodes at distance k before any node at distance k+1.' },
  { id: 'q14', algorithm: 'bfs', type: 'true-false', question: 'BFS can be used for weighted shortest path problems.', options: ['True', 'False'], correctIndex: 1, explanation: 'BFS only works for unweighted graphs. Use Dijkstra for weighted graphs.' },
  { id: 'q15', algorithm: 'bfs', type: 'mcq', question: 'What happens if you use a stack instead of a queue in BFS?', options: ['Same result', 'It becomes DFS', 'It becomes A*', 'It crashes'], correctIndex: 1, explanation: 'Replacing the queue with a stack changes BFS into DFS.' },
  { id: 'q28', algorithm: 'bfs', type: 'mcq', question: 'Which algorithms guarantee shortest path in unweighted graphs?', options: ['BFS and DFS', 'BFS and Bidirectional', 'DFS and Greedy', 'Only A*'], correctIndex: 1, explanation: 'Both BFS and Bidirectional BFS guarantee shortest paths in unweighted graphs.' },
  { id: 'b1', algorithm: 'bfs', type: 'mcq', question: 'What is the space complexity of BFS in the worst case?', options: ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'], correctIndex: 1, explanation: 'BFS may store all vertices in the queue in the worst case.' },
  { id: 'b2', algorithm: 'bfs', type: 'true-false', question: 'BFS can detect if a graph is bipartite.', options: ['True', 'False'], correctIndex: 0, explanation: 'BFS can check 2-colorability by alternating colors at each level.' },
  { id: 'b3', algorithm: 'bfs', type: 'mcq', question: 'In a tree, BFS is equivalent to which traversal?', options: ['Preorder', 'Inorder', 'Level-order', 'Postorder'], correctIndex: 2, explanation: 'BFS visits nodes level by level, which is level-order traversal.' },
  { id: 'b4', algorithm: 'bfs', type: 'mcq', question: 'BFS on a grid with 4-directional movement: each cell has how many neighbors at most?', options: ['2', '3', '4', '8'], correctIndex: 2, explanation: 'With 4-directional movement (up, down, left, right), each cell has at most 4 neighbors.' },
  { id: 'b5', algorithm: 'bfs', type: 'true-false', question: 'BFS requires marking nodes as visited before enqueuing to avoid duplicates.', options: ['True', 'False'], correctIndex: 0, explanation: 'Marking before enqueuing prevents the same node from being added multiple times.' },
  { id: 'b6', algorithm: 'bfs', type: 'mcq', question: 'If BFS explores 50 nodes to find a path of length 5, what does this suggest?', options: ['The graph is sparse', 'High branching factor', 'The path is suboptimal', 'BFS failed'], correctIndex: 1, explanation: 'Many nodes explored for a short path indicates high branching factor.' },
  { id: 'b7', algorithm: 'bfs', type: 'mcq', question: 'BFS on a complete binary tree of depth d visits how many nodes?', options: ['d', '2^d', '2^(d+1) - 1', 'd^2'], correctIndex: 2, explanation: 'A complete binary tree of depth d has 2^(d+1) - 1 nodes total.' },
  { id: 'b8', algorithm: 'bfs', type: 'true-false', question: 'BFS can find the shortest path in a graph with all edges having weight 2.', options: ['True', 'False'], correctIndex: 0, explanation: 'When all weights are equal, BFS finds shortest path (fewest edges = lowest total weight).' },
  { id: 'b9', algorithm: 'bfs', type: 'mcq', question: 'Which real-world problem is best solved with BFS?', options: ['Sorting numbers', 'Finding shortest route in a subway map', 'Encrypting data', 'Compressing files'], correctIndex: 1, explanation: 'Subway maps are unweighted graphs where BFS finds the fewest stops.' },
  { id: 'b10', algorithm: 'bfs', type: 'mcq', question: 'What does BFS return if the goal is unreachable?', options: ['An empty path', 'An error', 'The longest path found', 'A partial path'], correctIndex: 0, explanation: 'BFS exhausts all reachable nodes and returns no path if goal is not found.' },
  { id: 'b11', algorithm: 'bfs', type: 'true-false', question: 'BFS is a complete algorithm (always finds a solution if one exists).', options: ['True', 'False'], correctIndex: 0, explanation: 'BFS systematically explores all reachable nodes, so it is complete.' },
  { id: 'b12', algorithm: 'bfs', type: 'mcq', question: 'In BFS, when do you check if a node is the goal?', options: ['Before enqueuing', 'When dequeuing', 'Both are valid', 'Neither'], correctIndex: 2, explanation: 'Both approaches work; checking when dequeuing is the standard approach.' },
  { id: 'b13', algorithm: 'bfs', type: 'mcq', question: 'BFS on a disconnected graph will...', options: ['Crash', 'Visit all nodes', 'Only visit the connected component of start', 'Enter infinite loop'], correctIndex: 2, explanation: 'BFS only visits nodes reachable from the start node.' },

  // ===================== DFS (20+ questions) =====================
  { id: 'q3', algorithm: 'dfs', type: 'mcq', question: 'What data structure does DFS use?', options: ['Queue', 'Stack', 'Heap', 'Hash Map'], correctIndex: 1, explanation: 'DFS uses a Stack (LIFO) — either explicitly or via recursion.' },
  { id: 'q4', algorithm: 'dfs', type: 'true-false', question: 'DFS always finds the shortest path.', options: ['True', 'False'], correctIndex: 1, explanation: 'DFS does NOT guarantee the shortest path. It may find a longer path first.' },
  { id: 'q16', algorithm: 'dfs', type: 'mcq', question: 'DFS can be implemented using:', options: ['Only iteration', 'Only recursion', 'Both iteration and recursion', 'Neither'], correctIndex: 2, explanation: 'DFS can use an explicit stack (iterative) or the call stack (recursive).' },
  { id: 'q17', algorithm: 'dfs', type: 'mcq', question: 'What is the space complexity of DFS?', options: ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'], correctIndex: 1, explanation: 'DFS stores at most V nodes on the stack in the worst case.' },
  { id: 'q18', algorithm: 'dfs', type: 'true-false', question: 'DFS is commonly used for topological sorting.', options: ['True', 'False'], correctIndex: 0, explanation: 'DFS is the standard approach for topological sorting of DAGs.' },
  { id: 'q30', algorithm: 'dfs', type: 'mcq', question: 'Which algorithm uses the least memory?', options: ['BFS', 'DFS', 'Dijkstra', 'A*'], correctIndex: 1, explanation: 'DFS only stores nodes along the current path, using O(depth) memory.' },
  { id: 'd1', algorithm: 'dfs', type: 'mcq', question: 'What causes DFS to enter an infinite loop?', options: ['Using a queue', 'Not tracking visited nodes in a cyclic graph', 'Using a heuristic', 'Having weighted edges'], correctIndex: 1, explanation: 'Without visited tracking, DFS can revisit nodes endlessly in cycles.' },
  { id: 'd2', algorithm: 'dfs', type: 'true-false', question: 'Recursive DFS uses the call stack implicitly.', options: ['True', 'False'], correctIndex: 0, explanation: 'Each recursive call adds a frame to the call stack, acting as the DFS stack.' },
  { id: 'd3', algorithm: 'dfs', type: 'mcq', question: 'DFS on a tree visits nodes in which order?', options: ['Level-order', 'Preorder (by default)', 'Sorted order', 'Random order'], correctIndex: 1, explanation: 'DFS naturally performs a preorder traversal: visit node, then recurse on children.' },
  { id: 'd4', algorithm: 'dfs', type: 'mcq', question: 'What is the maximum recursion depth of DFS on a path graph with n nodes?', options: ['1', 'log n', 'n', 'n²'], correctIndex: 2, explanation: 'A path graph forces DFS to go n levels deep.' },
  { id: 'd5', algorithm: 'dfs', type: 'true-false', question: 'DFS can be used to find connected components.', options: ['True', 'False'], correctIndex: 0, explanation: 'Running DFS from each unvisited node identifies all connected components.' },
  { id: 'd6', algorithm: 'dfs', type: 'mcq', question: 'In a maze, DFS tends to find paths that are...', options: ['Shortest', 'Random-length', 'Often long and winding', 'Always optimal'], correctIndex: 2, explanation: 'DFS explores deep paths first, often finding longer, winding routes.' },
  { id: 'd7', algorithm: 'dfs', type: 'mcq', question: 'Which problem is DFS best suited for?', options: ['Shortest path in unweighted graph', 'Cycle detection', 'Minimum spanning tree', 'Load balancing'], correctIndex: 1, explanation: 'DFS naturally detects back edges, which indicate cycles.' },
  { id: 'd8', algorithm: 'dfs', type: 'true-false', question: 'Iterative DFS and recursive DFS always visit nodes in the same order.', options: ['True', 'False'], correctIndex: 1, explanation: 'Order may differ based on how neighbors are pushed/processed.' },
  { id: 'd9', algorithm: 'dfs', type: 'mcq', question: 'DFS is used in which maze generation algorithm?', options: ['Prim\'s', 'Kruskal\'s', 'Recursive backtracker', 'Eller\'s'], correctIndex: 2, explanation: 'The recursive backtracker uses DFS to carve random paths through a grid.' },
  { id: 'd10', algorithm: 'dfs', type: 'mcq', question: 'What is a back edge in DFS?', options: ['Edge to an unvisited node', 'Edge to an ancestor in the DFS tree', 'Edge to a sibling', 'A deleted edge'], correctIndex: 1, explanation: 'A back edge connects a node to its ancestor, indicating a cycle.' },
  { id: 'd11', algorithm: 'dfs', type: 'true-false', question: 'DFS is complete in infinite graphs.', options: ['True', 'False'], correctIndex: 1, explanation: 'DFS can get stuck in infinite branches and never find the goal.' },
  { id: 'd12', algorithm: 'dfs', type: 'mcq', question: 'How does iterative deepening DFS (IDDFS) improve on DFS?', options: ['Uses less memory', 'Guarantees shortest path in unweighted graphs', 'Runs faster', 'Uses a priority queue'], correctIndex: 1, explanation: 'IDDFS combines DFS memory efficiency with BFS completeness and optimality.' },
  { id: 'd13', algorithm: 'dfs', type: 'mcq', question: 'DFS time complexity on an adjacency matrix representation is:', options: ['O(V)', 'O(V²)', 'O(V + E)', 'O(E²)'], correctIndex: 1, explanation: 'With an adjacency matrix, checking all neighbors of each node takes O(V) per node, totaling O(V²).' },

  // ===================== Dijkstra (22+ questions) =====================
  { id: 'q5', algorithm: 'dijkstra', type: 'mcq', question: "What makes Dijkstra's algorithm different from BFS?", options: ['Uses a stack', 'Considers edge weights', 'Uses heuristics', 'Only works on trees'], correctIndex: 1, explanation: "Dijkstra's algorithm considers edge weights using a priority queue." },
  { id: 'q6', algorithm: 'dijkstra', type: 'true-false', question: "Dijkstra's algorithm can handle negative edge weights.", options: ['True', 'False'], correctIndex: 1, explanation: "Dijkstra's requires non-negative edge weights. Use Bellman-Ford for negative weights." },
  { id: 'q19', algorithm: 'dijkstra', type: 'mcq', question: 'What does "relaxation" mean in Dijkstra\'s algorithm?', options: ['Removing a node', 'Updating a shorter distance', 'Adding a wall', 'Skipping neighbors'], correctIndex: 1, explanation: 'Relaxation means updating the distance to a node when a shorter path is found.' },
  { id: 'q20', algorithm: 'dijkstra', type: 'mcq', question: "Dijkstra's is equivalent to BFS when all edge weights are:", options: ['0', '1', 'Negative', 'Random'], correctIndex: 1, explanation: 'With uniform weight 1, Dijkstra behaves identically to BFS.' },
  { id: 'q29', algorithm: 'dijkstra', type: 'mcq', question: 'Which is faster for grid pathfinding: Dijkstra or A*?', options: ['Dijkstra', 'A*', 'Same speed', 'Depends on grid'], correctIndex: 1, explanation: 'A* uses a heuristic to focus the search, visiting fewer nodes than Dijkstra.' },
  { id: 'dj1', algorithm: 'dijkstra', type: 'mcq', question: 'What data structure is essential for efficient Dijkstra?', options: ['Stack', 'Queue', 'Priority Queue (Min-Heap)', 'Linked List'], correctIndex: 2, explanation: 'A min-heap allows efficient extraction of the node with smallest distance.' },
  { id: 'dj2', algorithm: 'dijkstra', type: 'true-false', question: 'Dijkstra finds shortest paths from source to ALL other nodes.', options: ['True', 'False'], correctIndex: 0, explanation: 'Dijkstra computes single-source shortest paths to all reachable nodes.' },
  { id: 'dj3', algorithm: 'dijkstra', type: 'mcq', question: 'What happens if Dijkstra encounters a negative edge weight?', options: ['It handles it correctly', 'It may produce incorrect results', 'It crashes', 'It skips that edge'], correctIndex: 1, explanation: 'Negative weights can cause Dijkstra to miss shorter paths through negative edges.' },
  { id: 'dj4', algorithm: 'dijkstra', type: 'mcq', question: 'Time complexity of Dijkstra with a binary heap is:', options: ['O(V²)', 'O(V + E)', 'O((V + E) log V)', 'O(V³)'], correctIndex: 2, explanation: 'Each vertex is extracted once (O(V log V)) and each edge relaxed once (O(E log V)).' },
  { id: 'dj5', algorithm: 'dijkstra', type: 'true-false', question: 'Dijkstra can be used for routing in computer networks.', options: ['True', 'False'], correctIndex: 0, explanation: 'OSPF (Open Shortest Path First) protocol uses Dijkstra for routing.' },
  { id: 'dj6', algorithm: 'dijkstra', type: 'mcq', question: 'Which algorithm handles negative weights that Dijkstra cannot?', options: ['BFS', 'DFS', 'Bellman-Ford', 'Greedy BFS'], correctIndex: 2, explanation: 'Bellman-Ford can handle negative edge weights (but not negative cycles).' },
  { id: 'dj7', algorithm: 'dijkstra', type: 'mcq', question: 'In Dijkstra, what initial distance is assigned to all non-source nodes?', options: ['0', '1', 'Infinity', '-1'], correctIndex: 2, explanation: 'All nodes start with distance infinity except the source (distance 0).' },
  { id: 'dj8', algorithm: 'dijkstra', type: 'true-false', question: 'Dijkstra must process each node at most once.', options: ['True', 'False'], correctIndex: 0, explanation: 'Once a node is extracted from the priority queue and finalized, it is not processed again.' },
  { id: 'dj9', algorithm: 'dijkstra', type: 'mcq', question: 'Dijkstra with an unsorted array has time complexity:', options: ['O(V + E)', 'O(V²)', 'O(V log V)', 'O(E log V)'], correctIndex: 1, explanation: 'Finding minimum in an unsorted array takes O(V) per extraction, totaling O(V²).' },
  { id: 'dj10', algorithm: 'dijkstra', type: 'mcq', question: 'Which is NOT a valid application of Dijkstra?', options: ['GPS navigation', 'Network routing', 'Finding negative-weight shortest path', 'Robot path planning'], correctIndex: 2, explanation: 'Dijkstra cannot handle negative edge weights correctly.' },
  { id: 'dj11', algorithm: 'dijkstra', type: 'true-false', question: 'Dijkstra is a greedy algorithm.', options: ['True', 'False'], correctIndex: 0, explanation: 'Dijkstra greedily selects the unvisited node with the smallest distance at each step.' },
  { id: 'dj12', algorithm: 'dijkstra', type: 'mcq', question: 'If all edges have weight 5, Dijkstra visits nodes in the same order as:', options: ['DFS', 'BFS', 'A*', 'Random'], correctIndex: 1, explanation: 'Uniform weights make Dijkstra equivalent to BFS (fewest edges = lowest cost).' },
  { id: 'dj13', algorithm: 'dijkstra', type: 'mcq', question: 'How many times is each edge examined in Dijkstra?', options: ['0', '1', '2', 'V times'], correctIndex: 1, explanation: 'Each edge is relaxed at most once when its source vertex is processed.' },
  { id: 'dj14', algorithm: 'dijkstra', type: 'true-false', question: 'Dijkstra works on directed graphs.', options: ['True', 'False'], correctIndex: 0, explanation: 'Dijkstra works on both directed and undirected graphs with non-negative weights.' },
  { id: 'dj15', algorithm: 'dijkstra', type: 'mcq', question: 'What distinguishes Dijkstra from A*?', options: ['Dijkstra uses a stack', 'A* adds a heuristic estimate', 'Dijkstra is faster', 'A* cannot handle weights'], correctIndex: 1, explanation: 'A* adds h(n) to guide search toward the goal; Dijkstra uses only g(n).' },

  // ===================== A* (22+ questions) =====================
  { id: 'q7', algorithm: 'astar', type: 'mcq', question: 'What is the formula A* uses to prioritize nodes?', options: ['f(n) = g(n)', 'f(n) = h(n)', 'f(n) = g(n) + h(n)', 'f(n) = g(n) * h(n)'], correctIndex: 2, explanation: 'A* uses f(n) = g(n) + h(n), where g is actual cost and h is heuristic estimate.' },
  { id: 'q8', algorithm: 'astar', type: 'mcq', question: 'Which heuristic is commonly used for grid pathfinding in A*?', options: ['Euclidean distance', 'Manhattan distance', 'Chebyshev distance', 'Hamming distance'], correctIndex: 1, explanation: 'Manhattan distance (|dx| + |dy|) is used because grid movement is restricted to 4 directions.' },
  { id: 'q12', algorithm: 'astar', type: 'true-false', question: 'A* with an admissible heuristic always finds the optimal path.', options: ['True', 'False'], correctIndex: 0, explanation: 'An admissible heuristic never overestimates the true cost, so A* finds the optimal path.' },
  { id: 'q21', algorithm: 'astar', type: 'mcq', question: 'What happens if A* uses h(n) = 0 for all nodes?', options: ['It becomes BFS', 'It becomes Dijkstra', 'It becomes DFS', 'It fails'], correctIndex: 1, explanation: 'With h=0, A* degrades to Dijkstra since f(n) = g(n).' },
  { id: 'q22', algorithm: 'astar', type: 'true-false', question: 'An inadmissible heuristic can cause A* to find a suboptimal path.', options: ['True', 'False'], correctIndex: 0, explanation: 'If h overestimates, A* may skip the optimal path and find a suboptimal one.' },
  { id: 'a1', algorithm: 'astar', type: 'mcq', question: 'What does g(n) represent in A*?', options: ['Heuristic estimate to goal', 'Actual cost from start to n', 'Total estimated cost', 'Number of nodes visited'], correctIndex: 1, explanation: 'g(n) is the actual cost of the path from the start node to node n.' },
  { id: 'a2', algorithm: 'astar', type: 'mcq', question: 'What does h(n) represent in A*?', options: ['Actual cost from start', 'Estimated cost from n to goal', 'Number of walls', 'Queue size'], correctIndex: 1, explanation: 'h(n) is the heuristic estimate of the cost from n to the goal.' },
  { id: 'a3', algorithm: 'astar', type: 'true-false', question: 'A* always visits fewer nodes than Dijkstra.', options: ['True', 'False'], correctIndex: 1, explanation: 'In the worst case (poor heuristic), A* may visit the same number of nodes as Dijkstra.' },
  { id: 'a4', algorithm: 'astar', type: 'mcq', question: 'An admissible heuristic must:', options: ['Overestimate the cost', 'Never overestimate the cost', 'Equal the exact cost', 'Be zero'], correctIndex: 1, explanation: 'Admissible means h(n) ≤ actual cost from n to goal for all n.' },
  { id: 'a5', algorithm: 'astar', type: 'mcq', question: 'Manhattan distance between (0,0) and (3,4) is:', options: ['5', '7', '12', '3.4'], correctIndex: 1, explanation: '|3-0| + |4-0| = 3 + 4 = 7.' },
  { id: 'a6', algorithm: 'astar', type: 'true-false', question: 'Euclidean distance is admissible for 4-directional grid movement.', options: ['True', 'False'], correctIndex: 0, explanation: 'Euclidean distance never overestimates the true shortest path distance.' },
  { id: 'a7', algorithm: 'astar', type: 'mcq', question: 'If h(n) always equals the true cost, A* will:', options: ['Visit only nodes on the optimal path', 'Behave like BFS', 'Fail', 'Visit all nodes'], correctIndex: 0, explanation: 'A perfect heuristic means A* goes straight to the goal along the optimal path.' },
  { id: 'a8', algorithm: 'astar', type: 'mcq', question: 'A* is primarily used for:', options: ['Sorting arrays', 'Graph coloring', 'Pathfinding in games and robotics', 'Data compression'], correctIndex: 2, explanation: 'A* is the standard pathfinding algorithm in games and robotics.' },
  { id: 'a9', algorithm: 'astar', type: 'true-false', question: 'A* can be used without a heuristic.', options: ['True', 'False'], correctIndex: 0, explanation: 'Without a heuristic (h=0), A* degrades to Dijkstra, which still works.' },
  { id: 'a10', algorithm: 'astar', type: 'mcq', question: 'What makes A* "informed"?', options: ['It uses weighted edges', 'It uses a heuristic to estimate goal distance', 'It uses two queues', 'It backtracks'], correctIndex: 1, explanation: 'The heuristic provides domain-specific information to guide the search.' },
  { id: 'a11', algorithm: 'astar', type: 'mcq', question: 'A* with h(n) = infinity for all nodes will:', options: ['Find the shortest path', 'Never expand any node', 'Behave like DFS', 'Only expand the start'], correctIndex: 3, explanation: 'Infinite heuristic prevents expanding beyond start since f scores are all infinity.' },
  { id: 'a12', algorithm: 'astar', type: 'true-false', question: 'A consistent heuristic is always admissible.', options: ['True', 'False'], correctIndex: 0, explanation: 'Consistency (monotonicity) implies admissibility, but not vice versa.' },
  { id: 'a13', algorithm: 'astar', type: 'mcq', question: 'Which heuristic is best for 8-directional movement?', options: ['Manhattan', 'Euclidean', 'Chebyshev', 'Hamming'], correctIndex: 2, explanation: 'Chebyshev distance (max(|dx|, |dy|)) matches 8-directional grid movement.' },
  { id: 'a14', algorithm: 'astar', type: 'mcq', question: 'The open set in A* contains:', options: ['Visited nodes', 'Nodes to be explored', 'Walls', 'Path nodes'], correctIndex: 1, explanation: 'The open set holds discovered nodes that have not yet been fully explored.' },
  { id: 'a15', algorithm: 'astar', type: 'true-false', question: 'A* is guaranteed to terminate on finite graphs.', options: ['True', 'False'], correctIndex: 0, explanation: 'On finite graphs with non-negative weights, A* always terminates.' },
  { id: 'a16', algorithm: 'astar', type: 'mcq', question: 'What is the closed set in A*?', options: ['Nodes that will be explored', 'Nodes already fully explored', 'Wall cells', 'Goal nodes'], correctIndex: 1, explanation: 'The closed set contains nodes whose shortest paths have been determined.' },

  // ===================== Greedy (20+ questions) =====================
  { id: 'q9', algorithm: 'greedy', type: 'true-false', question: 'Greedy Best-First Search guarantees the shortest path.', options: ['True', 'False'], correctIndex: 1, explanation: 'Greedy BFS only considers h(n), so it can find suboptimal paths.' },
  { id: 'q23', algorithm: 'greedy', type: 'mcq', question: 'Greedy BFS evaluates nodes using:', options: ['f = g + h', 'f = g', 'f = h', 'f = g * h'], correctIndex: 2, explanation: 'Greedy uses only the heuristic h(n) — no actual cost considered.' },
  { id: 'q24', algorithm: 'greedy', type: 'mcq', question: 'In which scenario does Greedy BFS perform best?', options: ['Dense mazes', 'Open spaces with few walls', 'Weighted graphs', 'Cyclic graphs'], correctIndex: 1, explanation: 'Greedy excels in open spaces where the heuristic can guide directly toward the goal.' },
  { id: 'q25', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS and A* use the same evaluation function.', options: ['True', 'False'], correctIndex: 1, explanation: 'Greedy uses f=h, A* uses f=g+h. They differ in considering actual cost.' },
  { id: 'g1', algorithm: 'greedy', type: 'mcq', question: 'What makes Greedy BFS "greedy"?', options: ['It uses all available info', 'It only looks at the immediate best option (heuristic)', 'It explores all paths', 'It uses backtracking'], correctIndex: 1, explanation: 'It greedily picks the node that appears closest to the goal without considering cost so far.' },
  { id: 'g2', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS is a complete algorithm.', options: ['True', 'False'], correctIndex: 1, explanation: 'In infinite spaces or with bad heuristics, Greedy BFS may not find a solution.' },
  { id: 'g3', algorithm: 'greedy', type: 'mcq', question: 'Greedy BFS can get stuck in:', options: ['Priority queues', 'Dead ends and loops without proper visited tracking', 'Binary trees', 'Sorted arrays'], correctIndex: 1, explanation: 'Without visited tracking, Greedy can loop. With obstacles, it can get trapped.' },
  { id: 'g4', algorithm: 'greedy', type: 'mcq', question: 'Compared to A*, Greedy BFS typically:', options: ['Visits more nodes', 'Visits fewer nodes but may find suboptimal paths', 'Guarantees optimal paths', 'Uses more memory'], correctIndex: 1, explanation: 'Greedy is faster (fewer nodes) but sacrifices optimality.' },
  { id: 'g5', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS uses a priority queue.', options: ['True', 'False'], correctIndex: 0, explanation: 'Greedy BFS uses a min-heap priority queue ordered by heuristic value.' },
  { id: 'g6', algorithm: 'greedy', type: 'mcq', question: 'If the heuristic in Greedy BFS is always 0, it behaves like:', options: ['BFS', 'DFS', 'Random search', 'A*'], correctIndex: 0, explanation: 'With h=0, all nodes have equal priority — it degrades to BFS-like behavior.' },
  { id: 'g7', algorithm: 'greedy', type: 'mcq', question: 'Greedy BFS with a perfect heuristic will:', options: ['Find the optimal path directly', 'Still find suboptimal paths', 'Fail', 'Visit all nodes'], correctIndex: 0, explanation: 'A perfect heuristic guides Greedy directly along the optimal path.' },
  { id: 'g8', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS considers the cost already spent reaching a node.', options: ['True', 'False'], correctIndex: 1, explanation: 'Greedy ignores g(n) entirely — it only uses h(n).' },
  { id: 'g9', algorithm: 'greedy', type: 'mcq', question: 'Which is a disadvantage of Greedy BFS over A*?', options: ['Uses more memory', 'Does not guarantee optimal path', 'Slower in all cases', 'Cannot use heuristics'], correctIndex: 1, explanation: 'Unlike A*, Greedy BFS may find a path that is not the shortest.' },
  { id: 'g10', algorithm: 'greedy', type: 'mcq', question: 'In a maze with a wall between start and goal, Greedy BFS will:', options: ['Go through the wall', 'Explore around the wall, possibly finding a long path', 'Stop immediately', 'Switch to BFS'], correctIndex: 1, explanation: 'Greedy will try to go toward the goal, then explore around obstacles.' },
  { id: 'g11', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS has the same time complexity as A*.', options: ['True', 'False'], correctIndex: 0, explanation: 'Both have O((V + E) log V) with a priority queue, though practical performance differs.' },
  { id: 'g12', algorithm: 'greedy', type: 'mcq', question: 'When is Greedy BFS preferred over A*?', options: ['When optimality is critical', 'When speed matters more than path quality', 'When memory is unlimited', 'Never'], correctIndex: 1, explanation: 'In real-time applications where a fast approximate answer is acceptable.' },
  { id: 'g13', algorithm: 'greedy', type: 'mcq', question: 'Greedy BFS is classified as an:', options: ['Uninformed search', 'Informed search', 'Exhaustive search', 'Random search'], correctIndex: 1, explanation: 'It uses a heuristic (domain knowledge) to guide the search.' },
  { id: 'g14', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS always explores fewer nodes than BFS.', options: ['True', 'False'], correctIndex: 1, explanation: 'In some cases with bad heuristics or complex mazes, Greedy may explore more nodes.' },

  // ===================== Bidirectional (18+ questions) =====================
  { id: 'q11', algorithm: 'bidirectional', type: 'mcq', question: 'How does Bidirectional Search reduce search space?', options: ['Uses DFS instead of BFS', 'Searches from both ends simultaneously', 'Skips wall nodes', 'Uses a heuristic'], correctIndex: 1, explanation: 'Bidirectional Search runs two BFS from start and goal, meeting in the middle.' },
  { id: 'q26', algorithm: 'bidirectional', type: 'mcq', question: 'Bidirectional BFS reduces time complexity from O(b^d) to approximately:', options: ['O(b^d)', 'O(b^(d/2))', 'O(d)', 'O(log d)'], correctIndex: 1, explanation: 'By meeting in the middle, each search only goes half the depth.' },
  { id: 'q27', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search requires knowing the goal node in advance.', options: ['True', 'False'], correctIndex: 0, explanation: 'The backward search starts from the goal, so it must be known.' },
  { id: 'bi1', algorithm: 'bidirectional', type: 'mcq', question: 'How many queues does Bidirectional BFS use?', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'One queue for the forward search and one for the backward search.' },
  { id: 'bi2', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search can be combined with A*.', options: ['True', 'False'], correctIndex: 0, explanation: 'Bidirectional A* exists, though the meeting condition is more complex.' },
  { id: 'bi3', algorithm: 'bidirectional', type: 'mcq', question: 'When do the two searches in Bidirectional meet?', options: ['When a node is in both visited sets', 'When both queues are empty', 'After a fixed number of steps', 'When one queue is larger'], correctIndex: 0, explanation: 'The path is found when a node visited by the forward search is also visited by the backward search.' },
  { id: 'bi4', algorithm: 'bidirectional', type: 'mcq', question: 'Bidirectional Search is most effective when:', options: ['The graph is small', 'The branching factor is high and depth is large', 'The graph has negative weights', 'There is no path'], correctIndex: 1, explanation: 'High branching factor means exponential savings by meeting in the middle.' },
  { id: 'bi5', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search uses more memory than single-direction BFS.', options: ['True', 'False'], correctIndex: 1, explanation: 'It typically uses less total memory since each search goes only half the depth.' },
  { id: 'bi6', algorithm: 'bidirectional', type: 'mcq', question: 'What is the main challenge in implementing Bidirectional Search?', options: ['Choosing the start node', 'Merging the two search paths correctly', 'Using a stack', 'Handling weighted edges'], correctIndex: 1, explanation: 'Correctly joining the forward and backward parent chains is the tricky part.' },
  { id: 'bi7', algorithm: 'bidirectional', type: 'mcq', question: 'Bidirectional Search finds shortest path when each direction uses:', options: ['DFS', 'BFS', 'Random walk', 'Greedy search'], correctIndex: 1, explanation: 'Using BFS in both directions guarantees the meeting point yields shortest path.' },
  { id: 'bi8', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search works on directed graphs where edges can be reversed.', options: ['True', 'False'], correctIndex: 0, explanation: 'For directed graphs, you need to reverse edges for the backward search.' },
  { id: 'bi9', algorithm: 'bidirectional', type: 'mcq', question: 'In social networks, Bidirectional Search is used for:', options: ['Sorting friends', 'Finding degrees of separation', 'Posting updates', 'Deleting accounts'], correctIndex: 1, explanation: 'Finding the shortest connection between two people in a social graph.' },
  { id: 'bi10', algorithm: 'bidirectional', type: 'mcq', question: 'If BFS explores b^d nodes, Bidirectional explores approximately:', options: ['b^d', '2 * b^(d/2)', 'b^d / 2', 'd * b'], correctIndex: 1, explanation: 'Two half-depth searches each explore b^(d/2), totaling 2 * b^(d/2).' },
  { id: 'bi11', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search can be used when the goal is unknown.', options: ['True', 'False'], correctIndex: 1, explanation: 'The backward search requires a known goal node to start from.' },
  { id: 'bi12', algorithm: 'bidirectional', type: 'mcq', question: 'Which search strategy alternates expanding forward and backward?', options: ['Bidirectional Search', 'A*', 'DFS', 'Greedy BFS'], correctIndex: 0, explanation: 'Bidirectional Search alternates or interleaves forward and backward expansions.' },

  // ===================== Cross-algorithm / Debugging / Edge Cases (20+ questions) =====================
  { id: 'x1', algorithm: 'bfs', type: 'mcq', question: 'On a 10×10 grid with no walls, BFS from corner to corner visits approximately how many cells?', options: ['10', '19', '100', '50'], correctIndex: 2, explanation: 'BFS explores all reachable cells; with no walls, it visits all 100 cells before or when finding the goal.' },
  { id: 'x2', algorithm: 'dijkstra', type: 'mcq', question: 'A graph has edges: A→B(2), A→C(5), B→C(1). Shortest path A→C via Dijkstra is:', options: ['5', '3', '2', '7'], correctIndex: 1, explanation: 'A→B(2) + B→C(1) = 3, which is shorter than direct A→C(5).' },
  { id: 'x3', algorithm: 'astar', type: 'mcq', question: 'If A* and Dijkstra find paths of the same length, which visited fewer nodes?', options: ['A* (usually)', 'Dijkstra', 'Both visit the same number', 'Cannot determine'], correctIndex: 0, explanation: 'A* heuristic guides it to explore fewer irrelevant nodes than Dijkstra.' },
  { id: 'x4', algorithm: 'dfs', type: 'mcq', question: 'A DFS traversal visits: A→B→D→C. What could the graph look like?', options: ['A-B, A-C, B-D', 'A-B, B-C, C-D', 'A-B, A-D, A-C', 'A-C, C-B, B-D'], correctIndex: 0, explanation: 'A→B→D (deep), then backtrack to A→C. Graph: A connects to B and C, B connects to D.' },
  { id: 'x5', algorithm: 'bfs', type: 'true-false', question: 'In an unweighted graph, there can be multiple shortest paths of the same length.', options: ['True', 'False'], correctIndex: 0, explanation: 'Multiple paths can have the same number of edges (same length in unweighted graph).' },
  { id: 'x6', algorithm: 'dijkstra', type: 'true-false', question: 'Dijkstra can find the shortest path in a graph with a negative cycle.', options: ['True', 'False'], correctIndex: 1, explanation: 'Negative cycles make shortest path undefined (can reduce cost infinitely).' },
  { id: 'x7', algorithm: 'astar', type: 'mcq', question: 'Which heuristic is NOT admissible for 4-directional grid movement?', options: ['Manhattan distance', 'Euclidean distance', '2 × Manhattan distance', 'Zero'], correctIndex: 2, explanation: '2× Manhattan overestimates the true cost, making it inadmissible.' },
  { id: 'x8', algorithm: 'greedy', type: 'mcq', question: 'A spiral maze would be hardest for which algorithm?', options: ['BFS', 'DFS', 'Greedy BFS', 'Dijkstra'], correctIndex: 2, explanation: 'Greedy gets constantly misled by the heuristic in spiral structures.' },
  { id: 'x9', algorithm: 'bfs', type: 'mcq', question: 'Which traversal order is unique to BFS?', options: ['Nodes visited by depth', 'Nodes visited by distance from source', 'Nodes visited randomly', 'Nodes visited by weight'], correctIndex: 1, explanation: 'BFS uniquely visits nodes in order of their distance from the source.' },
  { id: 'x10', algorithm: 'dfs', type: 'true-false', question: 'DFS on an undirected graph with V vertices and E edges has time complexity O(V + E).', options: ['True', 'False'], correctIndex: 0, explanation: 'DFS visits each vertex once and examines each edge twice (once from each endpoint).' },
  { id: 'x11', algorithm: 'dijkstra', type: 'mcq', question: 'Dijkstra processes nodes in order of:', options: ['Insertion time', 'Alphabetical order', 'Increasing distance from source', 'Decreasing distance from source'], correctIndex: 2, explanation: 'The priority queue extracts the node with the smallest distance first.' },
  { id: 'x12', algorithm: 'astar', type: 'true-false', question: 'IDA* (Iterative Deepening A*) uses less memory than A*.', options: ['True', 'False'], correctIndex: 0, explanation: 'IDA* uses DFS with f-score cutoffs, requiring only O(depth) memory.' },
  { id: 'x13', algorithm: 'bfs', type: 'mcq', question: 'What is the branching factor in a grid with 4-directional movement?', options: ['2', '4', '8', 'Variable'], correctIndex: 1, explanation: 'Each cell can branch to at most 4 neighbors (up, down, left, right).' },
  { id: 'x14', algorithm: 'dfs', type: 'mcq', question: 'Which is a valid topological sort application?', options: ['Course prerequisites ordering', 'Shortest path finding', 'Minimum spanning tree', 'Graph coloring'], correctIndex: 0, explanation: 'Topological sort (using DFS) orders courses so prerequisites come first.' },
  { id: 'x15', algorithm: 'greedy', type: 'true-false', question: 'Greedy BFS is always faster than A* in practice.', options: ['True', 'False'], correctIndex: 1, explanation: 'In complex mazes, Greedy may explore more nodes due to poor path choices.' },
  { id: 'x16', algorithm: 'dijkstra', type: 'mcq', question: 'What is a "relaxed" edge in Dijkstra?', options: ['A deleted edge', 'An edge whose endpoint distance was updated to a shorter value', 'A weighted edge', 'An edge with weight 0'], correctIndex: 1, explanation: 'Relaxing an edge means finding a shorter path to the endpoint and updating its distance.' },
  { id: 'x17', algorithm: 'astar', type: 'mcq', question: 'A* explores nodes with the smallest:', options: ['g(n)', 'h(n)', 'f(n) = g(n) + h(n)', 'depth'], correctIndex: 2, explanation: 'A* always expands the node with the lowest f-score from the open set.' },
  { id: 'x18', algorithm: 'bidirectional', type: 'true-false', question: 'Bidirectional Search always visits fewer nodes than BFS.', options: ['True', 'False'], correctIndex: 0, explanation: 'By searching from both ends, the total explored space is typically much smaller.' },
  { id: 'x19', algorithm: 'bfs', type: 'mcq', question: 'If BFS finds a path of length 5, what can you conclude?', options: ['No shorter path exists (unweighted)', 'A shorter path might exist', 'The path is optimal by weight', 'Nothing — BFS is not reliable'], correctIndex: 0, explanation: 'In unweighted graphs, BFS always finds the shortest path.' },
  { id: 'x20', algorithm: 'dfs', type: 'mcq', question: 'A bug in DFS: forgetting to mark nodes as visited. What happens?', options: ['Correct results', 'Infinite loop in cyclic graphs', 'Faster execution', 'Shorter paths found'], correctIndex: 1, explanation: 'Without visited tracking, DFS revisits nodes endlessly in cycles.' },
];
