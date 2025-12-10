## ADDED Requirements

### Requirement: User XP Table Structure
The system MUST store user progress in a `user_xp` table.

#### Scenario: New User Initialization
- GIVEN a new user signs up
- WHEN they are created in `auth.users`
- THEN a corresponding row in `user_xp` SHOULD be created (via trigger or service) with 0 XP and Level 1.

### Requirement: XP Awarding Logic
The system MUST provide a method to award XP to users.

#### Scenario: Awarding XP for Task Completion
- GIVEN a user completes a task in 'Output' category
- WHEN `awardXP` is called with amount 50 and category 'output'
- THEN the user's `total_xp` should increase by 50
- AND the user's `attributes.output` should increase by 50.

### Requirement: Level Calculation
The system MUST calculate level based on total XP.

#### Scenario: Level Up
- GIVEN a user has 90 XP (Level 1)
- WHEN they earn 20 XP (Total 110)
- THEN their level should update to 2
- AND a "Level Up" event should be triggered.

### Requirement: Anti-Cheat Limits
The system MUST limit frequency of XP awards for spam-able actions.

#### Scenario: Journal Spam Prevention
- GIVEN a user has already earned Journal XP today
- WHEN they create another journal entry immediately
- THEN no additional XP should be awarded for that specific source/action type today.
