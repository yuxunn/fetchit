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
INSERT INTO vet_bills (dog_id, amount, bill_date, description, treatment_name, status, payment_status, category) VALUES
(1, 150.00, '2026-01-15', 'Annual checkup and vaccinations', 'Annual Checkup', 'Stable', 'Paid', 'Checkup'),
(1, 85.50, '2026-01-20', 'Dental cleaning', 'Dental Cleaning', 'Stable', 'Paid', 'Dental'),
(2, 120.00, '2026-01-10', 'Health examination', 'Health Exam', 'Stable', 'Paid', 'Checkup'),
(3, 200.00, '2025-12-20', 'Surgery for minor injury', 'Minor Surgery', 'Critical', 'Paid', 'Surgery'),
(4, 95.00, '2026-01-05', 'Grooming and health check', 'Grooming & Checkup', 'Stable', 'Unpaid', 'General'),
(5, 175.00, '2026-01-18', 'Vaccination and blood work', 'Vaccination Package', 'Stable', 'Paid', 'Vaccination'),
(6, 110.00, '2026-01-12', 'Ear infection treatment', 'Infection Treatment', 'Critical', 'Unpaid', 'Medication'),
(7, 140.00, '2026-01-08', 'Complete physical exam', 'Physical Exam', 'Stable', 'Paid', 'Checkup'),
(8, 80.00, '2026-01-22', 'Nail trim and checkup', 'Nail Trim', 'Stable', 'Unpaid', 'General'),
(9, 190.00, '2025-12-28', 'Emergency visit', 'Emergency Care', 'Critical', 'Paid', 'Emergency'),
(10, 125.00, '2026-01-14', 'Annual vaccinations', 'Vaccinations', 'Stable', 'Unpaid', 'Vaccination');

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

-- Seed data for sponsorships table
INSERT INTO sponsorships (sponsor_name, sponsor_contact, type, amount, start_date, end_date, status) VALUES
('John Smith', 'john.smith@email.com', 'general', 500.00, '2026-01-01', '2026-12-31', 'active'),
('Sarah Johnson', 'sarah.j@email.com', 'medical', 750.00, '2026-01-15', '2026-12-31', 'active'),
('Mike Chen', 'mike.chen@company.com', 'food', 300.00, '2026-02-01', '2026-07-31', 'active'),
('Animal Lovers Foundation', 'contact@animal-lovers.org', 'shelter', 1000.00, '2025-12-01', '2026-11-30', 'active'),
('Pet Care Inc', 'info@petcare.com', 'medical', 600.00, '2025-11-01', '2026-10-31', 'active'),
('Green Valley Vet Clinic', 'clinic@greenvalley.com', 'general', 400.00, '2026-01-20', '2026-06-30', 'active'),
('Old Town Bakery', 'bakery@oldtown.com', 'food', 250.00, '2026-02-10', '2026-08-31', 'active'),
('Corporate Sponsors Ltd', 'sponsors@corporate.com', 'shelter', 1500.00, '2025-10-01', '2026-09-30', 'active'),
('Dr. Emily Davis', 'emily.davis@vet.com', 'medical', 800.00, '2026-01-05', '2026-12-31', 'active'),
('Local Business Group', 'group@localbiz.com', 'general', 350.00, '2026-02-15', '2026-05-31', 'active');

-- Seed data for sponsored_dogs table
INSERT INTO sponsored_dogs (sponsorship_id, dog_id) VALUES
(1, 1), -- John Smith sponsors Max
(1, 2), -- John Smith also sponsors Bella
(2, 4), -- Sarah Johnson sponsors Luna
(3, 6), -- Mike Chen sponsors Daisy
(4, 3), -- Animal Lovers Foundation sponsors Charlie
(4, 9), -- Animal Lovers Foundation also sponsors Buddy
(5, 5), -- Pet Care Inc sponsors Rocky
(6, 7), -- Green Valley Vet Clinic sponsors Cooper
(7, 8), -- Old Town Bakery sponsors Sadie
(8, 10), -- Corporate Sponsors Ltd sponsors Molly
(9, 1), -- Dr. Emily Davis sponsors Max
(10, 2); -- Local Business Group sponsors Bella
