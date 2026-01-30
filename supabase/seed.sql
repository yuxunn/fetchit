-- Seed data for users table
INSERT INTO users (id, email, full_name, phone, address, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@fetchit.com', 'Admin User', '+65 9123 4567', '123 Shelter Lane, Singapore', 'admin'),
('00000000-0000-0000-0000-000000000002', 'john.doe@email.com', 'John Doe', '+65 9234 5678', '456 Orchard Road, Singapore', 'user'),
('00000000-0000-0000-0000-000000000003', 'jane.smith@email.com', 'Jane Smith', '+65 9345 6789', '789 Marina Bay, Singapore', 'user'),
('00000000-0000-0000-0000-000000000004', 'volunteer@fetchit.com', 'Maria Tan', '+65 9456 7890', '321 Clementi Ave, Singapore', 'volunteer');

-- Seed data for dogs table
INSERT INTO dogs (name, breed, gender, status, is_hdb_approved, kennel, description, adopter_id, adopted_at) VALUES
('Max', 'Golden Retriever', 'Male', 'Available', true, 'A1', 'Friendly and energetic golden retriever. Loves to play fetch and great with kids!', NULL, NULL),
('Bella', 'Labrador', 'Female', 'Available', true, 'A2', 'Sweet and gentle lab who loves belly rubs and long walks in the park.', NULL, NULL),
('Charlie', 'German Shepherd', 'Male', 'Adopted', false, 'B1', 'Smart and loyal. Great guard dog and companion for active families.', '00000000-0000-0000-0000-000000000002', '2025-12-15 10:30:00+00'),
('Luna', 'Poodle', 'Female', 'Available', true, 'A3', 'Adorable toy poodle with a playful personality. Perfect for apartment living.', NULL, NULL),
('Rocky', 'Bulldog', 'Male', 'Pending', true, 'B2', 'Calm and affectionate bulldog. Loves naps and snacks equally!', NULL, NULL),
('Daisy', 'Beagle', 'Female', 'Available', true, 'A4', 'Curious and friendly beagle with a great nose. Loves exploring!', NULL, NULL),
('Cooper', 'Border Collie', 'Male', 'Available', false, 'B3', 'Highly intelligent and energetic. Needs an active family who can keep up!', NULL, NULL),
('Sadie', 'Shih Tzu', 'Female', 'Available', true, 'A5', 'Gentle and affectionate lap dog. Perfect companion for seniors.', NULL, NULL),
('Buddy', 'Mixed Breed', 'Male', 'Adopted', true, 'C1', 'Lovable mixed breed with a heart of gold. Great with other pets.', '00000000-0000-0000-0000-000000000003', '2026-01-05 14:20:00+00'),
('Molly', 'Corgi', 'Female', 'Available', true, 'A6', 'Short-legged cutie with endless energy and personality. Royal companion!', NULL, NULL);

-- Seed data for vet_bills table
INSERT INTO vet_bills (dog_id, amount, bill_date, description) VALUES
(1, 150.00, '2026-01-15', 'Annual checkup and vaccinations'),
(1, 85.50, '2026-01-20', 'Dental cleaning'),
(2, 120.00, '2026-01-10', 'Health examination'),
(3, 200.00, '2025-12-20', 'Surgery for minor injury'),
(4, 95.00, '2026-01-05', 'Grooming and health check'),
(5, 175.00, '2026-01-18', 'Vaccination and blood work'),
(6, 110.00, '2026-01-12', 'Ear infection treatment'),
(7, 140.00, '2026-01-08', 'Complete physical exam'),
(8, 80.00, '2026-01-22', 'Nail trim and checkup'),
(9, 190.00, '2025-12-28', 'Emergency visit'),
(10, 125.00, '2026-01-14', 'Annual vaccinations');

-- Seed data for merchandise table
INSERT INTO merchandise (name, category, price, stock_quantity) VALUES
('Premium Dog Food (20kg)', 'Food', 45.99, 150),
('Puppy Training Treats', 'Treats', 12.50, 200),
('Leather Collar', 'Accessories', 18.99, 75),
('Retractable Leash', 'Accessories', 25.00, 60),
('Dog Bed (Large)', 'Furniture', 89.99, 30),
('Chew Toys Set', 'Toys', 15.99, 120),
('Stainless Steel Bowl', 'Bowls', 22.50, 85),
('Dog Shampoo', 'Grooming', 14.99, 100),
('Fetch Ball', 'Toys', 8.99, 180),
('Travel Crate', 'Accessories', 65.00, 25),
('Dental Sticks', 'Treats', 16.50, 140),
('Winter Jacket', 'Clothing', 35.99, 40);
