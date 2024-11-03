import { FinancialData, FinancialStatement } from './types';

export function generateCashFlowFromTransactions(
  transactions: FinancialData,
  trialBalance?: FinancialData | null
): FinancialStatement {
  const categorizeTransaction = (type: string) => {
    return transactions.rows.filter(row => {
      const transactionType = row.transaction_type?.toString().toLowerCase() || 
                            row.type?.toString().toLowerCase() || '';
      return transactionType.includes(type);
    }).map(row => ({
      account: row.description || row.account || '',
      amount: Number(row.amount || (row.debit || 0) - (row.credit || 0))
    }));
  };

  const calculateTotal = (items: { amount: number }[]) => 
    items.reduce((sum, item) => sum + item.amount, 0);

  const operating = categorizeTransaction('operating');
  const investing = categorizeTransaction('investing');
  const financing = categorizeTransaction('financing');

  const operatingTotal = calculateTotal(operating);
  const investingTotal = calculateTotal(investing);
  const financingTotal = calculateTotal(financing);

  return {
    date: new Date().toISOString(),
    sections: {
      operating: {
        total: operatingTotal,
        items: operating
      },
      investing: {
        total: investingTotal,
        items: investing
      },
      financing: {
        total: financingTotal,
        items: financing
      }
    },
    total: operatingTotal + investingTotal + financingTotal
  };
}