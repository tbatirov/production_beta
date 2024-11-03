-- Create enum types
create type statement_type as enum ('balance', 'income', 'cashflow');
create type statement_status as enum ('draft', 'finalized');

-- Create financial_statements table if it doesn't exist
create table if not exists financial_statements (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid references companies(id) on delete cascade not null,
    type statement_type not null,
    period_start timestamptz not null,
    period_end timestamptz not null,
    data jsonb not null,
    metadata jsonb default '{}'::jsonb,
    status statement_status default 'draft',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add indexes
create index if not exists idx_financial_statements_company_id on financial_statements(company_id);
create index if not exists idx_financial_statements_type on financial_statements(type);
create index if not exists idx_financial_statements_period on financial_statements(period_start, period_end);
create index if not exists idx_financial_statements_status on financial_statements(status);
create index if not exists idx_financial_statements_created_at on financial_statements(created_at);

-- Enable RLS
alter table financial_statements enable row level security;

-- Add RLS policies
create policy "Users can view their own statements"
    on financial_statements for select
    using (
        exists (
            select 1 from companies
            where companies.id = financial_statements.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can insert their own statements"
    on financial_statements for insert
    with check (
        exists (
            select 1 from companies
            where companies.id = financial_statements.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can update their own statements"
    on financial_statements for update
    using (
        exists (
            select 1 from companies
            where companies.id = financial_statements.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can delete their own statements"
    on financial_statements for delete
    using (
        exists (
            select 1 from companies
            where companies.id = financial_statements.company_id
            and companies.user_id = auth.uid()
        )
    );

-- Add trigger for updated_at
create trigger set_timestamp_financial_statements
    before update on financial_statements
    for each row
    execute function update_updated_at_column();