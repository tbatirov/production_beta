import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createCompany, fetchCompanies, updateCompany, deleteCompany } from '../utils/supabase/companies';
import { logger } from '../utils/logger';
import { createClient } from '@supabase/supabase-js';


interface Company {
  id: string;
  name: string;
  industry?: string;
  description?: string;
  email?: string;
  phone?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CompanyContextType {
  companies: Company[];
  loading: boolean;
  error: string | null;
  selectedCompany: Company | null;
  loadCompanies: () => Promise<void>;
  addCompany: (data: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  selectCompany: (company: Company | null) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const loadCompanies = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCompanies(user.id);
      setCompanies(data);
    } catch (err) {
      logger.error('Failed to load companies:', err);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (data: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newCompany = await createCompany({
        ...data,
        user_id: user.id
      });
      setCompanies(prev => [newCompany, ...prev]);
    } catch (err) {
      logger.error('Failed to add company:', err);
      throw err;
    }
  };

  const updateCompanyData = async (id: string, data: Partial<Company>) => {
    try {
      const updatedCompany = await updateCompany(id, data);
      setCompanies(prev => 
        prev.map(company => 
          company.id === id ? { ...company, ...updatedCompany } : company
        )
      );
    } catch (err) {
      logger.error('Failed to update company:', err);
      throw err;
    }
  };

  const deleteCompanyData = async (id: string) => {
    try {
      await deleteCompany(id);
      setCompanies(prev => prev.filter(company => company.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    } catch (err) {
      logger.error('Failed to delete company:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      loadCompanies();
    } else {
      setCompanies([]);
      setSelectedCompany(null);
    }
  }, [user]);

  const value = {
    companies,
    loading,
    error,
    selectedCompany,
    loadCompanies,
    addCompany,
    updateCompany: updateCompanyData,
    deleteCompany: deleteCompanyData,
    selectCompany: setSelectedCompany
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}