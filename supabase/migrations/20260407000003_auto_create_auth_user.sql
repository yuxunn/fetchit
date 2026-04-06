-- Function to automatically create auth user when user is inserted
CREATE OR REPLACE FUNCTION create_auth_user_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  random_password TEXT;
BEGIN
  -- Generate a random password (user will reset it)
  random_password := encode(gen_random_bytes(32), 'hex');
  
  -- Create auth user if it doesn't exist
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
    NEW.id,
    '00000000-0000-0000-0000-000000000000',
    NEW.email,
    crypt(random_password, gen_salt('bf')),
    NOW(), -- Auto-confirm email
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on users table
DROP TRIGGER IF EXISTS on_user_created ON users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_auth_user_on_insert();
