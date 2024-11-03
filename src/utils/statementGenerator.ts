import { ProcessedData, GeneratedStatements } from './types';
import { validateTrialBalance } from './validators';
import { analyzeTrialBalance } from './ai/balanceSheetAI';
import { analyzeCashFlow } from './ai/cashFlowAI';
import { logger } from './logger';

export async function generateStatements(data: ProcessedData): Promise<GeneratedStatements> {
  logger.info('Starting statement generation', {
    hasTrialBalance: !!data.trialBalance?.rows?.length,
    hasTransactions: !!data.transactions?.rows?.length
  });

  try {
    let statements: GeneratedStatements = {
      balanceSheet: null,
      incomeStatement: null,
      cashFlow: null
    };

    // Process trial balance for balance sheet and income statement
    if (data.trialBalance?.rows?.length) {
      logger.info('Processing trial balance data');
      validateTrialBalance(data.trialBalance);
      const trialBalanceResult = await analyzeTrialBalance(data.trialBalance);
      statements.balanceSheet = trialBalanceResult.balanceSheet;
      statements.incomeStatement = trialBalanceResult.incomeStatement;

      // Ensure income statement sections are properly initialized
      if (statements.incomeStatement) {
        const { revenue, expenses } = statements.incomeStatement.sections;
        
        // Initialize arrays if they don't exist
        revenue.items = revenue.items || [];
        expenses.items = expenses.items || [];
        
        // Calculate totals
        revenue.total = revenue.items.reduce((sum, item) => sum + Math.abs(item.amount), 0);
        expenses.total = expenses.items.reduce((sum, item) => sum + Math.abs(item.amount), 0);
        
        // Calculate net income
        statements.incomeStatement.total = revenue.total - expenses.total;
      }
      
      logger.info('Trial balance processing completed', {
        hasBalanceSheet: !!statements.balanceSheet,
        hasIncomeStatement: !!statements.incomeStatement
      });
    }

    // Process transactions for cash flow
    if (data.transactions?.rows?.length) {
      logger.info('Processing transaction data');
      const cashFlowResult = await analyzeCashFlow(data.transactions);
      if (cashFlowResult?.cashFlow) {
        statements.cashFlow = cashFlowResult.cashFlow;
        logger.info('Cash flow processing completed');
      } else {
        throw new Error('Invalid cash flow analysis result');
      }
    }

    if (!statements.balanceSheet && !statements.incomeStatement && !statements.cashFlow) {
      throw new Error('No valid data provided for analysis');
    }

    return statements;
  } catch (error) {
    logger.error('Statement generation failed:', error);
    throw error;
  }
}