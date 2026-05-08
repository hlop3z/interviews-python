// ============================================
// Shared Retrofit Fields
// ============================================

// Optional senior-grade context that can be attached to any reference record.
// All fields are optional so existing data remains valid; renderers gate on presence.
export interface RetrofitFields {
  seniorInsight?: string;
  commonTraps?: string[];
  followUps?: string[];
}

// ============================================
// Complexity Types
// ============================================

export type ComplexityQuality = 'best' | 'good' | 'fair' | 'bad' | 'worst' | 'na';

export interface ComplexityOperations {
  access: string;
  search: string;
  insertion: string;
  deletion: string;
}

// ============================================
// Data Structure Types
// ============================================

export type DataStructureGroup = 'List' | 'Tree' | 'Other';

export interface DataStructure extends RetrofitFields {
  name: string;
  shape: string;
  group: DataStructureGroup;
  description: string;
  time: {
    average: ComplexityOperations;
    worst: ComplexityOperations;
  };
  space: {
    worst: string;
  };
}

// ============================================
// Algorithm Types
// ============================================

export interface SortingAlgorithm extends RetrofitFields {
  name: string;
  description: string;
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: {
    worst: string;
  };
}

export type SearchCategory = 'array' | 'graph';

export interface SearchAlgorithm extends RetrofitFields {
  name: string;
  description: string;
  average: string;
  worst: string;
}

export interface SearchAlgorithms {
  array: SearchAlgorithm[];
  graph: SearchAlgorithm[];
}

// ============================================
// Big-O Types
// ============================================

export interface AsymptoticNotation {
  name: string;
  notation: string;
  description: string;
  note: string;
  simplified: string;
}

export interface TimeComplexity {
  name: string;
  notation: string;
  description: string;
  level: ComplexityQuality;
}

// ============================================
// Concept Types
// ============================================

export interface Concept extends RetrofitFields {
  name: string;
  description: string;
}

export interface ConceptGroups {
  oop: Concept[];
  solid: Concept[];
  design: Concept[];
  paradigms: Concept[];
  architectures: Concept[];
  principles: Concept[];
}

// ============================================
// Language-Specific Types
// ============================================

export interface PythonMethod {
  method: string;
  group: string;
  description: string;
}

export interface PythonDunder {
  name: string;
  description: string;
}

export interface SqlStatement extends RetrofitFields {
  statement: string;
  description: string;
  example: string;
}

// ============================================
// API Types
// ============================================

export interface RestConstraint extends RetrofitFields {
  name: string;
  description: string;
}

export interface RestMethod extends RetrofitFields {
  method: string;
  crud: string;
}

export interface GraphQLOperation extends RetrofitFields {
  operation: string;
  description: string;
}

// ============================================
// Docker Types
// ============================================

export interface DockerCommand {
  caption?: string;
  command: string;
  note?: string;
}

export interface DockerGroup {
  title: string;
  intro?: string;
  commands: DockerCommand[];
}

export interface DockerCategory {
  id: string;
  label: string;
  description?: string;
  groups: DockerGroup[];
}

export interface DockerTip {
  title: string;
  body: string;
}

// ============================================
// Git Types
// ============================================

export interface GitCommand {
  caption?: string;
  command: string;
  note?: string;
}

export interface GitGroup {
  title: string;
  intro?: string;
  commands: GitCommand[];
}

export interface GitCategory {
  id: string;
  label: string;
  description?: string;
  groups: GitGroup[];
}

export interface GitTip {
  title: string;
  body: string;
}

// ============================================
// Resource Types
// ============================================

export interface Resource {
  name: string;
  url: string;
  description?: string;
}

// ============================================
// Pattern Library Types (DSA)
// ============================================

export type PatternCategory =
  | 'two-pointer'
  | 'sliding-window'
  | 'fast-slow'
  | 'bfs'
  | 'dfs'
  | 'backtracking'
  | 'binary-search'
  | 'monotonic-stack'
  | 'union-find'
  | 'top-k-heap'
  | 'dp'
  | 'greedy'
  | 'bit-manipulation'
  | 'intervals'
  | 'topological-sort';

export type TemplateLang = 'python' | 'typescript' | 'go';

export interface CodeTemplate {
  id: string;
  patternId: string;
  languages: {
    lang: TemplateLang;
    code: string;
  }[];
}

export interface PatternExample {
  title: string;
  leetcodeNum?: number;
  note?: string;
}

export interface Pattern {
  id: string;
  name: string;
  category: PatternCategory;
  signals: string[];
  whenToUse: string;
  complexity: {
    time: string;
    space: string;
  };
  templateId: string;
  pitfalls: string[];
  examples: PatternExample[];
  usesDataStructures?: string[];
}

// ============================================
// Trade-off Table Type
// ============================================

export interface TradeoffCriterion {
  criterion: string;
  optionA: string;
  optionB: string;
}

export interface Tradeoff {
  topic: string;
  labelA: string;
  labelB: string;
  criteria: TradeoffCriterion[];
  rule: string;
}

// ============================================
// System-Design-Lite Scenario Type
// ============================================

export interface Scenario {
  id: string;
  title: string;
  problem: string;
  clarifyingQuestions: string[];
  approach: string;
  complexity: {
    time: string;
    space: string;
  };
  snippet?: string;
  snippetLang?: TemplateLang;
  followUps: string[];
}
