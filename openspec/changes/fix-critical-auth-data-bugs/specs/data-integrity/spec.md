## ADDED Requirements

### Requirement: Hard Delete for Transactions
The finance service SHALL perform hard deletes when removing transactions.

#### Scenario: Delete transaction
- **WHEN** `financeService.remove()` is called with valid userId and transaction id
- **THEN** the transaction SHALL be permanently removed from the database
- **AND** the deleted transaction SHALL NOT appear in subsequent `list()` calls

#### Scenario: Delete non-existent transaction
- **WHEN** `financeService.remove()` is called with a non-existent transaction id
- **THEN** the operation SHALL return false or throw an appropriate error

---

### Requirement: Hard Delete for Tasks
The tasks service SHALL perform hard deletes when removing tasks.

#### Scenario: Delete task
- **WHEN** `tasksService.remove()` is called with valid userId and task id
- **THEN** the task SHALL be permanently removed from the database
- **AND** the deleted task SHALL NOT appear in subsequent `list()` calls

#### Scenario: Delete non-existent task
- **WHEN** `tasksService.remove()` is called with a non-existent task id
- **THEN** the operation SHALL return false or throw an appropriate error
