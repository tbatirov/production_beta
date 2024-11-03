import { logger } from './logger';

export function parseAmount(value: any): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  try {
    // Handle various number formats
    let cleanValue = String(value)
      .replace(/[^\d.-]/g, '') // Remove everything except digits, dots, and minus
      .replace(/^-+/, '-') // Normalize multiple negative signs
      .replace(/-+$/, '') // Remove trailing negative signs
      .replace(/\.+/, '.'); // Normalize multiple decimal points

    // Handle parentheses for negative numbers
    if (value.toString().trim().match(/^\(.*\)$/)) {
      cleanValue = '-' + cleanValue;
    }

    // Handle thousand separators and different decimal marks
    cleanValue = cleanValue
      .replace(/\s+/g, '') // Remove spaces
      .replace(/,(\d{3})/g, '$1') // Remove commas if they're thousand separators
      .replace(/,/g, '.'); // Convert remaining commas to dots (European format)

    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : number;
  } catch (error) {
    logger.debug('Error parsing amount, defaulting to 0', { value, error });
    return 0;
  }
}

export function parseTransactionAmount(row: Record<string, any>): number {
  try {
    // Try multiple amount fields
    const amountFields = ['amount', 'sum', 'value', 'total'];
    for (const field of amountFields) {
      if (field in row && row[field] !== null && row[field] !== undefined) {
        const amount = parseAmount(row[field]);
        if (amount !== 0) return amount;
      }
    }

    // Try debit/credit fields
    const debit = parseAmount(row.debit);
    const credit = parseAmount(row.credit);

    // If both debit and credit exist, return the net amount
    if (debit !== 0 || credit !== 0) {
      return debit - credit;
    }

    logger.debug('No valid amount found in transaction', { row });
    return 0;
  } catch (error) {
    logger.debug('Error parsing transaction amount, defaulting to 0', { row, error });
    return 0;
  }
}