import React from 'react';
import { CurrencyConfig } from '../types/finance';
import { CURRENCIES } from '../data/initialData';
import {
  User,
  Coins,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Heart,
} from 'lucide-react';

interface ProfileViewProps {
  currentCurrency: CurrencyConfig;
  onSelectCurrency: (currency: CurrencyConfig) => void;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  onResetData: () => void;
  totalTransactionsCount: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentCurrency,
  onSelectCurrency,
  hideBalance,
  onToggleHideBalance,
  onResetData,
  totalTransactionsCount,
}) => {
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Mi Perfil Financiero
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Usuario Personal · Control Total
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Versión 1.0 Activa</span>
          </div>
        </div>
      </div>

      {/* Currency Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Moneda Principal
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CURRENCIES.map((curr) => {
            const isSelected = currentCurrency.code === curr.code;
            return (
              <button
                key={curr.code}
                onClick={() => onSelectCurrency(curr)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span>{curr.name}</span>
                <span className="font-mono text-slate-500 font-semibold">
                  {curr.symbol}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Seguridad y Privacidad
        </h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Ocultar saldos en pantalla
            </p>
            <p className="text-xs text-slate-400">
              Mantiene tus cifras privadas en lugares públicos
            </p>
          </div>
          <button
            onClick={onToggleHideBalance}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              hideBalance ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                hideBalance ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {hideBalance ? (
                <EyeOff className="w-3 h-3 text-emerald-600" />
              ) : (
                <Eye className="w-3 h-3 text-slate-400" />
              )}
            </div>
          </button>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Registros totales guardados
              </p>
              <p className="text-xs text-slate-400">
                Almacenados en tu dispositivo local
              </p>
            </div>
            <span className="font-mono font-bold text-sm text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {totalTransactionsCount}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={() => {
              if (
                window.confirm(
                  '¿Estás seguro de reiniciar los movimientos a los valores iniciales de prueba?'
                )
              ) {
                onResetData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar datos predeterminados</span>
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="text-center py-4 text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-500">Mi Dinero · Versión 1.0</p>
        <p className="flex items-center justify-center gap-1">
          Hecho con <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> para tu tranquilidad financiera
        </p>
      </div>
    </div>
  );
};
