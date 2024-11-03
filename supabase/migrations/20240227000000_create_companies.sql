-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create companies table
create table companies (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null,
    name text not null,
    industry text,
    description text,
    email text,
    phone text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create indexes
create index idx_companies_user_id on companies(user_id);
create index idx_companies_created_at on companies(created_at);

-- Enable RLS
alter table companies enable row level security;

-- Create RLS policies
create policy "Users can view their own companies"
    on companies for select
    using (user_id = auth.uid()::uuid);

create policy "Users can insert their own companies"
    on companies for insert
    with check (user_id = auth.uid()::uuid);

create policy "Users can update their own companies"
    on companies for update
    using (user_id = auth.uid()::uuid);

create policy "Users can delete their own companies"
    on companies for delete
    using (user_id = auth.uid()::uuid);

-- Create trigger for updated_at
create trigger set_timestamp_companies
    before update on companies
    for each row
    execute function update_updated_at_column();