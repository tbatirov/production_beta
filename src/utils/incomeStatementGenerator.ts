import { FinancialData, FinancialStatement } from './types';
import { logger } from './logger';
import { INCOME_STATEMENT_ACCOUNTS } from './settings/incomeStatementSettings';

function calculateAccountBalance(row: Record<string, any>): number {
  try {
    const debit = parseFloat(String(row.debit || '0')) || 0;
    const credit = parseFloat(String(row.credit || '0')) || 0;
    const accountCode = String(row.account_code || row.account_number || '');
    
    // Revenue accounts (7xxx) - Credit normal
    if (accountCode.startsWith('7')) {
      return credit - debit; // Credit increases revenue, debit decreases
    }
    
    // Expense accounts (8xxx) - Debit normal
    if (accountCode.startsWith('8')) {
      return debit - credit; // Debit increases expenses, credit decreases
    }
    
    return 0;
  } catch (error) {
    logger.error('Error calculating account balance', { error, row });
    return 0;
  }
}

function categorizeAccounts(data: FinancialData) {
  const categories = {
    revenue: {
      items: [],
      total: 0
    },
    expenses: {
      items: [],
      total: 0
    }
  };

  data.rows.forEach(row => {
    try {
      const accountCode = String(row.account_code || row.account_number || '');
      const balance = calculateAccountBalance(row);
      
      if (balance === 0) return;

      const item = {
        account: row.account_name || row.account || `Account ${accountCode}`,
        amount: Math.abs(balance) // Store absolute value for display
      };

      // Categorize based on account code
      if (accountCode.startsWith('7')) {
        // Revenue accounts
        categories.revenue.items.push(item);
        categories.revenue.total += balance;
      } else if (accountCode.startsWith('8')) {
        // Expense accounts
        categories.expenses.items.push(item);
        categories.expenses.total += balance;
      }
    } catch (error) {
      logger.error('Error categorizing account', { error, row });
    }
  });

  return categories;
}

export function generateIncomeStatement(data: FinancialData): FinancialStatement {
  logger.info('Generating income statement');

  try {
    // Categorize and calculate balances
    const categorized = categorizeAccounts(data);

    // Create sections with proper balances
    const sections = {
      revenue: {
        total: Math.abs(categorized.revenue.total), // Revenue is positive
        items: categorized.revenue.items.map(item => ({
          account: item.account,
          amount: item.amount // Already absolute value
        }))
      },
      expenses: {
        total: Math.abs(categorized.expenses.total), // Expenses are positive
        items: categorized.expenses.items.map(item => ({
          account: item.account,
          amount: item.amount // Already absolute value
        }))
      }
    };

    // Calculate net income (revenue - expenses)
    const netIncome = sections.revenue.total - sections.expenses.total;

    logger.info('Income statement generated', {
      totalRevenue: sections.revenue.total,
      totalExpenses: sections.expenses.total,
      netIncome: netIncome,
      revenueAccounts: sections.revenue.items.length,
      expenseAccounts: sections.expenses.items.length
    });

    return {
      date: new Date().toISOString(),
      sections,
      total: netIncome
    };

  } catch (error) {
    logger.error('Error generating income statement', { error });
    throw error;
  }
}