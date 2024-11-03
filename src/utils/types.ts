export interface FinancialRatios {
  profitability: {
    grossProfitMargin: number;
    netProfitMargin: number;
    operatingMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    returnOnCapitalEmployed: number;
    returnOnInvestedCapital: number;
    ebitdaMargin: number;
    returnOnSales: number;
    returnOnTangibleAssets: number;
  };
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    operatingCashFlowRatio: number;
    workingCapitalRatio: number;
    defensiveInterval: number;
    cashConversionCycle: number;
    netWorkingCapitalTurnover: number;
    currentLiabilitiesCoverage: number;
    shortTermLiquidityRatio: number;
  };
  efficiency: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
    fixedAssetTurnover: number;
    workingCapitalTurnover: number;
    operatingCycle: number;
    cashTurnover: number;
    totalAssetUtilization: number;
    equityTurnover: number;
  };
  leverage: {
    debtRatio: number;
    debtToEquity: number;
    interestCoverage: number;
    equityMultiplier: number;
    debtServiceCoverage: number;
    fixedChargeCoverage: number;
    longTermDebtRatio: number;
    timesInterestEarned: number;
    cashFlowCoverage: number;
    financialLeverage: number;
  };
  growth: {
    retentionRate: number;
    sustainableGrowthRate: number;
    assetGrowthRate: number;
    revenueGrowthRate: number;
    netIncomeGrowthRate: number;
  };
  marketValue: {
    bookValuePerShare: number;
    marketToBookRatio: number;
    priceEarningsRatio: number;
    dividendYield: number;
    dividendPayoutRatio: number;
  };
}