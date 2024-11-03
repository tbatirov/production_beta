-- Drop existing policies
drop policy if exists "Users can view their own analyses" on financial_analysis;
drop policy if exists "Users can insert their own analyses" on financial_analysis;
drop policy if exists "Users can update their own analyses" on financial_analysis;
drop policy if exists "Users can delete their own analyses" on financial_analysis;

-- Create updated RLS policies with proper UUID casting and auth checks
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