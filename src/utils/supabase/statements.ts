import { supabase } from './client';
import { FinancialStatement } from '../types/supabase';
import { logger } from '../logger';

export const saveFinancialStatement = async (
  companyId: string,
  type: 'balance' | 'income' | 'cashflow',
  periodStart: string,
  periodEnd: string,
  data: any,
  metadata?: any
): Promise<FinancialStatement> => {
  try {
    const { data: statement, error } = await supabase
      .from('financial_statements')
      .insert([
        {
          company_id: companyId,
          type,
          period_start: periodStart,
          period_end: periodEnd,
          data,
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error('Error saving financial statement:', error);
      throw error;
    }

    return statement;
  } catch (error) {
    logger.error('Failed to save financial statement:', error);
    throw error;
  }
};

export const getFinancialStatements = async (
  companyId: string,
  type?: 'balance' | 'income' | 'cashflow',
  startDate?: string,
  endDate?: string
): Promise<FinancialStatement[]> => {
  try {
    let query = supabase
      .from('financial_statements')
      .select('*')
      .eq('company_id', companyId);

    if (type) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('period_start', startDate);
    }

    if (endDate) {
      query = query.lte('period_end', endDate);
    }

    const { data, error } = await query.order('period_start', { ascending: false });

    if (error) {
      logger.error('Error fetching financial statements:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to fetch financial statements:', error);
    throw error;
  }
};