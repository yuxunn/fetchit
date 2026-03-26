-- Function to delete auth user when user is deleted from users table
CREATE OR REPLACE FUNCTION delete_auth_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Trigger to automatically delete auth user when user is deleted
CREATE TRIGGER on_user_deleted
  BEFORE DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user();
