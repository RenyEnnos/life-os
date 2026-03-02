import React from 'react';
import { Filter, Calendar, Tag, DollarSign, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/cn';

interface FinanceFilterBarProps {
    filters: Record<string, string>;
    onFilterChange: (filters: Record<string, string>) => void;
    onClear: () => void;
}

const categories = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 
    'Educação', 'Lazer', 'Compras', 'Contas', 'Investimentos', 'Salário', 'Freelance'
];

export function FinanceFilterBar({ filters, onFilterChange, onClear }: FinanceFilterBarProps) {
    const handleChange = (key: string, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const hasFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="flex flex-col gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-white/5 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                    <Filter size={16} />
                    <span>Filtros Avançados</span>
                </div>
                {hasFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClear}
                        className="text-xs text-zinc-500 hover:text-white h-8"
                    >
                        <X size={14} className="mr-1" /> Limpar Filtros
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Tipo</label>
                    <select
                        value={filters.type || ''}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full h-10 bg-black/40 border border-white/5 rounded-lg px-3 text-sm focus:border-primary/50 outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Todos os tipos</option>
                        <option value="income">Receitas (+)</option>
                        <option value="expense">Despesas (-)</option>
                    </select>
                </div>

                {/* Categoria */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Categoria</label>
                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full h-10 bg-black/40 border border-white/5 rounded-lg px-3 text-sm focus:border-primary/50 outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Data Início */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Data Início</label>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <Input
                            type="date"
                            value={filters.startDate || ''}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                            className="pl-9 h-10 bg-black/40 border-white/5"
                        />
                    </div>
                </div>

                {/* Data Fim */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Data Fim</label>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <Input
                            type="date"
                            value={filters.endDate || ''}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                            className="pl-9 h-10 bg-black/40 border-white/5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
