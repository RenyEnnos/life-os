## ADDED Requirements
### Requirement: Elite Terminology
The system SHALL adopt Elite Identity naming consistently across UI, URLs, and docs.

#### Scenario: Core labels updated
- **WHEN** the user navigates the product
- **THEN** the following terms are used: Dashboard→Nexus, Tasks→Fluxo, Assistant→Synapse, Dynamic section→Agora, Gamification→Arquétipos, Gallery→Legacy, Focus mode→Sanctuary
- **AND** legacy labels are removed from navigation, headers, and empty states

#### Scenario: URL and command alignment
- **WHEN** a user opens or searches via Synapse Bar or URLs
- **THEN** paths and command groups reflect the same nomenclature (e.g., `/nexus`, “Open Fluxo”)
- **AND** mixed naming is rejected during review

---

### Requirement: Voice and Copy Tone
The system SHALL use concise, calm copy aligned with “A Estética do Silêncio”.

#### Scenario: CTA copy guidelines
- **WHEN** a CTA is rendered in Nexus or Synapse
- **THEN** the label stays under 3 words, avoids jargon, and uses imperative mood (e.g., “Start Focus”)
- **AND** helper text stays under 80 chars and references context (time, archetype, or mood)
