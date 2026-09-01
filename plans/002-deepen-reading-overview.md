# Plan 002: Turn the overview into a concise synthesis

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Stop
> on any listed STOP condition instead of inventing new interpretation rules.
> When complete, update Plan 002 in `plans/README.md` to `DONE`.
>
> **Drift check (run first)**:
> `git diff --stat b239e37..HEAD -- summary.js e2e/app.spec.js`
> If either file changed, compare `overviewText`, `extraOverviewText`, and the
> overview E2E assertions with the excerpts below before proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `b239e37`, 2026-09-01

## Why this matters

The result screen is the product's core output. The current multi-card overview
correctly names every drawn card, but after that list it interprets only the
last card. Users therefore get a complete inventory rather than a convincing
summary of how the positions interact. The fix should stay deterministic and
compact: reuse existing card meanings and connect a bounded set of anchor
positions instead of adding AI or another content system.

## Current state

- `summary.js:34-49` already produces topic-aware text through
  `cardMeaning(entry)` for general, love, career, and money.
- `summary.js:57-64` already has `firstSentence(text)` and `entryLabel(entry)`.
  Reuse both.
- `summary.js:81-100` builds a complete card-name flow but appends meaning only
  for `last`:

  ```js
  var last=entries[entries.length-1];
  return flow+' '+last.position+'에서는 '+firstSentence(cardMeaning(last))+(summary.pattern?' '+summary.pattern:'');
  ```

- `summary.js:102-107` lists extra-card names but does not explain what the
  added card meaning changes.
- `summary.js:121-124` deliberately preserves version-1 shared links through
  `legacyOverviewText`. That compatibility path must remain byte-for-byte in
  behavior.
- `e2e/app.spec.js:77-79` requires the Celtic overview to contain every card
  name. Keep that guarantee.
- Share preview, restored links, and PNG output all consume the same summary;
  do not build a second summary path.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Syntax | `npm run check` | exit 0 |
| Unit tests | `npm test` | all tests pass |
| Browser regression | `npm run test:e2e` | all desktop and mobile tests pass |

## Scope

**In scope**:

- `summary.js`
- `e2e/app.spec.js`
- `plans/README.md` — status row only

**Out of scope**:

- Changing card meanings in `locale/ko.js`
- AI-generated or network-generated readings
- Rewriting the card-detail dialog
- Altering v1 shared-link output
- Adding another summary object, renderer, or dependency

## Git workflow

- Branch: `codex/002-reading-overview` if a branch is needed.
- Commit style: `feat: deepen multi-card overview`.
- Do not push unless instructed.

## Steps

### Step 1: Add a bounded interpretation arc to current summaries

Keep the existing `flow` sentence so every position and card remains visible.
After it, append topic-aware first sentences for a small set of anchors:

- 3 cards: first, middle, and last;
- 5, 7, or 10 cards: first, middle, and last;
- any other multi-card length: first and last;
- 1 card: keep the current behavior.

Each clause must name its actual `entry.position`, then use
`firstSentence(cardMeaning(entry))`. Join the clauses with natural Korean
transitions, with no forced newline and no repeated card-name inventory. A tiny
local helper inside `summary.js` is acceptable only if it removes duplication
between main and extra summaries; do not export it or create a new module.

Keep `summary.pattern` once at the end. Keep `legacyOverviewText` unchanged.

**Verify**: `npm run check` → exit 0.

### Step 2: Explain the effect of extra cards

In `extraOverviewText`, keep the main overview first and the bounded extra-card
name list. Append one topic-aware meaning clause for the first extra card; if
there is more than one extra card, also append one for the last extra card.
Do not enumerate every extra meaning, and do not duplicate `summary.pattern`.

This text becomes the alternate overall evaluation already controlled by
`overviewSwitch`; do not add another button or panel.

**Verify**: `npm run check` → exit 0.

### Step 3: Strengthen the existing browser contract

Extend `e2e/app.spec.js` using the current result and extra-card flows:

- a deterministic three-card result contains all three displayed names;
- its overview contains recognizable first-sentence content from the first,
  middle, and last card meanings, not only the final card;
- after adding an extra card, the extra overview contains that card's name and
  a meaning excerpt;
- the share preview shows exactly the selected main/combined overview;
- the current v1 compatibility test, if present, remains unchanged and passes.

Derive expected text from the rendered detail data or the loaded locale data;
do not hard-code one random shuffle outcome.

**Verify**: `npm run test:e2e` → all desktop and mobile projects pass.

### Step 4: Run the full gate

Run all local checks and update only the Plan 002 status row.

**Verify**: `npm run check && npm test && npm run test:e2e` → all exit 0.

## Test plan

- Preserve the all-card-name assertion for the ten-card spread.
- Add semantic assertions for all three anchors in a three-card reading.
- Add a semantic assertion for the first added card.
- Reuse the existing share-preview test to prove there is still one source of
  truth for screen, URL, and image output.

## Done criteria

- [ ] Multi-card overviews include all card names and meanings from bounded
  first/middle/last anchors.
- [ ] Extra-card evaluation includes at least one added card's actual meaning.
- [ ] Version-1 shared results still use `legacyOverviewText` unchanged.
- [ ] No network, AI, or new dependency was added.
- [ ] `npm run check`, `npm test`, and `npm run test:e2e` all pass.
- [ ] No source files outside `summary.js` and `e2e/app.spec.js` changed.
- [ ] Plan 002 is marked `DONE` in `plans/README.md`.

## STOP conditions

- The requested synthesis requires inventing meanings not present in
  `locale/ko.js` or `cardMeaning`.
- Version-1 shared-link output changes.
- The screen, share preview, and PNG require separate summary implementations.
- The overview becomes longer than the expanded card-detail content or causes a
  material layout regression at mobile width.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

The bounded anchor rule is deliberate: it keeps 7- and 10-card results readable
without pretending to be generative AI. Review Korean transitions and topic
specificity, but do not expand the overview into every card's full detail.

