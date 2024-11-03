-- Insert demo user if not exists
do $$
declare
  demo_user_id uuid;
begin
  -- First check if the demo user already exists
  select id into demo_user_id
  from auth.users
  where email = 'demo@example.com';

  -- If demo user doesn't exist, create it
  if demo_user_id is null then
    -- Insert into auth.users
    insert into auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) values (
      uuid_generate_v4(),
      'demo@example.com',
      crypt('Demo@123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Demo User"}',
      false,
      'authenticated'
    ) returning id into demo_user_id;

    -- Insert a demo company for the demo user
    insert into companies (
      user_id,
      name,
      industry,
      description,
      email
    ) values (
      demo_user_id,
      'Demo Company',
      'Technology',
      'A demo company for testing purposes',
      'demo@example.com'
    );
  end if;
end;
$$;