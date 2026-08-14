-- PG Connect - Cloudflare D1 Database Schema & Seed Data (Multi-PG & Google Auth Enabled)

DROP TABLE IF EXISTS poll_votes;
DROP TABLE IF EXISTS poll_options;
DROP TABLE IF EXISTS food_polls;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS fee_records;
DROP TABLE IF EXISTS weekly_menus;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS resident_profiles;
DROP TABLE IF EXISTS pg_branches;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS pg_properties;
DROP TABLE IF EXISTS pg_information;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    salt TEXT,
    role TEXT CHECK(role IN ('owner', 'resident')) NOT NULL DEFAULT 'resident',
    auth_provider TEXT DEFAULT 'password', -- 'password' | 'google'
    google_id TEXT,
    avatar_url TEXT,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PG Properties Table
CREATE TABLE pg_properties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    google_maps_link TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Resident Profiles Table (Associated with a single PG via pg_id)
CREATE TABLE resident_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
    pg_id TEXT NOT NULL DEFAULT 'pg_1' FOREIGN KEY REFERENCES pg_properties(id),
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    room_number TEXT NOT NULL DEFAULT 'Unassigned',
    branch TEXT NOT NULL DEFAULT 'Main Branch',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rooms Table (Scoped to PG)
CREATE TABLE rooms (
    id TEXT PRIMARY KEY,
    pg_id TEXT NOT NULL DEFAULT 'pg_1' FOREIGN KEY REFERENCES pg_properties(id),
    room_number TEXT NOT NULL,
    room_type TEXT NOT NULL,
    sharing_capacity INTEGER NOT NULL DEFAULT 2,
    monthly_rent REAL NOT NULL,
    yearly_rent REAL NOT NULL,
    is_available INTEGER NOT NULL DEFAULT 1,
    facilities TEXT NOT NULL DEFAULT 'Wi-Fi, Hot Water, Housekeeping',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Weekly Menus Table (Scoped to PG)
CREATE TABLE weekly_menus (
    id TEXT PRIMARY KEY,
    pg_id TEXT NOT NULL DEFAULT 'pg_1' FOREIGN KEY REFERENCES pg_properties(id),
    day_of_week TEXT NOT NULL,
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    dinner TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pg_id, day_of_week)
);

-- 6. Global Food Polls Table (GLOBAL - Shared by all PGs)
CREATE TABLE food_polls (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    is_closed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Poll Options Table
CREATE TABLE poll_options (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL FOREIGN KEY REFERENCES food_polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    vote_count INTEGER NOT NULL DEFAULT 0
);

-- 8. Poll Votes Table (Enforces 1 Vote Per Resident per Global Poll)
CREATE TABLE poll_votes (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL FOREIGN KEY REFERENCES food_polls(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL FOREIGN KEY REFERENCES poll_options(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id)
);

-- 9. Fee Records Table (Scoped to PG)
CREATE TABLE fee_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
    pg_id TEXT NOT NULL DEFAULT 'pg_1' FOREIGN KEY REFERENCES pg_properties(id),
    month_year TEXT NOT NULL,
    monthly_fee REAL NOT NULL,
    paid_amount REAL NOT NULL DEFAULT 0,
    balance REAL NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL,
    payment_status TEXT CHECK(payment_status IN ('Paid', 'Partially Paid', 'Pending', 'Overdue')) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Complaints Table (Scoped to PG)
CREATE TABLE complaints (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
    pg_id TEXT NOT NULL DEFAULT 'pg_1' FOREIGN KEY REFERENCES pg_properties(id),
    category TEXT CHECK(category IN ('Food', 'Room', 'Water', 'Electricity', 'Wi-Fi', 'Cleaning', 'Maintenance', 'Other')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK(status IN ('Open', 'In Progress', 'Resolved', 'Closed')) NOT NULL DEFAULT 'Open',
    owner_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Facilities Table (Scoped to PG)
CREATE TABLE facilities (
    id TEXT PRIMARY KEY,
    pg_id TEXT NOT NULL DEFAULT 'pg_1' FOREIGN KEY REFERENCES pg_properties(id),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed Owner User (password: OwnerPass123!)
INSERT INTO users (id, email, password_hash, salt, role, auth_provider) VALUES 
('usr_owner_1', 'owner@pgconnect.com', 'd132d72f16e3926eb6df1620a2e7c4f69747970d45292eb63c46e3e56c5e53ff', 'randomsalt123', 'owner', 'password');

-- Seed Sample Resident Users (password: Resident123!)
INSERT INTO users (id, email, password_hash, salt, role, auth_provider) VALUES 
('usr_res_1', 'rahul.sharma@example.com', 'd132d72f16e3926eb6df1620a2e7c4f69747970d45292eb63c46e3e56c5e53ff', 'randomsalt123', 'resident', 'password'),
('usr_res_2', 'priya.patel@example.com', 'd132d72f16e3926eb6df1620a2e7c4f69747970d45292eb63c46e3e56c5e53ff', 'randomsalt123', 'resident', 'password');

-- Seed PG Properties
INSERT INTO pg_properties (id, name, tagline, description, address, google_maps_link, owner_name, mobile_number, whatsapp_number) VALUES 
('pg_1', 'PG Connect Luxury (Main Branch)', 'Comfortable Living, Connected Digitally', 'Premium PG accommodation in Koramangala featuring high-speed Wi-Fi, organic healthy meals, 24/7 security, and modern amenities.', '124, Sunrise Avenue, Near Tech Park, Koramangala, Bengaluru - 560034', 'https://maps.google.com', 'Mr. Rajesh Verma', '+91 98765 43210', '919876543210'),
('pg_2', 'PG Connect Executive (HSR Layout)', 'Executive Stay for Tech Professionals', 'Modern luxury PG accommodation in HSR Layout Sector 2 with split AC rooms, rooftop dining, and fitness center.', '58, 14th Main, HSR Layout Sector 2, Bengaluru - 560102', 'https://maps.google.com', 'Mr. Rajesh Verma', '+91 98765 43210', '919876543210'),
('pg_3', 'PG Connect Prime (Whitefield)', 'Spacious Living Near ITPL', 'Spacious executive PG in Whitefield with balcony rooms, high-speed fiber, and 24/7 security.', '88, ECC Road, Near ITPL, Whitefield, Bengaluru - 560066', 'https://maps.google.com', 'Mr. Rajesh Verma', '+91 98765 43210', '919876543210');

-- Seed Resident Profiles
INSERT INTO resident_profiles (id, user_id, pg_id, full_name, mobile, room_number, branch, is_active) VALUES 
('prof_res_1', 'usr_res_1', 'pg_1', 'Rahul Sharma', '+91 98765 43210', '101', 'PG Connect Luxury (Main Branch)', 1),
('prof_res_2', 'usr_res_2', 'pg_2', 'Priya Patel', '+91 98765 43211', '201', 'PG Connect Executive (HSR Layout)', 1);

-- Seed Facilities for PG 1
INSERT INTO facilities (id, pg_id, name, icon, description, is_active) VALUES 
('fac_1', 'pg_1', 'High-Speed Wi-Fi', 'Wifi', 'Unlimited 300 Mbps fiber optic Wi-Fi across all floors', 1),
('fac_2', 'pg_1', 'Healthy & Hygienic Meals', 'Utensils', 'Fresh 3-time daily meals prepared with organic ingredients', 1),
('fac_3', 'pg_1', '24/7 Hot Water', 'ShowerHead', 'Solar and electric geyser hot water supply in all bathrooms', 1),
('fac_4', 'pg_1', 'Laundry & Washing', 'Shirt', 'Automatic washing machines and dedicated drying zones', 1),
('fac_5', 'pg_1', 'Daily Housekeeping', 'Sparkles', 'Daily room cleaning and sanitization by professional staff', 1),
('fac_6', 'pg_1', 'CCTV & Security', 'ShieldCheck', 'Round-the-clock CCTV surveillance and biometric door lock', 1),
('fac_7', 'pg_1', 'Covered Parking', 'Car', 'Spacious covered two-wheeler and four-wheeler parking', 1),
('fac_8', 'pg_1', '24/7 Power Backup', 'Zap', '100% generator power backup for uninterrupted work & living', 1);

-- Seed Facilities for PG 2
INSERT INTO facilities (id, pg_id, name, icon, description, is_active) VALUES 
('fac_9', 'pg_2', 'Gigabit Wi-Fi', 'Wifi', 'High-speed 500 Mbps mesh Wi-Fi', 1),
('fac_10', 'pg_2', 'Gourmet Dining', 'Utensils', 'Buffet-style breakfast, lunch, and dinner', 1),
('fac_11', 'pg_2', 'Gym & Fitness', 'Zap', 'Fully equipped rooftop gymnasium', 1),
('fac_12', 'pg_2', 'Covered Parking', 'Car', 'Dedicated parking slots for all residents', 1);

-- Seed Rooms for PG 1 & PG 2
INSERT INTO rooms (id, pg_id, room_number, room_type, sharing_capacity, monthly_rent, yearly_rent, is_available, facilities) VALUES 
('rm_101', 'pg_1', '101', 'Single Deluxe AC', 1, 14000, 168000, 0, 'Private Balcony, Attached Bath, Smart TV, Wi-Fi'),
('rm_102', 'pg_1', '102', '2 Sharing AC', 2, 9500, 114000, 1, 'Attached Bath, Individual Wardrobes, Study Tables, Wi-Fi'),
('rm_103', 'pg_1', '103', '3 Sharing Non-AC', 3, 7000, 84000, 1, 'Spacious Balcony, Individual Locker, Study Table'),
('rm_201', 'pg_2', '201', 'Single Executive AC', 1, 16000, 192000, 0, 'Private Balcony, Smart TV, Workstation, Split AC'),
('rm_202', 'pg_2', '202', '2 Sharing Luxury AC', 2, 11000, 132000, 1, 'Attached Bath, High-speed Fiber, Housekeeping');

-- Seed Weekly Menu for PG 1
INSERT INTO weekly_menus (id, pg_id, day_of_week, breakfast, lunch, dinner) VALUES 
('menu_mon_1', 'pg_1', 'Monday', 'Idli, Vada & Sambar + Tea/Coffee', 'South Indian Meals: Rice, Sambar, Rasam, Beetroot Poriyal & Curd', 'Chapati, Paneer Butter Masala, Jeera Rice & Dal Fry'),
('menu_tue_1', 'pg_1', 'Tuesday', 'Poha, Sev & Mint Chutney + Milk', 'Veg Thali: Chapati, Mix Veg Curry, Rice, Dal Tadka & Salad', 'Phulka, Aloo Gobi Masala, Steamed Rice & Veg Soup'),
('menu_wed_1', 'pg_1', 'Wednesday', 'Masala Dosa & Coconut Chutney + Coffee', 'Veg Pulao, Cucumber Raita, Boiled Egg/Paneer Curry & Pickle', 'Chapati, Kadai Chicken / Kadai Paneer & Steamed Rice'),
('menu_thu_1', 'pg_1', 'Thursday', 'Aloo Paratha & Fresh Curd + Tea', 'North Indian Thali: Phulka, Chana Masala, Rice & Curd', 'Chapati, Capsicum Masala, Rice & Yellow Dal'),
('menu_fri_1', 'pg_1', 'Friday', 'Upma & Tomato Chutney + Tea/Coffee', 'Lemon Rice, Potato Roast, Sambar, Rice & Papad', 'Veg Biryani / Chicken Biryani, Mirchi Ka Salan & Raita'),
('menu_sat_1', 'pg_1', 'Saturday', 'Puri Bhaji + Tea/Coffee', 'Rajma Chawal, Chapati, Mixed Veg & Onion Salad', 'Phulka, Egg Curry / Malai Kofta & Steamed Rice'),
('menu_sun_1', 'pg_1', 'Sunday', 'Mysore Masala Dosa + Filter Coffee', 'Special Feast: Veg Pulao, Paneer Tikka Masala, Gulab Jamun', 'Butter Naan / Chapati, Chicken Korma / Paneer Korma & Ice Cream');

-- Seed Global Food Poll (Accessible by all residents across all PGs)
INSERT INTO food_polls (id, question, start_date, end_date, is_closed) VALUES 
('poll_1', 'What special feast would you prefer for this Sunday Dinner across all branches?', '2026-08-01', '2026-08-20', 0);

INSERT INTO poll_options (id, poll_id, option_text, vote_count) VALUES 
('opt_1', 'poll_1', 'Hyderabadi Chicken Biryani / Paneer Biryani', 18),
('opt_2', 'poll_1', 'Butter Naan + Dal Makhani + Paneer Butter Masala', 12),
('opt_3', 'poll_1', 'Chinese Combo: Veg Fried Rice + Gobi Manchurian', 7);

-- Seed Fee Records
INSERT INTO fee_records (id, user_id, pg_id, month_year, monthly_fee, paid_amount, balance, due_date, payment_status, notes) VALUES 
('fee_1', 'usr_res_1', 'pg_1', 'August 2026', 14000, 14000, 0, '2026-08-05', 'Paid', 'Full rent paid via UPI'),
('fee_2', 'usr_res_2', 'pg_2', 'August 2026', 16000, 10000, 6000, '2026-08-05', 'Partially Paid', 'Advance ₹10,000 received, balance due Aug 15');

-- Seed Complaints
INSERT INTO complaints (id, user_id, pg_id, category, title, description, status, owner_response) VALUES 
('comp_1', 'usr_res_1', 'pg_1', 'Wi-Fi', 'Slow internet speed in Room 101', 'Wi-Fi speed drops below 5 Mbps during peak evening hours (8 PM - 10 PM).', 'In Progress', 'ISP technician has been contacted for bandwidth upgrade by tomorrow morning.'),
('comp_2', 'usr_res_2', 'pg_2', 'Maintenance', 'Balcony light not working in Room 201', 'The outdoor balcony bulb needs replacement.', 'Resolved', 'Replaced on Aug 2.');
