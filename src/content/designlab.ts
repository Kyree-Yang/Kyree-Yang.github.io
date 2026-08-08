import type { Entry } from './types';

/**
 * Snapshot of one working tree; the repo is multi-author, so every count here is
 * scoped to my contribution rather than the project total. Ruling 13: no internal
 * tool, platform, or design-system product names.
 */
export const designlab: Entry = {
  slug: 'design-lab',
  order: 2,
  title: 'Design Lab',
  tagline:
    'Designers ship real dual-platform UI code, not mockups — a 12-node agent DAG with deterministic quality gates.',
  eyebrow: 'ENTRY 02 · MAY–AUG 2026',
  dates: 'May–Aug 2026',
  role: 'TikTok · Intelligent Creation, Software Engineer Intern',
  category: 'agent-infrastructure',
  categoryLabel: 'agent infrastructure',
  stack: ['iOS UIKit', 'Jetpack Compose', 'Python', 'shell', 'subagent DAG'],
  headline: [
    { label: 'DAG nodes, 7 run as isolated subagents', value: '12' },
    { label: 'locales, 326 shared strings', value: '11' },
    { label: 'translation wait', value: '300 s → 5.1 s' },
  ],
  caveatTeaser:
    'Verified end to end on iOS; the Android side is specified and templated but device-verified only at contract level.',
  teaser:
    'A node that does not compile-check its own output will confidently call design-system APIs that do not exist.',

  metrics: [
    {
      label: 'DAG delivery nodes',
      value: 12,
      note: '10 designer/AI nodes + 2 engineer-owned handoff nodes',
      tone: 'primary',
    },
    {
      label: 'Isolated subagent stages',
      value: '7 of 10',
      note: 'seven output nodes dispatched to their own subagent, three input nodes kept in the main session because they must ask the designer a question',
      tone: 'violet',
    },
    {
      label: 'Locales in the shared string table',
      value: 11,
      note: '1 English source + 10 targets (zh, ja, ko, ar, de, ru, pl, uk, my, km)',
      tone: 'cyan',
    },
    {
      label: 'Translated string entries per locale',
      value: '326 + 9 plurals + 3 arrays',
      note: 'identical key count across all 11 locale files, 4,378 XML lines total',
      tone: 'cyan',
    },
    {
      label: 'Workflow infrastructure',
      value: '13,123 lines / 87 files',
      note: '4,761 Python, 1,600 shell, 6,305 markdown reference docs',
      tone: 'violet',
    },
    {
      label: 'Machine-translation wait, before → after',
      value: '300 s ceiling → 5.1 s',
      note: 'measured on the internal translation platform during the delta-only fix; a rejected intermediate design timed out at 63.8 s with 127/256 keys resolved, and a delta of 0 skips translation entirely',
      tone: 'emerald',
    },
    {
      label: 'Direction-icon RTL violations closed',
      value: '22 → 0',
      note: `direction-scanner rule RTL-ICON-001, before and after the mirror-helper rollout; blocking "Must" findings went 4 → 1 in the same scope`,
      tone: 'emerald',
    },
    {
      label: 'Deterministic gate scripts',
      value: '13 hooks, 5 blocking',
      note: '13 hook scripts across the node directories; 5 of them are completion gates that can return exit 2 and push the agent back to work',
      tone: 'amber',
    },
    {
      label: 'Playground screens under the workflow',
      value: '25 iOS / 22 Android, 16 tracked',
      note: '50,554 lines of playground UI code across 145 source files',
      tone: 'neutral',
    },
    {
      label: 'My commits on this codebase',
      value: '68 (+33,950 / −9,851)',
      note: 'repo total 202 commits on trunk, 122 feature branches, first commit 2026-04-08',
      tone: 'primary',
    },
  ],

  sections: [
    {
      id: 'problem',
      heading: 'The problem: designers were handing off pictures',
      body: `A designer's output was a static design file. Engineers then re-derived the UI from it, guessing at spacing, token choices, and every state the design file never showed — empty, loading, offline, dark, right-to-left, German-length text. The obvious fix (give designers the real monorepo) costs days of environment setup and produces code buried in a build system they can't run. The other obvious fix (a clean standalone demo project) produces code that uses raw platform controls, so engineers translate it anyway.

Design Lab takes the intersection: the complete company design system is pre-packaged as binary artifacts on iOS and a Maven dependency on Android, so a designer gets a zero-dependency project that compiles in seconds and whose code an engineer can lift verbatim. The agentic workflow sits on top and makes the quality bar mechanical rather than aspirational.`,
      bullets: [
        'Two standalone apps — iOS UIKit and Android Jetpack Compose — with the full company design system available, no monorepo checkout required',
        `Every screen is a self-contained "playground" directory; one command scaffolds it and registers it in the app's screen list`,
        `Agent instructions encode the design system's real traps (e.g. tokens whose names actively lie about their color), so generated code doesn't drift from the system`,
        'Delivery is a patch an engineer applies, not a design file an engineer interprets',
      ],
    },

    {
      id: 'dag',
      heading: 'Seven isolated subagent stages on a 12-node DAG',
      body: `Each screen carries a workflow.json describing its position in a dependency DAG: architecture selection → component selection → UI implementation → weak/no-network → empty state → screen-size adaptation → dark mode → i18n → localization adaptation → design merge request → engineer integration → engineer's final merge. Ordering is deliberate: structural additions first (new views), then layout, then color, then text — because text-related work must run last, after translated strings exist to stress the layout.

Nodes split into two execution modes. Three input nodes run in the main session because they must ask the designer a question. Seven output nodes are dispatched to isolated subagents, one per node, each with its own instruction manual, a declared capability list of reference documents, node-local tools, and its own hooks. The orchestrator never reads a node's internals — it stages parameters, launches the same-named agent, and reads back a structured summary.`,
      bullets: [
        'Each node directory is self-contained — an instruction manual, a capability declaration, hooks, references, and tools — for 39 reference documents and 10 node-local tools in total',
        'Hard rule enforced across the repo: adding a capability means adding a node directory; changing a capability means touching only that directory',
        'Feedback routing: designer comments are matched against per-node trigger phrase lists (the localization node alone declares 38 triggers in two languages) and re-opened in DAG order',
        'Subagent isolation prevents context pollution — a localization pass cannot see or accidentally rewrite the network-state work from three nodes earlier',
        'Cross-session resume is free: the in-progress node recorded in the workflow file is the resume point, so state is never inferred from conversation history',
      ],
      viz: ['DagFlow'],
    },

    {
      id: 'hooks-and-gates',
      heading: 'Lifecycle hooks and on-stop artifact gates',
      body: `Node bookkeeping is not the agent's job — it is the harness's. A start hook reads the agent's identity from the launch payload, resolves it against the node registry, and registers entry (status, pass counter, timestamp, log). If dependencies are not satisfied it performs a zero-registration: it writes nothing and injects context telling the subagent to stop immediately.

The stop hook is where the real leverage is. It sequences completion-check-then-bookkeeping in a single script — deliberately not two parallel hooks, because same-event hooks run concurrently and bookkeeping would happily mark a failing node complete. If the node ships a completion script, that script runs first; a non-zero exit blocks the agent from stopping and feeds the failure reason back on stderr so it keeps working. Five of the ten nodes carry such a gate, with retry ceilings so a flaky external toolchain cannot deadlock the pipeline.`,
      bullets: [
        'Gates are deterministic scripts, not LLM judgment: pattern scanners, a real compile, a translation-readiness query against the platform',
        'The localization gate (243 lines) aggregates three scanners then actually compiles the project, returning exit 2 with the error lines attached — this catches the failure mode where an agent invents a plausible-but-nonexistent design-system API name that no text scanner can detect',
        'A result-required gate refuses completion if the node wrote no findings — reasoning that stops without an artifact is reasoning that never happened',
        'Four additional on-write hooks fire during editing as non-blocking nudges (hard-coded colors, hard-coded direction, hand-rolled number formatting, fixed-width single-line text)',
        'Status fields are writable only by the workflow CLI; the agent may only edit its own result object',
      ],
    },

    {
      id: 'localization',
      heading: 'Localization: one shared source of truth, delta-only translation',
      body: `The original design carried three string tables — a JSON file for iOS plus two generated XML files for Android — with a code generator bridging them. I collapsed all of it into a single Android-format XML table per locale, shared by both platforms: Android consumes it directly as resources with zero code generation, and iOS parses it at runtime and converts positional placeholders. That deleted 15 files and an entire generator.

The harder problem was the translation loop. The old sync pushed the entire namespace to the machine-translation service, which swept every untranslated key in the shared workspace — including historical keys that will never translate — into one job, then blocked waiting for that job to finish. Designers watched a 5-minute timeout burn for a one-word change. The fix was on the trigger side, not the wait side: keep an English-source snapshot, compute the delta of new-or-changed keys, and translate only those. A delta of one now completes in 5.1 seconds; a delta of zero skips translation entirely.`,
      bullets: [
        `One shared table per locale — 326 strings, 9 plural sets, 3 arrays, identical key coverage across all 11 locales including Arabic's 6 plural forms`,
        'Two-tier quality: a deterministic checker flags literal strings sitting directly on output sinks (blocking), while a reviewer subagent traces indirect hard-coding — strings that reach the UI via a variable, mock data class, or computed property, which no static scan can see',
        'A duplicate-value gate blocks minting a second key for text that already exists ("Back", "Save"), which would otherwise be paid for and translated inconsistently multiple times',
        'A handwritten-translation lock file protects the 12 hand-authored entries (CLDR plural forms across ru/uk/pl/ar) that machine translation systematically gets wrong, which the write-back would otherwise silently overwrite',
        'An explicit rule distinguishes "still translating" from "translation failed": re-pull and diff the table — the count the API reports is a write count, not a change count, and trusting it produced a real false negative',
      ],
      viz: ['DeltaMtRace'],
    },

    {
      id: 'rtl',
      heading: 'RTL boundary correctness',
      body: `Right-to-left support is where a layout quietly breaks: a chevron still points left, a price label's currency symbol lands on the wrong side, an absolute left/right constraint survives the mirror. I built this as a second instance of the same generate-then-check machine the localization work established — swap the checker for a direction scanner, add an auditable mirroring-exception registry.

The scanner classifies findings by confidence. A single-sided absolute constraint is a blocking Must; a symmetric full-width pin is a Should (visually RTL-safe, merely unidiomatic) — that distinction alone removed most of the noise. For direction icons it does a plus-or-minus three line window scan for mirroring markers across all four platform mechanisms, so already-fixed sites stop reporting. The scanner ships with a 20-case self-test to prevent regressions in the rules themselves.`,
      bullets: [
        'Blocking findings went 4 → 1 and direction-icon findings 22 → 0 in the worked scope; the single survivor is a trailing character counter that needs a human design decision, and it is honestly left open rather than silenced',
        'No mirrored image assets existed anywhere in the repo, so the fix had to be programmatic flipping — I added a small mirror helper per platform and rolled it across 22 call sites',
        `The exception registry is deliberately empty. Review confirmed all 22 candidates were "should mirror, currently doesn't" — filing them as exceptions would have made the gate pass while the bug shipped. Each real exception requires 7 fields including owner, expiry, and a regression sample`,
        `Bidirectional text isolation (FSI/PDI wrapping around numbers, handles, and hashtags) is applied at sync time, so mixed-direction fragments don't reorder`,
      ],
      viz: ['RtlMirror'],
    },

    {
      id: 'network-states',
      heading: 'Weak and no-network states',
      body: `The network node covers the states a design file never shows. It models four design states over a three-value network classification aligned with the production app (normal / weak / offline) plus one sandbox-only gear for forced timeout, and two latency thresholds: a 3-second slow threshold that adds an "unstable connection" hint without interrupting loading, and an 8-second timeout that converts loading into a retryable failure. Crucially, weak network defaults to slow but successful — matching real networks — with timeout kept as a distinct state rather than collapsed into it.

A selection matrix maps 8 loading scenarios to 6 loading forms (loading ball, skeleton, spinner, progress ring, in-panel pie, blocking overlay) and decides, per scenario, whether the failure state carries a retry affordance — full-screen and skeleton loads do; pull-to-refresh, load-more, and partial refresh don't, and must restore the pre-action state instead of leaving a half-finished view.`,
      bullets: [
        'The mock network state machine is a global toggle in the developer tools panel; switching gears re-mounts the current screen centrally, so screens stay pure query-to-data with zero network-listener plumbing — meaning the code an engineer receives has no sandbox scaffolding to strip',
        `Deliberately asymmetric implementations, each faithful to how that platform's engineers actually write it: iOS leans on the design system's built-in network state machine via a host capability hook; Android maps state to title/message/retry by hand because its component has no state machine`,
        `Hard-won runtime finding: routing failure states through the built-in error path renders raw translation keys in the sandbox, because that path resolves copy from internal keys absent from the sandbox table — the node's manual now mandates an explicit config with spec-sourced English copy`,
        'Second hard-won finding, visible only on a real device: the status view has an intrinsic minimum height, so pinning it inside a short fixed card pushes the retry button under its neighbor. The scenario matrix now carries a quantified large-vs-small container threshold',
      ],
      viz: ['NetworkStates', 'ScenarioMatrix'],
    },

    {
      id: 'fault-injection',
      heading: 'Verification by fault injection, not happy path',
      body: `Every node I built was validated with deliberately bug-seeded adversarial pages rather than "it didn't crash" testing. The method is three steps: a dirty fixture containing known anti-patterns and a clean twin; confirm the deterministic gate returns exit 2 on the dirty one and exit 0 on the clean one with no false positives; then run the full node and confirm it fixes every seeded defect, that the reviewer tier catches the ones no text scan can see, and that the exception registry wasn't used to cheat; finally build, install, and screenshot on a real device per locale.

That last step is what surfaced the most valuable finding: a node that doesn't compile-check its own output will confidently emit fixes calling design-system APIs that don't exist. A guessed method name is not a grep-able anti-pattern — only a real build reveals it. That discovery is why compilation is now a hard gate inside the node's stop hook rather than a closing suggestion.`,
      bullets: [
        'Device evidence for localization: German currency/date/number rendering (1.299,00 and 23.07.2026) and Arabic mirrored layout with flipped chevrons',
        'Deterministic, touch-free screenshots via launch-environment overrides that open a specific screen directly in a specific state — no UI automation or scripted tapping needed',
        'A layout probe drives the device through 8 locales, dumps the view hierarchy per locale, and diffs element bounds against the English baseline to report four finding types: line-wrapped, row-uneven, clipped, and grew-to-edge',
        'A mandatory cleanup step resets the app to a cold English left-to-right state after evidence collection — the Android locale override is persistent, and a designer opening the app to a fully Arabic screen would reasonably conclude the page was broken',
        `Honest reporting is enforced: if the build fails after two retries the node must write a blocker and say "the code does not currently compile" rather than reporting success`,
      ],
      callout: {
        title: 'Why compilation became a hard gate',
        text: `A node that does not compile-check its own output will confidently emit fixes calling design-system APIs that do not exist. A guessed method name is not a grep-able anti-pattern — only a real build reveals it.`,
      },
    },

    {
      id: 'dashboard',
      heading: 'Delivery-status dashboard',
      body: `Progress lives in the repository, not a tracker. Each screen's workflow file is the single source of truth; an aggregation script scans both platform trees, serializes every workflow file into a static data module, and a dependency-free HTML page renders it two ways — a Kanban overview that folds the DAG into linear delivery phases, and a per-screen detail view showing the full DAG with per-node status, owner, and result payload.

The board is intentionally read-only. Every write goes through the agent or a direct file edit, which keeps the DAG's invariants (dependency satisfaction, pass counters, skip authorization) enforced in one place. Each node card carries a copy-to-clipboard prompt so a designer can hand the exact instruction to the agent instead of describing what they want.`,
      bullets: [
        'Zero runtime dependencies — plain HTML/CSS/SVG, opened from a single make target, no server and no build step',
        '16 screens currently tracked across both platforms, aggregated by a 31-line script using only the standard library',
        `Statuses are writable only by the workflow CLI, so "completed" always means the node's gate actually passed`,
        'Engineer-owned nodes (integration, final merge) are present but never auto-completed by the agent — the board never claims work that another team has not done',
      ],
    },
  ],

  caveats: [
    `Numbers are a snapshot of one working tree on 2026-08-07. The repository is multi-author (202 trunk commits, 122 feature branches); my measured contribution is 68 commits, +33,950/−9,851 lines, concentrated in the workflow engine, the localization/RTL/network nodes, and the shared string pipeline. The sandbox host apps and design-system packaging are shared team work.`,
    `The RTL figures (blocking 4→1, direction icons 22→0) are for the scope at the time of that work. Running the same scanner today over the whole tree reports 28 blocking / 41 advisory findings, almost entirely inside a third-party component library imported by others afterward and never brought into the node's remit.`,
    `The weak/no-network node was hard-verified end to end on iOS only; the Android side is specified and templated but device-verified only at contract level. Within iOS, "enters directly into a state" scenarios (full-screen first load, progress ring) are device-proven, while gesture-triggered scenarios (pull-to-refresh, load-more) and skeleton screens remain contract-level.`,
    `Machine translation here exists so a designer can verify that switching language actually works — it is explicitly not shipping copy. Human translation happens downstream in the same task, and the pipeline reports which strings are still falling back to English rather than hiding it.`,
    `Several of the described features lived on feature branches pending review at the time of this snapshot rather than on trunk; the localization node and the second weak-network pass in particular were verified locally but not yet merged.`,
  ],
};
