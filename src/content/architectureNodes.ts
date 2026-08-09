/**
 * Detail copy for the ArchitectureMap nodes. One entry per node id in that component.
 *
 * Every number here comes from the re-verified measurement pass, not from the earlier
 * internal summary. Ruling 13 applies: no internal tool, tracker, CI, chat, or platform
 * product names anywhere in this file.
 */

export type NodeDetail = {
  /** Matches the node id in ArchitectureMap. */
  id: string;
  title: string;
  plane: 'control' | 'execution' | 'external';
  /** One sentence: what this component is responsible for. */
  summary: string;
  /** 2-5 concrete facts, each with a number or a named mechanism where the archive has one. */
  facts: string[];
  /** Optional: the interesting failure, constraint or design tension. One sentence. */
  tension?: string;
};

export const architectureNodes: Record<string, NodeDetail> = {
  /* ---------------------------------------------------------------- control */

  c1: {
    id: 'c1',
    title: 'Chat-platform web app',
    plane: 'control',
    summary:
      'The dashboard as it is actually opened by most people: an in-app link inside the chat client, on desktop and phone, rather than a URL pasted into a browser.',
    facts: [
      'Every "open the board" affordance — outbound notification cards and inbound bot replies alike — emits one shared deep link that opens the dashboard inside the chat client\'s embedded web container instead of kicking out to the system browser.',
      'The raw web address is declared as a constant in two separate files and referenced in zero of them; the in-app link is the only path anything actually uses.',
      'Cards carry four destinations: the board, the ticket, the merge request, and the QR install build. All of them are plain URL jumps — no button callbacks are handled anywhere in the system.',
      'The entire chat integration subscribes to exactly one event type: inbound one-to-one text messages. Group messages, images, and rich text are silently dropped, which a dry-run replay confirmed produces no output at all.',
    ],
    tension:
      'That the in-app link actually opens for every recipient was never verified end to end — the only evidence is that both senders emit a byte-identical string.',
  },

  c2: {
    id: 'c2',
    title: 'Desktop browser',
    plane: 'control',
    summary:
      'The other way in: the same single-page app loaded directly in a browser on the internal network, where every human decision the pipeline needs is a button.',
    facts: [
      'Ten shipped human decisions live here — start, interrupt, cancel, verified-pass, verified-fail with screenshots and logs attached, needs-human, ignore, restore, delete, mark merged.',
      'Both the board and the job-detail view stop polling when the tab is hidden and refresh once immediately on return, rather than running a timer against a page nobody is looking at.',
      'The browser\'s built-in page translation used to take the whole app down: it wraps text nodes in extra elements outside React\'s knowledge, so the next reconciliation pass throws on insertBefore/removeChild and the top-level error boundary degrades the entire page.',
      'The fix is 75 lines installed on the DOM prototype two lines before React mounts, with an idempotent install flag; it downgrades only the path that was already going to throw into a no-op and leaves normal behaviour untouched.',
    ],
    tension:
      'Users reported that translation crash as "clicking Start returns an error" when the row had in fact been written successfully — a pure render failure that looked exactly like a backend failure.',
  },

  gw: {
    id: 'gw',
    title: 'Internal app-platform gateway',
    plane: 'control',
    summary:
      'The hosting platform\'s edge, which terminates every request to the control plane and splits it into three route classes before the application ever sees it.',
    facts: [
      'Three classes: browser traffic on an SSO session, worker traffic on an API key, and a server-rendered catch-all for everything else. The worker only ever touches the second.',
      'The listener classified the WebSocket route as a gateway refusal 713 times and never received a signal over it. Probing that route directly returns the application\u2019s own 404 rather than a gateway rejection, so the gateway-policy reading is the client\u2019s inference, not an observation — the downgrade is real, its stated cause is not confirmed.',
      'Identity arrives at the application as plain request metadata, which is why an offline reproduction of the whole login path needed only about 100 lines of stand-in gateway.',
      'A probe distinguishes the two failure surfaces: a path that does not exist returns a gateway-level rejection, while the WebSocket route returns the application\'s own 404.',
    ],
    tension:
      'The cheapness of reproducing the gateway offline is the same property that makes it a thin guarantee — the stand-in used in the offline bundle performs no authentication at all, and the bundle\'s own limits document says so in plain words.',
  },

  g1: {
    id: 'g1',
    title: '/api/* — SSO user session',
    plane: 'control',
    summary:
      'The browser-facing surface: 21 of the 25 HTTP endpoints, all of them scoped to the signed-in user.',
    facts: [
      '21 endpoints split as fix-job 15, watch-config 3, credential 2, translate 1. All 15 write endpoints carry the login guard.',
      'A handful of read endpoints rely on data scope rather than the guard: an absent user id degrades the query to an owner nobody matches and returns an empty set — fail-closed by scope, which is a different property from fail-closed by guard.',
      'Visibility is one shared predicate reused by every read path: rows you own, OR rows whose assignee is on your watch list and are not ignored. Other people\'s ignored rows deliberately never surface.',
      'Write endpoints still check ownership independently, so visible is explicitly not controllable — the two checks are separate by design.',
    ],
    tension:
      'None of these 21 endpoints has a machine-readable contract: the checked-in API spec covers only the four worker endpoints, and the generator script is literally an echo printing "unsupported, skip".',
  },

  g2: {
    id: 'g2',
    title: '/openapi/* — API key, worker egress only',
    plane: 'control',
    summary:
      'The four endpoints the laptop is allowed to dial, and the only wire on which the cloud can tell the laptop that anything happened.',
    facts: [
      'Exactly four: a long-poll held up to 20 s, a version baseline read, an SSE stream, and a credit-pull upstream. They are also the only endpoints in the repository with a machine-readable contract.',
      'SSE is tuned defensively: 15 s heartbeat comment frames, a 3 s database re-check for cross-instance changes, a deliberate disconnect at 10 minutes to force reconnection, and explicit no-buffering headers so intermediaries cannot hold frames.',
      'The credit protocol hands out one credit at a time and carries a 30 s lease grace, so a credit lost in flight tops itself up instead of starving the worker.',
      'The payload is a single integer. It names no job, no action, and no user — adding a new button to the UI requires no protocol change on either side, because there is no protocol to change.',
    ],
    tension:
      'The server side of the credit protocol was never independently confirmed from outside — a GET probe of the pull endpoint is rejected at the gateway because the real call is a POST, so the only evidence it works as specified is the client\'s own log of 3,996 successful negotiations.',
  },

  g3: {
    id: 'g3',
    title: '/* — server-rendered fallback',
    plane: 'control',
    summary:
      'A single catch-all route that hands the SPA to any path the API did not claim, served from the same process as everything else.',
    facts: [
      'One controller mapping covers both the root and the wildcard; it sits outside the 25 counted endpoints because it serves an asset, not an API.',
      'The whole control plane is one monolith in one process, so this fallback, the 21 user endpoints, and the four worker endpoints share a runtime and a failure domain.',
      'The bundle it serves has a 2,328 kB main chunk (701 kB gzipped) against an 800 kB warning threshold. Plenty of dynamic chunks do get split out, but the application chunk itself is neither manually chunked nor route-lazy.',
      'Scaffold rides along in the served build: a fully commented-out controller producing no route, an example page never mounted on the router, an unreferenced chart component, and a zero-byte README.',
    ],
    tension:
      'The build stamp rendered in the page footer — added specifically so a deploy could be verified from the browser — stopped being updated on 07-07 while the branch head moved to 07-23, so the one mechanism built to answer "which build is live" no longer answers it.',
  },

  be: {
    id: 'be',
    title: 'NestJS backend',
    plane: 'control',
    summary:
      'The control plane\'s only server process: 35 files and 3,781 lines carrying the business state machine, the tracker integration, the credential vault, and the signal channel.',
    facts: [
      'Seven modules behind 25 endpoints and four tables totalling 40 columns, all in a single-process monolith on an internal app platform.',
      '67 unit tests across 6 suites pass in 3.5 s, covering credentials, the tracker client, both signal transports, and the poller.',
      'The hosting platform forbids online schema changes, so four separate pieces of state ride parasitically inside existing columns — each with the reason written into the code rather than left for a reader to guess.',
      'The web tier reaches the database through HTTP → service → ORM. The worker skips all of it and writes SQL directly, so the service layer\'s state-machine validation is enforced on exactly one of the two writers.',
    ],
    tension:
      'The largest file on the server — 715 lines at branch head, 833 in the working tree, carrying the entire state machine and every race-compensation rule — is the one with zero tests, and the end-to-end test config points at a directory that does not exist.',
  },

  m1: {
    id: 'm1',
    title: 'FixJob — 16 states, 20 steps',
    plane: 'control',
    summary:
      'The row that represents one ticket for its whole life, and the module that owns every legal transition of it.',
    facts: [
      '16 business states in the union type; 20 pipeline steps in the backend\'s authoritative stage table, with the current step parsed out of the status string by regex.',
      'At snapshot the table held 289 rows: 191 not started, 60 pending review, 27 awaiting on-device verification, 7 ignored, and one each needs-human, merged, interrupted, and blocked.',
      'No unique index was available, so duplicate inserts are resolved by a deterministic rule both racers evaluate independently — earliest created_at, then lowest id — with the loser deleting its own row and returning 400. The comment names the duplicate-merge-request incident that motivated it.',
      'The transitional-state template: the web tier only compare-and-swaps into an intermediate state and rings the bell; killing processes and removing worktrees happens on the worker, which then compare-and-swaps the state closed. Restore and delete only accept the terminal state, so "ignore then immediately delete" cannot leak a worktree.',
      'Restore branches on step number rather than resetting uniformly: a run parked at step 15 restores to awaiting-verify, because a row carrying a real merge request masquerading as not-started would fall into the "not-started is harmless, deletable" reconciliation semantics and be swept away.',
    ],
    tension:
      'All of this validation guards the browser path only — the worker writes to the same rows directly, so its correctness rests entirely on each runner\'s own compare-and-swap rather than on this module.',
  },

  m2: {
    id: 'm2',
    title: 'WatchConfig — 60 s poll',
    plane: 'control',
    summary:
      'Turns "these are the engineers I watch" into a background query against the issue tracker, so new tickets appear on the board without anyone asking for them.',
    facts: [
      'A module-init interval, 60 s by default and env-tunable, runs the same direct sync as the manual refresh button, once per watched owner, then rings the signal.',
      'An in-flight flag skips a tick whose predecessor has not finished, so a slow tracker slows the loop instead of stacking up parallel syncs; one owner failing only warns and does not abort the rest.',
      'The table held 20 rows at snapshot — exactly matching the 20 distinct owner ids the laptop\'s own sync loop touched across 12,246 rounds.',
      'The refresh button is two-path: a fast path where the backend queries the tracker directly under a timeout and returns counts of inserted, removed, interrupted, wrapped-up and total-open; and a fallback that rings the bell and lets the laptop do the work.',
    ],
    tension:
      'The "new tickets appear within a minute" claim is a code comment: the interval, the in-flight guard and the per-owner error handling were all verified, but that end-to-end latency never was.',
  },

  m3: {
    id: 'm3',
    title: 'Credential — AES-256-GCM',
    plane: 'control',
    summary:
      'The vault: 21 rows of encrypted per-user secrets, plus the settings that decide what language a fix is written in.',
    facts: [
      'The UI collects no tokens at all any more. It exposes a git email, a terse-output toggle, and a preferred language; the response body returns those three fields and nothing else — not even a masked token status.',
      'When an older client still PUTs token fields, the backend ignores them silently: it neither writes them nor errors, so a stale frontend degrades instead of failing.',
      'Ciphertext is stored as version-tagged IV, tag and payload; plaintext never travels downstream to the browser under any code path.',
      'The service-level OAuth token for the tracker lives in a sentinel row of this same table, reusing the table and its encryption to avoid a schema change, and refresh is serialised through a single in-process promise because refresh-token rotation would let concurrent refreshes invalidate each other.',
    ],
    tension:
      'Key derivation depends on an environment variable being set. The code comment is explicit about which threat model the fallback path does and does not cover, rather than leaving a reader to assume it covers both — the kind of comment that is worth more than the mitigation it documents.',
  },

  m4: {
    id: 'm4',
    title: 'Signal — SSE / long-poll',
    plane: 'control',
    summary:
      'The doorbell. It increments a version number and tries to make the laptop notice quickly, without ever being load-bearing.',
    facts: [
      'Ringing the bell writes the row, then fires an in-process event to wake same-instance waiters; other instances catch up on a 1 s database check for long-poll and a 3 s check for SSE, and under all of it sits the laptop\'s own 90 s tick.',
      'The bell is wrapped in try/catch and can never throw. Losing it costs latency, not jobs — which is the entire reason polling was demoted rather than deleted.',
      'SSE queries the database before sending headers, so a database failure returns a 500 the client can downgrade on rather than a half-open stream.',
      'During that query the client may already have disconnected, and the close event has already passed, so no listener can attach: the handler returns early if the response is destroyed, otherwise every timer and subscription it allocates leaks permanently. Liveness has to test both writableEnded and destroyed, because after a client abort the former stays false.',
    ],
    tension:
      'A complete WebSocket implementation — 309 lines, registered in the module, covered by 9 unit tests — has carried zero production traffic since the day it was written, because the gateway strips the upgrade header; it was written knowingly, as zero-cost readiness for a gate that never opened.',
  },

  m5: {
    id: 'm5',
    title: 'Tracker link — service-level OAuth',
    plane: 'control',
    summary:
      'The backend\'s own authenticated connection to the issue tracker, used to discover new tickets and to decide when a ticket has stopped being worth working on.',
    facts: [
      'Ticket rechecking returns three sets — open, closed, unknown — rather than a boolean. Every id starts in unknown and is only moved when an answer actually arrives.',
      'Destructive convergence acts only on a confirmed close. Unknown is logged as "did not answer, no convergence this round, never treat as closed" and skipped by design.',
      'Both OPEN and REOPENED count as live, after a reopened ticket was read as closed and the same running fix was killed three times in a row.',
      'Closed tickets branch rather than being handled uniformly: an in-progress run is pushed into the interrupting state for the worker to kill, while a run already parked at on-device verification is sent to wrap-up so its strip commit and report still get produced.',
      'Queries are chunked at 50 ids per page, and the OAuth client is separately registered with its own device-code authorization so it rotates independently of the laptop\'s credentials.',
    ],
    tension:
      'An earlier revision treated an externally closed ticket as equivalent to an on-device pass; that rule manufactured at least two false convergences before it was found and removed, and the ticket-close signal it fed on is the one this module produces.',
  },

  m6: {
    id: 'm6',
    title: 'View / Translate — first paint, bilingual',
    plane: 'control',
    summary:
      'Serves the app shell and translates the parts of the UI that are not static strings — ticket titles, root causes, change summaries.',
    facts: [
      '289 static keys per language at branch head with zero gaps in either direction; 292 in the working tree, split as dashboard 147, jobDetail 50, credential 29, configs 24, common 20, credentialGuide 11, layout 6, backend errors 5.',
      'The client only de-duplicates and batches; the actual translation runs server-side, where every string first passes a 9-rule phrase map and only strings still containing CJK are sent to a model.',
      '39 Chinese lines remain under the pages directory. All 39 were read individually: logger strings, attachment parse markers, and inline comments. None is UI copy.',
      'Backend error strings are mapped to English on the client through a containment table rather than by error code, so a message the backend never localised still renders in the reader\'s language.',
    ],
    tension:
      'The translate path only accepts one shape of API key and the key actually configured is the other kind, so in English mode dynamic content silently falls back to untranslated — leaving those nine phrase-map rules as the only thing doing any work.',
  },

  fe: {
    id: 'fe',
    title: 'React SPA',
    plane: 'control',
    summary:
      'Four pages that turn a run\'s local files into something a person can act on, built on a heavy scaffold that most of the line count belongs to.',
    facts: [
      '212 tracked client files and 23,721 lines, of which 80 files / 7,567 lines are a UI kit and 105 files / 11,819 lines a business kit that arrived with the scaffold.',
      'Attributing by commit history instead — files whose first appearance is not the scaffold init commit, or that were touched more than once — gives 20 hand-written frontend files and 5,106 lines.',
      'Page sizes: dashboard 1,816 lines, job detail 552, credential 361, configs 332, credential guide 128.',
      'Frontend test count is zero. All 67 passing tests are backend service tests.',
    ],
    tension:
      'The obvious way to measure hand-written frontend code — exclude the components directory — is wrong in both directions at once: it drops a hand-written 220-line layout and keeps scaffold files that were never touched, which is why the commit-attribution number is the one worth quoting.',
  },

  p1: {
    id: 'p1',
    title: 'Dashboard — five-column board',
    plane: 'control',
    summary:
      'One row per ticket, sorted into columns by state, with every action the pipeline can hand back to a human attached to the card.',
    facts: [
      'Seven card types render by state, over a progress bar that buckets into 9 coarse phases but switches to a precise N/20 whenever the status string can be parsed.',
      'The six statistic tiles come from a single GROUP BY that replaced eight serial COUNT queries — the comment notes this was not only faster but removed counts drifting between queries.',
      'Verified-fail accepts screenshots and log files up to 50 MB each, uploads them, then re-signs a 30-day URL with three retries and throws if it cannot get one, rather than falling back to the SSO-gated download URL — because the worker\'s fetch would be redirected to a login page and silently get HTML.',
      'Feedback text and attachment URLs are encoded into an existing summary column, because the platform forbids adding one.',
    ],
    tension:
      'On-device verification is where runs stop: 34 of 73 recorded runs terminate there, waiting for a person holding a physical phone. The board’s own snapshot has a bigger live pile in review, so this is a statement about where runs end, not about which column is longest.',
  },

  p2: {
    id: 'p2',
    title: 'JobDetail — 20-step detail',
    plane: 'control',
    summary:
      'The drill-down that unrolls one ticket into the 20 pipeline steps and shows what the agent produced at each one.',
    facts: [
      'The detail endpoint returns the job plus exactly 20 stages, each marked done, current or pending from the step number parsed out of the status string.',
      'Steps are tiered rather than uniform: core steps expand, minor steps get one line, mechanical steps get a dot — so a 20-step timeline reads at a glance instead of as twenty equal blocks.',
      'The per-step prose has no column of its own. It is packed into an HTML comment embedded inside the root-cause text column and decoded on read; the code calls the carrier a hack in its own comment.',
      'Link-shaped artifacts — the merge request and the QR install build — are broken out of that blob and rendered separately, so the two things a reviewer actually clicks are not buried in prose.',
    ],
  },

  p3: {
    id: 'p3',
    title: 'Configs — assignee watch',
    plane: 'control',
    summary:
      'Where a user declares whose tickets they want on their board, which is also what determines what they can see.',
    facts: [
      'Tag-style add and remove of watched assignee emails with format and corporate-domain validation, a platform multi-select, and a master watch toggle — 332 lines total.',
      'The worker writes back which of those emails matched nobody in the tracker, and the page echoes them, so a typo surfaces as a visible not-found chip instead of a silently empty board.',
      'The watch list is what feeds the shared visibility predicate on every read endpoint; an empty list degrades cleanly to owner-only filtering.',
      'Refresh is fast-path plus fallback: the backend syncs directly under a timeout and returns real counts, or degrades to ringing the bell and letting the laptop sync.',
    ],
    tension:
      'The not-found list has no column either — it rides inside the watched-assignees JSON, and the parser has to accept both the bare-array and the object shape because both exist in stored history.',
  },

  p4: {
    id: 'p4',
    title: 'Credential — vault, onboarding',
    plane: 'control',
    summary:
      'The settings page after full credential management moved server-side: no tokens, three preferences, and the first-login bootstrap.',
    facts: [
      'It collects a git email, a terse-output toggle, and a preferred language. Nothing else — and the response carries no token state at all, not even a mask.',
      'Preferred language is not cosmetic: the worker reads it to decide whether the fix\'s ticket title, root cause, change summary and report are written in Chinese or English.',
      'A session-scoped flag stops the stored server preference from overwriting a language the user just picked on the page — the failure it prevents is the toggle appearing to snap back.',
      'First login auto-creates a default watch config watching yourself and back-fills the git email if empty; a 128-line guide page sits alongside for onboarding.',
      'Sign-out needs an explicit redirect-to-login call after session teardown, or the UI hangs on "signing out" forever.',
    ],
    tension:
      'That git email is a single point of failure for the entire notification chain — a user who never fills it in simply never gets notified, and the system only warns about it in a log line nobody reads.',
  },

  db: {
    id: 'db',
    title: 'PostgreSQL, managed',
    plane: 'control',
    summary:
      'Four tables and 40 columns that are, together with one signal, the entire coupling between the cloud and the laptop.',
    facts: [
      'Column counts: fix_job 17, user_credential 9, watch_config 9, control_signal 5. Row counts at snapshot: 289, 21, 20, and one signal row respectively.',
      'The hosting platform forbids online schema changes, so four pieces of state ride inside existing columns: per-step notes as an encoded comment inside the root-cause text, not-found assignees inside the watched-assignees JSON, the service OAuth token in a sentinel row\'s encrypted key column, and user feedback plus attachment URLs inside the change-summary column.',
      'No unique index was available either, which is why duplicate inserts are resolved by an application-level deterministic rule instead of by the database.',
      'The web tier reaches it through service and ORM; the worker writes SQL to it directly. Half of the writers therefore never pass the state-machine validation.',
    ],
    tension:
      'A schema that cannot be migrated cannot be corrected, only worked around — every one of those four parasitic carriers is a permanent workaround, and each carries its motivation in a comment precisely because it would otherwise read as carelessness.',
  },

  /* --------------------------------------------------------------- external */

  tracker: {
    id: 'tracker',
    title: 'Issue tracker',
    plane: 'external',
    summary:
      'The system of record for bugs, read through an HTTP API and a query language, and the source of every ticket the pipeline ever worked on.',
    facts: [
      'Three discovery paths exist; two ever ran. A standing query for open defects assigned to a watched engineer brought 154 distinct tickets onto the board, and a person clicking start supplied the rest.',
      'The queue runner re-reads bug priority from the tracker on every tick and bands strictly P0 > P1 > P2 > P3 > S > unset — anyone\'s P0 preempts anyone\'s P1 — with owner rotation applied only inside a band. A failed priority query degrades to a single band rather than blocking dispatch.',
      'Measured integration load: 12,246 sync rounds across 20 owners producing 124,842 per-owner sync lines; the token failed 428 times and fell back to a roughly six-minute headless path, during which the not-started column is stale; the token auto-refreshed into the keychain 102 times.',
      'Ticket ids are the directory names of the run archive, which is how 75 local run directories map back to externally checkable records with no extra bookkeeping.',
    ],
    tension:
      'The third discovery path — a 12-hour automatic watch-and-enqueue — exists in code and has never executed in production: all 14 service starts ran in sync-only mode and its log line count is zero.',
  },

  chat: {
    id: 'chat',
    title: 'Chat-platform API',
    plane: 'external',
    summary:
      'Two directions on the internal chat platform: outbound cards at the three moments a ticket owner has to act, and an inbound bot that answers questions about live runs.',
    facts: [
      '195 notification log lines: 185 delivered, 9 failed, 1 skipped — across 84 tickets and 7 distinct recipients. By kind: 96 build-ready-for-verification, 52 run-started, 37 merge-request-opened.',
      'Inbound lifetime volume is 24 answered messages — 15 rule-based answers served synchronously from the database, 9 model-generated answers spawned asynchronously with a 45 s timeout and a cap of 3 in flight.',
      'The long-lived connection logged 83 connects, 79 disconnects and 896 reconnect attempts across 77 reconnect rounds, one of which backed off as far as attempt 474 before recovering — with no alerting on any of it.',
      'Identity resolution is fail-closed through three hops ending in a unique display-name match inside the authorized user set; zero matches or two matches both return null and degrade to "send me a ticket id", so it can never show one person another person\'s ticket.',
      'A local CONNECT proxy sits underneath with multi-IP failover and 5-minute re-resolution, added after single-address pinning was found to drop messages with no retry and no failover.',
    ],
    tension:
      'Eight of the nine delivery failures were the bot lacking availability to that recipient: the server rejected the message, the code does not retry non-transient errors, the board shows nothing, and the person never learns a notification was meant for them.',
  },

  infra: {
    id: 'infra',
    title: 'Engineering infrastructure',
    plane: 'external',
    summary:
      'The code review platform, the internal CI, and the mobile monorepo — none of which offered an unattended-friendly API, so 22 reader scripts were reverse-engineered to talk to them.',
    facts: [
      '22 scripts and 2,827 lines turn merge-request, CI and ticket internals into callable readers; every one carries its reverse-engineering date, the real endpoint, and the authentication method in a header comment. Eight of them have no caller anywhere in the plugin.',
      'Self-confirmation is treated as an anti-pattern: the script that writes a merge-request body writes through one API surface and reads back through a different one, on the stated grounds that a 200 does not mean a field was accepted and a round trip on the same API is not verification. If it cannot obtain a token for the read surface it fails closed.',
      'The same rule applies to CI: the aggregate snapshot is not trusted, live job data is read instead, and the pipeline\'s commit must equal the expected commit — a documented case of a stale snapshot is cited in the comment.',
      'Green is not a scalar: one strip-commit round reported success after running 3 jobs while a sibling merge request ran 22, so a job-count reconciliation line ("22 jobs, same as the earlier round — not a shrunken false green") sits beside the all-green claim on the run where it mattered — one documented instance against 60 recorded all-greens.',
      'All 66 merge requests the pipeline produced were re-verified through the platform API to exist: 56 reached green CI, 9 failed, 1 was still running, and 2 merged to trunk.',
    ],
    tension:
      'The retry helper the CI loop invokes is not inside the plugin — it is a hard-coded absolute path into the scheduler directory, which contradicts the plugin manifest\'s own "self-contained" claim and would break on any other machine.',
  },

  /* -------------------------------------------------------------- execution */

  wk: {
    id: 'wk',
    title: 'Laptop daemon',
    plane: 'execution',
    summary:
      'A launchd-supervised loop on one laptop that owns the entire execution plane: five runners, background sweeps, and every process that edits code.',
    facts: [
      'The service script starts the local proxy only if its port is not already listening, starts the chat bot and the signal listener only if they are not already running, then execs into the daemon loop — so a repeated load cannot produce duplicates.',
      'Measured: 14 service starts, 16,082 loop ticks across 40 calendar days, and 22 days of continuous uptime for the current process at snapshot.',
      'Dual-speed sleep, verified in the log: 7,360 active ticks at 90 s and 1,802 idle ticks at 600 s.',
      'Loop ordering is semantics, not style. The five click-response runners run first, ahead of the per-owner tracker sync that takes roughly 95 seconds serially; moving that sync to the background at a 300 s period is what took click-to-spawn from about 95 s down to 1–2 s.',
      'It deliberately does not hold the machine awake, so the entire schedule pauses whenever the laptop sleeps — the honest boundary of "always on".',
    ],
    tension:
      'The single-instance lock is no longer on disk: the daemon has run since 07-16 and never touches the lock directory again, so the OS\'s periodic temp cleanup removed it — starting a second daemon today would acquire the lock successfully and double-spawn every job.',
  },

  w1: {
    id: 'w1',
    title: 'Five runners',
    plane: 'execution',
    summary:
      'Stop, queue, verify, retry, resume — run in that fixed order on every tick, each one claiming work atomically rather than coordinating.',
    facts: [
      'Lifetime activity: queue spawned 58 fixes across 39 tickets, verify spawned 115 wrap-ups across 30 tickets, resume took over 179 orphans across 48 tickets, retry re-spawned 12, and stop performed 25 cancellations plus 14 tracker-close kills.',
      'Every runner that spawns a process claims its row with UPDATE ... WHERE id AND status = expected and only affected_rows == 1 wins; 0 means someone else took it and −1 means a database wobble, in which case the row is deliberately left queued. This replaced a read-after-write pattern that had already produced two merge requests for one ticket.',
      'Fair share is a 19-line pure function computing work-conserving max-min: one owner alone can take every global slot, contended slots go to whoever currently holds fewest, and a slot with no demand is left empty rather than spun. Strict priority banding sits above it.',
      'Orphan takeover is guarded four ways — a state allowlist that never touches verification or completed runs, a credential check, a 15-minute cooldown with at most two per tick, and a repeat counter that marks a run failed after five no-progress relaunches instead of burning tokens in a loop.',
      'The kill path resolves processes by both PID marker and ticket-scoped match, then re-reads and kills again; it deliberately drops path-substring matching so it cannot take out a human\'s editor open in the same worktree.',
    ],
    tension:
      'The concurrency ceiling is soft: configured at 10, the log shows active reaching 11, 12, 13 and 14, because each runner holds its own slot count and the live process-count snapshot lags behind.',
  },

  w2: {
    id: 'w2',
    title: 'signal-listener',
    plane: 'execution',
    summary:
      'The outbound dialer that turns a version increment in the cloud into a spawned process on the laptop in one to two seconds.',
    facts: [
      '106 kicks delivered in total: 102 over SSE with credit-pull, 4 over plain SSE, 0 over long-poll, 0 over WebSocket — with 3,996 credit negotiations completed without a single manual intervention.',
      'Distinguishing "unsupported" from "flaky" needed a side channel, because a failed WebSocket open is opaque — refusal and rejection both surface as a bare 1006 close. A plain fetch of the version endpoint decides: probe succeeds means treat it as a policy refusal and cool down for 60 minutes; probe fails means network fault and exponential backoff.',
      'A second classifier handles the half-supported shape — connection opens, no frame ever arrives — and both the idle-timeout and close paths share one classifier, because otherwise a done-latch would stop the flap check from ever running and the listener would loop on WebSocket forever without downgrading.',
      'Credit failures self-heal three ways: a late callback cannot pollute the next round, three consecutive upstream failures fall back to plain push for 60 minutes, and a server without a session id keeps plain push indefinitely.',
      'On a new version it writes a marker file; the daemon\'s per-second sleep loop notices it and enters its next tick early, which is the entire mechanism behind 1–2 second click-to-spawn.',
    ],
    tension:
      'The 713 log lines reading "gateway will not allow WebSocket" are the client\'s own inference, not an observation: probing the route directly returns the application\'s own 404, so what the log records as a gateway policy may simply be a route that was never deployed.',
  },

  w3: {
    id: 'w3',
    title: 'bridge — write-back',
    plane: 'execution',
    summary:
      'The one-directional sync that reads a run\'s own files on disk and upserts them into the board row a human is looking at.',
    facts: [
      'It reads the run\'s status, stats, merge-request description and pipeline files and maps step to board state: completed becomes pending review, step 15 becomes awaiting verification, needs-human and failed pass through unchanged.',
      'Any step number at or above 16 maps to wrapping-up, computed from the number rather than an enumeration — omitting a single step name from a list would overwrite wrapping-up back to "in progress" on the next tick.',
      'Notifications are sourced here and de-duplicated at the source: a card is only sent when the old status differs from the new one and the new one is one of the two states a human must act on.',
      'Before notifying it compares the recipient\'s email prefix against the tracker\'s current assignee and warns loudly without blocking — added after a build-ready notice went to one person while the ticket was assigned to another.',
      'Only run directories modified in the last two days are swept, so an older run whose board row is still live stops being written back at all.',
    ],
    tension:
      'The whole sync runs disk → database in one direction, so a row whose run directory was moved or deleted silently falls out of every check — which is exactly the gap the reverse reconciliation was written to cover.',
  },

  w4: {
    id: 'w4',
    title: 'Background sweeps',
    plane: 'execution',
    summary:
      'Three long-period jobs behind the fast loop: assignee sync, a CI watchdog for merge requests nobody is actively driving, and a tracker watch.',
    facts: [
      'Assignee sync completed 12,246 rounds over 20 owners, first discovering 154 distinct tickets, with 428 token failures falling back to a slower headless path and 102 automatic token refreshes written back to the keychain.',
      'The CI watchdog ran 1,570 rounds scanning up to 80 in-flight merge requests each. It only touches two states, skips any ticket whose process marker is still alive, fails closed on any query error, and declares a job flaky only when every issue under a target is file-less and matches a specific upload-failure pattern — capped at four reruns per job.',
      'It deliberately does not auto-repush code fixes, on the stated grounds that a ticket awaiting verification may have someone testing that exact build and a ticket in review may have someone reading it.',
      'Reverse reconciliation (database → disk) warns and never mutates: 3,803 warnings across 14 tickets that were live rows with no local run directory. A separate dead-end guard is the only thing there that writes — 10 rows compare-and-swapped to pending-review after three barren rounds — deliberately not to "done", because with the directory gone the strip commit and the report were never produced and marking them done would be a lie.',
      'The 12-hour tracker watch exists in the loop and has never executed in production; two orphan rows were still hanging at snapshot.',
    ],
    tension:
      'The watchdog\'s judgement path almost never ran: 6,968 "CI fetch failed, skipping" events across 82 merge requests — 3,160 of them on a single day — and across all 1,570 rounds it reran a flaky job exactly zero times, its state file never even created. It warned 5,399 times and acted never.',
  },

  orc: {
    id: 'orc',
    title: 'orchestrate.sh → headless agent',
    plane: 'execution',
    summary:
      'One headless agent process per ticket, running a 20-step plugin whose hooks exist to make it unable to ask a human, reorder steps, or ship with its own instrumentation attached.',
    facts: [
      '77 source files and 8,385 lines: a 20-step machine, 7 shell hooks totalling 1,226 lines, 6 skills, 3 read-only reviewer and designer subagents, and 22 scripts.',
      'The step-completion hook alone carries 20 step branches and 54 hard-block exit points, and validates the status string against a 20-value enum before dispatching — a misspelled step name is rejected rather than silently bypassing its own guard.',
      'Context is loaded in three tiers so a 2,809-line skill survives a long headless run: a 153-line always-resident orchestration spine, per-step modules read only on entry, and platform reference files loaded only for the platform in play.',
      'Genuine content checks are rare and deliberate. The debug-log lifecycle is one: instrumentation must be present at the first commit and fully gone at the strip commit, verified by diffing against merge-base and grepping the tag. Multi-reviewer voting, the discriminating-evidence table and the A/B log quota have no mechanical backstop at all.',
      'The running copy is not the committed copy: local main was 8 commits ahead of the remote and unpushed, and the runtime install cache diverged from source in 21 places — missing the self-verification script, its gate hook, a newer step module, a whole skill, and the merge-request submitter’s reference set.',
    ],
    tension:
      'The step-15 "verified on a device" gate greps the whole stats file for a PASS line, and the step-10 compile step writes one — 67 of 73 runs contain such a line while only 30 ever advanced past step 15, so "reached the strip step" can never be read as "verified fixed".',
  },
};
