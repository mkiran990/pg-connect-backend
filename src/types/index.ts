export type UserRole = 'owner' | 'resident';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  auth_provider?: 'password' | 'google';
  google_id?: string;
  avatar_url?: string;
  last_login?: string;
  created_at?: string;
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

export interface ResidentProfile {
  id: string;
  user_id: string;
  pg_id?: string;
  pg_name?: string;
  full_name: string;
  mobile: string;
  room_number: string;
  branch: string;
  is_active: number;
  auth_provider?: 'password' | 'google';
  avatar_url?: string;
  last_login?: string;
  user_created_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  pg_id?: string;
  room_number: string;
  room_type: string;
  sharing_capacity: number;
  monthly_rent: number;
  yearly_rent: number;
  is_available: number;
  facilities: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeeklyMenuItem {
  id: string;
  pg_id?: string;
  day_of_week: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  updated_at?: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

export interface FoodPoll {
  id: string;
  question: string;
  start_date: string;
  end_date: string;
  is_closed: number;
  options: PollOption[];
  userVotedOptionId?: string | null;
  created_at?: string;
}

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';

export interface FeeRecord {
  id: string;
  user_id: string;
  pg_id?: string;
  pg_name?: string;
  full_name?: string;
  mobile?: string;
  room_number?: string;
  branch?: string;
  month_year: string;
  monthly_fee: number;
  paid_amount: number;
  balance: number;
  due_date: string;
  payment_status: PaymentStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type ComplaintCategory = 'Food' | 'Room' | 'Water' | 'Electricity' | 'Wi-Fi' | 'Cleaning' | 'Maintenance' | 'Other';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  user_id: string;
  pg_id?: string;
  pg_name?: string;
  full_name?: string;
  mobile?: string;
  room_number?: string;
  branch?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  owner_response?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PGInformation {
  id: string;
  pg_name: string;
  tagline: string;
  description: string;
  address: string;
  google_maps_link: string;
  owner_name: string;
  mobile_number: string;
  whatsapp_number: string;
  updated_at?: string;
}

export interface Facility {
  id: string;
  pg_id?: string;
  name: string;
  icon: string;
  description: string;
  is_active: number;
}

export interface OwnerStats {
  totalResidents: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  openComplaints: number;
  pendingFees: number;
  activePolls: number;
}
