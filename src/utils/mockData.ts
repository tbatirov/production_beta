import { FinancialAnalysis, FinancialRatios } from './types';

export const mockRatios: FinancialRatios = {
  profitability: {
    grossProfitMargin: 35.2,
    netProfitMargin: 15.8,
    operatingMargin: 22.4,
    returnOnAssets: 12.5,
    returnOnEquity: 18.9
  },
  liquidity: {
    currentRatio: 2.1,
    quickRatio: 1.5,
    cashRatio: 0.8
  },
  efficiency: {
    assetTurnover: 1.8,
    inventoryTurnover: 8.2,
    receivablesTurnover: 9.5
  },
  leverage: {
    debtRatio: 0.45,
    debtToEquity: 0.85,
    interestCoverage: 6.2
  }
};

export const mockAnalysis: FinancialAnalysis = {
  companyId: '123',
  period: '2024-02',
  statements: {
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
      total: 150000
    }
  },
  ratios: mockRatios,
  analysis: {
    summary: 'The company shows strong financial performance with healthy profitability and liquidity metrics.',
    strengths: [
      'Strong liquidity position with current ratio above industry average',
      'Healthy profit margins indicating efficient operations',
      'Good cash flow generation from operations'
    ],
    weaknesses: [
      'Slightly elevated debt levels',
      'Room for improvement in inventory management',
      'Accounts receivable collection could be more efficient'
    ],
    recommendations: [
      'Consider debt reduction strategies',
      'Implement stronger inventory control measures',
      'Review credit policies to improve receivables turnover',
      'Explore opportunities for operational efficiency'
    ],
    trends: {
      revenue: { trend: 'up', percentage: 12.5 },
      profitability: { trend: 'up', percentage: 8.3 },
      cashFlow: { trend: 'stable', percentage: 2.1 }
    }
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'final',
    version: '1.0'
  }
};

export const mockAnalysisHistory: FinancialAnalysis[] = [
  mockAnalysis,
  {
    ...mockAnalysis,
    period: '2024-01',
    metadata: {
      ...mockAnalysis.metadata,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    }
  },
  {
    ...mockAnalysis,
    period: '2023-12',
    metadata: {
      ...mockAnalysis.metadata,
      createdAt: new Date('2023-12-15').toISOString(),
      updatedAt: new Date('2023-12-15').toISOString()
    }
  }
];