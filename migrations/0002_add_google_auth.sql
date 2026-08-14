-- Migration 0002: Add Google Authentication fields to users table
ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'password';
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
