export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  OWNER_SECRET_KEY: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

export interface UserTokenPayload {
  id: string;
  email: string;
  role: 'owner' | 'resident';
  pg_id?: string;
  iat?: number;
  exp?: number;
}

export interface PGProperty {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  google_maps_link: string;
  owner_name: string;
  mobile_number: string;
  whatsapp_number: string;
  created_at?: string;
  updated_at?: string;
}
