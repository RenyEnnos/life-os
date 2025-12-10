# Achievement Unlock Specification

## ADDED Requirements

### Requirement: Achievement Unlock Check
The system must check if the user qualifies for any new achievements after XP is awarded.

#### Scenario: User completes first task
Given a user who has never completed a task
When they complete a task and XP is awarded
Then the "First Steps" achievement is unlocked.

#### Scenario: User already has the achievement
Given a user who has already unlocked "First Steps"
When they complete another task
Then no duplicate achievement is unlocked.

### Requirement: Achievement Notification
The system must notify the user when they unlock a new achievement.

#### Scenario: Achievement is newly unlocked
Given an achievement that was just unlocked
When the unlock process completes
Then a toast notification is displayed showing the achievement name and XP reward.

### Requirement: Achievement Panel Display
The Achievements Panel must display all achievements with their locked/unlocked status.

#### Scenario: User views achievements
Given a user on the Achievements Panel
When the panel loads
Then all achievements are displayed with icons, and unlocked achievements are highlighted.
