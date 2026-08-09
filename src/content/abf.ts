import type { Entry } from './types';

/**
 * Numbers here are the re-verified snapshot, not the earlier internal summary.
 * Ruling 13: no internal tool, tracker, CI, or chat product names anywhere in this file.
 */
export const abf: Entry = {
  slug: 'autonomous-bug-fix',
  order: 1,
  title: 'Autonomous Bug-Fix Pipeline',
  tagline:
    'A four-layer, ~42,500-line system that drove bug tickets on a large dual-platform mobile codebase from evidence to merge request, unattended.',
  eyebrow: 'ENTRY 01 · MAY–AUG 2026 · SOLO',
  dates: 'May–Aug 2026',
  role: 'TikTok · Intelligent Creation, Software Engineer Intern',
  category: 'agent-infrastructure',
  categoryLabel: 'agent infrastructure',
  stack: ['agent harness', 'state machine + hooks', 'NestJS', 'React', 'SSE', 'iOS/Android CI'],
  headline: [
    { label: 'autonomous runs', value: '75' },
    { label: 'merge requests, 56 green CI', value: '66' },
    { label: 'steps, 7 enforcement hooks', value: '20' },
  ],
  caveatTeaser:
    'It turned tickets into CI-green merge requests on most runs; getting those MRs merged went far worse (2 of 66), and the caveats say why.',
  teaser: '34 of 73 runs ended waiting for a human with a phone.',

  metrics: [
    {
      label: 'Autonomous fix runs',
      value: 75,
      note: '73 with complete state records, over ~5 weeks of continuous operation',
      tone: 'primary',
    },
    {
      label: 'Merge requests produced',
      value: 66,
      note: `all 66 re-verified to exist via the code-review platform's API; 2 merged to trunk`,
      tone: 'primary',
    },
    {
      label: 'MRs reaching green CI',
      value: '56 / 66',
      note: '9 failed, 1 still running at snapshot time',
      tone: 'emerald',
    },
    {
      label: 'Platform split',
      value: 'iOS 41 / Android 32',
      note: 'same engine, platform-specific reference modules loaded on demand',
      tone: 'cyan',
    },
    {
      label: 'Code written',
      value: 42500,
      prefix: '~',
      suffix: ' lines',
      note: '4 layers: 8,385 engine / 4,909 scheduler / 29,179 dashboard / ~900 chat + proxy — the layer counts are exact, the headline is rounded',
      tone: 'violet',
    },
    {
      label: 'Pipeline enforcement',
      value: '20 steps, 7 hooks',
      note: '54 hard-block points in the step-completion hook alone',
      tone: 'amber',
    },
    {
      label: 'Build duration',
      value: 12,
      suffix: ' weeks',
      note: 'solo; first commit to last production run',
      tone: 'neutral',
    },
    {
      label: 'Scheduler ticks',
      value: '16,082 / 40 days',
      note: 'single long-lived daemon, 22 days without a restart at snapshot',
      tone: 'cyan',
    },
    {
      label: 'Knowledge-base rules',
      value: 29,
      note: '19 iOS + 10 Android, auto-written at step 19, read back at step 4',
      tone: 'emerald',
    },
    {
      label: 'Benchmark units',
      value: 31,
      suffix: ' paired',
      note: 'same bug entered twice — sparse ticket vs evidence-enriched ticket',
      tone: 'violet',
    },
  ],

  credits: 'TikTok Intelligent Creation · built solo',

  sections: [
    {
      id: 'what-it-does',
      heading: 'What the system does',
      body: `The pipeline picks up a bug ticket from the issue tracker, detects the platform, gathers evidence (attachments, logs, screen recordings, team chat threads, and the counterpart implementation on the other platform), forms competing hypotheses and votes on a root cause, edits the app source, opens a merge request, drives it through the internal CI, produces a QR install build for on-device verification, strips its own debug instrumentation, closes the ticket, and writes what it learned back into a knowledge base. Four cooperating systems do this: a fix engine, a scheduler daemon, a web dashboard, and a chat layer, built and operated solo in about 12 weeks.`,
      bullets: [
        '75 autonomous runs across iOS (41) and Android (32); 66 merge requests produced, 56 of them reaching a fully green pipeline',
        'Every code change gated behind a negative-logic kill switch, so a bad fix reverts to byte-identical original behavior by flipping one flag',
        'Only two human stop points by design: on-device verification, and a “this may not be a real bug” escape hatch',
        'Every claim the agent makes is a re-checkable artifact — evidence tables, cross-check matrices, anchored facts carrying file:line, and per-job CI records',
        'The run corpus itself is 21,021 lines of state archives and 17,153 lines of per-job CI logs',
        'Ran unattended on a laptop for weeks at a time: 16,082 scheduler ticks over 40 calendar days',
      ],
      viz: ['PipelineRing'],
    },

    {
      id: 'architecture',
      heading: 'Two planes and the one wire between them',
      body: `The laptop that does the work sits inside an office network and accepts no inbound connections. Nothing in the cloud can call it — not the dashboard, not a webhook, not a retry after a dropped job. Every wire between the two planes therefore has to originate on the laptop, and the architecture is mostly a consequence of that one fact.

What it forces is a push channel with no content in it. A button in the web UI does exactly one thing: increment a version number on a single control-signal row. The number says nothing about which job, which action, or which user — it only says that something moved. The laptop, holding an outbound connection open, notices the increment and re-reads the database to find out what actually changed. The practical payoff is that adding a new button to the UI needs no protocol change on either side, because there is no protocol to change.

The result is a deliberately lopsided system. The two planes share exactly one Postgres table plus that one signal; everything else — 25 endpoints, five runners, the 20-step machine, the worktrees — lives entirely on one side or the other. The web tier reaches the database through HTTP, a service layer, and an ORM. The worker speaks no HTTP to the database at all; its only HTTP is the signal connection it dials itself.`,
      bullets: [
        'The office network refuses inbound connections, so the control plane cannot reach the worker at all. Any button increments a version; the worker dials out, sees it moved, and re-reads the database to learn what changed. The signal itself carries no business semantics',
        'Three tiers under the push channel: the WebSocket route never delivered a signal — the listener read that as the gateway refusing the upgrade, though probing the route directly makes that the client\u2019s inference rather than an observation — so the live channel is SSE with a 15 s heartbeat and a deliberate reconnect every 10 minutes; if that fails it drops to long-poll, and under that the 90 s full tick remains as the floor. Click to spawned process is 1–2 seconds',
        `The write path is asymmetric: the web tier goes /api/* → service → ORM, while the worker skips that path entirely and writes to the database directly. The service layer's state-machine validation therefore does not apply to the worker, whose correctness rests entirely on each runner's own compare-and-swap`,
        'Of the 20 steps, exactly one — step 15, on-device verification — is a scheduled human stop; the only other way a run waits for a person is the “this may not be a real bug” escape hatch, which is an escalation rather than a step. Step 15 is also the system’s largest queue: 34 of 73 runs end there',
      ],
      viz: ['ArchitectureMap'],
    },

    {
      id: 'four-layers',
      heading: 'Four layers',
      body: `The system separates the thing that reasons about code from the thing that schedules work, from the thing humans click on, from the thing that talks to people. Each layer can fail without taking the others down, and each was measured independently.`,
      bullets: [
        'Fix engine (8,385 lines) — an agent-harness plugin: 20-step state machine, 7 enforcement hooks, 6 skills, 3 reviewer/designer subagents, 22 reverse-engineered CI, merge-request, and tracker reader scripts',
        'Scheduler and daemon layer (4,909 lines) — 5 scheduler runners, CI watchdog, signal listener, assignee sync, all long-lived on the laptop',
        'Web dashboard (29,179 lines) — NestJS + React full-stack app: 25 endpoints, 4 tables, a 16-state business state machine, bilingual UI',
        'Chat and notification layer (~900 lines) — outbound interactive cards, an inbound Q&A bot, and a local CONNECT proxy underneath both',
        'The control plane (cloud) and execution plane (laptop) are coupled through exactly one database table plus one outbound signal channel — the laptop accepts no inbound connections',
        'Context budget was a first-class design constraint: the 2,809-line main skill loads in three tiers so a long headless run never blows its window',
      ],
      viz: ['LayerStack'],
    },

    {
      id: 'enforcement',
      heading: 'A 20-step state machine that hooks actually enforce',
      body: `Getting an LLM to edit code was the easy part. The work went into what an unattended agent must be unable to do: ask a human mid-run, reorder steps, or ship with its own debug instrumentation still attached. Entering step N writes the run status; the step-completion hook asserts that finishing step N leaves status at N+1 or beyond, and exits non-zero otherwise. The ordering is mechanically enforced; most content checks are existence checks.`,
      bullets: [
        '20 step branches and 54 hard-block exit points in the completion hook; a misspelled status name is rejected against a 20-value enum rather than silently bypassing the guard',
        'Inverted debug-log lifecycle — one of the few real content checks: the hook verifies instrumentation is present at commit #1 and fully removed at the strip commit, by diffing against merge-base and grepping the tag',
        'An ask-guard makes the agent physically unable to open a question prompt except at the verification step; the rejection message hands it the alternative action',
        'A verify-guard blocks source edits by path and extension while a build is out for on-device testing',
        'A discriminating-evidence gate: if no observation separates the top two hypotheses, the root cause is written UNDETERMINED and the round is deliberately downgraded to a diagnostic round with a quota of rival-hypothesis probes, so the round still yields evidence',
        `Three-reviewer voting on root cause (two design reviewers plus a devil's advocate required to produce counter-hypotheses) before any code is touched`,
      ],
    },

    {
      id: 'execution-plane',
      heading: 'Distributed execution plane',
      body: `Multiple runners, a cloud dashboard, and a laptop daemon all race for the same jobs. There is no coordinator; correctness comes from making each claim atomic.`,
      bullets: [
        'Compare-and-swap row claiming: UPDATE ... WHERE id AND status = expected, and only affected_rows == 1 wins — this replaced a read-after-write pattern that had already produced duplicate merge requests for one ticket',
        'Work-conserving max-min fair share across ticket owners as a 19-line pure function, layered under strict priority banding (any P0 preempts any P1)',
        `Per-ticket git worktree isolation; the kill path resolves processes by both PID marker and ticket-scoped match, then re-reads and re-kills, and deliberately drops path matching so it can't take out a human's editor`,
        'Orphan takeover resumes runs whose process died, behind four guards: state allowlist, credential check, 15-minute cooldown, and a repeat counter that fails the run rather than burning tokens in a loop',
        'Reverse reconciliation (database → disk) that only warns and never mutates, because the primary sync is one-directional and rows whose run directory vanished would otherwise fall out of every check silently',
      ],
      viz: ['CasRace'],
    },

    {
      id: 'signal-path',
      heading: 'The signal path',
      body: `The control plane runs in the cloud and the execution plane runs on a laptop that accepts no inbound connections, so the fast path had to be outbound-only. The laptop opens an SSE stream, advertises how much work it can take through a credit-pull protocol, and the dashboard hands out jobs against that credit. Polling was never removed; it dropped to a fallback.`,
      bullets: [
        '106 kicks delivered on the push channel: 102 over SSE with credit-pull, 4 over plain SSE; the long-poll fallback was built out and never promoted, and the WebSocket route never worked through the gateway',
        'Click-to-spawn fell from ~95 s to 1–2 s, because the laptop no longer had to wait for its next poll tick to learn there was work',
        'Dual-speed polling stays underneath at 90 s active / 600 s idle, so a dropped stream degrades responsiveness instead of losing a job',
        '16,082 scheduler ticks over 40 calendar days on a single long-lived daemon, 22 of those days without a restart',
      ],
      viz: ['SignalLatency'],
    },

    {
      id: 'control-plane',
      heading: 'Control plane: the web dashboard',
      body: `A full-stack app that turns each ticket into a board row and exposes every human decision the pipeline needs: start, interrupt, cancel, verified-pass, verified-fail with screenshots and logs attached, needs-human, ignore, restore, delete, mark merged — plus take-over, which is written but never shipped past the working tree. It also runs assignee sync against the tracker and hosts the signal channel the laptop listens on.`,
      bullets: [
        '25 HTTP endpoints, 4 tables, a 16-state business state machine, and a 20-step drill-down view per ticket',
        `Transitional-state template: the web tier only CAS-sets an intermediate state and rings the bell; the destructive work (killing processes, removing worktrees) happens on the worker, which then CAS-closes the state — so "ignore then immediately delete" can't leak a worktree`,
        'The platform forbade online schema changes, so four pieces of state ride parasitically inside existing columns (per-step notes as encoded comments, service credentials in a sentinel row) — each with the motivation written into the code',
        'No unique index was available either, so duplicate inserts are resolved by a deterministic application-level rule both racers independently evaluate, leaving exactly one row under any interleaving',
        'Three-state (open / closed / unknown) ticket rechecking instead of a boolean: destructive convergence acts only on a confirmed close, and "unknown" is logged and skipped by design',
        'Bilingual UI at 289 keys per language with zero gaps, an AES-256-GCM credential vault, and 67 passing unit tests',
      ],
    },

    {
      id: 'chat-layer',
      heading: 'Chat and notification layer',
      body: `Two directions on the internal chat platform: outbound interactive cards at the three moments a ticket owner needs to act, and an inbound bot that answers questions about live runs.`,
      bullets: [
        '185 notification cards delivered across 84 tickets at three trigger moments — run started, build ready for on-device verification, merge request opened — with deep links to the board, the ticket, the MR, and the install build',
        'Inbound routing is dual-path: closed questions (progress, CI status, list my tickets) answered synchronously from the database; open questions spawned as async LLM answers, bilingual, capped at 3 in flight',
        `Identity resolution is fail-closed — a unique display-name match inside the authorized user set or it degrades to "send me a ticket id"; it will never show one person another person's ticket`,
        'Three dedupe layers: event id, per-reply idempotency key, and "only notify on a real state transition"',
        'A local CONNECT proxy with multi-IP failover and 5-minute re-resolution underneath everything, after single-IP pinning proved to drop messages',
        'Inbound usage was tiny (24 answered messages lifetime), and 8 outbound cards failed because the bot lacked availability to those recipients. Those failures were silent, which is the worse problem',
      ],
    },

    {
      id: 'outcomes',
      heading: 'What shipped, and where it stopped',
      body: `Producing a reviewable MR worked: 66 of them, 56 fully green. Landing code did not: 2 merged to trunk. The more useful picture is where runs actually stop: the largest single terminal state is a finished build waiting for on-device verification.`,
      bullets: [
        'Funnel: 75 runs → 73 with complete state records → 66 merge requests → 56 green pipelines → 30 reached the debug-log strip step → 2 merged to trunk',
        'Terminal states across the 73 recorded runs: 34 waiting on on-device verification, 27 completed, 4 stopped in evidence collection, 4 escalated as needs-human, 3 at the strip commit, 1 at the first commit',
        '49 of the 66 merge requests were deliberately non-merge benchmark experiments; of the 17 regular intake tickets, one landed inside the internship window and ten are still open',
        'The merge decision always belonged to the owning engineer, so the merge count measures a human review queue at least as much as it measures the agent',
      ],
      viz: ['OutcomeFunnel', 'TerminalStates'],
    },

    {
      id: 'verify-gate',
      heading: 'The gate that never fired',
      body: `Tier-1 automated self-verification never returned a verdict: 46 runs, 46 skips, zero PASS and zero FAIL. The guardrail direction was correct — it was built to skip rather than risk a false PASS that would revert a good fix — but its practical contribution to this dataset was zero. The dominant blocker was concrete and fixable: CI emitted device builds while the verifier needed simulator builds.`,
      bullets: [
        'Skip reasons: 22 needed a simulator build the CI only produced as a device build, 8 never reached the changed code path, 6 had no criteria file, 4 had no build artifact, 6 other',
        'The one guarantee it did deliver is the one it was designed for: it failed closed, so it never returned a PASS that would have reverted a working fix',
        'The failure was coverage: a guardrail that skips 46 out of 46 times contributes nothing to the dataset it was built to defend',
      ],
      viz: ['VerifyGate'],
    },

    {
      id: 'benchmark',
      heading: 'Benchmark and the knowledge-base learning loop',
      body: `To test whether richer evidence makes an agent fix bugs better, I built a two-arm benchmark: the same bug entered twice — once as the raw ticket, once as an evidence-enriched repro ticket — run in two isolated rounds. The result turned out to be unanswerable at n=5, so what this section mostly documents is the measurement setup.`,
      bullets: [
        '31 paired units across two platforms and three product areas, with an independent round-2 scheduler and event log',
        `Contamination isolation was mechanical: round-1 run directories were physically moved out of the scan root, and their stale worktree git pointers renamed so any accidental reuse fails loudly instead of operating on someone else's branch`,
        'The headline finding is negative: only 5 units have on-device verdicts on both arms, so at n=5 the core question is not answerable',
        'Quoted pass rates swing from 18% to 58% purely on denominator choice, so every table ships with a "denominator" page defining numerator and denominator before any rate appears',
        `About 43% of second-round units couldn't be reproduced at all (missing media, expired flags, platform gaps) — an environment constraint that contaminates any "of tickets attempted" denominator`,
        'Learning loop: 29 root-cause rules plus failure retrospectives are written at step 19 in the same commit as the fix and read back at step 4 — and a self-audit caught a duplicate rule number, i.e. unattended auto-numbering collides',
      ],
      viz: ['DenominatorSlider'],
    },

    {
      id: 'audit',
      heading: 'Evidence discipline under external audit',
      body: `Another product team inside the org challenged the reported quality directly: "most of these fixes didn't find the root cause, and the blast radius on existing logic is large." I did not argue from summary statistics. I ran a two-round adversarial review with 47 subagents (prosecution / defense / judge, then a second pass) where every conclusion had to point at a diff line or a file:line.`,
      bullets: [
        'Result on the 5 comparable tickets: 4 hit the real causal chain, 1 did not — conceded in writing, with the exact reason (the patch sat downstream of a gating predicate that was itself the defect)',
        'Blast radius measured in logical lines: larger on one ticket, comparable on two, clearly smaller on one',
        'Root cause of the "large blast radius" perception was my own delivery hygiene — 6 of 8 merge requests were reviewed with 20–25 debug log lines still attached, because the strip step was documented but not hook-enforced',
        'The review surfaced facts that helped my case and facts that hurt it; both went into the same document, in the same tables',
        'Two "verified pass" results had come from a convergence rule treating an externally closed ticket as equivalent to on-device verification; that rule was wrong and I removed it',
        `The audit trail, including the losing arguments, is archived alongside the winning ones; the run archives contain entries where a later round explicitly overturns an earlier round's own PASS`,
      ],
    },
  ],

  caveats: [
    `Two of the 66 merge requests were merged to trunk. Forty-nine were deliberately non-merge benchmark experiments, and the merge decision always belonged to the owning engineer; of the 17 regular intake tickets, one landed inside the internship window and ten are still open.`,
    `Tier-1 automated self-verification never returned a verdict: 46 runs, 46 skips, zero PASS and zero FAIL. The guardrail direction was correct — it was built to skip rather than risk a false PASS that would revert a good fix — but its practical contribution to this dataset was zero. The dominant blocker was concrete and fixable: CI emitted device builds while the verifier needed simulator builds.`,
    `Thirty-four of 73 runs (47%) end waiting for a human to verify the fix on a real device, the largest queue in the system. The design underestimated how much on-device verification it would generate; that queue set the system's real throughput.`,
    `Several enforcement gates check that an artifact exists rather than that it is correct, and I found one PASS gate that a compile-step line could satisfy. That means "reached the strip step" cannot be read as "verified fixed". The same gap let 6 of 8 audited merge requests reach review with debug instrumentation still attached; both gaps surfaced in an audit of my own hooks.`,
    `The system ran on a single laptop: credentials, worktrees, and run archives all lived locally, some capability existed only in unpushed local commits, and the two scheduler directories were never under version control. Making that setup durable was the correct next fix.`,
    `An earlier internal summary of this work quoted a materially higher first-attempt fix rate against a different denominator. The numbers on this page are the re-verified ones, and where they disagree with anything else I have written, these are correct.`,
    `Code is TikTok internal; the architecture map and state machines on this page are the shareable record.`,
  ],
};
