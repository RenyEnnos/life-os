import { IpcClient } from '@/shared/api/ipcClient';
import { Transaction } from '@/shared/types';
import { useAuthStore } from '@/shared/stores/authStore';

const financesIpc = new IpcClient<Transaction>('finances');

export const financesApi = {
    list: async (_userId?: string, filters?: Record<string, string>) => {
        const all = await financesIpc.getAll();

        return all.filter((transaction) => {
            const transactionDate = transaction.transaction_date ?? transaction.date;

            if (_userId && transaction.user_id !== _userId) {
                return false;
            }
            if (filters?.startDate && transactionDate && transactionDate < filters.startDate) {
                return false;
            }
            if (filters?.endDate && transactionDate && transactionDate > filters.endDate) {
                return false;
            }
            if (filters?.type && transaction.type !== filters.type) {
                return false;
            }
            if (filters?.category && transaction.category !== filters.category) {
                return false;
            }

            return true;
        });
    },

    create: async (transaction: Partial<Transaction>) => {
        const userId = useAuthStore.getState().user?.id;
        const payload: Partial<Transaction> = transaction.user_id || !userId
            ? transaction
            : { ...transaction, user_id: userId };

        const data = await financesIpc.create(payload);
        return data;
    },

    update: async (id: string, updates: Partial<Transaction>) => {
        const data = await financesIpc.update(id, updates);
        return data;
    },

    delete: async (id: string) => {
        await financesIpc.delete(id);
    },

    getSummary: async (userId?: string) => {
        const all = await financesIpc.getAll();
        const scoped = userId ? all.filter((transaction) => transaction.user_id === userId) : all;

        const summary = scoped.reduce(
            (acc, transaction) => {
                const amount = Number(transaction.amount) || 0;

                if (transaction.type === 'income') {
                    acc.income += amount;
                } else {
                    acc.expenses += amount;

                    if (transaction.category) {
                        acc.byCategory[transaction.category] = (acc.byCategory[transaction.category] || 0) + amount;
                    }
                }

                return acc;
            },
            {
                income: 0,
                expenses: 0,
                balance: 0,
                byCategory: {} as Record<string, number>,
            }
        );

        summary.balance = summary.income - summary.expenses;
        return summary;
    }
};
