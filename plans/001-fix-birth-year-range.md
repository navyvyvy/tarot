# Plan 001: Keep the birth-year range current

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If a STOP condition occurs, stop and report; do not improvise.
> When complete, update Plan 001 in `plans/README.md` to `DONE`.
>
> **Drift check (run first)**:
> `git diff --stat b239e37..HEAD -- app.js e2e/app.spec.js`
> If either file changed, compare the current code with the excerpts below. If
> the birth-year loop or birth-card flow changed materially, stop and report.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b239e37`, 2026-09-01

## Why this matters

The birth-card form still uses `1924`, a value that appears to have been chosen
in 2024. In 2026 it silently excludes people older than 102 and will become
more restrictive every year. A rolling 120-year range removes the stale date
without adding configuration or changing the birth-card calculation.

## Current state

- `app.js:748-757` builds native `<select>` options for the birth date:

  ```js
  var thisYear=new Date().getFullYear();
  for(var y=thisYear;y>=1924;y--){
    var op=document.createElement('option');op.value=y;op.textContent=y+'년';ySel.appendChild(op);
  }
  ```

- `core.js:23-36` owns the actual birth-card arithmetic and does not impose a
  year limit. Do not change that pure calculation.
- Browser flows live in `e2e/app.spec.js`; use the existing Playwright style
  (`test`, `expect`, native selectors) and do not add another test dependency.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Syntax | `npm run check` | exit 0, no syntax errors |
| Unit tests | `npm test` | all tests pass |
| Browser regression | `npm run test:e2e` | all desktop and mobile tests pass |

## Scope

**In scope**:

- `app.js`
- `e2e/app.spec.js`
- `plans/README.md` — status row only

**Out of scope**:

- `core.js` birth-card arithmetic
- Replacing the three native selects with a custom date picker
- Persisting a birth date
- Changing the tarot-school reduction rules

## Git workflow

- Branch: `codex/001-birth-year-range` if a branch is needed; otherwise follow
  the operator's current-branch instruction.
- Commit style: conventional commits, e.g. `fix: keep birth year range current`.
- Do not push unless the operator explicitly asks.

## Steps

### Step 1: Replace the stale lower bound

In `initBirthSelects` in `app.js`, derive the oldest offered year from the
current year and keep exactly 121 choices: current year through current year
minus 120, inclusive. Use one local value such as `oldestYear`; do not add a
global constant or settings abstraction.

**Verify**: `npm run check` → exit 0.

### Step 2: Lock the range with one browser test

Add one Playwright test in `e2e/app.spec.js` that opens `/?mode=birth`, reads
the non-placeholder options from `#bYear`, and asserts:

- there are 121 options;
- the first value is the browser's current year;
- the last value is current year minus 120;
- selecting the last value still permits a valid month/day and produces the
  birth-card result with the existing form action.

Use `page.evaluate(() => new Date().getFullYear())` so the test cannot go stale.

**Verify**: `npm run test:e2e` → all projects pass, including the new test.

### Step 3: Run the full local gate

Run the syntax and unit suites, then update only the Plan 001 status row.

**Verify**: `npm run check && npm test` → both commands exit 0.

## Test plan

- New E2E coverage: dynamic endpoints, inclusive count, oldest supported year,
  and successful result generation.
- Existing calculation coverage remains in `test/core.test.js` under
  `calculateBirthCard keeps the reduction and resolves hidden pairs`.

## Done criteria

- [ ] `rg -n "1924" app.js` returns no matches.
- [ ] The year select contains current year through current year minus 120.
- [ ] The oldest offered date completes the existing birth-card flow.
- [ ] `npm run check`, `npm test`, and `npm run test:e2e` all pass.
- [ ] No source files outside `app.js` and `e2e/app.spec.js` changed.
- [ ] Plan 001 is marked `DONE` in `plans/README.md`.

## STOP conditions

- The UI no longer uses `#bYear`, `#bMonth`, and `#bDay` native selects.
- Product requirements specify a different supported age range.
- The change appears to require altering `core.calculateBirthCard`.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

The rolling limit is a UI constraint only. If the product later accepts typed
dates, keep `core.calculateBirthCard` independent of that UI range.

