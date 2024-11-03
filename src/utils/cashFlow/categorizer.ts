import { TransactionRow } from '../types';
import { logger } from '../logger';

export function categorizeTransaction(row: TransactionRow): 'operating' | 'investing' | 'financing' {
  try {
    const accountCode = String(row.account_code || row.account_number || '');
    if (!accountCode) {
      logger.warn('Missing account code, defaulting to operating', { row });
      return 'operating';
    }

    const code = parseInt(accountCode);

    // Operating Activities (4xxx-4999, 6000-6799, 7xxx-8xxx)
    if ((code >= 4000 && code <= 4999) || // Receivables
        (code >= 6000 && code <= 6799) || // Current liabilities
        (code >= 7000 && code <= 8999)) { // Revenue and expenses
      return 'operating';
    }

    // Investing Activities (0xxx-1xxx)
    if (code >= 0 && code <= 1999) { // Fixed assets and investments
      return 'investing';
    }

    // Financing Activities (5xxx, 6800-6899)
    if ((code >= 5000 && code <= 5999) || // Equity accounts
        (code >= 6800 && code <= 6899)) { // Long-term loans
      return 'financing';
    }

    logger.debug('Account code not in defined ranges, defaulting to operating', { accountCode });
    return 'operating';
  } catch (error) {
    logger.error('Error categorizing transaction', { error, row });
    return 'operating';
  }
}