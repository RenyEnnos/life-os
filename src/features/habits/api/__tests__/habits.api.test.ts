import { describe, it, expect, beforeEach } from "vitest";
import { habitsApi } from "../habits.api";
import { Habit } from "../../types";
import { apiClient } from "@/shared/api/http";

// Bridge-based tests: validate contract with window.api.invokeResource

describe("habits.api (bridge-based)", () => {
  beforeEach(() => {
    // Mock the IPC bridge used by IpcClient to talk to the habits resource
    (window as any).api = {
      invokeResource: async (resource: string, action: string, ...args: any[]) => {
        if (resource !== 'habits') throw new Error('Unknown resource');
        if (action === 'getAll') {
          const item = {
            id: 'h1',
            title: 'Test Habit',
            type: 'binary',
            frequency: [],
            streak: 0,
            routine: 'morning',
            schedule: { frequency: 'daily' },
            target_value: 0,
            goal: 0,
            name: 'Test Habit',
          } as any;
          return [item];
        }
        if (action === 'create') {
          const payload = args[0] as any;
          const created: any = {
            id: 'h2',
            title: payload?.title ?? '',
            type: payload?.type ?? 'binary',
            frequency: payload?.frequency ?? [],
            streak: 0,
            routine: payload?.routine ?? 'morning',
            schedule: payload?.schedule ?? { frequency: 'daily' },
            target_value: payload?.target_value ?? 0,
            goal: payload?.goal ?? 0,
            name: payload?.title ?? 'New Habit',
          } as any;
          return created;
        }
        if (action === 'update') {
          const [id, updates] = args;
          if (!id) throw new Error('ID required');
          return { id, ...(updates ?? {}) } as any;
        }
        if (action === 'delete') {
          const id = args[0];
          if (!id) throw new Error('ID required');
          return true;
        }
        return null;
      }
    };

    // Mock the HTTP client used for getLogs
    (apiClient as any).get = async (_url: string) => {
      // Return a sample log with a legacy date field to ensure normalization works
      return [ { habit_id: 'h1', logged_date: '2026-03-09' } ];
    };
  });

  describe("list", () => {
    it("fetches habits via bridge and returns an array", async () => {
      const data = await habitsApi.list();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].id).toBe('h1');
    });
  });

  describe("create", () => {
    it("creates a habit with valid payload via bridge", async () => {
      const payload: Partial<Habit> = {
        title: 'New Habit',
        type: 'binary',
        frequency: [],
        streak: 0,
        routine: 'morning',
        schedule: { frequency: 'daily' },
        target_value: 0,
        goal: 0,
        name: 'New Habit'
      };
      const created = await habitsApi.create(payload as any);
      expect(created.id).toBe('h2');
      expect(created.title).toBe('New Habit');
    });

    it("rejects invalid payload for create", async () => {
      await expect(habitsApi.create({} as any)).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("updates a habit with valid id and payload via bridge", async () => {
      const updated = await habitsApi.update('h1', { title: 'Updated Title' } as any);
      expect(updated.id).toBe('h1');
      expect(updated.title).toBe('Updated Title');
    });

    it("rejects when id is invalid for update", async () => {
      await expect(habitsApi.update('', { title: 'X' } as any)).rejects.toThrow();
    });

    it("rejects invalid payload for update", async () => {
      await expect(habitsApi.update('h1', { title: '' } as any)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("deletes a habit with valid id via bridge", async () => {
      await expect(habitsApi.delete('h1')).resolves.toBeUndefined();
    });

    it("rejects invalid id for delete", async () => {
      await expect(habitsApi.delete('')).rejects.toThrow();
    });
  });

  describe("getLogs", () => {
    it("normalizes date from date/logged_date", async () => {
      const logs = await habitsApi.getLogs('2026-03-09');
      expect(Array.isArray(logs)).toBe(true);
      expect((logs[0] as any).date).toBe('2026-03-09');
    });
  });
});
