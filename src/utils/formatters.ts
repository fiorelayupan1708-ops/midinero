/**
 * Helper to round to 2 decimals safely preventing floating point inaccuracies (e.g. 0.1 + 0.2)
 */
export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Formats currency respecting positive and negative amounts.
 * If negative, prefixes with a minus sign '-' (e.g., -$ 150.00)
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const isNegative = amount < 0;
  const roundedAbs = Math.abs(round2(amount));
  const formatted = roundedAbs.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}${symbol} ${formatted}`;
}

/**
 * Formats currency with explicit plus/minus sign for transactional clarity
 */
export function formatSignedCurrency(
  amount: number,
  symbol: string = '$',
  type?: 'income' | 'expense'
): string {
  const roundedAbs = Math.abs(round2(amount));
  const formatted = roundedAbs.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (type === 'income') {
    return `+ ${symbol} ${formatted}`;
  }
  if (type === 'expense') {
    return `- ${symbol} ${formatted}`;
  }

  // If calculating net balance
  if (amount < 0) {
    return `- ${symbol} ${formatted}`;
  }
  if (amount > 0) {
    return `+ ${symbol} ${formatted}`;
  }
  return `${symbol} ${formatted}`;
}

export function formatDateLabel(dateStr: string): string {
  try {
    const today = new Date();
    const date = new Date(dateStr + 'T00:00:00');
    
    // Compare year, month, date
    const isToday = 
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();
      
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = 
      yesterday.getFullYear() === date.getFullYear() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getDate() === date.getDate();

    if (isToday) return 'Hoy';
    if (isYesterday) return 'Ayer';

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}
