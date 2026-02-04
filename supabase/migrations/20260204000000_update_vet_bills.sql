-- Update vet_bills table with additional fields
ALTER TABLE vet_bills 
ADD COLUMN IF NOT EXISTS treatment_name TEXT NOT NULL DEFAULT 'General Treatment',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Stable' CHECK (status IN ('Critical', 'Stable')),
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid', 'Unpaid')),
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General' CHECK (category IN ('Surgery', 'Vaccination', 'Checkup', 'Emergency', 'Medication', 'Dental', 'General'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_vet_bills_status ON vet_bills(status);
CREATE INDEX IF NOT EXISTS idx_vet_bills_payment_status ON vet_bills(payment_status);
CREATE INDEX IF NOT EXISTS idx_vet_bills_category ON vet_bills(category);
CREATE INDEX IF NOT EXISTS idx_vet_bills_bill_date ON vet_bills(bill_date);
