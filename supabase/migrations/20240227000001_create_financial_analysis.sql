-- Create financial_analysis table
create table financial_analysis (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid not null,
    period varchar(7) not null check (period ~ '^\d{4}-\d{2}$'),
    statements jsonb not null,
    ratios jsonb not null,
    analysis jsonb not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint fk_company
        foreign key (company_id)
        references companies(id)
        on delete cascade,
        
    constraint financial_analysis_company_period_key 
        unique(company_id, period)
);

-- Create indexes
create index idx_financial_analysis_company_id on financial_analysis(company_id);
create index idx_financial_analysis_period on financial_analysis(period);
create index idx_financial_analysis_created_at on financial_analysis(created_at);

-- Enable RLS
alter table financial_analysis enable row level security;

-- Create RLS policies
create policy "Users can view their own analyses"
    on financial_analysis for select
    using (exists (
        select 1 from companies
        where companies.id = financial_analysis.company_id
        and companies.user_id = auth.uid()::uuid
    ));

create policy "Users can insert their own analyses"
    on financial_analysis for insert
    with check (exists (
        select 1 from companies
        where companies.id = financial_analysis.company_id
        and companies.user_id = auth.uid()::uuid
    ));

create policy "Users can update their own analyses"
    on financial_analysis for update
    using (exists (
        select 1 from companies
        where companies.id = financial_analysis.company_id
        and companies.user_id = auth.uid()::uuid
    ));

create policy "Users can delete their own analyses"
    on financial_analysis for delete
    using (exists (
        select 1 from companies
        where companies.id = financial_analysis.company_id
        and companies.user_id = auth.uid()::uuid
    ));