import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, CurrencyConfig } from './types/finance';
import { INITIAL_TRANSACTIONS, CURRENCIES } from './data/initialData';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { ActionButtons } from './components/ActionButtons';
import { FinancialIndicators } from './components/FinancialIndicators';
import { RecentTransactions } from './components/RecentTransactions';
import { TransactionHistoryModule } from './components/TransactionHistoryModule';
import { TransactionModal } from './components/TransactionModal';
import { BottomNav, NavTab } from './components/BottomNav';
import { StatsView } from './components/StatsView';
import { ProfileView } from './components/ProfileView';
import { Toast, ToastData } from './components/Toast';
import { formatCurrency, formatSignedCurrency, round2 } from './utils/formatters';
import { Smartphone, Monitor } from 'lucide-react';

const STORAGE_KEY_TX = 'mi_dinero_transactions_v1';
const STORAGE_KEY_CURR = 'mi_dinero_currency_v1';
const STORAGE_KEY_PRIVACY = 'mi_dinero_privacy_v1';

export default function App() {
  // Load transactions from localStorage or fallback to initial data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  // Load currency
  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURR);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return CURRENCIES[0]; // USD
  });

  // Privacy toggle (hide balance)
  const [hideBalance, setHideBalance] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRIVACY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return false;
  });

  // Current navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Modal registration state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('income');

  // Toast notification state
  const [toast, setToast] = useState<ToastData | null>(null);

  // Indicator highlight state
  const [lastAddedType, setLastAddedType] = useState<'income' | 'expense' | null>(null);

  // Desktop preview mode ('mobile' frame or 'responsive' fluid)
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  // Persist transactions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // Persist currency
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURR, JSON.stringify(currency));
    } catch {
      // ignore
    }
  }, [currency]);

  // Persist privacy
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRIVACY, JSON.stringify(hideBalance));
    } catch {
      // ignore
    }
  }, [hideBalance]);

  // Regla 1: El total de ingresos será la suma de todos los ingresos registrados
  const totalIncome = useMemo(() => {
    const sum = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((acc, tx) => acc + tx.amount, 0);
    return round2(sum);
  }, [transactions]);

  // Regla 2: El total de gastos será la suma de todos los gastos registrados
  const totalExpense = useMemo(() => {
    const sum = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => acc + tx.amount, 0);
    return round2(sum);
  }, [transactions]);

  // Regla 3: El saldo disponible será igual a ingresos menos gastos
  // Regla 5: Si gastos > ingresos, balance será negativo
  const balance = useMemo(() => {
    return round2(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  // Contadores de movimientos para los indicadores
  const incomeCount = useMemo(
    () => transactions.filter((tx) => tx.type === 'income').length,
    [transactions]
  );
  const expenseCount = useMemo(
    () => transactions.filter((tx) => tx.type === 'expense').length,
    [transactions]
  );

  // Handlers
  const handleOpenIncome = () => {
    setModalType('income');
    setIsModalOpen(true);
  };

  const handleOpenExpense = () => {
    setModalType('expense');
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };

    setTransactions((prev) => [created, ...prev]);
    setLastAddedType(newTx.type);

    // Mensaje de confirmación
    if (newTx.type === 'income') {
      setToast({
        id: `toast-${Date.now()}`,
        type: 'success',
        variant: 'income',
        title: '¡Ingreso registrado correctamente!',
        message: `Se sumaron ${formatCurrency(newTx.amount, currency.symbol)} al indicador de ingresos por concepto de "${newTx.description}".`,
      });
    } else {
      setToast({
        id: `toast-${Date.now()}`,
        type: 'success',
        variant: 'expense',
        title: '¡Gasto registrado correctamente!',
        message: `Se registraron ${formatCurrency(newTx.amount, currency.symbol)} en el indicador de gastos por concepto de "${newTx.description}".`,
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    // Eliminar movimiento
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    setLastAddedType(null);

    // Requisito 7: Confirmar recálculo automático de totales y saldo
    setToast({
      id: `toast-${Date.now()}`,
      type: 'info',
      variant: 'general',
      title: 'Movimiento eliminado',
      message: `Se eliminó "${txToDelete.description}" (${formatSignedCurrency(
        txToDelete.amount,
        currency.symbol,
        txToDelete.type
      )}). El total de ingresos, gastos y el saldo se han recalculado automáticamente.`,
    });
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setToast({
      id: `toast-${Date.now()}`,
      type: 'info',
      title: 'Datos restaurados',
      message: 'Se han recargado los movimientos iniciales de prueba.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-900/5 sm:bg-slate-900/10 text-slate-900 flex flex-col items-center relative">
      {/* Toast Notification flotante */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Desktop view switcher bar (shown only on screens >= md) */}
      <div className="hidden md:flex w-full max-w-4xl items-center justify-between py-2 px-4 text-xs text-slate-500 border-b border-slate-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Mi Dinero</span>
          <span className="text-slate-300">|</span>
          <span>Aplicación Móvil de Finanzas Personales</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista Celular</span>
          </button>
          <button
            onClick={() => setViewMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'responsive'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Vista Ampliada</span>
          </button>
        </div>
      </div>

      {/* Main container: smartphone frame or responsive view */}
      <main
        className={`w-full transition-all duration-300 flex-1 flex flex-col ${
          viewMode === 'mobile'
            ? 'max-w-md sm:my-6 sm:rounded-[40px] sm:shadow-2xl sm:ring-1 sm:ring-slate-900/10 overflow-hidden bg-slate-50 min-h-screen sm:min-h-[844px]'
            : 'max-w-3xl my-0 sm:my-6 sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200 overflow-hidden bg-slate-50 min-h-screen'
        }`}
      >
        {/* App Header with "Mi Dinero" */}
        <Header
          currentCurrency={currency}
          onSelectCurrency={setCurrency}
          hideBalance={hideBalance}
          onToggleHideBalance={() => setHideBalance(!hideBalance)}
          onResetData={handleResetData}
        />

        {/* Tab content view */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="space-y-4 pb-20 animate-in fade-in duration-200">
              {/* Tarjeta con el saldo disponible */}
              <BalanceCard
                balance={balance}
                currencySymbol={currency.symbol}
                hideBalance={hideBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />

              {/* Botones: "Registrar ingreso" y "Registrar gasto" */}
              <ActionButtons
                onOpenIncome={handleOpenIncome}
                onOpenExpense={handleOpenExpense}
              />

              {/* Tres indicadores: ingresos, gastos y saldo */}
              <FinancialIndicators
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                balance={balance}
                currencySymbol={currency.symbol}
                hideBalance={hideBalance}
                incomeCount={incomeCount}
                expenseCount={expenseCount}
                lastAddedType={lastAddedType}
              />

              {/* Movimientos recientes con enlace al historial completo */}
              <RecentTransactions
                transactions={transactions}
                currencySymbol={currency.symbol}
                hideBalance={hideBalance}
                onDeleteTransaction={handleDeleteTransaction}
                onOpenIncome={handleOpenIncome}
                onOpenExpense={handleOpenExpense}
                onViewAll={() => setActiveTab('transactions')}
              />
            </div>
          )}

          {/* Módulo completo de Historial de Movimientos */}
          {activeTab === 'transactions' && (
            <TransactionHistoryModule
              transactions={transactions}
              currencySymbol={currency.symbol}
              hideBalance={hideBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenIncome={handleOpenIncome}
              onOpenExpense={handleOpenExpense}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              transactions={transactions}
              currencySymbol={currency.symbol}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
              hideBalance={hideBalance}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentCurrency={currency}
              onSelectCurrency={setCurrency}
              hideBalance={hideBalance}
              onToggleHideBalance={() => setHideBalance(!hideBalance)}
              onResetData={handleResetData}
              totalTransactionsCount={transactions.length}
            />
          )}
        </div>

        {/* Barra de navegación inferior */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </main>

      {/* Formulario modal para registrar ingreso y registrar gasto */}
      <TransactionModal
        isOpen={isModalOpen}
        type={modalType}
        currencySymbol={currency.symbol}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
