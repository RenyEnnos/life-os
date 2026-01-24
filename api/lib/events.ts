import EventEmitter from 'events'

class LifeOSEventBus extends EventEmitter {
    constructor() {
        super()
        this.setMaxListeners(20)
    }
}

export const eventBus = new LifeOSEventBus()

export enum Events {
    HABIT_COMPLETED = 'habit:completed',
    TASK_COMPLETED = 'task:completed',
    LEVEL_UP = 'user:levelup',
    SYNAMSE_TRIGGER = 'synapse:trigger',
    // Finance
    TRANSACTION_CREATED = 'finance:transaction_created',
    BUDGET_CHECK = 'finance:budget_check'
}
