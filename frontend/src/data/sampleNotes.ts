import { StudyItem } from '../types';

export interface SampleCourse {
  id: string;
  title: string;
  code: string;
  icon: string;
  description: string;
  summary: string;
  items: StudyItem[];
}

export const SAMPLE_COURSES: SampleCourse[] = [
  {
    id: 'course-distributed-systems',
    code: 'CS 666',
    title: 'Distributed Systems Necromancy & Byzantine Horrors',
    icon: '🔮',
    description: 'Master consensus algorithms, split-brain zombies, CAP theorem trade-offs, and deadlock resolution.',
    summary: 'An advanced treatise on preventing network partitions, resurrecting dead worker nodes, and achieving quorum in hostile clusters.',
    items: [
      {
        id: 'ds-1',
        topic: 'Raft Consensus',
        question: 'In the Raft consensus protocol, what happens when a Follower stops hearing heartbeats from the reigning Leader?',
        options: [
          'It immediately shuts down to prevent split-brain anomalies.',
          'It converts to Candidate state, increments its term, and solicits votes from peers.',
          'It forwards client requests to the standby backup leader.',
          'It commits all uncommitted log entries locally.'
        ],
        answer: 'It converts to Candidate state, increments its term, and solicits votes from peers.',
        explanation: 'When election timeout elapses without heartbeats, a follower suspects the leader is dead, increments the election term, votes for itself, and sends RequestVote RPCs.'
      },
      {
        id: 'ds-2',
        topic: 'CAP Theorem',
        question: 'Under Eric Brewer\'s CAP Theorem, when an unavoidable network partition (P) arises between distributed nodes, what trade-off must a system make?',
        options: [
          'It must choose between Consistency (all nodes see latest data) and Availability (every request receives non-error response).',
          'It must sacrifice Persistence to keep memory throughput optimal.',
          'It immediately switches from ACID guarantees to strict linearizability.',
          'It guarantees Partition Tolerance by dropping all write replicas.'
        ],
        answer: 'It must choose between Consistency (all nodes see latest data) and Availability (every request receives non-error response).',
        explanation: 'Because network partitions cannot be prevented in physical systems, a distributed design must decide whether to return stale data or refuse reads/writes (Consistency vs. Availability).'
      },
      {
        id: 'ds-3',
        topic: 'Deadlock Detection',
        question: 'Which of the following conditions is NOT one of Coffman\'s four necessary conditions for a deadlock to exist?',
        options: [
          'Mutual Exclusion: Resources cannot be shared simultaneously.',
          'Hold and Wait: Processes holding resources can request additional ones.',
          'Preemption: The operating system forcibly reclaims resources from waiting tasks.',
          'Circular Wait: A closed chain of processes each waiting for a resource held by the next.'
        ],
        answer: 'Preemption: The operating system forcibly reclaims resources from waiting tasks.',
        explanation: 'The actual Coffman condition is "No Preemption" (resources can only be released voluntarily). If preemption is allowed, deadlocks can be systematically broken!'
      },
      {
        id: 'ds-4',
        topic: 'Byzantine Fault Tolerance',
        question: 'In a Byzantine Fault Tolerant (BFT) network of N nodes, what is the maximum number of malicious or traitorous nodes (f) the cluster can tolerate?',
        options: [
          'f < N / 2',
          'f <= (N - 1) / 3',
          'f = N - 1',
          'f <= sqrt(N)'
        ],
        answer: 'f <= (N - 1) / 3',
        explanation: 'Lamport and Castro-Liskov demonstrated that consensus in the presence of arbitrary (Byzantine) malicious behavior requires at least 3f + 1 nodes (N >= 3f + 1).'
      },
      {
        id: 'ds-5',
        topic: 'Raft Consensus',
        question: 'How does Raft guarantee that a new leader possesses all previously committed log entries?',
        options: [
          'By querying every node for its highest committed log offset before beginning election.',
          'The RequestVote RPC is rejected if the candidate\'s log is less up-to-date than the voter\'s log.',
          'By performing an expensive two-phase commit over previous terms during initialization.',
          'By discarding uncommitted logs across all non-candidate replicas.'
        ],
        answer: 'The RequestVote RPC is rejected if the candidate\'s log is less up-to-date than the voter\'s log.',
        explanation: 'Raft uses the voting process itself to prevent candidates without all committed entries from winning elections: a voter rejects a candidate whose log is less recent.'
      },
      {
        id: 'ds-6',
        topic: 'Vector Clocks',
        question: 'What fundamental ordering property do Vector Clocks capture that simple Lamport Timestamps cannot?',
        options: [
          'Wall-clock real time synchronized with atomic clocks.',
          'Direct detection of concurrent events (causal independence).',
          'Exact millisecond timestamps of physical hardware interrupts.',
          'High-throughput serialization of SQL write transactions.'
        ],
        answer: 'Direct detection of concurrent events (causal independence).',
        explanation: 'Lamport timestamps provide a total order, but if L(A) < L(B), you cannot conclude A caused B. Vector clocks allow detecting whether two events are causally related or concurrent (conflict).'
      }
    ]
  },
  {
    id: 'course-vampire-neurobiology',
    code: 'BIO 404',
    title: 'Neurobiology of Vampirism & Cognitive Nightmares',
    icon: '🦇',
    description: 'Explore synaptic transmission, circadian clock mutations, iron homeostasis, and sensory hyper-acuity.',
    summary: 'A biochemical deep-dive into nocturnal circadian rhythms, photolytic retinal damage, and dopamine receptor supersensitivity.',
    items: [
      {
        id: 'vn-1',
        topic: 'Circadian Biology',
        question: 'Which hypothalamic nucleus functions as the master circadian pacemaker governing sleep-wake cycles and nocturnal shifts?',
        options: [
          'Suprachiasmatic Nucleus (SCN)',
          'Ventromedial Hypothalamus (VMH)',
          'Arcuate Nucleus (ARC)',
          'Lateral Geniculate Nucleus (LGN)'
        ],
        answer: 'Suprachiasmatic Nucleus (SCN)',
        explanation: 'The Suprachiasmatic Nucleus (SCN) receives direct retinal input via the retinohypothalamic tract to synchronize endogenous 24-hour molecular oscillations.'
      },
      {
        id: 'vn-2',
        topic: 'Synaptic Transmission',
        question: 'During rapid chemical synaptic transmission, what primary ion influx triggers synaptic vesicle fusion at the presynaptic terminal?',
        options: [
          'Inward Sodium (Na+) flux',
          'Inward Calcium (Ca2+) flux through voltage-gated channels',
          'Outward Potassium (K+) hyperpolarization',
          'Chloride (Cl-) mediated retrograde signaling'
        ],
        answer: 'Inward Calcium (Ca2+) flux through voltage-gated channels',
        explanation: 'Action potential arrival depolarizes the terminal, opening voltage-gated Ca2+ channels. Ca2+ binds to synaptotagmin, driving SNARE-complex vesicle fusion and neurotransmitter release.'
      },
      {
        id: 'vn-3',
        topic: 'Hematology & Iron',
        question: 'What liver-derived peptide hormone acts as the master regulator of systemic iron homeostasis by degrading ferroportin?',
        options: [
          'Hepcidin',
          'Transferrin',
          'Ferritin',
          'Erythropoietin'
        ],
        answer: 'Hepcidin',
        explanation: 'Hepcidin binds to the iron exporter ferroportin, causing its internalization and lysosomal degradation, thus locking iron inside macrophages and enterocytes.'
      },
      {
        id: 'vn-4',
        topic: 'Sensory Acuity',
        question: 'In nocturnal predators, which retinal adaptation substantially enhances photon capture in near-total darkness?',
        options: [
          'A high density of foveal cone photoreceptors',
          'The Tapetum Lucidum reflecting light back through rod outer segments',
          'Absence of rhodopsin pigment in peripheral retina',
          'Enhanced myelination of bipolar cells'
        ],
        answer: 'The Tapetum Lucidum reflecting light back through rod outer segments',
        explanation: 'The Tapetum Lucidum is a retroreflective layer lying immediately behind the retina that bounces unabsorbed photons back across the photoreceptors for a second chance at absorption.'
      },
      {
        id: 'vn-5',
        topic: 'Circadian Biology',
        question: 'Which pineal gland hormone is synthesized in darkness from serotonin and suppressed by exposure to blue wavelengths?',
        options: [
          'Melatonin',
          'Cortisol',
          'Dopamine',
          'Thyroxine'
        ],
        answer: 'Melatonin',
        explanation: 'Melatonin synthesis is stimulated by darkness via sympathetic inputs from the SCN and strongly inhibited by light detected by melanopsin-expressing retinal ganglion cells.'
      }
    ]
  },
  {
    id: 'course-spectral-algorithms',
    code: 'ALGO 301',
    title: 'Graph Traversal through the Haunted Labyrinth',
    icon: '🕸️',
    description: 'Conquer A* heuristic pathfinding, Minimum Spanning Trees, Topological Curse Sorting, and NP-Complete specters.',
    summary: 'A rigorous algorithmic expedition through spooky graphs, memoization rituals, and dynamic programming catacombs.',
    items: [
      {
        id: 'sa-1',
        topic: 'A* Pathfinding',
        question: 'For the A* search algorithm to guarantee finding an optimal (shortest) path, what property must the heuristic function h(n) satisfy?',
        options: [
          'It must be strictly monotonic and overestimate cost by at least 15%.',
          'It must be Admissible (never overestimate the true cost to the goal).',
          'It must compute exact Euclidean distance between arbitrary disjoint subgraphs.',
          'It must execute in O(1) space complexity on directed acyclic graphs.'
        ],
        answer: 'It must be Admissible (never overestimate the true cost to the goal).',
        explanation: 'An admissible heuristic h(n) <= h*(n) guarantees that A* will never overlook an optimal path in favor of a path that looked artificially cheaper.'
      },
      {
        id: 'sa-2',
        topic: 'Minimum Spanning Trees',
        question: 'What is the time complexity of Kruskal\'s algorithm for a graph with V vertices and E edges using a Disjoint Set Union (Union-Find) with path compression?',
        options: [
          'O(V^3)',
          'O(E log E) or O(E log V)',
          'O(V + E)',
          'O(V^2)'
        ],
        answer: 'O(E log E) or O(E log V)',
        explanation: 'Sorting the E edges dominates the runtime at O(E log E). Since E <= V^2, log(E) is O(log V), yielding O(E log V). Disjoint Set operations run in nearly linear alpha(V) time.'
      },
      {
        id: 'sa-3',
        topic: 'Topological Sort',
        question: 'Topological sorting is strictly defined only for which category of graphs?',
        options: [
          'Undirected Bipartite Graphs',
          'Directed Acyclic Graphs (DAGs)',
          'Complete Strongly Connected Graphs',
          'Eulerian Multigraphs'
        ],
        answer: 'Directed Acyclic Graphs (DAGs)',
        explanation: 'If a directed graph contains a cycle (u -> v -> ... -> u), no linear sequence can place u before v while also placing v before u. Hence, DAGs are required.'
      },
      {
        id: 'sa-4',
        topic: 'NP-Completeness',
        question: 'Which of the following problems was famously proven to be NP-complete by Stephen Cook in 1971 (Cook-Levin Theorem)?',
        options: [
          'Boolean Satisfiability (SAT)',
          'Single-Source Shortest Path (Dijkstra)',
          'Minimum Cut in Flow Networks',
          'Primality Testing'
        ],
        answer: 'Boolean Satisfiability (SAT)',
        explanation: 'Cook proved that Boolean Satisfiability (SAT) is NP-complete, establishing the foundation of computational complexity theory and reductions.'
      },
      {
        id: 'sa-5',
        topic: 'A* Pathfinding',
        question: 'If the heuristic function in A* is set to h(n) = 0 for all nodes, what classic algorithm does A* degenerate into?',
        options: [
          'Dijkstra\'s Algorithm',
          'Depth-First Search (DFS)',
          'Bellman-Ford Algorithm',
          'Floyd-Warshall All-Pairs Algorithm'
        ],
        answer: 'Dijkstra\'s Algorithm',
        explanation: 'When h(n) = 0, the priority evaluation function f(n) = g(n) + h(n) becomes simply f(n) = g(n), which is uniform-cost search (Dijkstra).'
      }
    ]
  }
];
