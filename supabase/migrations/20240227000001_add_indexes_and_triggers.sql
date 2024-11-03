-- Add missing indexes
create index if not exists idx_companies_created_at on companies(created_at);
create index if not exists idx_companies_updated_at on companies(updated_at);
create index if not exists idx_financial_analysis_created_at on financial_analysis(created_at);
create index if not exists idx_financial_analysis_updated_at on financial_analysis(updated_at);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger set_timestamp_companies
  before update on companies
  for each row
  execute function update_updated_at_column();

create trigger set_timestamp_financial_analysis
  before update on financial_analysis
  for each row
  execute function update_updated_at_column();

-- Add cascade delete for related tables
alter table financial_analysis
  drop constraint if exists financial_analysis_company_id_fkey,
  add constraint financial_analysis_company_id_fkey
    foreign key (company_id)
    references companies(id)
    on delete cascade;