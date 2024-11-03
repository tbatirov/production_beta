-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create companies table if not exists
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  industry text,
  description text,
  user_id uuid references auth.users not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create financial_analysis table
create table if not exists financial_analysis (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  period text not null,
  statements jsonb not null,
  ratios jsonb not null,
  analysis jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Add unique constraint for company and period
  unique(company_id, period)
);

-- Add RLS policies for companies
alter table companies enable row level security;

create policy "Users can view their own companies"
  on companies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own companies"
  on companies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own companies"
  on companies for update
  using (auth.uid() = user_id);

-- Add RLS policies for financial_analysis
alter table financial_analysis enable row level security;

create policy "Users can view analysis for their companies"
  on financial_analysis for select
  using (
    exists (
      select 1 from companies
      where companies.id = financial_analysis.company_id
      and companies.user_id = auth.uid()
    )
  );

create policy "Users can insert analysis for their companies"
  on financial_analysis for insert
  with check (
    exists (
      select 1 from companies
      where companies.id = financial_analysis.company_id
      and companies.user_id = auth.uid()
    )
  );

create policy "Users can update analysis for their companies"
  on financial_analysis for update
  using (
    exists (
      select 1 from companies
      where companies.id = financial_analysis.company_id
      and companies.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index idx_companies_user_id on companies(user_id);
create index idx_financial_analysis_company_id on financial_analysis(company_id);
create index idx_financial_analysis_period on financial_analysis(period);