import { supabase } from './client';
import { Company } from '../types/supabase';
import { logger } from '../logger';

export const fetchCompanies = async (): Promise<Company[]> => {
  try {

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      throw new Error('Authentication required');
    }

    // Validate required fields
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('users.id',session.user.id)
      .order('name');

    if (error) {
      logger.error('Error fetching companies:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Failed to fetch companies:', error);
    throw error;
  }
};

export const createCompany = async (
  company: Omit<Company, 'id' | 'created_at' | 'updated_at'>
): Promise<Company> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) {
      logger.error('Error creating company:', error);
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Failed to create company:', error);
    throw error;
  }
};

export const updateCompany = async (
  id: string,
  updates: Partial<Omit<Company, 'id' | 'created_at'>>
): Promise<Company> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating company:', error);
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Failed to update company:', error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting company:', error);
      throw error;
    }
  } catch (error) {
    logger.error('Failed to delete company:', error);
    throw error;
  }
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching company:', error);
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Failed to fetch company:', error);
    throw error;
  }
};