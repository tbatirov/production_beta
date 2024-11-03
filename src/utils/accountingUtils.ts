import { logger } from './logger';

/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @param locale The locale to use for formatting (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    logger.error('Error formatting currency', { error, amount, currency, locale });
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Check if an account is a cash account based on its code
 * @param accountCode The account code to check
 */
export function isCashAccount(accountCode: string): boolean {
  const code = accountCode.toString().trim();
  return code.startsWith('301') || // Cash on hand
         code.startsWith('311') || // Cash in bank
         code.startsWith('312');   // Cash in foreign currency
}

/**
 * Calculate the net amount from debit and credit
 * @param debit The debit amount
 * @param credit The credit amount
 * @param isDebitNormal Whether the account is debit-normal
 */
export function calculateNetAmount(
  debit: number,
  credit: number,
  isDebitNormal: boolean = true
): number {
  try {
    const debitAmount = parseFloat(debit?.toString() || '0') || 0;
    const creditAmount = parseFloat(credit?.toString() || '0') || 0;
    
    return isDebitNormal ? 
      debitAmount - creditAmount : 
      creditAmount - debitAmount;
  } catch (error) {
    logger.error('Error calculating net amount', { error, debit, credit });
    return 0;
  }
}

/**
 * Parse a string amount to number, handling various formats
 * @param amount The amount to parse
 */
export function parseAmount(amount: string | number): number {
  if (typeof amount === 'number') return amount;
  if (!amount) return 0;

  try {
    // Remove currency symbols and spaces
    const cleaned = amount.toString()
      .replace(/[^0-9.-]/g, '')
      .replace(/^-+/, '-')
      .replace(/-+$/, '')
      .replace(/\.+/, '.');

    // Handle parentheses for negative numbers
    const isNegative = amount.toString().trim().match(/^\(.*\)$/);
    const number = parseFloat(cleaned);
    
    return isNegative ? -Math.abs(number) : number;
  } catch (error) {
    logger.error('Error parsing amount', { error, amount });
    return 0;
  }
}

/**
 * Round a number to a specified number of decimal places
 * @param value The value to round
 * @param decimals The number of decimal places (default: 2)
 */
export function roundAmount(value: number, decimals: number = 2): number {
  try {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  } catch (error) {
    logger.error('Error rounding amount', { error, value, decimals });
    return value;
  }
}