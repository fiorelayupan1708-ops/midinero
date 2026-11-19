import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { Transaction, TransactionType } from '../types/finance';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  type: TransactionType;
  currencySymbol: string;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  type,
  currencySymbol,
  onClose,
  onSave,
}) => {
  const isIncome = type === 'income';

  // Filter categories based on transaction type
  const availableCategories = CATEGORIES.filter(
    (c) => c.type === 'all' || c.type === type
  );

  const [concept, setConcept] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>(availableCategories[0]?.id || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setConcept('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory(availableCategories[0]?.id || '');
      setError('');
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleAddPreset = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Requisito 2: Validar concepto
    if (!concept.trim()) {
      setError(
        isIncome
          ? 'Por favor, ingresa el concepto del ingreso.'
          : 'Por favor, ingresa el concepto del gasto.'
      );
      return;
    }

    // Requisito 3 y 6: Validar que el monto sea un número mayor que cero
    const parsedAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(parsedAmount)) {
      setError(
        isIncome
          ? 'Por favor, ingresa un monto válido recibido.'
          : 'Por favor, ingresa un monto válido gastado.'
      );
      return;
    }

    if (parsedAmount <= 0) {
      setError('El monto debe ser estrictamente mayor que cero (0).');
      return;
    }

    // Requisito 4: Validar fecha
    if (!date) {
      setError('Por favor, selecciona una fecha válida.');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Guardar transacción
    onSave({
      type,
      amount: parsedAmount,
      description: concept.trim(),
      category: category || (isIncome ? 'salario' : 'otros_gastos'),
      date,
      time: timeStr,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del formulario */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                isIncome
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-rose-600 shadow-rose-600/30'
              }`}
            >
              {isIncome ? '+' : '-'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-none">
                {isIncome ? 'Registrar ingreso' : 'Registrar gasto'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isIncome
                  ? 'Completa los datos para sumar dinero a tu saldo'
                  : 'Completa los datos de tu salida de dinero'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Requisito 2: Concepto del ingreso */}
          <div>
            <label
              htmlFor="concept-input"
              className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
            >
              {isIncome ? 'Concepto del ingreso *' : 'Concepto del gasto *'}
            </label>
            <input
              id="concept-input"
              type="text"
              autoFocus
              placeholder={
                isIncome
                  ? 'Ej. Sueldo quincenal, Venta de laptop, Bono extra...'
                  : 'Ej. Supermercado semanal, Pago de internet, Gasolina...'
              }
              value={concept}
              onChange={(e) => {
                setConcept(e.target.value);
                if (error) setError('');
              }}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Requisito 3 y 6: Monto recibido */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="amount-input"
                className="block text-xs font-bold text-slate-600 uppercase tracking-wider"
              >
                {isIncome ? 'Monto recibido *' : 'Monto del gasto *'}
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Mayor que 0</span>
            </div>
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold font-mono text-slate-400">
                {currencySymbol}
              </span>
              <input
                id="amount-input"
                type="number"
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className="w-full h-14 pl-12 pr-4 text-2xl font-bold font-mono text-slate-900 bg-transparent focus:outline-none"
              />
            </div>

            {/* Atajos de montos para facilitar el uso en celulares */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 text-[11px] shrink-0 font-medium">
                Atajos rápidos:
              </span>
              {[20, 50, 100, 200, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold transition-colors shrink-0"
                >
                  +{currencySymbol}{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Requisito 4: Fecha */}
          <div>
            <label
              htmlFor="date-input"
              className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
            >
              {isIncome ? 'Fecha del ingreso *' : 'Fecha del gasto *'}
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (error) setError('');
              }}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white text-sm text-slate-900 focus:outline-none transition-all font-mono"
            />
          </div>

          {/* Categoría asociada */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-0.5">
              {availableCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? isIncome
                          ? 'border-emerald-600 bg-emerald-50/70 font-bold text-emerald-950 ring-1 ring-emerald-600'
                          : 'border-rose-600 bg-rose-50/70 font-bold text-rose-950 ring-1 ring-rose-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.color}`}
                    >
                      <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mensaje de error de validación */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {/* Requisito 5: Botón Guardar ingreso */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                isIncome
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
              }`}
            >
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>{isIncome ? 'Guardar ingreso' : 'Guardar gasto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
