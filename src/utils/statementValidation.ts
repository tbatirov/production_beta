import { GeneratedStatements, StatementValidation } from './types';
import { logger } from './logger';

export function validateStatementsForFinalization(
  statements: GeneratedStatements
): StatementValidation {
  const validation: StatementValidation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // Validate Balance Sheet
    if (statements.balanceSheet) {
      const bs = statements.balanceSheet;
      const totalAssets = bs.sections.assets.total;
      const totalLiabilities = bs.sections.liabilities.total;
      const totalEquity = bs.sections.equity.total;

      // Check if assets = liabilities + equity
      const difference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
      if (difference > 0.01) {
        validation.errors.push(
          `Balance sheet equation does not balance. Difference: ${difference.toFixed(2)}`
        );
      }

      // Check for negative asset accounts
      bs.sections.assets.items.forEach(item => {
        if (item.amount < 0) {
          validation.warnings.push(
            `Negative asset account: ${item.account} (${item.amount})`
          );
        }
      });
    } else {
      validation.errors.push('Balance sheet is missing');
    }

    // Validate Income Statement
    if (statements.incomeStatement) {
      const is = statements.incomeStatement;
      const calculatedTotal = is.sections.revenue.total - is.sections.expenses.total;
      
      // Check if net income calculation is correct
      if (Math.abs(calculatedTotal - is.total) > 0.01) {
        validation.errors.push('Income statement total does not match revenue - expenses');
      }
    } else {
      validation.errors.push('Income statement is missing');
    }

    // Validate Cash Flow
    if (statements.cashFlow) {
      const cf = statements.cashFlow;
      const calculatedTotal = 
        cf.sections.operating.total +
        cf.sections.investing.total +
        cf.sections.financing.total;
      
      // Check if cash flow sections sum to total
      if (Math.abs(calculatedTotal - cf.total) > 0.01) {
        validation.errors.push('Cash flow sections do not sum to total');
      }

      // Verify beginning and ending cash
      if (cf.beginningCash !== undefined && cf.endingCash !== undefined) {
        const expectedEnding = cf.beginningCash + cf.total;
        if (Math.abs(expectedEnding - cf.endingCash) > 0.01) {
          validation.errors.push('Cash flow beginning + net flow does not equal ending cash');
        }
      }
    } else {
      validation.errors.push('Cash flow statement is missing');
    }

    // Set overall validation status
    validation.isValid = validation.errors.length === 0;

    logger.info('Statement validation completed', {
      isValid: validation.isValid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length
    });

    return validation;
  } catch (error) {
    logger.error('Error validating statements', { error });
    validation.isValid = false;
    validation.errors.push('An error occurred during validation');
    return validation;
  }
}