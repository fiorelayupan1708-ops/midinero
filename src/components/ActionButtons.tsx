import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface ActionButtonsProps {
  onOpenIncome: () => void;
  onOpenExpense: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOpenIncome,
  onOpenExpense,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 my-4">
      {/* Botón Registrar ingreso */}
      <button
        type="button"
        onClick={onOpenIncome}
        className="flex items-center justify-center gap-2.5 h-13 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all duration-150 cursor-pointer whitespace-nowrap"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <PlusCircle className="w-4 h-4 text-white" strokeWidth={2.4} />
        </div>
        <span className="truncate">Registrar ingreso</span>
      </button>

      {/* Botón Registrar gasto */}
      <button
        type="button"
        onClick={onOpenExpense}
        className="flex items-center justify-center gap-2.5 h-13 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-rose-600/20 transition-all duration-150 cursor-pointer whitespace-nowrap"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <MinusCircle className="w-4 h-4 text-white" strokeWidth={2.4} />
        </div>
        <span className="truncate">Registrar gasto</span>
      </button>
    </div>
  );
};
