# Archetype Logic Specification

## ADDED Requirements

### Requirement: Archetype Determination
The system must determine the user's archetype based on their dominant XP attribute.

#### Scenario: User has highest XP in "output"
Given a user with attributes { body: 100, mind: 50, spirit: 30, output: 200 }
When the archetype is calculated
Then the result is "The Maker" with amber/orange color.

#### Scenario: User has highest XP in "mind"
Given a user with attributes { body: 50, mind: 300, spirit: 100, output: 200 }
When the archetype is calculated
Then the result is "The Scholar" with blue/indigo color.

#### Scenario: User has all equal attributes
Given a user with attributes { body: 100, mind: 100, spirit: 100, output: 100 }
When the archetype is calculated
Then the result is "The Aspirant" with gray color.

#### Scenario: User has zero XP in all attributes
Given a user with attributes { body: 0, mind: 0, spirit: 0, output: 0 }
When the archetype is calculated
Then the result is "The Aspirant" with gray color.

### Requirement: Archetype Object Structure
The archetype object must contain: `id`, `name`, `color`, `bgColor`, `icon`, and `description`.

#### Scenario: Archetype object is returned
Given any valid attribute set
When the archetype is calculated
Then the returned object contains all required fields.
