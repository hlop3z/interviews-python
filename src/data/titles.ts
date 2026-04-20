// Decoder for the alphabet soup of software-engineering job titles.
// Kept as typed data so the cheat-sheet page stays sortable / searchable.

export interface TitleEntry {
  title: string;
  abbr?: string;
  note?: string;
  // Another abbreviation this one collides with — surfaces a ⚠ badge inline.
  conflictsWith?: string;
}

export interface TitleArea {
  area: string;
  description?: string;
  titles: TitleEntry[];
}

export interface AmbiguousAbbr {
  abbr: string;
  meanings: string[];
}

export interface RoleBucket {
  name: string;
  examples: string[];
}

// ── Core titles — often interchangeable at the "builds features" level.
export const coreTitles: TitleEntry[] = [
  { title: 'Software Engineer', abbr: 'SWE' },
  { title: 'Software Developer', abbr: 'SD' },
  { title: 'Software Development Engineer', abbr: 'SDE', note: 'Amazon / Microsoft' },
  { title: 'Engineer', abbr: 'Eng', note: 'generic shorthand' },
  { title: 'Programmer', note: 'rare today — usually a legacy posting' },
];

// ── Seniority ladder. Usually prefixes a core title ("Sr SWE", "Staff Eng").
export const seniorityLevels: TitleEntry[] = [
  { title: 'Junior', abbr: 'Jr' },
  { title: 'Mid-level', note: 'often no label — assumed when no prefix' },
  { title: 'Senior', abbr: 'Sr' },
  { title: 'Staff Engineer', abbr: 'Staff' },
  { title: 'Senior Staff', abbr: 'Sr Staff' },
  { title: 'Principal Engineer', abbr: 'PE', conflictsWith: 'Platform Engineer' },
  { title: 'Distinguished Engineer', abbr: 'DE', conflictsWith: 'Data Engineer' },
  { title: 'Fellow', note: 'very rare — top individual-contributor tier' },
];

// ── Specializations grouped by concern.
export const specializations: TitleArea[] = [
  {
    area: 'Frontend / Backend',
    titles: [
      { title: 'Frontend Engineer', abbr: 'FE' },
      { title: 'Backend Engineer', abbr: 'BE' },
      { title: 'Full Stack Engineer', abbr: 'FS / FSE' },
    ],
  },
  {
    area: 'Infrastructure / Ops',
    titles: [
      { title: 'Site Reliability Engineer', abbr: 'SRE', note: 'popularized by Google' },
      { title: 'DevOps Engineer', abbr: 'DevOps' },
      { title: 'Platform Engineer', abbr: 'PE', conflictsWith: 'Principal Engineer' },
      { title: 'Infrastructure Engineer', abbr: 'Infra' },
    ],
  },
  {
    area: 'Data & AI',
    titles: [
      { title: 'Data Engineer', abbr: 'DE', conflictsWith: 'Distinguished Engineer' },
      { title: 'Machine Learning Engineer', abbr: 'MLE' },
      { title: 'AI Engineer', abbr: 'AIE' },
      { title: 'Data Scientist', abbr: 'DS' },
      { title: 'Applied Scientist', abbr: 'AS' },
    ],
  },
  {
    area: 'Mobile',
    titles: [
      { title: 'iOS Engineer', abbr: 'iOS' },
      { title: 'Android Engineer', abbr: 'Android' },
      { title: 'Mobile Engineer', abbr: 'ME' },
    ],
  },
  {
    area: 'Systems / Low-Level',
    titles: [
      { title: 'Systems Engineer', abbr: 'SE', conflictsWith: 'Software Engineer' },
      { title: 'Embedded Engineer', abbr: 'EE' },
      { title: 'Firmware Engineer', abbr: 'FW' },
    ],
  },
  {
    area: 'Security',
    titles: [
      { title: 'Security Engineer', abbr: 'SecEng' },
      { title: 'Application Security Engineer', abbr: 'AppSec' },
      { title: 'Cloud Security Engineer', abbr: 'CSE' },
    ],
  },
  {
    area: 'QA / Testing',
    titles: [
      { title: 'QA Engineer', abbr: 'QA' },
      { title: 'Software Development Engineer in Test', abbr: 'SDET' },
      { title: 'Test Engineer', abbr: 'TE' },
    ],
  },
  {
    area: 'Architecture',
    titles: [
      { title: 'Software Architect', abbr: 'SA' },
      { title: 'Solutions Architect', abbr: 'SolArch' },
      { title: 'Enterprise Architect', abbr: 'EA' },
    ],
  },
  {
    area: 'Product / Cross-functional',
    description: 'Not always "engineering" — but tightly coupled to it.',
    titles: [
      { title: 'Product Manager', abbr: 'PM', conflictsWith: 'Project Manager' },
      { title: 'Project Manager', abbr: 'PM', conflictsWith: 'Product Manager' },
      { title: 'Technical Program Manager', abbr: 'TPM' },
      { title: 'Engineering Manager', abbr: 'EM' },
    ],
  },
];

// ── Overloaded abbreviations — the real source of confusion in job posts.
export const ambiguousAbbrs: AmbiguousAbbr[] = [
  { abbr: 'SE', meanings: ['Software Engineer', 'Systems Engineer'] },
  { abbr: 'PE', meanings: ['Principal Engineer', 'Platform Engineer'] },
  { abbr: 'DE', meanings: ['Data Engineer', 'Distinguished Engineer'] },
  { abbr: 'PM', meanings: ['Product Manager', 'Project Manager'] },
];

// ── The TL;DR: most titles collapse into these five real buckets.
export const roleBuckets: RoleBucket[] = [
  {
    name: 'Build product features',
    examples: ['SWE', 'SDE', 'FE', 'BE', 'FS'],
  },
  {
    name: 'Run systems reliably',
    examples: ['SRE', 'DevOps', 'Infra'],
  },
  {
    name: 'Work with data / AI',
    examples: ['DE', 'DS', 'MLE', 'AIE'],
  },
  {
    name: 'Specialized platforms',
    examples: ['iOS', 'Android', 'Embedded', 'Firmware', 'SecEng'],
  },
  {
    name: 'Coordinate / lead',
    examples: ['EM', 'PM', 'TPM', 'Architect'],
  },
];
