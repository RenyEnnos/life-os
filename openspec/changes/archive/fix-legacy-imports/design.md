# Design: Refactor AnimeJS to Framer Motion

## Context
We uninstalled `animejs` to consolidate on `framer-motion`. However, several imperative animations (hooks, tickers) relied on `animejs`.

## Architecture
We will replace `animejs` with `framer-motion`'s imperative `animate` function.

### `useStaggerAnimation`
**Current**: Uses `anime({ targets, delay: anime.stagger(100) })`.
**New**: Use `animate(scope.current, { opacity: 1, y: 0 }, { delay: stagger(0.1) })` from `framer-motion`. This allows us to keep the hook's API (passing a ref/selector) but implement it with the approved library.

### `NumberTicker`
**Current**: Uses `anime({ targets: obj, val: value, update: ... })`.
**New**: Use `animate(0, value, { onUpdate: (v) => ... })` from `framer-motion`. This is a direct one-to-one replacement for value tweening.

### `CourseCard` & `FinanceCharts`
**Current**: Unused or legacy imports.
**New**: Delete the imports.
