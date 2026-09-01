# Plan 003: Make full-deck offline storage visible and testable

> **Executor instructions**: Follow this plan step by step and run every
> verification command. If a STOP condition occurs, stop and report rather
> than redesigning the PWA. When complete, update Plan 003 in
> `plans/README.md` to `DONE`.
>
> **Drift check (run first)**:
> `git diff --stat b239e37..HEAD -- index.html app.js sw.js css/style.css e2e/app.spec.js README.md`
> If service-worker cache names, registration, home utilities, or the existing
> cache test changed, reconcile the excerpts below or stop.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `b239e37`, 2026-09-01

## Why this matters

The README promises that an installed app stores all 78 local card images, but
the service worker swallows per-image failures and sends no completion result.
Users cannot tell whether offline storage finished, and the E2E suite verifies
only the shell cache. A small manual action with a completion/failure status,
backed by a real offline browser test, turns that promise into an observable
contract without adding an install framework or storage library.

## Current state

- `sw.js:44-52` accepts `CACHE_ALL_CARDS`, catches every failed `cache.add`, and
  resolves without telling the page what happened:

  ```js
  return Promise.all(CARD_ASSETS.map(function(url) {
    return cache.match(url).then(function(cached) { return cached || cache.add(url); }).catch(function() { return false; });
  }));
  ```

- `app.js:913-929` posts that message automatically only in standalone mode or
  after `appinstalled`. `saveData` correctly prevents automatic bulk download.
- `e2e/app.spec.js:131-146` verifies only that `noru-app-v59` exists and contains
  very few `/assets/` entries. It never verifies `noru-cards-v1`, all 78 files,
  or an offline image load.
- `card.js` exposes the canonical 78 local asset paths through `CARD_CONFIG`.
  Reuse that list in the worker; do not duplicate filenames in the page.
- `app.js` already has `showToast`; reuse it for concise status/error feedback.
- README `오프라인 동작` documents automatic behavior and must match the final
  manual behavior.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Syntax | `npm run check` | exit 0 |
| Unit tests | `npm test` | all tests pass |
| Browser regression | `npm run test:e2e` | all desktop and mobile tests pass |

## Scope

**In scope**:

- `sw.js`
- `app.js`
- `index.html`
- `css/style.css`
- `e2e/app.spec.js`
- `README.md`
- `plans/README.md` — status row only

**Out of scope**:

- New dependencies, Workbox, IndexedDB, or a second service worker
- Background Sync, notifications, or reading history
- A custom install prompt
- Changing card files or cache strategy for normal viewed cards
- Automatically bulk-downloading on `saveData` connections

## Git workflow

- Branch: `codex/003-offline-deck-status` if a branch is needed.
- Commit style: `feat: expose offline deck status`.
- Do not push unless instructed.

## Steps

### Step 1: Return one cache result from the worker

Keep the existing `CACHE_ALL_CARDS` message and `CARD_ASSETS` source. Map each
asset to a boolean success value, count successes and failures after all settle,
and post one result to `event.ports[0]` when a `MessagePort` was supplied:

```js
{ type: 'CACHE_ALL_CARDS_RESULT', total: 78, cached: 78, failed: 0 }
```

The exact counts must come from `CARD_ASSETS.length`, not a literal. A caller
without a port must continue to trigger caching for backward compatibility.
Keep `event.waitUntil`. Do not add per-card progress messages.

**Verify**: `npm run check` → exit 0.

### Step 2: Add the smallest user-visible control

Add one secondary home-screen button labelled `오프라인으로 저장` near the
existing utility actions and one compact status element associated with it.
Hide or disable it when service workers or Cache Storage are unavailable.

In `app.js`, reuse `cacheInstalledCards` for automatic and manual calls. For a
manual call, create a native `MessageChannel`, send `port2`, set the button to a
busy state, and handle the single result on `port1`:

- zero failures: show `78장 저장 완료` and mark the control complete;
- some failures: show the exact failed count and allow retry;
- worker/registration error: restore the button and use `showToast`.

The automatic standalone call should remain quiet. `saveData` should block only
automatic bulk caching; an explicit user click is authorization to proceed.
Use existing button and focus styles in `css/style.css`; add only the selectors
needed for placement, busy, and completed states.

**Verify**: `npm run check` → exit 0.

### Step 3: Test the complete offline contract

Extend the service-worker Playwright coverage. Start by deleting
`noru-cards-v1` in the test context so the assertion is independent. Trigger
the same manual UI action a user sees, wait for `78장 저장 완료`, and assert:

- `noru-cards-v1` contains 78 requests under `/assets/`;
- every cached response is present;
- after `page.context().setOffline(true)`, reloading the app shell succeeds;
- opening a reading or dictionary card uses a cached WebP whose `naturalWidth`
  is greater than zero;
- restore online mode in `finally` so later tests cannot inherit offline state.

Do not hard-code a timeout sleep; use Playwright polling/assertions. Six
megabytes is the expected bounded transfer.

**Verify**: `npm run test:e2e` → all desktop and mobile projects pass.

### Step 4: Align documentation and run all gates

Update README `오프라인 동작` to mention the manual action, automatic installed
behavior, `saveData`, retry behavior, and the two cache names. Do not claim that
unsupported browsers can install or cache.

Run the complete local gate and update only the Plan 003 status row.

**Verify**: `npm run check && npm test && npm run test:e2e` → all exit 0.

## Test plan

- Keep the existing shell-first test.
- Add one full-deck cache test through the visible button.
- Verify all 78 cached requests and one actual offline image decode.
- Exercise the result message, not an internal worker implementation detail.
- Existing desktop and mobile projects both run the flow.

## Done criteria

- [ ] A user can explicitly start full-deck offline storage and see success or
  a retryable failure count.
- [ ] Automatic installed-app caching still works and respects `saveData`.
- [ ] A port-less `CACHE_ALL_CARDS` message still works.
- [ ] E2E proves 78 cached WebPs and a decoded image while offline.
- [ ] README matches the shipped behavior.
- [ ] `npm run check`, `npm test`, and `npm run test:e2e` all pass.
- [ ] No new dependency or storage layer was added.
- [ ] No source files outside the listed scope changed.
- [ ] Plan 003 is marked `DONE` in `plans/README.md`.

## STOP conditions

- The 78-card assets exceed a reasonable bounded download because new deck
  variants were added.
- The browser cannot provide `MessageChannel` to the active worker in the
  supported test environments.
- Offline navigation itself fails with the current shell cache and requires a
  cache-strategy redesign beyond these files.
- The UI placement requires redesigning the main menu rather than adding one
  secondary utility control.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

Increment `CARD_CACHE_NAME` only when card asset contents or filenames change;
increment `CACHE_NAME` when shell files change. Reviewers should pay particular
attention to failed-request counting and restoration of online mode in E2E.

