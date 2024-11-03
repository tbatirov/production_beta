import { TransactionRow } from '../types';
import { logger } from '../logger';

export function parseTransactionAmount(row: TransactionRow): number {
  try {
    // Try to get amount from direct amount field first
    if (row.amount !== undefined && row.amount !== null) {
      const amount = parseFloat(String(row.amount));
      if (!isNaN(amount)) return amount;
    }

    // Calculate from debit/credit if available
    const debit = parseFloat(String(row.debit || '0')) || 0;
    const credit = parseFloat(String(row.credit || '0')) || 0;

    // For cash accounts (3xxx), debit increases (inflow) and credit decreases (outflow)
    const accountCode = String(row.account_code || row.account_number || '');
    const isCashAccount = accountCode.startsWith('3');

    return isCashAccount ? debit - credit : credit - debit;
  } catch (error) {
    logger.error('Error parsing transaction amount', { error, row });
    return 0;
  }
}