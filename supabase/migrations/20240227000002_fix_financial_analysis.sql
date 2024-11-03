-- Drop existing table if it exists
drop table if exists financial_analysis;

-- Create financial_analysis table with correct schema
create table financial_analysis (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid references companies(id) on delete cascade not null,
    period varchar(7) not null,  -- Format: YYYY-MM
    statements jsonb not null,
    ratios jsonb not null,
    analysis jsonb not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    -- Add unique constraint for company and period
    unique(company_id, period)
);

-- Add indexes for better performance
create index idx_financial_analysis_company_id on financial_analysis(company_id);
create index idx_financial_analysis_period on financial_analysis(period);
create index idx_financial_analysis_created_at on financial_analysis(created_at);

-- Enable RLS
alter table financial_analysis enable row level security;

-- Add RLS policies
create policy "Users can view their own analyses"
    on financial_analysis for select
    using (
        exists (
            select 1 from companies
            where companies.id = financial_analysis.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can insert their own analyses"
    on financial_analysis for insert
    with check (
        exists (
            select 1 from companies
            where companies.id = financial_analysis.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can update their own analyses"
    on financial_analysis for update
    using (
        exists (
            select 1 from companies
            where companies.id = financial_analysis.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can delete their own analyses"
    on financial_analysis for delete
    using (
        exists (
            select 1 from companies
            where companies.id = financial_analysis.company_id
            and companies.user_id = auth.uid()
        )
    );

-- Add trigger for updated_at
create trigger set_timestamp_financial_analysis
    before update on financial_analysis
    for each row
    execute function update_updated_at_column();