# Design: Synapse Regex Refinement

## Context
Refining the Pattern Matching logic to be more fluid. Users should be able to just type "50 em Uber" without strictly typing "Gastei".

## Changes

### Shared UI
#### [MODIFY] [Synapse.tsx](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/synapse/Synapse.tsx)
- Update Expense Regex to: `/^(?:gastei|paguei)?\s*(\d+)(?:\s+(?:em|no|na)\s+(.*))?$/`
- Add guard clause: `lowerQuery.length > 2` to prevent triggering on typing "1" or "10" unintentionally (though "10" might be a valid expense, usually context is needed).
- Update Task Regex to handle "todo " prefix more cleanly.
