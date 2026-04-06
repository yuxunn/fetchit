-- Temporarily disable the trigger to test if it's causing the issue
DROP TRIGGER IF EXISTS on_user_created ON users;
