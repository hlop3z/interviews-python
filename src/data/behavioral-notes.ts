// Behavioral prompts that recur in backend loops. Each has a jr/mid/sr shape
// so the user can self-calibrate: am I answering at the level I am interviewing
// for? The senior shapes lean on outcome + reflection, not just the action.

export interface BehavioralPrompt {
  id: string;
  prompt: string;
  whatTheyProbe: string;
  junior: string;
  mid: string;
  senior: string;
  redFlags: string[];
}

export const prompts: BehavioralPrompt[] = [
  {
    id: 'conflict-teammate',
    prompt: 'Tell me about a conflict with a teammate.',
    whatTheyProbe: 'Can you disagree professionally, separate the issue from the person, and drive to resolution without escalating unnecessarily?',
    junior: 'Names the conflict, describes how a manager or senior resolved it for them.',
    mid: 'Owns the disagreement, describes a 1:1 conversation, arrives at a compromise or escalation path.',
    senior: 'Starts by naming the shared goal, reframes the disagreement as a problem to solve together, and explicitly reflects on what they learned about their own communication style. Escalation is framed as a deliberate last resort, not a default.',
    redFlags: ['Blames the teammate without self-reflection', 'Describes the same disagreement repeating (did not learn)', 'Escalated prematurely without direct conversation'],
  },
  {
    id: 'biggest-failure',
    prompt: "What's your biggest failure, and what did you learn?",
    whatTheyProbe: 'Self-awareness. Can you name a real failure without spinning it, and can you translate it into a durable change in how you work?',
    junior: 'Picks a small failure (bug, missed deadline); describes the fix.',
    mid: 'Picks a genuine failure with real cost; describes the process change that resulted.',
    senior: 'Names a decision-level failure (wrong architecture, wrong prioritization, hiring, team structure). Explains the signals they missed, the mental model that led them astray, and how they changed their own judgment — not just the process.',
    redFlags: ['"My biggest failure is that I work too hard"', 'Failure was 100% someone else\'s fault', 'No durable lesson — "I just worked harder"'],
  },
  {
    id: 'scope-cut',
    prompt: 'Tell me about a time you had to cut scope to hit a deadline.',
    whatTheyProbe: 'Prioritization under pressure. Can you distinguish "nice-to-have" from "must-have" quickly and sell the cut to stakeholders?',
    junior: 'Describes what was cut; may not explain why those items specifically.',
    mid: 'Prioritized by user impact; explains the tradeoff and got PM buy-in.',
    senior: 'Named the release\'s core promise to the user in one sentence, cut everything not defending that promise, and documented the deferred work so it actually got done later. Proactively flagged the slip before the deadline, not at it.',
    redFlags: ['Missed the deadline anyway because nothing was cut', 'Cut the wrong thing (cut the user-visible feature, kept the internal cleanup)', 'Stakeholders were surprised at launch'],
  },
  {
    id: 'leadership-no-authority',
    prompt: 'Describe a time you led without being the manager.',
    whatTheyProbe: 'Influence, communication, willingness to take ownership outside your mandate.',
    junior: 'Organized a small task among peers.',
    mid: 'Drove a cross-team initiative to conclusion through meetings and docs.',
    senior: 'Identified a problem nobody owned, recruited the right people, produced artifacts (doc, RFC, timeline) that kept the work aligned, and explicitly credited contributors. Can name what they delegated vs did themselves and why.',
    redFlags: ['Described as "I told them what to do"', 'Took all the credit', 'Project stalled when they rotated off — no successor'],
  },
  {
    id: 'architectural-regret',
    prompt: 'Describe an architectural decision you regret.',
    whatTheyProbe: 'Design sense, long-term thinking, ability to name the tradeoffs you got wrong.',
    junior: "Hasn't made architectural decisions yet — redirect to a coding decision.",
    mid: 'Names a library / framework / shape choice that cost them later; explains why.',
    senior: 'Names the decision, the information available at the time, the assumption that turned out wrong, and the remediation path (migrated? lived with it? rewrote?). Articulates what they would now look for before making that class of decision again.',
    redFlags: ['"I have no regrets"', 'Blames the requirements not the decision', 'Did not migrate or mitigate — just kept complaining'],
  },
  {
    id: 'disagree-manager',
    prompt: 'Tell me about a time you disagreed with your manager.',
    whatTheyProbe: 'Can you challenge upward without insubordination? Do you know when to disagree-and-commit?',
    junior: 'Expressed disagreement, followed the manager\'s call.',
    mid: 'Made the case with data, accepted the decision after being heard.',
    senior: 'Framed the disagreement as a shared problem, brought data and alternatives, asked what would change their mind. After the call, committed fully — including to peers. Has a specific example of when they escalated a decision they still disagreed with, and why.',
    redFlags: ['Badmouthed the manager to peers after the decision', 'Refused to disagree ever', 'Let a bad decision happen silently to avoid friction'],
  },
  {
    id: 'production-incident',
    prompt: 'Walk me through a production incident you led or handled.',
    whatTheyProbe: 'Calm under pressure, diagnostic rigor, communication, postmortem quality.',
    junior: 'Was paged, followed a runbook, escalated.',
    mid: 'Diagnosed and mitigated; wrote the postmortem; drove one or two action items.',
    senior: 'Separated mitigation (stop bleeding) from root-cause (prevent recurrence); communicated status to stakeholders during the incident; ran a blameless postmortem; drove systemic fixes (tests, guardrails, runbooks) not just the specific bug fix. Names the signal that would have caught it earlier.',
    redFlags: ['Blamed a person in the postmortem', 'Fixed the immediate bug but not the class of bug', 'No communication during the incident'],
  },
  {
    id: 'mentoring',
    prompt: 'Tell me about someone you mentored.',
    whatTheyProbe: 'Investment in people, teaching ability, empathy.',
    junior: "Hasn't formally mentored; talk about helping a peer.",
    mid: 'Took on an intern or junior; describes regular 1:1s and reviews.',
    senior: 'Tailored the approach to the mentee — what they needed, what gaps mattered. Names a specific growth moment and how they surfaced it. Explicitly transferred ownership so the mentee could succeed without them. Can name where the mentoring did NOT work and why.',
    redFlags: ['Talked mostly about what they taught, not what the mentee learned', 'Same approach for every mentee', 'Created a dependency, not independence'],
  },
  {
    id: 'prioritization',
    prompt: 'Describe a time you had to prioritize conflicting requests from multiple stakeholders.',
    whatTheyProbe: 'Stakeholder management, clarity of judgment, ability to say no.',
    junior: 'Asked the manager to prioritize for them.',
    mid: 'Used a framework (impact × effort, RICE) and negotiated.',
    senior: 'Started by naming the underlying tension explicitly to both sides. Proposed a decision with clear tradeoffs in writing, not a meeting; got asynchronous sign-off. Followed up with the side that did not win on when their ask would be revisited.',
    redFlags: ['Tried to deliver both; delivered neither well', 'Let the loudest stakeholder win every time', 'Said yes to everything'],
  },
  {
    id: 'ambiguous-requirements',
    prompt: 'Tell me about working on a project with ambiguous requirements.',
    whatTheyProbe: 'Tolerance for ambiguity, clarifying skills, ability to ship before full certainty.',
    junior: 'Asked for more specification before starting.',
    mid: 'Produced a short doc or spike, validated direction, iterated.',
    senior: 'Named the ambiguity, made it visible, and chose the smallest reversible step that would reduce it. Set a budget for exploration, ran a time-boxed spike, and converted findings into a concrete plan. Proactively communicated what was still unknown.',
    redFlags: ['Waited for perfect spec and missed the window', 'Assumed and built the wrong thing', 'Hid the ambiguity instead of surfacing it'],
  },
  {
    id: 'disagree-and-commit',
    prompt: 'When have you disagreed and committed?',
    whatTheyProbe: 'Maturity. Can you lose an argument without losing the team?',
    junior: 'Has an example but may conflate it with following an order.',
    mid: 'Voiced concern, accepted the call, executed in good faith.',
    senior: 'Explicitly made the case, lost the vote, explicitly signalled commitment to the team ("I was wrong" or "this is the plan now"), and executed without dragging. Can name a case where they were proven right later — and did not gloat — and one where they were proven wrong and said so publicly.',
    redFlags: ['Passive-aggressive execution', '"I was right all along"', 'Re-litigated the decision mid-execution'],
  },
  {
    id: 'scaling-team',
    prompt: 'How have you helped scale a team or codebase?',
    whatTheyProbe: 'Senior signal — do you invest in team velocity, not just your own output?',
    junior: 'Shipped features faster themselves.',
    mid: 'Wrote docs, standardized patterns, improved local dev loop.',
    senior: 'Identified a scaling bottleneck (onboarding, deploys, test time, ownership gaps) and invested in fixing it, often at the cost of their own feature throughput. Measured the improvement. Framed it to leadership as team velocity, not personal scope.',
    redFlags: ['Added process for its own sake', 'Built tools nobody used', 'Did not measure outcome'],
  },
  {
    id: 'feedback-hard',
    prompt: 'Tell me about a time you received hard feedback.',
    whatTheyProbe: 'Coachability. Can you take a hit without becoming defensive?',
    junior: 'Felt bad about it, fixed the specific thing.',
    mid: 'Reflected, changed behavior, thanked the giver.',
    senior: 'Separated the sting from the signal. Named what was accurate, what they initially disagreed with, and what they later conceded was right. Can describe a durable behavior change and the mechanism by which they keep the feedback active.',
    redFlags: ['"I didn\'t get any feedback that year"', 'Got defensive and explained why the feedback was wrong', 'No durable change'],
  },
];

export const starTemplate = {
  headline: 'STAR — the shape of every behavioral answer.',
  steps: [
    { letter: 'S', name: 'Situation', guide: 'One sentence. The context. When, where, who.' },
    { letter: 'T', name: 'Task', guide: 'Your specific responsibility. "I owned…" / "I was the lead…".' },
    { letter: 'A', name: 'Action', guide: 'What YOU did. Not the team. Verbs: I decided, I wrote, I asked, I cut.' },
    { letter: 'R', name: 'Result', guide: 'Quantified if possible. Then the reflection: what you learned / would do differently.' },
  ],
  common_mistake:
    'Too much S and T, not enough A and R. The interviewer wants to understand your actions and judgment, not the backstory. Budget: 15% situation, 10% task, 60% action, 15% result + reflection.',
};

export const answerShapeRules = [
  'Pick one concrete example. Never "I always…" — interviewers probe for specifics.',
  'Use "I" not "we" when describing your actions. Credit the team in the result.',
  'Budget 2 minutes per answer. Long rambly answers signal weak prioritization.',
  'End with a reflection, not the action. The reflection is where seniority shows.',
  'Prep ~6 stories that cover 80% of prompts. Most prompts map onto a few core experiences.',
];

export const questionsToAsk = [
  'What would success for this role look like in 6 months?',
  'What is the biggest technical debt the team carries, and what is the plan?',
  'How does the team decide what to work on?',
  'How do engineers here get promoted — what do you see in people who get to the next level?',
  'What is the on-call rotation like, and what is the cadence of production incidents?',
  'What has been the hardest tradeoff the team made in the last quarter?',
];
