import { FinancialData, FinancialStatement } from './types';

export function generateBalanceSheetFromTB(trialBalance: FinancialData): FinancialStatement {
  const accounts = trialBalance.rows.reduce((acc, row) => {
    const accountType = row.account_type?.toString().toLowerCase() || '';
    const amount = Number(row.amount || row.balance || (row.debit || 0) - (row.credit || 0));
    
    if (!acc[accountType]) {
      acc[accountType] = {
        total: 0,
        items: []
      };
    }

    acc[accountType].items.push({
      account: row.account_name || row.account || '',
      amount: amount
    });

    acc[accountType].total += amount;

    return acc;
  }, {});

  return {
    date: new Date().toISOString(),
    sections: {
      assets: accounts.assets || { total: 0, items: [] },
      liabilities: accounts.liabilities || { total: 0, items: [] },
      equity: accounts.equity || { total: 0, items: [] }
    },
    total: (accounts.assets?.total || 0) - ((accounts.liabilities?.total || 0) + (accounts.equity?.total || 0))
  };
}

export function generateIncomeStatementFromTB(trialBalance: FinancialData): FinancialStatement {
  const accounts = trialBalance.rows.reduce((acc, row) => {
    const accountType = row.account_type?.toString().toLowerCase() || '';
    const amount = Number(row.amount || row.balance || (row.debit || 0) - (row.credit || 0));
    
    if (accountType === 'revenue' || accountType === 'expense') {
      if (!acc[accountType]) {
        acc[accountType] = {
          total: 0,
          items: []
        };
      }

      acc[accountType].items.push({
        account: row.account_name || row.account || '',
        amount: Math.abs(amount)
      });

      acc[accountType].total += Math.abs(amount);
    }

    return acc;
  }, {});

  const revenueTotal = accounts.revenue?.total || 0;
  const expenseTotal = accounts.expense?.total || 0;

  return {
    date: new Date().toISOString(),
    sections: {
      revenue: accounts.revenue || { total: 0, items: [] },
      expenses: accounts.expense || { total: 0, items: [] }
    },
    total: revenueTotal - expenseTotal
  };
}