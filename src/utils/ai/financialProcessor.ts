import { FinancialData, GeneratedStatements } from '../types';
import { logger } from '../logger';
import { analyzeTrialBalance } from './balanceSheetAI';
import { analyzeCashFlow } from './cashFlowAI';


export async function processFinancialData(
  data: FinancialData,
  type: 'trialBalance' | 'transactions' = 'trialBalance'
): Promise<GeneratedStatements> {
  try {
    logger.info(`Processing ${type} data with AI`, {
      rowCount: data.rows.length,
      headers: data.headers
    });

    if (type === 'transactions') {
      // Process transactions for cash flow statement
      const cashFlow = await analyzeCashFlow(data);
      return {
        balanceSheet: null,
        incomeStatement: null,
        cashFlow
      };
    } else {
      // Process trial balance for balance sheet and income statement
      return await analyzeTrialBalance(data);
    }
  } catch (error) {
    logger.error(`Error processing ${type} data with AI`, { error });
    throw error;
  }
}