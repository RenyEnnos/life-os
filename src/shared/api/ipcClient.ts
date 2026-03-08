export class IpcClient<T> {
    private resource: string;

    constructor(resource: string) {
        this.resource = resource;
    }

    private assertApi() {
        if (typeof window === 'undefined' || !(window as any).api?.invokeResource) {
            throw new Error(`window.api.invokeResource is not available. Ensure you are running in Electron.`);
        }
    }

    async getAll(): Promise<T[]> {
        this.assertApi();
        return (window as any).api.invokeResource(this.resource, 'getAll');
    }

    async getById(id: string): Promise<T | null> {
        this.assertApi();
        return (window as any).api.invokeResource(this.resource, 'getById', id);
    }

    async create(data: Partial<T>): Promise<T> {
        this.assertApi();
        return (window as any).api.invokeResource(this.resource, 'create', data);
    }

    async update(id: string, updates: Partial<T>): Promise<T> {
        this.assertApi();
        return (window as any).api.invokeResource(this.resource, 'update', id, updates);
    }

    async delete(id: string): Promise<boolean> {
        this.assertApi();
        return (window as any).api.invokeResource(this.resource, 'delete', id);
    }
}
