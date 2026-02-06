-- Create sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
    id BIGSERIAL PRIMARY KEY,
    sponsor_name TEXT NOT NULL,
    sponsor_contact TEXT,
    type TEXT NOT NULL CHECK (type IN ('general', 'medical', 'food', 'shelter')),
    amount NUMERIC(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sponsored_dogs junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS sponsored_dogs (
    id BIGSERIAL PRIMARY KEY,
    sponsorship_id BIGINT REFERENCES sponsorships(id) ON DELETE CASCADE,
    dog_id BIGINT REFERENCES dogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sponsorship_id, dog_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_name ON sponsorships(sponsor_name);
CREATE INDEX IF NOT EXISTS idx_sponsorships_type ON sponsorships(type);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON sponsorships(status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_start_date ON sponsorships(start_date);
CREATE INDEX IF NOT EXISTS idx_sponsorships_end_date ON sponsorships(end_date);
CREATE INDEX IF NOT EXISTS idx_sponsored_dogs_sponsorship_id ON sponsored_dogs(sponsorship_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_dogs_dog_id ON sponsored_dogs(dog_id);

-- Enable Row Level Security (RLS)
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_dogs ENABLE ROW LEVEL SECURITY;