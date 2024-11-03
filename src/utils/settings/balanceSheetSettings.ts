// Balance Sheet Account Ranges according to UzNAS
export const BALANCE_SHEET_ACCOUNTS = {
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
  }
};

// List of accounts that follow debit-normal rules
export const DEBIT_NORMAL_ACCOUNTS = [
  // Asset accounts (0-4999)
  ...Array.from({ length: 5000 }, (_, i) => i),
  // Expense accounts (8000-8999)
  ...Array.from({ length: 1000 }, (_, i) => i + 8000)
];