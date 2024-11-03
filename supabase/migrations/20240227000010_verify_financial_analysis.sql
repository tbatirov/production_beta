-- First, verify the table exists and has correct structure
create or replace function verify_financial_analysis_table()
returns void as $$
begin
    -- Drop existing table if it needs to be recreated
    drop table if exists financial_analysis cascade;

    -- Create financial_analysis table with proper structure
    create table financial_analysis (
        id uuid primary key default uuid_generate_v4(),
        company_id uuid not null,
        period varchar(7) not null check (period ~ '^\d{4}-\d{2}$'), -- Ensures YYYY-MM format
        statements jsonb not null check (jsonb_typeof(statements) = 'object'),
        ratios jsonb not null check (jsonb_typeof(ratios) = 'object'),
        analysis jsonb not null check (jsonb_typeof(analysis) = 'object'),
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        
        -- Add foreign key constraint
        constraint fk_company
            foreign key (company_id)
            references companies(id)
            on delete cascade,
            
        -- Ensure unique company-period combination
        constraint financial_analysis_company_period_key 
            unique(company_id, period)
    );

    -- Create indexes for better performance
    create index if not exists idx_financial_analysis_company_id 
        on financial_analysis(company_id);
    create index if not exists idx_financial_analysis_period 
        on financial_analysis(period);
    create index if not exists idx_financial_analysis_created_at 
        on financial_analysis(created_at);

    -- Enable RLS
    alter table financial_analysis enable row level security;

    -- Create RLS policies with proper auth checks
    create policy "Users can view their own analyses"
        on financial_analysis for select
        using (
            exists (
                select 1 from companies
                where companies.id = financial_analysis.company_id
                and companies.user_id = auth.uid()::uuid
                and auth.role() = 'authenticated'
            )
        );

    create policy "Users can insert their own analyses"
        on financial_analysis for insert
        with check (
            exists (
                select 1 from companies
                where companies.id = financial_analysis.company_id
                and companies.user_id = auth.uid()::uuid
                and auth.role() = 'authenticated'
            )
        );

    create policy "Users can update their own analyses"
        on financial_analysis for update
        using (
            exists (
                select 1 from companies
                where companies.id = financial_analysis.company_id
                and companies.user_id = auth.uid()::uuid
                and auth.role() = 'authenticated'
            )
        );

    create policy "Users can delete their own analyses"
        on financial_analysis for delete
        using (
            exists (
                select 1 from companies
                where companies.id = financial_analysis.company_id
                and companies.user_id = auth.uid()::uuid
                and auth.role() = 'authenticated'
            )
        );

    -- Add trigger for updated_at
    create trigger set_timestamp_financial_analysis
        before update on financial_analysis
        for each row
        execute function update_updated_at_column();
end;
$$ language plpgsql;