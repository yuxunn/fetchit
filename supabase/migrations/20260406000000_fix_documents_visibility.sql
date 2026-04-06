-- Fix the RLS policy for admin-only documents to match the check constraint
DROP POLICY IF EXISTS "Allow admins to read admin-only documents" ON documents;

CREATE POLICY "Allow admins to read admin-only documents" ON documents
    FOR SELECT USING (visibility = 'administrators-only' AND uploaded_by = auth.uid());

-- Also add a policy for administrators-volunteers visibility
CREATE POLICY "Allow admins and volunteers to read their documents" ON documents
    FOR SELECT USING (visibility = 'administrators-volunteers' AND uploaded_by = auth.uid());
