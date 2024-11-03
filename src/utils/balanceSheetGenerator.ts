import { FinancialData, FinancialStatement } from './types';
import { logger } from './logger';
import { roundAmount } from './accountingUtils';

// Account Ranges according to UzNAS
const ACCOUNT_RANGES = {
  assets: {
    fixedAssets: { start: 0, end: 999 },
    investments: { start: 1000, end: 1999 },
    inventory: {
      rawMaterials: { start: 2100, end: 2199 },
      workInProgress: { start: 2200, end: 2299 },
      finishedGoods: { start: 2300, end: 2399 }
    },
    cash: {
      cashOnHand: '3010',
      cashInBankUZS: '3110',
      cashInBankUSD: '3120'
    },
    receivables: {
      trade: { start: 4000, end: 4099 },
      notes: { start: 4100, end: 4199 },
      employees: { start: 4200, end: 4299 },
      tax: { start: 4300, end: 4399 }
    }
  },
  contraAssets: {
    accumulatedDepreciation: { start: 200, end: 299 }
  },
  liabilities: {
    current: {
      accountsPayable: { start: 6000, end: 6099 },
      taxPayable: { start: 6400, end: 6499 },
      wagesPayable: { start: 6700, end: 6799 }
    },
    longTerm: {
      bankLoans: { start: 6800, end: 6899 }
    }
  },
  equity: {
    charterCapital: { start: 5000, end: 5099 },
    legalReserve: { start: 5100, end: 5199 },
    retainedEarnings: { start: 5300, end: 5399 }
  },
  // Excluded from balance sheet
  incomeStatement: {
    revenue: { start: 7000, end: 7999 },
    expenses: { start: 8000, end: 8999 }
  }
};

interface AssetGroup {
  grossAmount: number;
  contraAmount: number;
  netAmount: number;
  items: Array<{
    account: string;
    amount: number;
    isContra?: boolean;
  }>;
}

function calculateAccountBalance(row: Record<string, any>): number {
  try {
    const debit = parseFloat(String(row.debit || '0')) || 0;
    const credit = parseFloat(String(row.credit || '0')) || 0;
    const accountCode = String(row.account_code || row.account_number || '0');

    // Most asset accounts are debit-normal
    const isDebitNormal = parseInt(accountCode) < 5000;
    return roundAmount(isDebitNormal ? debit - credit : credit - debit);
  } catch (error) {
    logger.error('Error calculating account balance', { error });
    return 0;
  }
}

function isContraAccount(accountCode: string): boolean {
  const code = parseInt(accountCode);
  return code >= ACCOUNT_RANGES.contraAssets.accumulatedDepreciation.start &&
         code <= ACCOUNT_RANGES.contraAssets.accumulatedDepreciation.end;
}

function isIncomeStatementAccount(accountCode: string): boolean {
  const code = parseInt(accountCode);
  return (code >= ACCOUNT_RANGES.incomeStatement.revenue.start &&
          code <= ACCOUNT_RANGES.incomeStatement.revenue.end) ||
         (code >= ACCOUNT_RANGES.incomeStatement.expenses.start &&
          code <= ACCOUNT_RANGES.incomeStatement.expenses.end);
}

function categorizeAccounts(data: FinancialData) {
  const fixedAssets: AssetGroup = {
    grossAmount: 0,
    contraAmount: 0,
    netAmount: 0,
    items: []
  };

  const categories = {
    assets: {
      fixed: fixedAssets,
      inventory: {
        rawMaterials: [] as Array<{ account: string; amount: number }>,
        workInProgress: [] as Array<{ account: string; amount: number }>,
        finishedGoods: [] as Array<{ account: string; amount: number }>
      },
      cash: [] as Array<{ account: string; amount: number }>,
      receivables: [] as Array<{ account: string; amount: number }>,
      total: 0
    },
    liabilities: {
      current: [] as Array<{ account: string; amount: number }>,
      longTerm: [] as Array<{ account: string; amount: number }>,
      total: 0
    },
    equity: {
      items: [] as Array<{ account: string; amount: number }>,
      total: 0
    }
  };

  data.rows.forEach(row => {
    try {
      const accountCode = String(row.account_code || row.account_number || '0');
      const balance = calculateAccountBalance(row);
      
      if (balance === 0 || isIncomeStatementAccount(accountCode)) return;

      const item = {
        account: row.account_name || row.account || 'Unknown Account',
        amount: Math.abs(balance)
      };

      // Handle fixed assets and their contra accounts
      if (parseInt(accountCode) < 1000) {
        if (isContraAccount(accountCode)) {
          fixedAssets.contraAmount += Math.abs(balance);
          fixedAssets.items.push({ ...item, isContra: true });
        } else {
          fixedAssets.grossAmount += Math.abs(balance);
          fixedAssets.items.push(item);
        }
        fixedAssets.netAmount = roundAmount(fixedAssets.grossAmount - fixedAssets.contraAmount);
        return;
      }

      // Categorize inventory
      if (accountCode.startsWith('21')) {
        categories.assets.inventory.rawMaterials.push(item);
        categories.assets.total += item.amount;
      } else if (accountCode.startsWith('22')) {
        categories.assets.inventory.workInProgress.push(item);
        categories.assets.total += item.amount;
      } else if (accountCode.startsWith('23')) {
        categories.assets.inventory.finishedGoods.push(item);
        categories.assets.total += item.amount;
      }
      // Categorize cash
      else if (accountCode.startsWith('30') || accountCode.startsWith('31')) {
        categories.assets.cash.push(item);
        categories.assets.total += item.amount;
      }
      // Categorize receivables
      else if (accountCode.startsWith('4')) {
        categories.assets.receivables.push(item);
        categories.assets.total += item.amount;
      }
      // Categorize current liabilities
      else if (accountCode.startsWith('60') || accountCode.startsWith('64') || accountCode.startsWith('67')) {
        categories.liabilities.current.push(item);
        categories.liabilities.total += item.amount;
      }
      // Categorize long-term liabilities
      else if (accountCode.startsWith('68')) {
        categories.liabilities.longTerm.push(item);
        categories.liabilities.total += item.amount;
      }
      // Categorize equity
      else if (accountCode.startsWith('5')) {
        categories.equity.items.push(item);
        categories.equity.total += item.amount;
      }
    } catch (error) {
      logger.error('Error categorizing account', { error, row });
    }
  });

  // Add net fixed assets to total assets
  categories.assets.total += categories.assets.fixed.netAmount;

  return categories;
}

export function generateBalanceSheet(data: FinancialData): FinancialStatement {
  logger.info('Generating balance sheet');

  try {
    const categorized = categorizeAccounts(data);

    // Create sections with proper categorization
    const sections = {
      assets: {
        total: roundAmount(categorized.assets.total),
        items: [
          {
            account: 'Fixed Assets',
            amount: categorized.assets.fixed.netAmount,
            details: categorized.assets.fixed.items
          },
          {
            account: 'Inventory',
            amount: roundAmount(
              categorized.assets.inventory.rawMaterials.reduce((sum, item) => sum + item.amount, 0) +
              categorized.assets.inventory.workInProgress.reduce((sum, item) => sum + item.amount, 0) +
              categorized.assets.inventory.finishedGoods.reduce((sum, item) => sum + item.amount, 0)
            ),
            details: [
              ...categorized.assets.inventory.rawMaterials,
              ...categorized.assets.inventory.workInProgress,
              ...categorized.assets.inventory.finishedGoods
            ]
          },
          {
            account: 'Cash & Equivalents',
            amount: roundAmount(categorized.assets.cash.reduce((sum, item) => sum + item.amount, 0)),
            details: categorized.assets.cash
          },
          {
            account: 'Receivables',
            amount: roundAmount(categorized.assets.receivables.reduce((sum, item) => sum + item.amount, 0)),
            details: categorized.assets.receivables
          }
        ]
      },
      liabilities: {
        total: roundAmount(categorized.liabilities.total),
        items: [
          {
            account: 'Current Liabilities',
            amount: roundAmount(categorized.liabilities.current.reduce((sum, item) => sum + item.amount, 0)),
            details: categorized.liabilities.current
          },
          {
            account: 'Long-term Liabilities',
            amount: roundAmount(categorized.liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0)),
            details: categorized.liabilities.longTerm
          }
        ]
      },
      equity: {
        total: roundAmount(categorized.equity.total),
        items: categorized.equity.items
      }
    };

    // Verify the accounting equation: Assets = Liabilities + Equity
    const totalAssets = sections.assets.total;
    const totalLiabilitiesAndEquity = roundAmount(sections.liabilities.total + sections.equity.total);
    const difference = Math.abs(totalAssets - totalLiabilitiesAndEquity);

    if (difference > 0.01) {
      logger.warn('Balance sheet is not balanced', {
        totalAssets,
        totalLiabilitiesAndEquity,
        difference
      });
    }

    return {
      date: new Date().toISOString(),
      sections
    };

  } catch (error) {
    logger.error('Error generating balance sheet', { error });
    throw error;
  }
}