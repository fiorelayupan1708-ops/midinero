import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types/finance';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import { formatSignedCurrency, formatDateLabel } from '../utils/formatters';
import { Trash2, Search, ArrowDownLeft, ArrowUpRight, Inbox, AlertTriangle, ChevronRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currencySymbol: string;
  hideBalance: boolean;
  onDeleteTransaction: (id: string) => void;
  onOpenIncome: () => void;
  onOpenExpense: () => void;
  onViewAll?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currencySymbol,
  hideBalance,
  onDeleteTransaction,
  onOpenIncome,
  onOpenExpense,
  onViewAll,
}) => {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  // Exact timestamp parsing for descending chronological order
  const getTimestamp = (tx: Transaction) => {
    const timeStr = tx.time && tx.time.includes(':') ? tx.time : '00:00';
    const dateObj = new Date(`${tx.date}T${timeStr}:00`);
    return isNaN(dateObj.getTime()) ? new Date(tx.date).getTime() : dateObj.getTime();
  };

  // Requisito 5: Ordenar los movimientos desde el más reciente hasta el más antiguo
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const timeB = getTimestamp(b);
      const timeA = getTimestamp(a);
      if (timeB !== timeA) return timeB - timeA;
      return b.id.localeCompare(a.id);
    });
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((tx) => {
      if (filter !== 'all' && tx.type !== filter) return false;
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(term);
        const categoryObj = CATEGORIES.find((c) => c.id === tx.category);
        const matchesCat = categoryObj?.name.toLowerCase().includes(term);
        const matchesAmount = tx.amount.toString().includes(term);
        return matchesDesc || matchesCat || matchesAmount;
      }
      return true;
    });
  }, [sortedTransactions, filter, searchTerm]);

  const getCategoryMeta = (catId: string) => {
    return (
      CATEGORIES.find((c) => c.id === catId) || {
        name: 'Otro',
        icon: 'HelpCircle',
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDeleteTransaction(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-3">
      {/* Section Header with Segmented Filter Controls */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Movimientos Recientes
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              ({transactions.length})
            </span>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>Ver todo el historial</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Segmented filter buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Ingresos</span>
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Gastos</span>
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative flex-1 max-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              No hay movimientos registrados
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchTerm
                ? 'No se encontraron resultados para la búsqueda'
                : 'Empieza registrando un ingreso o gasto'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={onOpenIncome}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              + Registrar ingreso
            </button>
            <button
              onClick={onOpenExpense}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              - Registrar gasto
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredTransactions.slice(0, 7).map((tx) => {
            const meta = getCategoryMeta(tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors"
              >
                {/* Left: Category Icon with directional flow badge and Description */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      <CategoryIcon iconName={meta.icon} className="w-5 h-5" type={tx.type} />
                    </div>
                    {/* Small badge overlay showing + or - direction */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white ${
                        isIncome ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <span
                        className={`font-semibold ${
                          isIncome ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isIncome ? 'Ingreso' : 'Gasto'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{meta.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="shrink-0 font-medium">
                        {formatDateLabel(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-bold font-mono tabular-nums block ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {hideBalance
                        ? '••••'
                        : formatSignedCurrency(tx.amount, currencySymbol, tx.type)}
                    </span>
                    {tx.time && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tx.time}
                      </span>
                    )}
                  </div>

                  {/* Delete trigger */}
                  <button
                    onClick={() => setDeleteTarget(tx)}
                    className="opacity-60 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title={`Eliminar "${tx.description}"`}
                    aria-label={`Eliminar ${tx.description}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation modal for delete */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                ¿Eliminar movimiento?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Se eliminará{' '}
                <strong className="text-slate-800">
                  "{deleteTarget.description}"
                </strong>{' '}
                ({formatSignedCurrency(
                  deleteTarget.amount,
                  currencySymbol,
                  deleteTarget.type
                )})
                .
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Los totales de ingresos, gastos y el saldo disponible se
                recalcularán automáticamente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 active:scale-[0.98] cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
