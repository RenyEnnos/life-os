import type { BridgeAPI } from '../types/electron';

export class IpcClient<T> {
    private resource: string;

    constructor(resource: string) {
        this.resource = resource;
    }

    private getBridge(): BridgeAPI {
        const win = window as Window;
        if (typeof window === 'undefined' || !win?.api?.invokeResource) {
            throw new Error(`window.api.invokeResource is not available. Ensure you are running in Electron.`);
        }
        return win.api;
    }

    async getAll(): Promise<T[]> {
        const bridge = this.getBridge();
        return bridge.invokeResource<T[]>(this.resource, 'getAll');
    }

    async getById(id: string): Promise<T | null> {
        const bridge = this.getBridge();
        return bridge.invokeResource<T | null>(this.resource, 'getById', id);
    }

    async create(data: Partial<T>): Promise<T> {
        const bridge = this.getBridge();
        return bridge.invokeResource<T>(this.resource, 'create', data);
    }

    async update(id: string, updates: Partial<T>): Promise<T> {
        const bridge = this.getBridge();
        return bridge.invokeResource<T>(this.resource, 'update', id, updates);
    }

    async delete(id: string): Promise<boolean> {
        const bridge = this.getBridge();
        return bridge.invokeResource<boolean>(this.resource, 'delete', id);
    }
}
