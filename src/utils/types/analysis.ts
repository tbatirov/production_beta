export interface FinancialRatios {
  profitability: {
    grossProfitMargin: number;
    netProfitMargin: number;
    operatingMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
  };
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
  };
  efficiency: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
  };
  leverage: {
    debtRatio: number;
    debtToEquity: number;
    interestCoverage: number;
  };
}

export interface FinancialAnalysis {
  id?: string;
  companyId: string;
  period: string;
  statements: {
    balanceSheet: any;
    incomeStatement: any;
    cashFlow?: any;
  };
  ratios: FinancialRatios;
  analysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    trends: {
      revenue: { trend: 'up' | 'down' | 'stable'; percentage: number };
      profitability: { trend: 'up' | 'down' | 'stable'; percentage: number };
      cashFlow: { trend: 'up' | 'down' | 'stable'; percentage: number };
    };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'final';
    version: string;
  };
}