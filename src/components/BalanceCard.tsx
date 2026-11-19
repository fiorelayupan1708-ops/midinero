import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, Wifi, AlertTriangle } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  currencySymbol: string;
  hideBalance: boolean;
  totalIncome: number;
  totalExpense: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currencySymbol,
  hideBalance,
  totalIncome,
  totalExpense,
}) => {
  const isNegative = balance < 0;

  // Calculate savings rate percentage
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : totalExpense > 0
      ? -100
      : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl text-white p-6 shadow-xl transition-all duration-300 border ${
        isNegative
          ? 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border-rose-500/40 shadow-rose-950/20'
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border-slate-700/40 shadow-slate-900/15'
      }`}
    >
      {/* Decorative ambient background glows */}
      <div
        className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
          isNegative ? 'bg-rose-500/20' : 'bg-emerald-500/15'
        }`}
      />
      <div
        className={`absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
          isNegative ? 'bg-red-500/15' : 'bg-teal-500/10'
        }`}
      />

      {/* Card Top Row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {/* EMV Chip & Contactless design element */}
          <div className="w-8 h-6 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 border border-amber-400/50 flex items-center justify-center shadow-inner">
            <div className="w-5 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
              <div className="border-r border-b border-amber-700/30" />
              <div className="border-b border-amber-700/30" />
              <div className="border-r border-amber-700/30" />
              <div />
            </div>
          </div>
          <Wifi className="w-4 h-4 text-slate-400 rotate-90 opacity-70" />
        </div>

        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isNegative ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {isNegative ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Saldo Negativo</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cuenta Principal</span>
            </>
          )}
        </div>
      </div>

      {/* Saldo Disponible Section */}
      <div className="mt-5 mb-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Saldo disponible
          </span>
          {isNegative && !hideBalance && (
            <span className="text-[11px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
              Gastos superan ingresos
            </span>
          )}
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          {hideBalance ? (
            <span className="text-3xl sm:text-4xl font-extrabold tracking-widest text-slate-200 font-mono">
              ••••••••
            </span>
          ) : (
            <span
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums ${
                isNegative ? 'text-rose-400' : 'text-white'
              }`}
            >
              {formatCurrency(balance, currencySymbol)}
            </span>
          )}
        </div>
      </div>

      {/* Card Bottom Row */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
        <div>
          <span className="text-[11px] text-slate-400 block font-light">Titular</span>
          <span className="font-medium tracking-wide">MI BILLETERA</span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-light">
            {isNegative ? 'Situación' : 'Tasa de ahorro'}
          </span>
          <span
            className={`font-semibold font-mono tabular-nums ${
              isNegative ? 'text-rose-400 font-bold' : 'text-emerald-400'
            }`}
          >
            {hideBalance
              ? '••%'
              : isNegative
              ? 'Déficit'
              : `${savingsRate >= 0 ? '+' : ''}${savingsRate}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
