import { ipcMain } from 'electron';
import { BaseRepository } from '../db/BaseRepository';

class TasksRepository extends BaseRepository<any> {
    constructor() {
        super('tasks');
    }

    // Custom serialize/deserialize for tasks
    protected serialize(data: any): any {
        const result = { ...data };
        if (result.tags) {
            result.tags = JSON.stringify(result.tags);
        }
        return result;
    }

    protected deserialize(row: any): any {
        const result = { ...row };
        if (result.tags && typeof result.tags === 'string') {
            try {
                result.tags = JSON.parse(result.tags);
            } catch {
                result.tags = [];
            }
        }
        return result;
    }
}

export const setupTasksHandlers = () => {
    const repo = new TasksRepository();

    ipcMain.handle('tasks:getAll', async () => {
        try {
            return repo.getAll();
        } catch (err) {
            console.error('Failed to get tasks', err);
            return [];
        }
    });

    ipcMain.handle('tasks:create', async (_event, task) => {
        try {
            return repo.create(task);
        } catch (err) {
            console.error('Failed to create task', err);
            throw err;
        }
    });

    ipcMain.handle('tasks:update', async (_event, id, updates) => {
        try {
            return repo.update(id, updates);
        } catch (err) {
            console.error('Failed to update task', err);
            throw err;
        }
    });

    ipcMain.handle('tasks:delete', async (_event, id) => {
        try {
            return repo.delete(id);
        } catch (err) {
            console.error('Failed to delete task', err);
            throw err;
        }
    });
};
