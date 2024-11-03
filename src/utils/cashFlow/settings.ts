// Cash account codes according to UzNAS
export const CASH_ACCOUNTS = {
  CASH_ON_HAND: '3010',
  CASH_IN_BANK: '3110',
  CASH_IN_FOREIGN_CURRENCY: '3120'
};

// Account ranges for cash flow categorization
export const ACCOUNT_RANGES = {
  operating: {
    // Current assets and liabilities
    receivables: { start: 4000, end: 4999 },
    payables: { start: 6000, end: 6819 },
    // Revenue and expenses
    revenue: { start: 7000, end: 7999 },
    expenses: { start: 8000, end: 8999 }
  },
  investing: {
    // Fixed assets and long-term investments
    fixedAssets: { start: 0, end: 999 },
    investments: { start: 1000, end: 1999 }
  },
  financing: {
    // Loans and equity
    loans: '6820',
    equity: { start: 5000, end: 5999 }
  }
};

// Special accounts
export const SPECIAL_ACCOUNTS = {
  interestReceived: '7320',
  interestPaid: '8510',
  taxPaid: '6410',
  dividendsPaid: '5510'
};