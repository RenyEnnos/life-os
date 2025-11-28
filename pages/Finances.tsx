import React from 'react';
import { Card, Button, ProgressBar } from '../components/Widgets';

const TRANSACTIONS = [
    { date: 'Oct 28', desc: 'Dinner with friends', amount: '-$78.50', tag: 'Food', color: 'blue' },
    { date: 'Oct 25', desc: 'Freelance Payment', amount: '+$1,200.00', tag: 'Salary', color: 'green' },
    { date: 'Oct 22', desc: 'Groceries', amount: '-$124.15', tag: 'Food', color: 'blue' },
    { date: 'Oct 15', desc: 'Spotify', amount: '-$10.99', tag: 'Sub', color: 'purple' },
    { date: 'Oct 05', desc: 'Monthly Salary', amount: '+$4,000.00', tag: 'Salary', color: 'green' },
    { date: 'Oct 01', desc: 'Rent', amount: '-$1,800.00', tag: 'Housing', color: 'orange' },
];

export const Finances: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-white text-4xl font-black tracking-tighter font-display">Finances</h1>
                <div className="flex gap-2">
                    <Button variant="secondary" icon="upload">Import CSV</Button>
                    <Button variant="primary" icon="add">Add Transaction</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="flex flex-col gap-1">
                    <p className="text-sm text-white/60">Total Income</p>
                    <p className="text-3xl font-bold text-green-500 font-display">$5,200.00</p>
                </Card>
                <Card className="flex flex-col gap-1">
                    <p className="text-sm text-white/60">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-500 font-display">$2,850.00</p>
                </Card>
                <Card className="flex flex-col gap-1">
                    <p className="text-sm text-white/60">Net Balance</p>
                    <p className="text-3xl font-bold text-white font-display">$2,350.00</p>
                </Card>
                <Card className="flex flex-col gap-1">
                    <p className="text-sm text-white/60">vs. Last Month</p>
                    <div className="flex items-center gap-2 text-green-500">
                        <span className="material-symbols-outlined">arrow_upward</span>
                        <p className="text-3xl font-bold font-display">+15%</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions Table */}
                <div className="lg:col-span-2">
                    <Card title="Transactions" className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#102310] text-white/60 font-mono text-xs uppercase">
                                    <tr>
                                        <th className="py-3 px-4 font-medium">Date</th>
                                        <th className="py-3 px-4 font-medium">Description</th>
                                        <th className="py-3 px-4 font-medium text-right">Amount</th>
                                        <th className="py-3 px-4 font-medium">Tag</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#224922]">
                                    {TRANSACTIONS.map((t, i) => (
                                        <tr key={i} className="hover:bg-[#142e14] transition-colors">
                                            <td className="py-4 px-4 font-mono text-white/70">{t.date}</td>
                                            <td className="py-4 px-4 font-medium">{t.desc}</td>
                                            <td className={`py-4 px-4 text-right font-mono font-bold ${t.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{t.amount}</td>
                                            <td className="py-4 px-4">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm bg-${t.color}-500/20 text-${t.color}-300`}>
                                                    {t.tag}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Breakdown */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card title="Expense Breakdown">
                        <div className="flex flex-col gap-6">
                            <ProgressBar progress={63} color="bg-orange-400" label="Housing ($1,800)" />
                            <ProgressBar progress={15} color="bg-blue-400" label="Food ($202)" />
                            <ProgressBar progress={30} color="bg-pink-400" label="Entertainment ($836)" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
