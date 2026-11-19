import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types/finance';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import { formatSignedCurrency, formatCurrency } from '../utils/formatters';
import {
  History,
  Trash2,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Calendar,
  AlertTriangle,
  X,
  Inbox,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

interface TransactionHistoryModuleProps {
  transactions: Transaction[];
  currencySymbol: string;
  hideBalance: boolean;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  onDeleteTransaction: (id: string) => void;
  onOpenIncome: () => void;
  onOpenExpense: () => void;
}

export const TransactionHistoryModule: React.FC<TransactionHistoryModuleProps> = ({
  transactions,
  currencySymbol,
  hideBalance,
  totalIncome,
  totalExpense,
  balance,
  onDeleteTransaction,
  onOpenIncome,
  onOpenExpense,
}) => {
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  // Helper to parse exact timestamp for sorting
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

  // Filtrado por tipo y búsqueda
  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((tx) => {
      // Filtro tipo (ingreso / gasto)
      if (filterType !== 'all' && tx.type !== filterType) return false;

      // Filtro búsqueda
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const cat = CATEGORIES.find((c) => c.id === tx.category);
        const matchesCat = cat?.name.toLowerCase().includes(query);
        const matchesAmount = tx.amount.toString().includes(query);
        return matchesDesc || matchesCat || matchesAmount;
      }
      return true;
    });
  }, [sortedTransactions, filterType, searchTerm]);

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

  // Format full legible date
  const formatFullDate = (dateStr: string, timeStr?: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      const formattedDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return timeStr ? `${formattedDate} · ${timeStr}` : formattedDate;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Cabecera del módulo de historial */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Historial de Movimientos
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Orden cronológico: más recientes primero
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-xl text-slate-700 font-mono">
            {transactions.length} registros
          </span>
        </div>

        {/* Resumen numérico rápido del historial */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
              + Ingresos
            </span>
            <span className="text-xs font-bold font-mono text-emerald-700 tabular-nums truncate block mt-0.5">
              {hideBalance ? '••••' : formatCurrency(totalIncome, currencySymbol)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">
              - Gastos
            </span>
            <span className="text-xs font-bold font-mono text-rose-700 tabular-nums truncate block mt-0.5">
              {hideBalance ? '••••' : formatCurrency(totalExpense, currencySymbol)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
              Saldo
            </span>
            <span
              className={`text-xs font-bold font-mono tabular-nums truncate block mt-0.5 ${
                balance < 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {hideBalance ? '••••' : formatCurrency(balance, currencySymbol)}
            </span>
          </div>
        </div>

        {/* Botones de acción rápida para registrar dentro del historial */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenIncome}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Registrar ingreso</span>
          </button>
          <button
            onClick={onOpenExpense}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Registrar gasto</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Segmented filter buttons */}
          <div className="flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Ingresos</span>
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Gastos</span>
            </button>
          </div>

          {/* Buscador de concepto */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por concepto o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800 placeholder-slate-400 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista del Historial de Movimientos */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              No se encontraron movimientos
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchTerm
                ? `No hay registros que coincidan con "${searchTerm}"`
                : filterType !== 'all'
                ? `No hay ${filterType === 'income' ? 'ingresos' : 'gastos'} registrados`
                : 'Aún no tienes movimientos registrados en tu historial'}
            </p>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const meta = getCategoryMeta(tx.category);

            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Lado izquierdo: Icono con indicador direccional + Concepto + Fecha */}
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      <CategoryIcon iconName={meta.icon} className="w-5 h-5" type={tx.type} />
                    </div>

                    {/* Badge con flecha direccional verde o roja */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white shadow-sm ${
                        isIncome ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                    </div>
                  </div>

                  {/* Concepto, categoría y fecha */}
                  <div className="min-w-0">
                    {/* Requisito 2: Mostrar concepto */}
                    <p className="text-sm font-bold text-slate-900 truncate leading-snug">
                      {tx.description}
                    </p>

                    {/* Requisito 2: Mostrar fecha y metadatos */}
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
                      <span className="flex items-center gap-1 shrink-0 font-medium font-mono text-[11px]">
                        <Calendar className="w-3 h-3 inline text-slate-400" />
                        {formatFullDate(tx.date, tx.time)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lado derecho: Requisitos 3 y 4 (Monto con color verde para ingresos y rojo para gastos) + Botón Eliminar */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-base font-extrabold font-mono tabular-nums block ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {hideBalance
                        ? '••••'
                        : formatSignedCurrency(tx.amount, currencySymbol, tx.type)}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {isIncome ? 'Entrada' : 'Salida'}
                    </span>
                  </div>

                  {/* Requisito 6: Botón para eliminar un movimiento */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(tx)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group-hover:text-slate-400"
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

      {/* Modal de confirmación para eliminar movimiento */}
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
                ¿Eliminar este movimiento?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Se eliminará{' '}
                <strong className="text-slate-800">
                  "{deleteTarget.description}"
                </strong>{' '}
                por un monto de{' '}
                <strong
                  className={
                    deleteTarget.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }
                >
                  {formatSignedCurrency(
                    deleteTarget.amount,
                    currencySymbol,
                    deleteTarget.type
                  )}
                </strong>
                .
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Al confirmar, el total de{' '}
                {deleteTarget.type === 'income' ? 'ingresos' : 'gastos'} y el saldo
                disponible se recalcularán automáticamente.
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
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
