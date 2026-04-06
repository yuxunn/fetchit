-- Drop conflicting document policies
DROP POLICY IF EXISTS "Allow admins to read admin-only documents" ON documents;
DROP POLICY IF EXISTS "Allow admins and volunteers to read their documents" ON documents;
DROP POLICY IF EXISTS "Allow users to read their own documents" ON documents;
DROP POLICY IF EXISTS "Allow public to read public documents" ON documents;

-- Recreate with clear, role-based policies

-- 1. Anyone can read public documents
CREATE POLICY "Allow public to read public documents" ON documents
    FOR SELECT USING (visibility = 'public');

-- 2. Admins can read all administrator-only documents
CREATE POLICY "Allow admins to read admin-only documents" ON documents
    FOR SELECT USING (
        visibility = 'administrators-only' 
        AND is_admin()
    );

-- 3. Admins and volunteers can read administrators-volunteers documents
CREATE POLICY "Allow admins and volunteers to read shared documents" ON documents
    FOR SELECT USING (
        visibility = 'administrators-volunteers' 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'volunteer')
        )
    );

-- 4. Users can always read their own uploaded documents (regardless of visibility)
CREATE POLICY "Allow users to read own documents" ON documents
    FOR SELECT USING (uploaded_by = auth.uid());
