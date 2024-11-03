import { supabase } from './supabase';
import { CompanyProfile } from './types';
import { logger } from './logger';

export async function getCompanies(): Promise<CompanyProfile[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return data;
  } catch (error) {
    logger.error('Error fetching companies', { error });
    throw error;
  }
}

export async function getCompany(id: string): Promise<CompanyProfile | null> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    logger.error('Error fetching company', { error });
    throw error;
  }
}

export async function createCompany(company: Partial<CompanyProfile>): Promise<CompanyProfile> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) throw error;
    
    logger.info('Company created successfully', { companyId: data.id });
    return data;
  } catch (error) {
    logger.error('Error creating company', { error });
    throw error;
  }
}

export async function updateCompany(id: string, updates: Partial<CompanyProfile>): Promise<CompanyProfile> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    logger.info('Company updated successfully', { companyId: id });
    return data;
  } catch (error) {
    logger.error('Error updating company', { error });
    throw error;
  }
}

export async function deleteCompany(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    logger.info('Company deleted successfully', { companyId: id });
  } catch (error) {
    logger.error('Error deleting company', { error });
    throw error;
  }
}