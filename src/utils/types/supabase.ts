export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          description: string | null
          fiscal_year_end: string | null
          tax_id: string | null
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          description?: string | null
          fiscal_year_end?: string | null
          tax_id?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          description?: string | null
          fiscal_year_end?: string | null
          tax_id?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          updated_at?: string
        }
      }
      financial_statements: {
        Row: {
          id: string
          company_id: string
          type: 'balance' | 'income' | 'cashflow'
          period_start: string
          period_end: string
          data: Json
          metadata: Json | null
          status: 'draft' | 'finalized'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          type: 'balance' | 'income' | 'cashflow'
          period_start: string
          period_end: string
          data: Json
          metadata?: Json | null
          status?: 'draft' | 'finalized'
          created_at?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          type?: 'balance' | 'income' | 'cashflow'
          period_start?: string
          period_end?: string
          data?: Json
          metadata?: Json | null
          status?: 'draft' | 'finalized'
          updated_at?: string
        }
      }
      accounting_periods: {
        Row: {
          id: string
          company_id: string
          start_date: string
          end_date: string
          type: 'month' | 'quarter' | 'year'
          status: 'open' | 'closed' | 'locked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          start_date: string
          end_date: string
          type: 'month' | 'quarter' | 'year'
          status?: 'open' | 'closed' | 'locked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          start_date?: string
          end_date?: string
          type?: 'month' | 'quarter' | 'year'
          status?: 'open' | 'closed' | 'locked'
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Company = Database['public']['Tables']['companies']['Row']
export type FinancialStatement = Database['public']['Tables']['financial_statements']['Row']
export type AccountingPeriod = Database['public']['Tables']['accounting_periods']['Row']