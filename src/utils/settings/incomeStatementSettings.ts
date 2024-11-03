// Income Statement Account Ranges according to UzNAS
export const INCOME_STATEMENT_ACCOUNTS = {
  revenue: {
    sales: { start: 7100, end: 7199 },
    services: { start: 7200, end: 7299 },
    interest: { start: 7300, end: 7399 },
    other: { start: 7400, end: 7999 }
  },
  expenses: {
    costOfGoods: { start: 8000, end: 8099 },
    operating: { start: 8100, end: 8499 },
    financial: { start: 8500, end: 8599 },
    other: { start: 8600, end: 8999 }
  }
};

// Account types that follow credit-normal rules
export const CREDIT_NORMAL_ACCOUNTS = [
  // Revenue accounts (7000-7999)
  ...Array.from({ length: 1000 }, (_, i) => i + 7000)
];

// Account types that follow debit-normal rules
export const DEBIT_NORMAL_ACCOUNTS = [
  // Expense accounts (8000-8999)
  ...Array.from({ length: 1000 }, (_, i) => i + 8000)
];