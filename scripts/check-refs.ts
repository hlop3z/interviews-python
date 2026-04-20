// Build-time validation of cross-references between patterns, templates, and
// scenarios. Run before `astro build` so dead references fail the build early.
//
// Run: `npx tsx scripts/check-refs.ts`

import { patterns, patternMap } from '../src/data/patterns';
import { codeTemplates, codeTemplateMap } from '../src/data/code-templates';
import { scenarios, scenarioMap } from '../src/data/system-design';
import { dataStructures } from '../src/data/data-structures';

type Issue = { where: string; message: string };
const issues: Issue[] = [];

// 1) Every Pattern.templateId must resolve to a CodeTemplate.
for (const p of patterns) {
  if (!codeTemplateMap[p.templateId]) {
    issues.push({
      where: `patterns:${p.id}`,
      message: `references unknown templateId "${p.templateId}"`,
    });
  }
}

// 2) Every CodeTemplate.patternId must resolve to a Pattern.
for (const t of codeTemplates) {
  if (!patternMap[t.patternId]) {
    issues.push({
      where: `code-templates:${t.id}`,
      message: `references unknown patternId "${t.patternId}"`,
    });
  }
}

// 3) Pattern ids must be unique.
const patternIds = new Set<string>();
for (const p of patterns) {
  if (patternIds.has(p.id)) {
    issues.push({ where: `patterns:${p.id}`, message: 'duplicate pattern id' });
  }
  patternIds.add(p.id);
}

// 4) CodeTemplate ids must be unique.
const templateIds = new Set<string>();
for (const t of codeTemplates) {
  if (templateIds.has(t.id)) {
    issues.push({ where: `code-templates:${t.id}`, message: 'duplicate template id' });
  }
  templateIds.add(t.id);
}

// 5) Scenario ids must be unique.
const scenarioIds = new Set<string>();
for (const s of scenarios) {
  if (scenarioIds.has(s.id)) {
    issues.push({ where: `system-design:${s.id}`, message: 'duplicate scenario id' });
  }
  scenarioIds.add(s.id);
}
// Reference the map so unused-import rules don't complain; also ensures it built.
void scenarioMap;

// 6) CodeTemplate.languages must include python at minimum (interview default).
for (const t of codeTemplates) {
  const hasPython = t.languages.some((l) => l.lang === 'python');
  if (!hasPython) {
    issues.push({
      where: `code-templates:${t.id}`,
      message: 'missing python language entry — python is the required default',
    });
  }
}

// 7) Every Pattern.usesDataStructures entry must match a real DataStructure.name.
const dsNames = new Set(dataStructures.map((d) => d.name));
for (const p of patterns) {
  for (const ref of p.usesDataStructures ?? []) {
    if (!dsNames.has(ref)) {
      issues.push({
        where: `patterns:${p.id}`,
        message: `usesDataStructures references unknown DataStructure.name "${ref}"`,
      });
    }
  }
}

if (issues.length > 0) {
  console.error(`\n❌ check-refs found ${issues.length} issue(s):\n`);
  for (const i of issues) {
    console.error(`  [${i.where}] ${i.message}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `✓ check-refs: ${patterns.length} patterns, ${codeTemplates.length} templates, ${scenarios.length} scenarios, ${dataStructures.length} data structures — all references resolve`,
);
