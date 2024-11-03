import { FinancialData, FinancialStatement, Transaction, CashFlowCategories } from './types';
import { calculateAccountBalances, categorizeAccounts, isCashAccount } from './accountingUtils';

export function generateBalanceSheet(
  trialBalance: FinancialData | null,
  transactions: FinancialData | null
): FinancialStatement {
  // Balance sheet requires trial balance data
  if (!trialBalance?.rows?.length) {
    return {
      date: new Date().toISOString(),
      sections: {
        assets: { total: 0, items: [] },
        liabilities: { total: 0, items: [] },
        equity: { total: 0, items: [] }
      },
      total: 0
    };
  }

  const accounts = calculateAccountBalances(trialBalance);
  const categorized = categorizeAccounts(accounts);

  const createSection = (items: any[] = []) => ({
    total: items.reduce((sum, item) => sum + (item.balance || 0), 0),
    items: items.map(item => ({
      account: item.account,
      amount: item.balance || 0
    }))
  });

  const statement = {
    date: new Date().toISOString(),
    sections: {
      assets: createSection(categorized.assets || []),
      liabilities: createSection(categorized.liabilities || []),
      equity: createSection(categorized.equity || [])
    },
    total: 0
  };

  // Calculate total assets and liabilities
  const totalAssets = statement.sections.assets.total;
  const totalLiabilities = statement.sections.liabilities.total;
  const totalEquity = statement.sections.equity.total;
  statement.total = totalAssets - (totalLiabilities + totalEquity);

  console.log('Generated Balance Sheet:', statement);
  return statement;
}

export function generateIncomeStatement(
  trialBalance: FinancialData | null,
  transactions: FinancialData | null
): FinancialStatement {
  // Income statement requires trial balance data
  if (!trialBalance?.rows?.length) {
    return {
      date: new Date().toISOString(),
      sections: {
        revenue: { total: 0, items: [] },
        expenses: { total: 0, items: [] }
      },
      total: 0
    };
  }

  const accounts = calculateAccountBalances(trialBalance);
  const categorized = categorizeAccounts(accounts);

  // Filter and process revenue accounts (7xxx and 8xxx)
  const revenue = (categorized.revenue || []).filter(item => 
    item.accountNumber?.toString().match(/^[78]/)
  );

  // Filter and process expense accounts (6xxx)
  const expenses = (categorized.expenses || []).filter(item => 
    item.accountNumber?.toString().startsWith('6')
  );

  const revenueTotal = revenue.reduce((sum, item) => sum + Math.abs(item.balance || 0), 0);
  const expensesTotal = expenses.reduce((sum, item) => sum + Math.abs(item.balance || 0), 0);

  const statement = {
    date: new Date().toISOString(),
    sections: {
      revenue: {
        total: revenueTotal,
        items: revenue.map(item => ({
          account: item.account,
          amount: Math.abs(item.balance || 0)
        }))
      },
      expenses: {
        total: expensesTotal,
        items: expenses.map(item => ({
          account: item.account,
          amount: Math.abs(item.balance || 0)
        }))
      }
    },
    total: revenueTotal - expensesTotal
  };

  console.log('Generated Income Statement:', statement);
  return statement;
}

function categorizeCashFlowTransactions(transactions: FinancialData): CashFlowCategories {
  const categorized: CashFlowCategories = {
    operating: [],
    investing: [],
    financing: []
  };

  transactions.rows.forEach(row => {
    const transaction: Transaction = {
      description: row.description || row.account || '',
      amount: Number(row.amount || row.debit - row.credit || 0),
      date: row.date || new Date().toISOString(),
      accountCode: row.account_code?.toString() || row.account_number?.toString() || ''
    };

    if (!transaction.accountCode) return;

    // Categorize based on account code
    if (transaction.accountCode.match(/^[4678]/)) {
      categorized.operating.push(transaction);
    } else if (transaction.accountCode.match(/^[01]/)) {
      categorized.investing.push(transaction);
    } else if (transaction.accountCode.startsWith('5') || transaction.accountCode === '6820') {
      categorized.financing.push(transaction);
    }
  });

  return categorized;
}

export function generateCashFlow(
  trialBalance: FinancialData | null,
  transactions: FinancialData | null
): FinancialStatement {
  // Cash flow statement requires transactions data
  if (!transactions?.rows?.length) {
    return {
      date: new Date().toISOString(),
      sections: {
        operating: { total: 0, items: [] },
        investing: { total: 0, items: [] },
        financing: { total: 0, items: [] }
      },
      total: 0
    };
  }

  let openingBalance = 0;

  if (trialBalance?.rows?.length) {
    const cashAccounts = trialBalance.rows.filter(row => 
      isCashAccount(row.account_name || row.account || '')
    );
    openingBalance = cashAccounts.reduce((sum, account) => 
      sum + Number(account.amount || account.balance || 0), 0);
  }

  const categorized = categorizeCashFlowTransactions(transactions);
  
  const operatingTotal = categorized.operating.reduce((sum, t) => sum + t.amount, 0);
  const investingTotal = categorized.investing.reduce((sum, t) => sum + t.amount, 0);
  const financingTotal = categorized.financing.reduce((sum, t) => sum + t.amount, 0);

  const statement = {
    date: new Date().toISOString(),
    sections: {
      operating: {
        total: operatingTotal,
        items: categorized.operating.map(t => ({
          account: t.description,
          amount: t.amount
        }))
      },
      investing: {
        total: investingTotal,
        items: categorized.investing.map(t => ({
          account: t.description,
          amount: t.amount
        }))
      },
      financing: {
        total: financingTotal,
        items: categorized.financing.map(t => ({
          account: t.description,
          amount: t.amount
        }))
      }
    },
    total: operatingTotal + investingTotal + financingTotal
  };

  console.log('Generated Cash Flow Statement:', statement);
  return statement;
}