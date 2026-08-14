-- Migration 0003: Multi-PG Support
CREATE TABLE IF NOT EXISTS pg_properties (
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

-- Seed Default Multi-PG Properties
INSERT OR IGNORE INTO pg_properties (id, name, tagline, description, address, google_maps_link, owner_name, mobile_number, whatsapp_number) VALUES 
('pg_1', 'PG Connect Luxury (Main Branch)', 'Comfortable Living, Connected Digitally', 'Premium PG accommodation in Koramangala featuring high-speed Wi-Fi, 3-time daily meals, and modern amenities.', '124, Sunrise Avenue, Near Tech Park, Koramangala, Bengaluru - 560034', 'https://maps.google.com', 'Mr. Rajesh Verma', '+91 98765 43210', '919876543210'),
('pg_2', 'PG Connect Executive (HSR Layout)', 'Executive Stay for Tech Professionals', 'Modern luxury PG accommodation in HSR Layout Sector 2 with split AC rooms, rooftop dining, and fitness center.', '58, 14th Main, HSR Layout Sector 2, Bengaluru - 560102', 'https://maps.google.com', 'Mr. Rajesh Verma', '+91 98765 43210', '919876543210'),
('pg_3', 'PG Connect Prime (Whitefield)', 'Spacious Living Near ITPL', 'Spacious executive PG in Whitefield with balcony rooms, high-speed fiber, and 24/7 security.', '88, ECC Road, Near ITPL, Whitefield, Bengaluru - 560066', 'https://maps.google.com', 'Mr. Rajesh Verma', '+91 98765 43210', '919876543210');

-- Add pg_id columns to scoped tables if not exists
-- (SQLite supports ADD COLUMN)
ALTER TABLE resident_profiles ADD COLUMN pg_id TEXT DEFAULT 'pg_1';
ALTER TABLE rooms ADD COLUMN pg_id TEXT DEFAULT 'pg_1';
ALTER TABLE weekly_menus ADD COLUMN pg_id TEXT DEFAULT 'pg_1';
ALTER TABLE fee_records ADD COLUMN pg_id TEXT DEFAULT 'pg_1';
ALTER TABLE complaints ADD COLUMN pg_id TEXT DEFAULT 'pg_1';
ALTER TABLE facilities ADD COLUMN pg_id TEXT DEFAULT 'pg_1';
