---
name: connecting-synapse
description: Manages the logic for the "Second Brain" knowledge graph. Use when creating connections between entities (Journal, Tasks, Habits), implementing Neural Clusters, or calculating insights.
---

# Connecting Synapse

This skill defines the logic for the "Synapse" engine—the connective tissue of the LifeOS Second Brain. It governs how different entities (Tasks, Journal Entries, Habits) relate to each other to form "Neural Clusters".

## When to use this skill
- When implementing "Insights" or "Recommendations".
- When building features that link data types (e.g., "Show habits related to this project").
- When working on the "Neural Clusters" sidebar or graph visualization.

## Core Concepts

### 1. The Entity-Node Model
Everything in LifeOS is a **Node** that can be connected:
-   **Journal Entry**: A thought or record.
-   **Task**: An actionable item.
-   **Habit**: A recurring pattern.
-   **Project**: A container of value.

### 2. The Cluster Logic (Edges)
Nodes are connected primarily through **Tags** and **Context**.
-   **Implicit Connection**: Two entities share the tag `#productivity`.
-   **Explicit Connection**: User links a Task to a Project.
-   **Resonance Connection**: AI detects similar semantic content (embedding similarity).

## Workflow for New Features

When adding a new feature that needs to "feel intelligent":

1.  **Tag Extraction**: Always allow the user (or AI) to tag the entity.
2.  **Aggregation**: Calculate clusters on the fly using `reduce` or `Map` (never hardcode).
    ```typescript
    // Example: Aggregating Clusters
    const clusters = entries.reduce((acc, entry) => {
      entry.tags.forEach(tag => {
        acc.set(tag, (acc.get(tag) || 0) + 1);
      });
      return acc;
    }, new Map<string, number>());
    ```
3.  **Cross-Pollination**: Display related entities.
    -   *If viewing a Project, show Journal Entries with the same tags.*

## Instructions
-   **Normalization**: ALL tags must be `lowercase` and `trimmed` before saving.
-   **Resonance**: Use the `journalApi.analyzeEntry` endpoint to generate AI insights for unconnected thoughts.
-   **Visuals**: Use the `InsightCard` component for displaying connections.

## Resources
- [Journal Analysis Logic](file:///src/features/journal/api/journal.api.ts)
