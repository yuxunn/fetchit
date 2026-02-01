-- Seed data for users table
INSERT INTO users (id, email, full_name, phone, address, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@fetchit.com', 'Admin User', '+65 9123 4567', '123 Shelter Lane, Singapore', 'admin'),
('00000000-0000-0000-0000-000000000002', 'john.doe@email.com', 'John Doe', '+65 9234 5678', '456 Orchard Road, Singapore', 'user'),
('00000000-0000-0000-0000-000000000003', 'jane.smith@email.com', 'Jane Smith', '+65 9345 6789', '789 Marina Bay, Singapore', 'user'),
('00000000-0000-0000-0000-000000000004', 'volunteer@fetchit.com', 'Maria Tan', '+65 9456 7890', '321 Clementi Ave, Singapore', 'volunteer');

-- Seed data for dogs table
INSERT INTO dogs (name, breed, age, size, weight, gender, status, is_hdb_approved, kennel, description, sterilization_status, vaccination_status, medical_checkup_status, medical_priority, images, adopter_id, adopted_at) VALUES
('Max', 'Golden Retriever', 3, 'Large', 32.50, 'Male', 'Available', true, 'A1', 'Friendly and energetic golden retriever. Loves to play fetch and great with kids!', 'Sterilized', 'Up to Date', 'Completed', 'Normal', ARRAY['https://images.dog.ceo/breeds/retriever-golden/n02099601_1003.jpg'], NULL, NULL),
('Bella', 'Labrador', 2, 'Large', 28.00, 'Female', 'Available', true, 'A2', 'Sweet and gentle lab who loves belly rubs and long walks in the park.', 'Sterilized', 'Up to Date', 'Completed', 'Normal', ARRAY['https://images.dog.ceo/breeds/labrador/n02099712_1181.jpg'], NULL, NULL),
('Charlie', 'German Shepherd', 5, 'Large', 38.00, 'Male', 'Adopted', false, 'B1', 'Smart and loyal. Great guard dog and companion for active families.', 'Sterilized', 'Up to Date', 'Completed', 'Low', ARRAY['https://images.dog.ceo/breeds/germanshepherd/n02106662_10544.jpg'], '00000000-0000-0000-0000-000000000002', '2025-12-15 10:30:00+00'),
('Luna', 'Poodle', 1, 'Small', 8.50, 'Female', 'Available', true, 'A3', 'Adorable toy poodle with a playful personality. Perfect for apartment living.', 'Not Sterilized', 'Incomplete', 'Pending', 'High', ARRAY['https://images.dog.ceo/breeds/poodle-toy/n02113624_1449.jpg'], NULL, NULL),
('Rocky', 'Bulldog', 4, 'Medium', 22.00, 'Male', 'Urgent', true, 'B2', 'Calm and affectionate bulldog. Loves naps and snacks equally!', 'Sterilized', 'Up to Date', 'Completed', 'Normal', ARRAY['https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg'], NULL, NULL),
('Daisy', 'Beagle', 2, 'Medium', 12.50, 'Female', 'Available', true, 'A4', 'Curious and friendly beagle with a great nose. Loves exploring!', 'Sterilized', 'Up to Date', 'Completed', 'Normal', ARRAY['https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg'], NULL, NULL),
('Cooper', 'Border Collie', 3, 'Medium', 18.00, 'Male', 'Available', false, 'B3', 'Highly intelligent and energetic. Needs an active family who can keep up!', 'Sterilized', 'Up to Date', 'Completed', 'Normal', ARRAY['https://images.dog.ceo/breeds/collie-border/n02106166_355.jpg'], NULL, NULL),
('Sadie', 'Shih Tzu', 6, 'Small', 7.20, 'Female', 'Available', true, 'A5', 'Gentle and affectionate lap dog. Perfect companion for seniors.', 'Sterilized', 'Overdue', 'Overdue', 'High', ARRAY['https://images.dog.ceo/breeds/shihtzu/n02086240_4275.jpg'], NULL, NULL),
('Buddy', 'Mixed Breed', 4, 'Medium', 15.00, 'Male', 'Adopted', true, 'C1', 'Lovable mixed breed with a heart of gold. Great with other pets.', 'Sterilized', 'Up to Date', 'Completed', 'Low', ARRAY['https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg'], '00000000-0000-0000-0000-000000000003', '2026-01-05 14:20:00+00'),
('Molly', 'Corgi', 2, 'Small', 11.00, 'Female', 'Available', true, 'A6', 'Short-legged cutie with endless energy and personality. Royal companion!', 'Not Sterilized', 'Incomplete', 'Pending', 'Urgent', ARRAY['https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1226.jpg'], NULL, NULL);

-- Seed data for medical_history table
INSERT INTO medical_history (dog_id, name, date_archived, shelter, status, description) VALUES
(1, 'Annual Checkup & Vaccinations', '2026-01-15 14:30:00+00', 'FetchIt Main Shelter', 'Completed', 'Annual checkup and vaccinations'),
(1, 'Dental Cleaning', '2026-01-20 10:15:00+00', 'FetchIt Main Shelter', 'Completed', 'Dental cleaning procedure'),
(2, 'Health Examination', '2026-01-10 09:45:00+00', 'FetchIt Main Shelter', 'Completed', 'Complete health examination'),
(3, 'Minor Injury Surgery', '2025-12-20 16:20:00+00', 'FetchIt Main Shelter', 'Completed', 'Surgery for minor injury'),
(4, 'Grooming & Health Check', '2026-01-05 11:00:00+00', 'FetchIt Main Shelter', 'Pending', 'Scheduled grooming and health check'),
(5, 'Vaccination & Blood Work', '2026-01-18 13:30:00+00', 'FetchIt Main Shelter', 'Completed', 'Vaccination and blood work'),
(6, 'Ear Infection Treatment', '2026-01-12 15:45:00+00', 'FetchIt Main Shelter', 'Completed', 'Treatment for ear infection'),
(7, 'Complete Physical Exam', '2026-01-08 10:30:00+00', 'FetchIt Main Shelter', 'Completed', 'Complete physical examination'),
(8, 'Nail Trim & Checkup', '2026-01-22 14:00:00+00', 'FetchIt Main Shelter', 'Incomplete', 'Nail trim and routine checkup'),
(9, 'Emergency Visit', '2025-12-28 18:30:00+00', 'FetchIt Main Shelter', 'Completed', 'Emergency visit due to injury'),
(10, 'Annual Vaccinations', '2026-01-14 11:15:00+00', 'FetchIt Main Shelter', 'Pending', 'Annual vaccinations due');

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

-- Create test auth user for local development
-- This matches the admin user in the users table for authentication
DELETE FROM auth.users WHERE email = 'admin@fetchit.com';

INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  confirmation_token, 
  email_change, 
  email_change_token_new, 
  recovery_token
) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  '00000000-0000-0000-0000-000000000001', 
  'authenticated', 
  'authenticated', 
  'admin@fetchit.com', 
  crypt('password123', gen_salt('bf')), 
  NOW(), 
  '{"provider":"email","providers":["email"]}', 
  '{}', 
  NOW(), 
  NOW(), 
  '', 
  '', 
  '', 
  ''
);
