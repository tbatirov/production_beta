import { GeneratedStatements, FinancialRatios } from './types';
import { logger } from './logger';

function safeDiv(numerator: number, denominator: number): number {
  if (!denominator || denominator === 0) return 0;
  return numerator / denominator;
}

export function calculateFinancialRatios(statements: GeneratedStatements): FinancialRatios {  
  try {
    const bs = statements.balanceSheet?.sections;
    const is = statements.incomeStatement?.sections;
    const cf = statements.cashFlow?.sections;
    
    if (!bs || !is) {
      logger.warn('Missing required statement sections for ratio calculation');
      return getEmptyRatios();
    }

    // Calculate key balance sheet values
    const totalAssets = Math.abs(bs.assets.total);
    const currentAssets = Math.abs(bs.assets.items
      .filter(item => 
        item.account.toLowerCase().includes('current') || 
        item.account.toLowerCase().includes('cash') ||
        item.account.toLowerCase().includes('inventory') ||
        item.account.toLowerCase().includes('receivable')
      ).reduce((sum, item) => sum + Math.abs(item.amount), 0));

    const inventory = Math.abs(bs.assets.items
      .filter(item => item.account.toLowerCase().includes('inventory'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));

    const accountsReceivable = Math.abs(bs.assets.items
      .filter(item => item.account.toLowerCase().includes('receivable'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));

    const currentLiabilities = Math.abs(bs.liabilities.items
      .filter(item => 
        item.account.toLowerCase().includes('current') ||
        item.account.toLowerCase().includes('payable')
      ).reduce((sum, item) => sum + Math.abs(item.amount), 0));

    const accountsPayable = Math.abs(bs.liabilities.items
      .filter(item => item.account.toLowerCase().includes('payable'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));

    const totalLiabilities = Math.abs(bs.liabilities.total);
    const equity = Math.abs(bs.equity.total);
    const retainedEarnings = Math.abs(bs.equity.items
      .filter(item => item.account.toLowerCase().includes('retained'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));

    // Calculate income statement values
    const revenue = Math.abs(is.revenue.total);
    const grossProfit = revenue - Math.abs(is.expenses.items
      .filter(item => item.account.toLowerCase().includes('cost of'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));
    const operatingExpenses = Math.abs(is.expenses.items
      .filter(item => !item.account.toLowerCase().includes('interest'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));
    const operatingIncome = revenue - operatingExpenses;
    const interestExpense = Math.abs(is.expenses.items
      .filter(item => item.account.toLowerCase().includes('interest'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));
    const netIncome = Math.abs(statements.incomeStatement?.total || 0);

    // Calculate cash flow values
    const operatingCashFlow = Math.abs(cf?.operating?.total || 0);
    const investingCashFlow = Math.abs(cf?.investing?.total || 0);
    const financingCashFlow = Math.abs(cf?.financing?.total || 0);
    const totalCashFlow = Math.abs(statements.cashFlow?.total || 0);

    // Calculate specific items
    const cashAndEquivalents = Math.abs(bs.assets.items
      .filter(item => item.account.toLowerCase().includes('cash'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));

    const workingCapital = currentAssets - currentLiabilities;
    const tangibleAssets = totalAssets - Math.abs(bs.assets.items
      .filter(item => item.account.toLowerCase().includes('intangible'))
      .reduce((sum, item) => sum + Math.abs(item.amount), 0));

    // Calculate all ratios (multiply by 100 for percentages)
    return {
      profitability: {
        grossProfitMargin: safeDiv(grossProfit, revenue) * 100,
        netProfitMargin: safeDiv(netIncome, revenue) * 100,
        operatingMargin: safeDiv(operatingIncome, revenue) * 100,
        returnOnAssets: safeDiv(netIncome, totalAssets) * 100,
        returnOnEquity: safeDiv(netIncome, equity) * 100,
        returnOnCapitalEmployed: safeDiv(operatingIncome, (totalAssets - currentLiabilities)) * 100,
        returnOnInvestedCapital: safeDiv(operatingIncome * (1 - 0.25), (totalAssets - currentLiabilities)) * 100,
        ebitdaMargin: safeDiv((operatingIncome + interestExpense), revenue) * 100,
        returnOnSales: safeDiv(operatingIncome, revenue) * 100,
        returnOnTangibleAssets: safeDiv(netIncome, tangibleAssets) * 100
      },
      liquidity: {
        currentRatio: safeDiv(currentAssets, currentLiabilities) * 100,
        quickRatio: safeDiv((currentAssets - inventory), currentLiabilities) * 100,
        cashRatio: safeDiv(cashAndEquivalents, currentLiabilities) * 100,
        operatingCashFlowRatio: safeDiv(operatingCashFlow, currentLiabilities) * 100,
        workingCapitalRatio: safeDiv(workingCapital, totalAssets) * 100,
        defensiveInterval: safeDiv(currentAssets, (operatingExpenses / 365)) * 100,
        cashConversionCycle: safeDiv((inventory + accountsReceivable - accountsPayable), (revenue / 365)) * 100,
        netWorkingCapitalTurnover: safeDiv(revenue, workingCapital) * 100,
        currentLiabilitiesCoverage: safeDiv(operatingCashFlow, currentLiabilities) * 100,
        shortTermLiquidityRatio: safeDiv((cashAndEquivalents + accountsReceivable), currentLiabilities) * 100
      },
      efficiency: {
        assetTurnover: safeDiv(revenue, totalAssets) * 100,
        inventoryTurnover: safeDiv(revenue, inventory) * 100,
        receivablesTurnover: safeDiv(revenue, accountsReceivable) * 100,
        payablesTurnover: safeDiv(revenue, accountsPayable) * 100,
        fixedAssetTurnover: safeDiv(revenue, (totalAssets - currentAssets)) * 100,
        workingCapitalTurnover: safeDiv(revenue, workingCapital) * 100,
        operatingCycle: safeDiv((inventory + accountsReceivable), (revenue / 365)) * 100,
        cashTurnover: safeDiv(revenue, cashAndEquivalents) * 100,
        totalAssetUtilization: safeDiv(revenue, totalAssets) * 100,
        equityTurnover: safeDiv(revenue, equity) * 100
      },
      leverage: {
        debtRatio: safeDiv(totalLiabilities, totalAssets) * 100,
        debtToEquity: safeDiv(totalLiabilities, equity) * 100,
        interestCoverage: safeDiv((operatingIncome + interestExpense), interestExpense) * 100,
        equityMultiplier: safeDiv(totalAssets, equity) * 100,
        debtServiceCoverage: safeDiv(operatingIncome, (interestExpense + (totalLiabilities * 0.2))) * 100,
        fixedChargeCoverage: safeDiv((operatingIncome + interestExpense), interestExpense) * 100,
        longTermDebtRatio: safeDiv((totalLiabilities - currentLiabilities), equity) * 100,
        timesInterestEarned: safeDiv(operatingIncome, interestExpense) * 100,
        cashFlowCoverage: safeDiv(operatingCashFlow, totalLiabilities) * 100,
        financialLeverage: safeDiv(totalAssets, equity) * 100
      },
      growth: {
        retentionRate: safeDiv(retainedEarnings, netIncome) * 100,
        sustainableGrowthRate: safeDiv((retainedEarnings * netIncome), equity) * 100,
        assetGrowthRate: 0, // Requires historical data
        revenueGrowthRate: 0, // Requires historical data
        netIncomeGrowthRate: 0 // Requires historical data
      },
      marketValue: {
        bookValuePerShare: safeDiv(equity, 1) * 100, // Divide by number of shares if available
        marketToBookRatio: 0, // Requires market data
        priceEarningsRatio: 0, // Requires market data
        dividendYield: 0, // Requires dividend data
        dividendPayoutRatio: 0 // Requires dividend data
      }
    };
  } catch (error) {
    logger.error('Error calculating financial ratios:', error);
    return getEmptyRatios();
  }
}

function getEmptyRatios(): FinancialRatios {
  return {
    profitability: {
      grossProfitMargin: 0,
      netProfitMargin: 0,
      operatingMargin: 0,
      returnOnAssets: 0,
      returnOnEquity: 0,
      returnOnCapitalEmployed: 0,
      returnOnInvestedCapital: 0,
      ebitdaMargin: 0,
      returnOnSales: 0,
      returnOnTangibleAssets: 0
    },
    liquidity: {
      currentRatio: 0,
      quickRatio: 0,
      cashRatio: 0,
      operatingCashFlowRatio: 0,
      workingCapitalRatio: 0,
      defensiveInterval: 0,
      cashConversionCycle: 0,
      netWorkingCapitalTurnover: 0,
      currentLiabilitiesCoverage: 0,
      shortTermLiquidityRatio: 0
    },
    efficiency: {
      assetTurnover: 0,
      inventoryTurnover: 0,
      receivablesTurnover: 0,
      payablesTurnover: 0,
      fixedAssetTurnover: 0,
      workingCapitalTurnover: 0,
      operatingCycle: 0,
      cashTurnover: 0,
      totalAssetUtilization: 0,
      equityTurnover: 0
    },
    leverage: {
      debtRatio: 0,
      debtToEquity: 0,
      interestCoverage: 0,
      equityMultiplier: 0,
      debtServiceCoverage: 0,
      fixedChargeCoverage: 0,
      longTermDebtRatio: 0,
      timesInterestEarned: 0,
      cashFlowCoverage: 0,
      financialLeverage: 0
    },
    growth: {
      retentionRate: 0,
      sustainableGrowthRate: 0,
      assetGrowthRate: 0,
      revenueGrowthRate: 0,
      netIncomeGrowthRate: 0
    },
    marketValue: {
      bookValuePerShare: 0,
      marketToBookRatio: 0,
      priceEarningsRatio: 0,
      dividendYield: 0,
      dividendPayoutRatio: 0
    }
  };
}