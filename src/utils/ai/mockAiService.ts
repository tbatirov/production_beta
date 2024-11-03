import { FinancialData, GeneratedStatements } from '../types';
import { logger } from '../logger';

// Mock AI-generated statements
const mockStatements: GeneratedStatements = {
  balanceSheet: {
    date: new Date().toISOString(),
    sections: {
      assets: {
        total: 1500000,
        items: [
          { account: 'Cash and Equivalents', amount: 300000 },
          { account: 'Accounts Receivable', amount: 400000 },
          { account: 'Inventory', amount: 500000 },
          { account: 'Fixed Assets', amount: 300000 }
        ]
      },
      liabilities: {
        total: 600000,
        items: [
          { account: 'Accounts Payable', amount: 200000 },
          { account: 'Short-term Debt', amount: 150000 },
          { account: 'Long-term Debt', amount: 250000 }
        ]
      },
      equity: {
        total: 900000,
        items: [
          { account: 'Common Stock', amount: 500000 },
          { account: 'Retained Earnings', amount: 400000 }
        ]
      }
    }
  },
  incomeStatement: {
    date: new Date().toISOString(),
    sections: {
      revenue: {
        total: 2000000,
        items: [
          { account: 'Product Sales', amount: 1500000 },
          { account: 'Service Revenue', amount: 500000 }
        ]
      },
      expenses: {
        total: 1600000,
        items: [
          { account: 'Cost of Goods Sold', amount: 1000000 },
          { account: 'Operating Expenses', amount: 400000 },
          { account: 'Interest Expense', amount: 200000 }
        ]
      }
    },
    total: 400000
  },
  cashFlow: {
    date: new Date().toISOString(),
    sections: {
      operating: {
        total: 450000,
        items: [
          { account: 'Net Income', amount: 400000 },
          { account: 'Depreciation', amount: 50000 }
        ]
      },
      investing: {
        total: -200000,
        items: [
          { account: 'Equipment Purchase', amount: -200000 }
        ]
      },
      financing: {
        total: -100000,
        items: [
          { account: 'Debt Repayment', amount: -100000 }
        ]
      }
    },
    total: 150000,
    beginningCash: 500000,
    endingCash: 650000
  }
};

export async function mockAnalyzeFinancialData(
  data: FinancialData,
  type: 'trialBalance' | 'transactions'
): Promise<any> {
  logger.info(`Mock AI: Analyzing ${type} data`, {
    rowCount: data.rows.length,
    type
  });

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (type === 'transactions') {
    return { cashFlow: mockStatements.cashFlow };
  }

  return {
    balanceSheet: mockStatements.balanceSheet,
    incomeStatement: mockStatements.incomeStatement
  };
}