import { GeneratedStatements, HistoricalData } from './types';
import { supabase } from './supabase';
import { logger } from './logger';

export async function saveStatements(statements: GeneratedStatements): Promise<void> {
  try {
    const { error } = await supabase
      .from('financial_statements')
      .insert({
        company_id: statements.companyId,
        period: statements.period,
        balance_sheet: statements.balanceSheet,
        income_statement: statements.incomeStatement,
        cash_flow: statements.cashFlow,
        status: 'finalized',
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    
    logger.info('Statements saved successfully', {
      companyId: statements.companyId,
      period: statements.period
    });
  } catch (error) {
    logger.error('Error saving statements', { error });
    throw error;
  }
}

export async function getHistoricalStatements(
  companyId: string,
  startDate?: string,
  endDate?: string
): Promise<HistoricalData[]> {
  try {
    let query = supabase
      .from('financial_statements')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'finalized')
      .order('period', { ascending: false });

    if (startDate) {
      query = query.gte('period', startDate);
    }
    if (endDate) {
      query = query.lte('period', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(record => ({
      statements: {
        balanceSheet: record.balance_sheet,
        incomeStatement: record.income_statement,
        cashFlow: record.cash_flow
      },
      period: record.period,
      companyId: record.company_id,
      createdAt: record.created_at
    }));
  } catch (error) {
    logger.error('Error fetching historical statements', { error });
    throw error;
  }
}