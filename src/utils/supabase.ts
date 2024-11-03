import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';
import { logger } from './logger';
import { GeneratedStatements } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export async function createCompany(data: {
  name: string;
  industry?: string;
  description?: string;
  email?: string;
  phone?: string;
  user_id: string;
}) {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return company;
  } catch (error) {
    logger.error('Error creating company:', error);
    throw error;
  }
}

export async function fetchCompanies(userId: string) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching companies:', error);
    throw error;
  }
}

export async function updateCompany(id: string, data: Partial<{
  name: string;
  industry: string;
  description: string;
  email: string;
  phone: string;
}>) {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return company;
  } catch (error) {
    logger.error('Error updating company:', error);
    throw error;
  }
}

export async function deleteCompany(id: string) {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting company:', error);
    throw error;
  }
}

export async function saveFinancialStatement(data: {
  company_id: string;
  user_id: string;
  period: string;
  statements: GeneratedStatements;
  metadata?: Record<string, any>;
}) {
  try {
    const { data: statement, error } = await supabase
      .from('financial_statements')
      .insert([{
        company_id: data.company_id,
        user_id: data.user_id,
        period: data.period,
        balance_sheet: data.statements.balanceSheet,
        income_statement: data.statements.incomeStatement,
        cash_flow: data.statements.cashFlow,
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return statement;
  } catch (error) {
    logger.error('Error saving financial statement:', error);
    throw error;
  }
}

export async function fetchFinancialStatements(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('financial_statements')
      .select('*')
      .eq('company_id', companyId)
      .order('period', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching financial statements:', error);
    throw error;
  }
}

export async function fetchLatestFinancialStatement(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('financial_statements')
      .select('*')
      .eq('company_id', companyId)
      .order('period', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching latest financial statement:', error);
    throw error;
  }
}

export async function deleteFinancialStatement(id: string) {
  try {
    const { error } = await supabase
      .from('financial_statements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting financial statement:', error);
    throw error;
  }
}