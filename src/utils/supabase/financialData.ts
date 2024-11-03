import { supabase } from './client';
import { GeneratedStatements } from '../types';
import { logger } from '../logger';

export async function saveFinancialData(
  companyId: string,
  data: GeneratedStatements,
  period: string
) {
  try {
    // Save Balance Sheet
    if (data.balanceSheet) {
      const { error: balanceSheetError } = await supabase
        .from('financial_statements')
        .insert({
          company_id: companyId,
          type: 'balance',
          period_start: period,
          period_end: period,
          data: data.balanceSheet,
          status: 'finalized'
        });

      if (balanceSheetError) throw balanceSheetError;
    }

    // Save Income Statement
    if (data.incomeStatement) {
      const { error: incomeError } = await supabase
        .from('financial_statements')
        .insert({
          company_id: companyId,
          type: 'income',
          period_start: period,
          period_end: period,
          data: data.incomeStatement,
          status: 'finalized'
        });

      if (incomeError) throw incomeError;
    }

    // Save Cash Flow Statement
    if (data.cashFlow) {
      const { error: cashFlowError } = await supabase
        .from('financial_statements')
        .insert({
          company_id: companyId,
          type: 'cashflow',
          period_start: period,
          period_end: period,
          data: data.cashFlow,
          status: 'finalized'
        });

      if (cashFlowError) throw cashFlowError;
    }

    logger.info('Financial data saved successfully', { companyId, period });
  } catch (error) {
    logger.error('Error saving financial data:', error);
    throw error;
  }
}

export async function getFinancialData(companyId: string, period?: string) {
  try {
    let query = supabase
      .from('financial_statements')
      .select('*')
      .eq('company_id', companyId)
      .order('period_start', { ascending: false });

    if (period) {
      query = query.eq('period_start', period);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group statements by period
    const groupedData = data.reduce((acc, statement) => {
      if (!acc[statement.period_start]) {
        acc[statement.period_start] = {
          balanceSheet: null,
          incomeStatement: null,
          cashFlow: null
        };
      }

      switch (statement.type) {
        case 'balance':
          acc[statement.period_start].balanceSheet = statement.data;
          break;
        case 'income':
          acc[statement.period_start].incomeStatement = statement.data;
          break;
        case 'cashflow':
          acc[statement.period_start].cashFlow = statement.data;
          break;
      }

      return acc;
    }, {});

    return Object.entries(groupedData).map(([period, statements]) => ({
      period,
      statements
    }));
  } catch (error) {
    logger.error('Error fetching financial data:', error);
    throw error;
  }
}