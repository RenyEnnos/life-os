# Spec: Remove AnimeJS

## MODIFIED Requirements

### Requirement: Use framer-motion for animations
The application MUST use `framer-motion` for all imperative animations to avoid splitting the animation stack.

#### Scenario: Verify useStaggerAnimation uses framer-motion
Given the `useStaggerAnimation` hook
When it is called with a selector
Then it should use `framer-motion`'s `animate` function instead of `animejs`

#### Scenario: Verify NumberTicker uses framer-motion
Given the `NumberTicker` component
When it receives a new value
Then it should tween to that value using `framer-motion`

#### Scenario: Verify FinanceCharts uses framer-motion
Given the `FinanceCharts` component
When transaction list mounts
Then it should stagger animate items using `framer-motion` (or declarative variants)
