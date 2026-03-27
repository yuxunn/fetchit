-- Create helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policies for users table
CREATE POLICY "Allow admins to read all users" ON users
    FOR SELECT USING (is_admin());

CREATE POLICY "Allow admins to insert users" ON users
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Allow admins to update all users" ON users
    FOR UPDATE USING (is_admin());

CREATE POLICY "Allow admins to delete users" ON users
    FOR DELETE USING (is_admin());
