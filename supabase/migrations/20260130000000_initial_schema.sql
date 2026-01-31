-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'volunteer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dogs table
CREATE TABLE IF NOT EXISTS dogs (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER,
    size TEXT CHECK (size IN ('Small', 'Medium', 'Large')),
    weight NUMERIC(5, 2),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Adopted', 'Pending')),
    is_hdb_approved BOOLEAN DEFAULT false,
    kennel TEXT,
    description TEXT,
    sterilization_status TEXT DEFAULT 'Pending' CHECK (sterilization_status IN ('Completed', 'Incomplete', 'Pending')),
    vaccination_status TEXT DEFAULT 'Pending' CHECK (vaccination_status IN ('Completed', 'Incomplete', 'Pending')),
    medical_checkup_status TEXT DEFAULT 'Pending' CHECK (medical_checkup_status IN ('Completed', 'Incomplete', 'Pending')),
    medical_priority TEXT DEFAULT 'Normal' CHECK (medical_priority IN ('Low', 'Normal', 'High')),
    images TEXT[] DEFAULT '{}',
    adopter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    adopted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_history table
CREATE TABLE IF NOT EXISTS medical_history (
    id BIGSERIAL PRIMARY KEY,
    dog_id BIGINT REFERENCES dogs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date_archived TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    shelter TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Completed', 'Incomplete', 'Pending')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vet_bills table
CREATE TABLE IF NOT EXISTS vet_bills (
    id BIGSERIAL PRIMARY KEY,
    dog_id BIGINT REFERENCES dogs(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchandise table
CREATE TABLE IF NOT EXISTS merchandise (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_dogs_status ON dogs(status);
CREATE INDEX IF NOT EXISTS idx_dogs_gender ON dogs(gender);
CREATE INDEX IF NOT EXISTS idx_dogs_hdb_approved ON dogs(is_hdb_approved);
CREATE INDEX IF NOT EXISTS idx_dogs_adopter_id ON dogs(adopter_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_dog_id ON medical_history(dog_id);
CREATE INDEX IF NOT EXISTS idx_vet_bills_dog_id ON vet_bills(dog_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow users to read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public read access on dogs" ON dogs
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on medical_history" ON medical_history
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on vet_bills" ON vet_bills
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on merchandise" ON merchandise
    FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete (adjust as needed)
CREATE POLICY "Allow authenticated insert on dogs" ON dogs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on dogs" ON dogs
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on dogs" ON dogs
    FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on medical_history" ON medical_history
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on medical_history" ON medical_history
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on medical_history" ON medical_history
    FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on vet_bills" ON vet_bills
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on vet_bills" ON vet_bills
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on vet_bills" ON vet_bills
    FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on merchandise" ON merchandise
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on merchandise" ON merchandise
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on merchandise" ON merchandise
    FOR DELETE USING (true);
