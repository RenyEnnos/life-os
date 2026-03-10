import { ipcMain } from 'electron';
import { BaseRepository } from '../db/BaseRepository';

// Allowlist of allowed resources mapped to their respective DB tables.
// This prevents arbitrary SQL table injection through the IPC dynamic router.
const ALLOWED_RESOURCES: Record<string, string> = {
    'habits': 'habits',
    'journal': 'journal_entries', // example mapping
    'finances': 'transactions',
    'health': 'health_metrics',
    'medications': 'medication_reminders',
    // ... add more as we migrate
};

export const setupResourceHandlers = () => {
    ipcMain.handle('resource:invoke', async (_event, resourceName: string, action: string, ...args: any[]) => {
        if (!ALLOWED_RESOURCES[resourceName]) {
            throw new Error(`Unauthorized or unknown resource: ${resourceName}`);
        }

        const tableName = ALLOWED_RESOURCES[resourceName];
        const repo = new BaseRepository<any>(tableName);

        switch (action) {
            case 'getAll':
                return repo.getAll();
            case 'getById':
                return repo.getById(args[0]);
            case 'create':
                return repo.create(args[0]);
            case 'update':
                return repo.update(args[0], args[1]);
            case 'delete':
                return repo.delete(args[0]);
            default:
                throw new Error(`Unknown action: ${action} for resource: ${resourceName}`);
        }
    });
};
