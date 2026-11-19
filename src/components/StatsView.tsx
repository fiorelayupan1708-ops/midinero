import React from 'react';
import { Transaction } from '../types/finance';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { PieChart, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface StatsViewProps {
  transactions: Transaction[];
  currencySymbol: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  hideBalance: boolean;
}

export const StatsView: React.FC<StatsViewProps> = ({
  transactions,
  currencySymbol,
  totalIncome,
  totalExpense,
  balance,
  hideBalance,
}) => {
  // Category breakdown for expenses
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const expensesByCategory: Record<string, number> = {};

  expenseTransactions.forEach((tx) => {
    expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
  });

  const sortedCategories = Object.entries(expensesByCategory)
    .map(([catId, amount]) => {
      const cat = CATEGORIES.find((c) => c.id === catId);
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        catId,
        name: cat?.name || 'Otro',
        icon: cat?.icon || 'HelpCircle',
        color: cat?.color || 'text-slate-600',
        bgColor: cat?.bgColor || 'bg-slate-100',
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const rawRatio = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : totalExpense > 0 ? 100 : 0;
  const isDeficit = balance < 0;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Distribución del Dinero
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Noviembre 2026</span>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600">Porcentaje gastado de ingresos</span>
            <span
              className={`font-mono font-bold ${
                rawRatio > 100 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {rawRatio}% {rawRatio > 100 ? '(Déficit)' : ''}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                rawRatio > 100
                  ? 'bg-rose-600'
                  : rawRatio > 85
                  ? 'bg-rose-500'
                  : rawRatio > 60
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(rawRatio, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
            <span>0%</span>
            <span>Meta recomendada &lt; 70%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div
            className={`p-3 rounded-2xl border transition-colors ${
              isDeficit ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <TrendingUp
                className={`w-3.5 h-3.5 ${
                  isDeficit ? 'text-rose-600' : 'text-emerald-600'
                }`}
              />
              <span className="font-semibold">Saldo Neto</span>
            </div>
            <div
              className={`text-sm font-bold font-mono tabular-nums ${
                isDeficit ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {hideBalance ? '••••' : formatCurrency(balance, currencySymbol)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              <span>Gasto Promedio</span>
            </div>
            <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
              {hideBalance
                ? '••••'
                : formatCurrency(
                    expenseTransactions.length > 0
                      ? totalExpense / expenseTransactions.length
                      : 0,
                    currencySymbol
                  )}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses by Category List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Gastos por Categoría
          </h3>
          <span className="text-xs text-slate-400">
            {sortedCategories.length} categorías activas
          </span>
        </div>

        {sortedCategories.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            No hay gastos registrados para analizar.
          </p>
        ) : (
          <div className="space-y-3.5">
            {sortedCategories.map((cat) => (
              <div key={cat.catId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.color}`}>
                      <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {hideBalance ? '••••' : formatCurrency(cat.amount, currencySymbol)}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1.5 font-medium">
                      ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full transition-all duration-300"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Health Tip */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950">
          <p className="font-bold">Consejo de ahorro</p>
          <p className="text-emerald-800 mt-0.5 leading-relaxed">
            Mantener un fondo de emergencia de 3 a 6 meses de gastos te brinda tranquilidad ante imprevistos.
          </p>
        </div>
      </div>
    </div>
  );
};
