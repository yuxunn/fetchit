-- Function to automatically create auth user when user is inserted
CREATE OR REPLACE FUNCTION create_auth_user_on_insert()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  random_password TEXT;
  new_user_id UUID;
BEGIN
  -- Generate UUID for the new user if not provided
  IF NEW.id IS NULL THEN
    new_user_id := gen_random_uuid();
    NEW.id := new_user_id;
  ELSE
    new_user_id := NEW.id;
  END IF;

  -- Generate a random password (user will reset it)
  random_password := md5(random()::text || clock_timestamp()::text);
  
  -- Create auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    NEW.email,
    extensions.crypt(random_password, extensions.gen_salt('bf'::text)),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object('full_name', NEW.full_name),
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger on users table (BEFORE INSERT so we can set the ID)
DROP TRIGGER IF EXISTS on_user_created ON users;
CREATE TRIGGER on_user_created
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_auth_user_on_insert();
