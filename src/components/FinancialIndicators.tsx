import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Scale, AlertOctagon } from 'lucide-react';
import { formatCurrency, formatSignedCurrency } from '../utils/formatters';

interface FinancialIndicatorsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  currencySymbol: string;
  hideBalance: boolean;
  incomeCount: number;
  expenseCount: number;
  lastAddedType?: 'income' | 'expense' | null;
}

export const FinancialIndicators: React.FC<FinancialIndicatorsProps> = ({
  totalIncome,
  totalExpense,
  balance,
  currencySymbol,
  hideBalance,
  incomeCount,
  expenseCount,
  lastAddedType,
}) => {
  const [highlightIncome, setHighlightIncome] = useState(false);
  const [highlightExpense, setHighlightExpense] = useState(false);

  const isNegative = balance < 0;

  useEffect(() => {
    if (lastAddedType === 'income') {
      setHighlightIncome(true);
      const timer = setTimeout(() => setHighlightIncome(false), 2200);
      return () => clearTimeout(timer);
    } else if (lastAddedType === 'expense') {
      setHighlightExpense(true);
      const timer = setTimeout(() => setHighlightExpense(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [totalIncome, totalExpense, lastAddedType]);

  // Relative percentages for visual comparison bar
  const totalFlow = totalIncome + totalExpense;
  const incomePercentage = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePercentage = totalFlow > 0 ? 100 - incomePercentage : 50;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Resumen Financiero
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          3 Indicadores Automáticos
        </span>
      </div>

      {/* Grid de 3 indicadores principales */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Indicador 1: Total Ingresos (Regla 1) */}
        <div
          className={`bg-white rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between transition-all duration-300 ${
            highlightIncome
              ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02] bg-emerald-50/20'
              : 'border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-tight">
              Ingresos
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                highlightIncome ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 strokeWidth={2.5}" />
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-emerald-600 truncate">
              {hideBalance ? '••••' : formatSignedCurrency(totalIncome, currencySymbol, 'income')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {incomeCount} {incomeCount === 1 ? 'registro' : 'registros'}
            </div>
          </div>
        </div>

        {/* Indicador 2: Total Gastos (Regla 2) */}
        <div
          className={`bg-white rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between transition-all duration-300 ${
            highlightExpense
              ? 'border-rose-500 ring-2 ring-rose-500/30 scale-[1.02] bg-rose-50/20'
              : 'border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-tight">
              Gastos
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                highlightExpense ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 strokeWidth={2.5}" />
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-rose-600 truncate">
              {hideBalance ? '••••' : formatSignedCurrency(totalExpense, currencySymbol, 'expense')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {expenseCount} {expenseCount === 1 ? 'registro' : 'registros'}
            </div>
          </div>
        </div>

        {/* Indicador 3: Saldo Disponible = Ingresos - Gastos (Reglas 3 y 5) */}
        <div
          className={`bg-white rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between transition-all duration-300 ${
            isNegative
              ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/30'
              : highlightIncome || highlightExpense
              ? 'border-slate-300 ring-2 ring-slate-400/20'
              : 'border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-tight ${
                isNegative ? 'text-rose-700' : 'text-slate-700'
              }`}
            >
              Saldo
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isNegative ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <div
              className={`text-sm sm:text-base font-bold font-mono tabular-nums truncate ${
                isNegative ? 'text-rose-600 font-extrabold' : 'text-slate-900'
              }`}
            >
              {hideBalance ? '••••' : formatCurrency(balance, currencySymbol)}
            </div>
            <div
              className={`text-[11px] mt-0.5 truncate font-semibold ${
                isNegative ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isNegative ? 'Déficit (Negativo)' : 'Superávit'}
            </div>
          </div>
        </div>
      </div>

      {/* Regla 5 y 6: Alerta visual si los gastos superan los ingresos */}
      {isNegative && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">¡Atención: Gastos superan ingresos!</p>
            <p className="text-rose-700 mt-0.5 leading-snug">
              Tus gastos acumulados superan tus ingresos por{' '}
              <strong className="font-mono">
                {formatCurrency(Math.abs(balance), currencySymbol)}
              </strong>
              . Tu saldo está en números rojos.
            </p>
          </div>
        </div>
      )}

      {/* Regla 6: Barra visual comparativa entre Ingresos y Gastos */}
      {totalFlow > 0 && (
        <div className="bg-white rounded-2xl p-3 border border-slate-100 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Ingresos ({incomePercentage}%)
            </span>
            <span className="flex items-center gap-1 text-rose-700 font-semibold">
              Gastos ({expensePercentage}%)
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${incomePercentage}%` }}
              title={`Ingresos: ${incomePercentage}%`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${expensePercentage}%` }}
              title={`Gastos: ${expensePercentage}%`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
