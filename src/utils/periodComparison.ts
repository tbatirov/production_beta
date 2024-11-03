import { GeneratedStatements } from './types';
import { logger } from './logger';

export function calculatePeriodComparison(
  currentPeriod: GeneratedStatements,
  previousPeriod: GeneratedStatements
) {
  logger.info('Starting period comparison calculation');

  try {
    const calculatePercentageChange = (current: number, previous: number): number => {
      if (!previous) return 0;
      return ((current - previous) / Math.abs(previous)) * 100;
    };

    const changes = {
      balanceSheet: {
        totalAssets: calculatePercentageChange(
          currentPeriod.balanceSheet?.sections.assets.total || 0,
          previousPeriod.balanceSheet?.sections.assets.total || 0
        ),
        totalLiabilities: calculatePercentageChange(
          currentPeriod.balanceSheet?.sections.liabilities.total || 0,
          previousPeriod.balanceSheet?.sections.liabilities.total || 0
        ),
        totalEquity: calculatePercentageChange(
          currentPeriod.balanceSheet?.sections.equity.total || 0,
          previousPeriod.balanceSheet?.sections.equity.total || 0
        )
      },
      incomeStatement: {
        revenue: calculatePercentageChange(
          currentPeriod.incomeStatement?.sections.revenue.total || 0,
          previousPeriod.incomeStatement?.sections.revenue.total || 0
        ),
        expenses: calculatePercentageChange(
          currentPeriod.incomeStatement?.sections.expenses.total || 0,
          previousPeriod.incomeStatement?.sections.expenses.total || 0
        ),
        netIncome: calculatePercentageChange(
          currentPeriod.incomeStatement?.total || 0,
          previousPeriod.incomeStatement?.total || 0
        )
      },
      cashFlow: {
        operating: calculatePercentageChange(
          currentPeriod.cashFlow?.sections.operating.total || 0,
          previousPeriod.cashFlow?.sections.operating.total || 0
        ),
        investing: calculatePercentageChange(
          currentPeriod.cashFlow?.sections.investing.total || 0,
          previousPeriod.cashFlow?.sections.investing.total || 0
        ),
        financing: calculatePercentageChange(
          currentPeriod.cashFlow?.sections.financing.total || 0,
          previousPeriod.cashFlow?.sections.financing.total || 0
        ),
        netCashFlow: calculatePercentageChange(
          currentPeriod.cashFlow?.total || 0,
          previousPeriod.cashFlow?.total || 0
        )
      },
      revenue: {
        trend: calculatePercentageChange(
          currentPeriod.incomeStatement?.sections.revenue.total || 0,
          previousPeriod.incomeStatement?.sections.revenue.total || 0
        ),
        analysis: [
          `Revenue ${currentPeriod.incomeStatement?.sections.revenue.total || 0 > previousPeriod.incomeStatement?.sections.revenue.total || 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(
            currentPeriod.incomeStatement?.sections.revenue.total || 0,
            previousPeriod.incomeStatement?.sections.revenue.total || 0
          )).toFixed(1)}%`
        ]
      },
      netIncome: {
        trend: calculatePercentageChange(
          currentPeriod.incomeStatement?.total || 0,
          previousPeriod.incomeStatement?.total || 0
        ),
        analysis: [
          `Net income ${currentPeriod.incomeStatement?.total || 0 > previousPeriod.incomeStatement?.total || 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(
            currentPeriod.incomeStatement?.total || 0,
            previousPeriod.incomeStatement?.total || 0
          )).toFixed(1)}%`
        ]
      },
      assets: {
        trend: calculatePercentageChange(
          currentPeriod.balanceSheet?.sections.assets.total || 0,
          previousPeriod.balanceSheet?.sections.assets.total || 0
        ),
        analysis: [
          `Total assets ${currentPeriod.balanceSheet?.sections.assets.total || 0 > previousPeriod.balanceSheet?.sections.assets.total || 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(
            currentPeriod.balanceSheet?.sections.assets.total || 0,
            previousPeriod.balanceSheet?.sections.assets.total || 0
          )).toFixed(1)}%`
        ]
      },
      cashFlow: {
        trend: calculatePercentageChange(
          currentPeriod.cashFlow?.total || 0,
          previousPeriod.cashFlow?.total || 0
        ),
        analysis: [
          `Net cash flow ${currentPeriod.cashFlow?.total || 0 > previousPeriod.cashFlow?.total || 0 ? 'increased' : 'decreased'} by ${Math.abs(calculatePercentageChange(
            currentPeriod.cashFlow?.total || 0,
            previousPeriod.cashFlow?.total || 0
          )).toFixed(1)}%`
        ]
      }
    };

    logger.info('Period comparison calculation completed successfully');
    return {
      currentPeriod,
      previousPeriod,
      changes
    };
  } catch (error) {
    logger.error('Error calculating period comparison:', error);
    throw error;
  }
}