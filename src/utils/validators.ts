import { FinancialData } from './types';
import { logger } from './logger';
import { validateRequiredColumns } from './columnMatcher';
import { parseAmount } from './numberParser';

export function validateTrialBalance(data: FinancialData): void {
  if (!data?.rows?.length) {
    throw new Error('No data found in trial balance');
  }

  // Required columns with flexible matching
  const requiredColumns = [
    'account_code',   // Account code/number
    'account_name',   // Account name/description
    'debit',         // Debit amount
    'credit'         // Credit amount
  ];
  
  const missingColumns = validateRequiredColumns(data.headers, requiredColumns);

  if (missingColumns.length > 0) {
    logger.warn('Some recommended columns are missing', { missingColumns });
  }

  let totalDebits = 0;
  let totalCredits = 0;

  data.rows.forEach((row, index) => {
    const debit = parseAmount(row.debit);
    const credit = parseAmount(row.credit);

    // More flexible account code validation
    const accountCode = String(row.account_code || row.account_number || '').replace(/\D/g, '');
    if (accountCode && !/^\d{1,6}$/.test(accountCode)) {
      logger.warn('Unusual account code format', { 
        rowIndex: index, 
        accountCode,
        suggestion: 'Consider using standard numeric account codes'
      });
    }

    if (debit === 0 && credit === 0) {
      logger.debug('Row with zero values', { rowIndex: index, row });
    }

    totalDebits += Math.abs(debit);
    totalCredits += Math.abs(credit);
  });

  // More flexible balance check
  const difference = Math.abs(totalDebits - totalCredits);
  const totalMagnitude = Math.max(totalDebits, totalCredits);
  const tolerancePercentage = 0.01; // 1% tolerance
  const tolerance = totalMagnitude * tolerancePercentage;

  if (difference > tolerance) {
    logger.warn('Trial balance shows significant imbalance', {
      totalDebits,
      totalCredits,
      difference,
      tolerance,
      suggestion: 'Consider reviewing for potential missing entries'
    });
  }

  logger.info('Trial balance validation completed', {
    rowCount: data.rows.length,
    totalDebits,
    totalCredits,
    difference
  });
}