import React from 'react';
import { Wallet, Settings, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { CurrencyConfig } from '../types/finance';
import { CURRENCIES } from '../data/initialData';

interface HeaderProps {
  currentCurrency: CurrencyConfig;
  onSelectCurrency: (currency: CurrencyConfig) => void;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onSelectCurrency,
  hideBalance,
  onToggleHideBalance,
  onResetData,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
            <Wallet className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              Mi Dinero
            </h1>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Finanzas Personales
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Privacy button */}
          <button
            onClick={onToggleHideBalance}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={hideBalance ? 'Mostrar saldos' : 'Ocultar saldos'}
            aria-label={hideBalance ? 'Mostrar saldos' : 'Ocultar saldos'}
          >
            {hideBalance ? (
              <EyeOff className="w-4 h-4 text-slate-400" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          {/* Quick Currency Selector dropdown / settings toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Ajustes y monedas"
              aria-label="Ajustes"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showSettings && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Moneda principal
                </div>
                <div className="space-y-1 my-1">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        onSelectCurrency(curr);
                        setShowSettings(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-colors ${
                        currentCurrency.code === curr.code
                          ? 'bg-emerald-50 text-emerald-800 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{curr.name}</span>
                      <span className="font-mono text-slate-500 font-medium">
                        {curr.symbol} ({curr.code})
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      if (window.confirm('¿Deseas restaurar los movimientos de ejemplo iniciales?')) {
                        onResetData();
                        setShowSettings(false);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar datos de ejemplo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
