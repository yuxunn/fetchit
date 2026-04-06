-- Temporarily allow anyone to access users table (completely permissive for debugging)
DROP POLICY IF EXISTS "Allow admins to read all users" ON users;
DROP POLICY IF EXISTS "Allow admins to insert users" ON users;
DROP POLICY IF EXISTS "Allow authenticated to insert users" ON users;
DROP POLICY IF EXISTS "Allow all to insert users" ON users;

CREATE POLICY "Allow all to read users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Allow all to insert users" ON users
    FOR INSERT WITH CHECK (true);
