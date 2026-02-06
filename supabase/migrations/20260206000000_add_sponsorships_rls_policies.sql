-- Add RLS policies for sponsorships tables
-- Allow authenticated users to read sponsorships
CREATE POLICY "Allow authenticated read on sponsorships" ON sponsorships
FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to insert sponsorships
CREATE POLICY "Allow authenticated insert on sponsorships" ON sponsorships
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update sponsorships
CREATE POLICY "Allow authenticated update on sponsorships" ON sponsorships
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete sponsorships
CREATE POLICY "Allow authenticated delete on sponsorships" ON sponsorships
FOR DELETE TO authenticated
USING (true);

-- Allow authenticated users to read sponsored_dogs
CREATE POLICY "Allow authenticated read on sponsored_dogs" ON sponsored_dogs
FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to insert sponsored_dogs
CREATE POLICY "Allow authenticated insert on sponsored_dogs" ON sponsored_dogs
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update sponsored_dogs
CREATE POLICY "Allow authenticated update on sponsored_dogs" ON sponsored_dogs
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete sponsored_dogs
CREATE POLICY "Allow authenticated delete on sponsored_dogs" ON sponsored_dogs
FOR DELETE TO authenticated
USING (true);