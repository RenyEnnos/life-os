# Spec: Technical Cleanup

## REMOVED Requirements

### Requirement: Remove Legacy UI Components
The application MUST NOT contain `src/shared/ui/premium/BentoGrid.tsx`.
#### Scenario: Checking the file system
GIVEN the file system
WHEN checking user interface directory
THEN `src/shared/ui/premium/BentoGrid.tsx` should not exist

### Requirement: Remove AnimeJS
The application MUST NOT depend on `animejs` or `@types/animejs`.
#### Scenario: Checking package.json
GIVEN `package.json`
WHEN inspecting dependencies and devDependencies
THEN `animejs` and `@types/animejs` should be absent

## MODIFIED Requirements

### Requirement: Deep Dark CSS Variables
The application MUST use the defined "Deep Dark" color palette variables in `src/index.css`.
#### Scenario: verifying root variables
GIVEN `src/index.css`
THEN `--color-background` should be `#050505`
AND `--color-surface` should be `#0f0f0f`
