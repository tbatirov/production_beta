import { FinancialData, FinancialStatement } from '../types';
import { logger } from '../logger';
import { parseTransactionAmount } from './parser';
import { categorizeTransaction } from './categorizer';

export function generateCashFlow(data: FinancialData): FinancialStatement {
  logger.info('Starting cash flow statement generation');

  try {
    // Sort transactions by date
    const sortedTransactions = [...data.rows].sort((a, b) => {
      const dateA = new Date(a.date || a.transaction_date || '');
      const dateB = new Date(b.date || b.transaction_date || '');
      return dateA.getTime() - dateB.getTime();
    });

    // Initialize sections
    const sections = {
      operating: {
        total: 0,
        items: [] as any[]
      },
      investing: {
        total: 0,
        items: [] as any[]
      },
      financing: {
        total: 0,
        items: [] as any[]
      }
    };

    // Process each transaction
    sortedTransactions.forEach(transaction => {
      const amount = parseTransactionAmount(transaction);
      if (amount === 0) return;

      const category = categorizeTransaction(transaction);
      const item = {
        account: transaction.account_name || transaction.account || 'Unknown Account',
        accountCode: transaction.account_code || transaction.account_number,
        amount,
        details: [{
          date: transaction.date || transaction.transaction_date || new Date().toISOString(),
          description: transaction.description || transaction.narrative || 'No description',
          amount
        }]
      };

      // Add to appropriate section
      sections[category].items.push(item);
      sections[category].total += amount;
    });

    // Calculate totals
    const total = Object.values(sections).reduce((sum, section) => sum + section.total, 0);

    // Calculate beginning and ending cash
    const beginningCash = sortedTransactions
      .filter(t => t.account_code?.toString().startsWith('3'))
      .reduce((sum, t) => sum + parseTransactionAmount(t), 0);

    const endingCash = beginningCash + total;

    logger.info('Cash flow statement generated successfully', {
      operatingTotal: sections.operating.total,
      investingTotal: sections.investing.total,
      financingTotal: sections.financing.total,
      total,
      beginningCash,
      endingCash
    });

    return {
      date: new Date().toISOString(),
      sections,
      total,
      beginningCash,
      endingCash
    };

  } catch (error) {
    logger.error('Error generating cash flow statement', { error });
    throw error;
  }
}