import { CategoryInfo, CurrencyConfig, Transaction } from '../types/finance';

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'Dólar (USD)' },
  { code: 'PEN', symbol: 'S/.', name: 'Sol Peruano (PEN)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (MXN)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (COP)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (ARS)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (CLP)' },
];

export const CATEGORIES: CategoryInfo[] = [
  // Ingresos
  { id: 'salario', name: 'Salario / Nómina', icon: 'Briefcase', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', type: 'income' },
  { id: 'freelance', name: 'Freelance / Trabajo Extra', icon: 'Laptop', color: 'text-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-950/40', type: 'income' },
  { id: 'inversiones', name: 'Inversiones / Rendimientos', icon: 'TrendingUp', color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-950/40', type: 'income' },
  { id: 'ventas', name: 'Ventas / Negocio', icon: 'ShoppingBag', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/40', type: 'income' },
  { id: 'otros_ingresos', name: 'Otros Ingresos', icon: 'PlusCircle', color: 'text-emerald-700', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', type: 'income' },

  // Gastos
  { id: 'comida', name: 'Comida y Supermercado', icon: 'Utensils', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950/40', type: 'expense' },
  { id: 'vivienda', name: 'Vivienda y Alquiler', icon: 'Home', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/40', type: 'expense' },
  { id: 'transporte', name: 'Transporte y Combustible', icon: 'Car', color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-950/40', type: 'expense' },
  { id: 'servicios', name: 'Servicios (Luz, Agua, Net)', icon: 'Zap', color: 'text-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-950/40', type: 'expense' },
  { id: 'entretenimiento', name: 'Ocio y Entretenimiento', icon: 'Film', color: 'text-rose-600', bgColor: 'bg-rose-50 dark:bg-rose-950/40', type: 'expense' },
  { id: 'salud', name: 'Salud y Farmacia', icon: 'HeartPulse', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950/40', type: 'expense' },
  { id: 'educacion', name: 'Educación y Cursos', icon: 'BookOpen', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950/40', type: 'expense' },
  { id: 'compras', name: 'Ropa y Artículos Personales', icon: 'Tag', color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-950/40', type: 'expense' },
  { id: 'otros_gastos', name: 'Otros Gastos', icon: 'HelpCircle', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800', type: 'expense' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 3200,
    category: 'salario',
    description: 'Nómina quincenal',
    date: '2026-11-15',
    time: '09:00',
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 650,
    category: 'vivienda',
    description: 'Pago mensual alquiler',
    date: '2026-11-15',
    time: '11:30',
  },
  {
    id: 'tx-3',
    type: 'income',
    amount: 850,
    category: 'freelance',
    description: 'Diseño de sitio web cliente',
    date: '2026-11-16',
    time: '14:20',
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 145.50,
    category: 'comida',
    description: 'Compras del supermercado',
    date: '2026-11-16',
    time: '17:45',
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 68.00,
    category: 'servicios',
    description: 'Servicio de Internet y telefonía',
    date: '2026-11-17',
    time: '10:15',
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 42.00,
    category: 'transporte',
    description: 'Recarga de tarjeta y gasolina',
    date: '2026-11-18',
    time: '08:40',
  },
  {
    id: 'tx-7',
    type: 'expense',
    amount: 38.50,
    category: 'entretenimiento',
    description: 'Cine y café con amigos',
    date: '2026-11-18',
    time: '16:10',
  },
];
