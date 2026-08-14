import {
  User, ResidentProfile, Room, WeeklyMenuItem, FoodPoll, FeeRecord, Complaint, PGInformation, Facility, OwnerStats, PGProperty
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Initial Mock Datasets for Standalone / Multi-PG Mode
const INITIAL_PGS: PGProperty[] = [
  {
    id: 'pg_1',
    name: 'PG Connect Luxury (Main Branch)',
    tagline: 'Comfortable Living, Connected Digitally',
    description: 'Premium PG accommodation in Koramangala featuring high-speed Wi-Fi, organic healthy meals, 24/7 security, and modern amenities.',
    address: '124, Sunrise Avenue, Near Tech Park, Koramangala, Bengaluru - 560034',
    google_maps_link: 'https://maps.google.com',
    owner_name: 'Mr. Rajesh Verma',
    mobile_number: '+91 98765 43210',
    whatsapp_number: '919876543210'
  },
  {
    id: 'pg_2',
    name: 'PG Connect Executive (HSR Layout)',
    tagline: 'Executive Stay for Tech Professionals',
    description: 'Modern luxury PG accommodation in HSR Layout Sector 2 with split AC rooms, rooftop dining, and fitness center.',
    address: '58, 14th Main, HSR Layout Sector 2, Bengaluru - 560102',
    google_maps_link: 'https://maps.google.com',
    owner_name: 'Mr. Rajesh Verma',
    mobile_number: '+91 98765 43210',
    whatsapp_number: '919876543210'
  },
  {
    id: 'pg_3',
    name: 'PG Connect Prime (Whitefield)',
    tagline: 'Spacious Living Near ITPL',
    description: 'Spacious executive PG in Whitefield with balcony rooms, high-speed fiber, and 24/7 security.',
    address: '88, ECC Road, Near ITPL, Whitefield, Bengaluru - 560066',
    google_maps_link: 'https://maps.google.com',
    owner_name: 'Mr. Rajesh Verma',
    mobile_number: '+91 98765 43210',
    whatsapp_number: '919876543210'
  }
];

const INITIAL_FACILITIES: Facility[] = [
  { id: 'fac_1', pg_id: 'pg_1', name: 'High-Speed Wi-Fi', icon: 'Wifi', description: 'Unlimited 300 Mbps fiber optic Wi-Fi across all floors', is_active: 1 },
  { id: 'fac_2', pg_id: 'pg_1', name: 'Healthy & Hygienic Meals', icon: 'Utensils', description: 'Fresh 3-time daily meals prepared with organic ingredients', is_active: 1 },
  { id: 'fac_3', pg_id: 'pg_1', name: '24/7 Hot Water', icon: 'ShowerHead', description: 'Solar and electric geyser hot water supply in all bathrooms', is_active: 1 },
  { id: 'fac_4', pg_id: 'pg_1', name: 'Laundry & Washing', icon: 'Shirt', description: 'Automatic washing machines and dedicated drying zones', is_active: 1 },
  { id: 'fac_5', pg_id: 'pg_1', name: 'Daily Housekeeping', icon: 'Sparkles', description: 'Daily room cleaning and sanitization by professional staff', is_active: 1 },
  { id: 'fac_6', pg_id: 'pg_1', name: 'CCTV & Security', icon: 'ShieldCheck', description: 'Round-the-clock CCTV surveillance and biometric door lock', is_active: 1 },
  { id: 'fac_7', pg_id: 'pg_1', name: 'Covered Parking', icon: 'Car', description: 'Spacious covered two-wheeler and four-wheeler parking', is_active: 1 },
  { id: 'fac_8', pg_id: 'pg_1', name: '24/7 Power Backup', icon: 'Zap', description: '100% generator power backup for uninterrupted work & living', is_active: 1 },
  { id: 'fac_9', pg_id: 'pg_2', name: 'Gigabit Wi-Fi', icon: 'Wifi', description: 'High-speed 500 Mbps mesh Wi-Fi', is_active: 1 },
  { id: 'fac_10', pg_id: 'pg_2', name: 'Gourmet Dining', icon: 'Utensils', description: 'Buffet-style 3-time meals', is_active: 1 },
  { id: 'fac_11', pg_id: 'pg_2', name: 'Gym & Fitness', icon: 'Zap', description: 'Fully equipped rooftop gymnasium', is_active: 1 },
  { id: 'fac_12', pg_id: 'pg_3', name: 'High-Speed Fiber', icon: 'Wifi', description: 'Dedicated work-from-home fiber internet', is_active: 1 }
];

const INITIAL_ROOMS: Room[] = [
  { id: 'rm_101', pg_id: 'pg_1', room_number: '101', room_type: 'Single Deluxe AC', sharing_capacity: 1, monthly_rent: 14000, yearly_rent: 168000, is_available: 0, facilities: 'Private Balcony, Attached Bath, Smart TV, Wi-Fi' },
  { id: 'rm_102', pg_id: 'pg_1', room_number: '102', room_type: '2 Sharing AC', sharing_capacity: 2, monthly_rent: 9500, yearly_rent: 114000, is_available: 1, facilities: 'Attached Bath, Individual Wardrobes, Study Tables, Wi-Fi' },
  { id: 'rm_103', pg_id: 'pg_1', room_number: '103', room_type: '3 Sharing Non-AC', sharing_capacity: 3, monthly_rent: 7000, yearly_rent: 84000, is_available: 1, facilities: 'Spacious Balcony, Individual Locker, Study Table' },
  { id: 'rm_201', pg_id: 'pg_2', room_number: '201', room_type: 'Single Executive AC', sharing_capacity: 1, monthly_rent: 16000, yearly_rent: 192000, is_available: 0, facilities: 'Private Balcony, Workstation, Split AC' },
  { id: 'rm_202', pg_id: 'pg_2', room_number: '202', room_type: '2 Sharing Luxury AC', sharing_capacity: 2, monthly_rent: 11000, yearly_rent: 132000, is_available: 1, facilities: 'Attached Bath, Daily Housekeeping, Split AC' },
  { id: 'rm_301', pg_id: 'pg_3', room_number: '301', room_type: '2 Sharing Premium', sharing_capacity: 2, monthly_rent: 9000, yearly_rent: 108000, is_available: 1, facilities: 'Balcony View, Attached Bathroom, High-Speed Wi-Fi' }
];

const INITIAL_MENU: WeeklyMenuItem[] = [
  { id: 'menu_mon_1', pg_id: 'pg_1', day_of_week: 'Monday', breakfast: 'Idli, Vada & Sambar + Tea/Coffee', lunch: 'South Indian Meals: Rice, Sambar, Rasam, Beetroot Poriyal & Curd', dinner: 'Chapati, Paneer Butter Masala, Jeera Rice & Dal Fry' },
  { id: 'menu_tue_1', pg_id: 'pg_1', day_of_week: 'Tuesday', breakfast: 'Poha, Sev & Mint Chutney + Milk', lunch: 'Veg Thali: Chapati, Mix Veg Curry, Rice, Dal Tadka & Salad', dinner: 'Phulka, Aloo Gobi Masala, Steamed Rice & Veg Soup' },
  { id: 'menu_wed_1', pg_id: 'pg_1', day_of_week: 'Wednesday', breakfast: 'Masala Dosa & Coconut Chutney + Coffee', lunch: 'Veg Pulao, Cucumber Raita, Boiled Egg/Paneer Curry & Pickle', dinner: 'Chapati, Kadai Chicken / Kadai Paneer & Steamed Rice' },
  { id: 'menu_thu_1', pg_id: 'pg_1', day_of_week: 'Thursday', breakfast: 'Aloo Paratha & Fresh Curd + Tea', lunch: 'North Indian Thali: Phulka, Chana Masala, Rice & Curd', dinner: 'Chapati, Capsicum Masala, Rice & Yellow Dal' },
  { id: 'menu_fri_1', pg_id: 'pg_1', day_of_week: 'Friday', breakfast: 'Upma & Tomato Chutney + Tea/Coffee', lunch: 'Lemon Rice, Potato Roast, Sambar, Rice & Papad', dinner: 'Veg Biryani / Chicken Biryani, Mirchi Ka Salan & Raita' },
  { id: 'menu_sat_1', pg_id: 'pg_1', day_of_week: 'Saturday', breakfast: 'Puri Bhaji + Tea/Coffee', lunch: 'Rajma Chawal, Chapati, Mixed Veg & Onion Salad', dinner: 'Phulka, Egg Curry / Malai Kofta & Steamed Rice' },
  { id: 'menu_sun_1', pg_id: 'pg_1', day_of_week: 'Sunday', breakfast: 'Mysore Masala Dosa + Filter Coffee', lunch: 'Special Feast: Veg Pulao, Paneer Tikka Masala, Gulab Jamun', dinner: 'Butter Naan / Chapati, Chicken Korma / Paneer Korma & Ice Cream' }
];

// Global Food Polls (Shared across all PGs)
const INITIAL_POLLS: FoodPoll[] = [
  {
    id: 'poll_1',
    question: 'What special feast would you prefer for this Sunday Dinner across all branches?',
    start_date: '2026-08-01',
    end_date: '2026-08-20',
    is_closed: 0,
    options: [
      { id: 'opt_1', poll_id: 'poll_1', option_text: 'Hyderabadi Chicken Biryani / Paneer Biryani', vote_count: 18 },
      { id: 'opt_2', poll_id: 'poll_1', option_text: 'Butter Naan + Dal Makhani + Paneer Butter Masala', vote_count: 12 },
      { id: 'opt_3', poll_id: 'poll_1', option_text: 'Chinese Combo: Veg Fried Rice + Gobi Manchurian', vote_count: 7 }
    ],
    userVotedOptionId: null
  }
];

const INITIAL_RESIDENTS: ResidentProfile[] = [
  { id: 'prof_1', user_id: 'usr_res_1', pg_id: 'pg_1', pg_name: 'PG Connect Luxury (Main Branch)', full_name: 'Rahul Sharma', mobile: '+91 98765 43210', room_number: '101', branch: 'PG Connect Luxury (Main Branch)', is_active: 1, auth_provider: 'password', created_at: '2026-07-15' },
  { id: 'prof_2', user_id: 'usr_res_2', pg_id: 'pg_2', pg_name: 'PG Connect Executive (HSR Layout)', full_name: 'Priya Patel', mobile: '+91 98765 43211', room_number: '201', branch: 'PG Connect Executive (HSR Layout)', is_active: 1, auth_provider: 'google', created_at: '2026-07-20' },
  { id: 'prof_3', user_id: 'usr_res_3', pg_id: 'pg_1', pg_name: 'PG Connect Luxury (Main Branch)', full_name: 'Ankit Mehta', mobile: '+91 98765 43212', room_number: '103', branch: 'PG Connect Luxury (Main Branch)', is_active: 1, auth_provider: 'password', created_at: '2026-08-01' }
];

const INITIAL_FEES: FeeRecord[] = [
  { id: 'fee_1', user_id: 'usr_res_1', pg_id: 'pg_1', pg_name: 'PG Connect Luxury (Main Branch)', full_name: 'Rahul Sharma', mobile: '+91 98765 43210', room_number: '101', branch: 'PG Connect Luxury (Main Branch)', month_year: 'August 2026', monthly_fee: 14000, paid_amount: 14000, balance: 0, due_date: '2026-08-05', payment_status: 'Paid', notes: 'Full rent paid via UPI' },
  { id: 'fee_2', user_id: 'usr_res_2', pg_id: 'pg_2', pg_name: 'PG Connect Executive (HSR Layout)', full_name: 'Priya Patel', mobile: '+91 98765 43211', room_number: '201', branch: 'PG Connect Executive (HSR Layout)', month_year: 'August 2026', monthly_fee: 16000, paid_amount: 10000, balance: 6000, due_date: '2026-08-05', payment_status: 'Partially Paid', notes: 'Advance ₹10,000 received, balance due Aug 15' }
];

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: 'comp_1', user_id: 'usr_res_1', pg_id: 'pg_1', pg_name: 'PG Connect Luxury (Main Branch)', full_name: 'Rahul Sharma', mobile: '+91 98765 43210', room_number: '101', branch: 'PG Connect Luxury (Main Branch)', category: 'Wi-Fi', title: 'Slow internet speed in Room 101', description: 'Wi-Fi speed drops below 5 Mbps during peak evening hours (8 PM - 10 PM).', status: 'In Progress', owner_response: 'ISP technician has been contacted for bandwidth upgrade by tomorrow morning.', created_at: '2026-07-31 10:00' },
  { id: 'comp_2', user_id: 'usr_res_2', pg_id: 'pg_2', pg_name: 'PG Connect Executive (HSR Layout)', full_name: 'Priya Patel', mobile: '+91 98765 43211', room_number: '201', branch: 'PG Connect Executive (HSR Layout)', category: 'Maintenance', title: 'Balcony light not working in Room 201', description: 'The outdoor balcony bulb needs replacement.', status: 'Resolved', owner_response: 'Replaced on Aug 2.', created_at: '2026-07-30 14:20' }
];

// Helper to manage localStorage mock state
function getStorage<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(`pgc_${key}`);
  if (!item) return defaultValue;
  try { return JSON.parse(item); } catch { return defaultValue; }
}

function setStorage<T>(key: string, value: T): void {
  localStorage.setItem(`pgc_${key}`, JSON.stringify(value));
}

// Network Request Wrapper with Fallback
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('pgc_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const err: any = await res.json().catch(() => ({ error: 'Server error' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`API call ${endpoint} failed (${err.message}). Using local state handler.`);
    throw err;
  }
}

export const apiService = {
  // ----------------------------------------------------
  // MULTI-PG MANAGEMENT
  // ----------------------------------------------------
  async getPGList(): Promise<PGProperty[]> {
    try {
      const res = await apiRequest<{ pgs: PGProperty[] }>('/pgs');
      return res.pgs;
    } catch {
      return getStorage('pg_list', INITIAL_PGS);
    }
  },

  async createPG(data: Partial<PGProperty>): Promise<PGProperty> {
    try {
      const res = await apiRequest<{ pg: PGProperty }>('/pgs', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.pg;
    } catch {
      const pgs = getStorage('pg_list', INITIAL_PGS);
      const newPG: PGProperty = {
        id: 'pg_' + Date.now(),
        name: data.name || 'New PG Property',
        tagline: data.tagline || 'Comfortable Living, Connected Digitally',
        description: data.description || '',
        address: data.address || '',
        google_maps_link: data.google_maps_link || '',
        owner_name: data.owner_name || 'Mr. Rajesh Verma',
        mobile_number: data.mobile_number || '+91 98765 43210',
        whatsapp_number: data.whatsapp_number || '919876543210',
        created_at: new Date().toISOString().split('T')[0]
      };
      pgs.push(newPG);
      setStorage('pg_list', pgs);
      return newPG;
    }
  },

  async updatePG(id: string, data: Partial<PGProperty>): Promise<PGProperty> {
    try {
      const res = await apiRequest<{ pg: PGProperty }>(`/pgs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.pg;
    } catch {
      const pgs = getStorage('pg_list', INITIAL_PGS);
      const idx = pgs.findIndex(p => p.id === id);
      if (idx !== -1) {
        pgs[idx] = { ...pgs[idx], ...data, updated_at: new Date().toISOString() };
        setStorage('pg_list', pgs);
        return pgs[idx];
      }
      return data as PGProperty;
    }
  },

  // ----------------------------------------------------
  // PUBLIC & RESIDENT PG INFO (Auto-scoped to resident's PG)
  // ----------------------------------------------------
  async getPGInfo(pgId?: string): Promise<{ info: PGInformation; facilities: Facility[] }> {
    const profile = getStorage<ResidentProfile | null>('profile', null);
    const targetPgId = pgId || profile?.pg_id || 'pg_1';

    try {
      return await apiRequest<{ info: PGInformation; facilities: Facility[] }>(`/pg-info?pg_id=${targetPgId}`);
    } catch {
      const pgs = getStorage('pg_list', INITIAL_PGS);
      const pg = pgs.find(p => p.id === targetPgId) || pgs[0];
      const allFacilities = getStorage('facilities', INITIAL_FACILITIES);
      const facilities = allFacilities.filter(f => f.pg_id === targetPgId || !f.pg_id);

      const info: PGInformation = {
        id: pg.id,
        pg_name: pg.name,
        tagline: pg.tagline,
        description: pg.description,
        address: pg.address,
        google_maps_link: pg.google_maps_link,
        owner_name: pg.owner_name,
        mobile_number: pg.mobile_number,
        whatsapp_number: pg.whatsapp_number
      };

      return { info, facilities };
    }
  },

  async updatePGInfo(info: PGInformation, pgId?: string): Promise<PGInformation> {
    const targetPgId = pgId || info.id || 'pg_1';
    try {
      const res = await apiRequest<{ info: PGInformation }>(`/pg-info?pg_id=${targetPgId}`, {
        method: 'PUT',
        body: JSON.stringify(info)
      });
      return res.info;
    } catch {
      await this.updatePG(targetPgId, {
        name: info.pg_name,
        tagline: info.tagline,
        description: info.description,
        address: info.address,
        google_maps_link: info.google_maps_link,
        owner_name: info.owner_name,
        mobile_number: info.mobile_number,
        whatsapp_number: info.whatsapp_number
      });
      return info;
    }
  },

  // ----------------------------------------------------
  // ROOMS (Auto-scoped for Resident / Filterable for Owner)
  // ----------------------------------------------------
  async getRooms(pgId?: string): Promise<Room[]> {
    const profile = getStorage<ResidentProfile | null>('profile', null);
    const targetPgId = pgId !== undefined ? pgId : (profile?.pg_id || 'all');

    try {
      const url = targetPgId && targetPgId !== 'all' ? `/rooms?pg_id=${targetPgId}` : '/rooms';
      const res = await apiRequest<{ rooms: Room[] }>(url);
      return res.rooms;
    } catch {
      const rooms = getStorage('rooms', INITIAL_ROOMS);
      if (targetPgId && targetPgId !== 'all') {
        return rooms.filter(r => r.pg_id === targetPgId);
      }
      return rooms;
    }
  },

  async saveRoom(room: Partial<Room>, pgId?: string): Promise<Room> {
    const targetPgId = pgId || room.pg_id || 'pg_1';
    const payload = { ...room, pg_id: targetPgId };

    try {
      if (room.id) {
        await apiRequest(`/rooms/${room.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        return payload as Room;
      } else {
        const res = await apiRequest<{ id: string }>('/rooms', { method: 'POST', body: JSON.stringify(payload) });
        return { ...payload, id: res.id } as Room;
      }
    } catch {
      const rooms = getStorage('rooms', INITIAL_ROOMS);
      if (room.id) {
        const idx = rooms.findIndex(r => r.id === room.id);
        if (idx !== -1) rooms[idx] = { ...rooms[idx], ...payload };
        setStorage('rooms', rooms);
        return rooms[idx];
      } else {
        const newRoom = { ...payload, id: 'rm_' + Date.now() } as Room;
        rooms.push(newRoom);
        setStorage('rooms', rooms);
        return newRoom;
      }
    }
  },

  async deleteRoom(id: string): Promise<void> {
    try {
      await apiRequest(`/rooms/${id}`, { method: 'DELETE' });
    } catch {
      const rooms = getStorage('rooms', INITIAL_ROOMS).filter(r => r.id !== id);
      setStorage('rooms', rooms);
    }
  },

  // ----------------------------------------------------
  // WEEKLY FOOD MENU (Auto-scoped for Resident / Filterable for Owner)
  // ----------------------------------------------------
  async getWeeklyMenu(pgId?: string): Promise<WeeklyMenuItem[]> {
    const profile = getStorage<ResidentProfile | null>('profile', null);
    const targetPgId = pgId || profile?.pg_id || 'pg_1';

    try {
      const res = await apiRequest<{ menu: WeeklyMenuItem[] }>(`/menu?pg_id=${targetPgId}`);
      return res.menu;
    } catch {
      const menus = getStorage('menu', INITIAL_MENU);
      const scoped = menus.filter(m => m.pg_id === targetPgId);
      return scoped.length > 0 ? scoped : menus.filter(m => m.pg_id === 'pg_1' || !m.pg_id);
    }
  },

  async updateWeeklyMenu(menuItems: WeeklyMenuItem[], pgId?: string): Promise<void> {
    const targetPgId = pgId || 'pg_1';
    const scopedItems = menuItems.map(m => ({ ...m, pg_id: targetPgId }));

    try {
      await apiRequest(`/menu?pg_id=${targetPgId}`, { method: 'PUT', body: JSON.stringify(scopedItems) });
    } catch {
      const menus = getStorage('menu', INITIAL_MENU);
      // Replace or insert items for this PG
      const otherMenus = menus.filter(m => m.pg_id !== targetPgId);
      setStorage('menu', [...otherMenus, ...scopedItems]);
    }
  },

  // ----------------------------------------------------
  // GLOBAL FOOD POLLS (SHARED GLOBALLY ACROSS ALL PGs)
  // ----------------------------------------------------
  async getPolls(): Promise<FoodPoll[]> {
    try {
      const res = await apiRequest<{ polls: FoodPoll[] }>('/polls');
      return res.polls;
    } catch {
      const polls = getStorage<FoodPoll[]>('polls', INITIAL_POLLS);
      const user = JSON.parse(localStorage.getItem('pgc_user') || '{}');
      const userId = user.id || 'usr_res_1';
      const userVotes = getStorage<{ [key: string]: string }>('user_votes', {});

      return polls.map(p => ({
        ...p,
        userVotedOptionId: userVotes[`${userId}_${p.id}`] || null
      }));
    }
  },

  async createPoll(poll: { question: string; startDate: string; endDate: string; options: string[] }): Promise<FoodPoll> {
    try {
      const res = await apiRequest<{ id: string }>('/polls', { method: 'POST', body: JSON.stringify(poll) });
      return {
        id: res.id,
        question: poll.question,
        start_date: poll.startDate,
        end_date: poll.endDate,
        is_closed: 0,
        options: poll.options.map((opt, i) => ({ id: `opt_${Date.now()}_${i}`, poll_id: res.id, option_text: opt, vote_count: 0 }))
      };
    } catch {
      const polls = getStorage('polls', INITIAL_POLLS);
      const pollId = 'poll_' + Date.now();
      const newPoll: FoodPoll = {
        id: pollId,
        question: poll.question,
        start_date: poll.startDate,
        end_date: poll.endDate,
        is_closed: 0,
        options: poll.options.map((opt, i) => ({ id: `opt_${pollId}_${i}`, poll_id: pollId, option_text: opt, vote_count: 0 }))
      };
      polls.unshift(newPoll);
      setStorage('polls', polls);
      return newPoll;
    }
  },

  async votePoll(pollId: string, optionId: string): Promise<void> {
    const user = JSON.parse(localStorage.getItem('pgc_user') || '{}');
    const userId = user.id || 'usr_res_1';
    const userVotes = getStorage<{ [key: string]: string }>('user_votes', {});
    const voteKey = `${userId}_${pollId}`;

    try {
      await apiRequest(`/polls/${pollId}/vote`, { method: 'POST', body: JSON.stringify({ optionId }) });
      userVotes[voteKey] = optionId;
      setStorage('user_votes', userVotes);
    } catch (err: any) {
      if (userVotes[voteKey]) {
        throw new Error('You have already voted in this poll');
      }

      const polls = getStorage<FoodPoll[]>('polls', INITIAL_POLLS);
      const poll = polls.find(p => p.id === pollId);
      if (poll) {
        const opt = poll.options.find(o => o.id === optionId);
        if (opt) opt.vote_count += 1;
        setStorage('polls', polls);
      }

      userVotes[voteKey] = optionId;
      setStorage('user_votes', userVotes);
    }
  },

  async closePoll(pollId: string): Promise<void> {
    try {
      await apiRequest(`/polls/${pollId}/close`, { method: 'PUT' });
    } catch {
      const polls = getStorage('polls', INITIAL_POLLS);
      const poll = polls.find(p => p.id === pollId);
      if (poll) poll.is_closed = 1;
      setStorage('polls', polls);
    }
  },

  async deletePoll(pollId: string): Promise<void> {
    try {
      await apiRequest(`/polls/${pollId}`, { method: 'DELETE' });
    } catch {
      const polls = getStorage('polls', INITIAL_POLLS).filter(p => p.id !== pollId);
      setStorage('polls', polls);
    }
  },

  // ----------------------------------------------------
  // FEE RECORDS (Private per Resident / Filterable for Owner)
  // ----------------------------------------------------
  async getMyFees(): Promise<FeeRecord[]> {
    try {
      const res = await apiRequest<{ fees: FeeRecord[] }>('/fees/my');
      return res.fees;
    } catch {
      const user = JSON.parse(localStorage.getItem('pgc_user') || '{}');
      const userId = user.id || 'usr_res_1';
      return getStorage<FeeRecord[]>('fees', INITIAL_FEES).filter(f => f.user_id === userId);
    }
  },

  async getAllFees(pgId?: string): Promise<FeeRecord[]> {
    try {
      const url = pgId && pgId !== 'all' ? `/fees/all?pg_id=${pgId}` : '/fees/all';
      const res = await apiRequest<{ fees: FeeRecord[] }>(url);
      return res.fees;
    } catch {
      const fees = getStorage('fees', INITIAL_FEES);
      if (pgId && pgId !== 'all') {
        return fees.filter(f => f.pg_id === pgId);
      }
      return fees;
    }
  },

  async saveFeeRecord(fee: Partial<FeeRecord>, pgId?: string): Promise<FeeRecord> {
    const targetPgId = pgId || fee.pg_id || 'pg_1';
    const payload = { ...fee, pgId: targetPgId };

    try {
      if (fee.id) {
        await apiRequest(`/fees/${fee.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        return fee as FeeRecord;
      } else {
        const res = await apiRequest<{ id: string }>('/fees', { method: 'POST', body: JSON.stringify(payload) });
        return { ...fee, id: res.id } as FeeRecord;
      }
    } catch {
      const fees = getStorage('fees', INITIAL_FEES);
      const monthlyFee = Number(fee.monthly_fee) || 0;
      const paidAmount = Number(fee.paid_amount) || 0;
      const balance = Math.max(0, monthlyFee - paidAmount);
      let payment_status: any = 'Pending';
      if (balance === 0 && paidAmount > 0) payment_status = 'Paid';
      else if (paidAmount > 0 && balance > 0) payment_status = 'Partially Paid';

      const residents = getStorage('residents', INITIAL_RESIDENTS);
      const resident = residents.find(r => r.user_id === fee.user_id);
      const pgs = getStorage('pg_list', INITIAL_PGS);
      const pg = pgs.find(p => p.id === targetPgId);

      if (fee.id) {
        const idx = fees.findIndex(f => f.id === fee.id);
        if (idx !== -1) {
          fees[idx] = { ...fees[idx], ...fee, balance, payment_status, pg_id: targetPgId, pg_name: pg?.name };
        }
        setStorage('fees', fees);
        return fees[idx];
      } else {
        const newFee: FeeRecord = {
          id: 'fee_' + Date.now(),
          user_id: fee.user_id || 'usr_res_1',
          pg_id: targetPgId,
          pg_name: pg?.name || 'Main Branch',
          full_name: resident?.full_name || 'Resident',
          mobile: resident?.mobile || '',
          room_number: resident?.room_number || '101',
          branch: pg?.name || resident?.branch || 'Main Branch',
          month_year: fee.month_year || 'August 2026',
          monthly_fee: monthlyFee,
          paid_amount: paidAmount,
          balance,
          due_date: fee.due_date || '2026-08-05',
          payment_status,
          notes: fee.notes || ''
        };
        fees.unshift(newFee);
        setStorage('fees', fees);
        return newFee;
      }
    }
  },

  // ----------------------------------------------------
  // COMPLAINTS (Private per Resident / Filterable for Owner)
  // ----------------------------------------------------
  async getMyComplaints(): Promise<Complaint[]> {
    try {
      const res = await apiRequest<{ complaints: Complaint[] }>('/complaints/my');
      return res.complaints;
    } catch {
      const user = JSON.parse(localStorage.getItem('pgc_user') || '{}');
      const userId = user.id || 'usr_res_1';
      return getStorage<Complaint[]>('complaints', INITIAL_COMPLAINTS).filter(c => c.user_id === userId);
    }
  },

  async getAllComplaints(pgId?: string): Promise<Complaint[]> {
    try {
      const url = pgId && pgId !== 'all' ? `/complaints/all?pg_id=${pgId}` : '/complaints/all';
      const res = await apiRequest<{ complaints: Complaint[] }>(url);
      return res.complaints;
    } catch {
      const complaints = getStorage('complaints', INITIAL_COMPLAINTS);
      if (pgId && pgId !== 'all') {
        return complaints.filter(c => c.pg_id === pgId);
      }
      return complaints;
    }
  },

  async submitComplaint(data: { category: string; title: string; description: string }): Promise<Complaint> {
    try {
      const res = await apiRequest<{ id: string }>('/complaints', { method: 'POST', body: JSON.stringify(data) });
      return { id: res.id, ...data, user_id: 'current', status: 'Open' } as Complaint;
    } catch {
      const user = JSON.parse(localStorage.getItem('pgc_user') || '{}');
      const profile = getStorage<ResidentProfile | null>('profile', null);
      const complaints = getStorage('complaints', INITIAL_COMPLAINTS);
      const newComp: Complaint = {
        id: 'comp_' + Date.now(),
        user_id: user.id || 'usr_res_1',
        pg_id: profile?.pg_id || 'pg_1',
        pg_name: profile?.pg_name || 'Main Branch',
        full_name: profile?.full_name || 'Resident',
        mobile: profile?.mobile || '',
        room_number: profile?.room_number || '101',
        branch: profile?.branch || 'Main Branch',
        category: data.category as any,
        title: data.title,
        description: data.description,
        status: 'Open',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      complaints.unshift(newComp);
      setStorage('complaints', complaints);
      return newComp;
    }
  },

  async updateComplaintStatus(id: string, status: string, owner_response?: string): Promise<void> {
    try {
      await apiRequest(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify({ status, owner_response }) });
    } catch {
      const complaints = getStorage('complaints', INITIAL_COMPLAINTS);
      const comp = complaints.find(c => c.id === id);
      if (comp) {
        comp.status = status as any;
        if (owner_response !== undefined) comp.owner_response = owner_response;
        setStorage('complaints', complaints);
      }
    }
  },

  // ----------------------------------------------------
  // RESIDENTS MANAGEMENT
  // ----------------------------------------------------
  async getResidents(pgId?: string): Promise<ResidentProfile[]> {
    try {
      const url = pgId && pgId !== 'all' ? `/residents?pg_id=${pgId}` : '/residents';
      const res = await apiRequest<{ residents: ResidentProfile[] }>(url);
      return res.residents;
    } catch {
      const residents = getStorage('residents', INITIAL_RESIDENTS);
      if (pgId && pgId !== 'all') {
        return residents.filter(r => r.pg_id === pgId);
      }
      return residents;
    }
  },

  async saveResidentProfile(userId: string, profileData: { full_name: string; mobile: string; room_number?: string; branch?: string; pg_id?: string }): Promise<ResidentProfile> {
    const targetUserId = userId || 'usr_res_1';
    try {
      await apiRequest<{ profile: ResidentProfile }>('/auth/profile', {
        method: 'POST',
        body: JSON.stringify({
          fullName: profileData.full_name,
          mobile: profileData.mobile,
          roomNumber: profileData.room_number,
          branch: profileData.branch,
          pgId: profileData.pg_id
        })
      });
      return this.syncLocalResidentProfile(targetUserId, profileData);
    } catch {
      return this.syncLocalResidentProfile(targetUserId, profileData);
    }
  },

  syncLocalResidentProfile(userId: string, profileData: { full_name: string; mobile: string; room_number?: string; branch?: string; pg_id?: string }): ResidentProfile {
    const residents = getStorage('residents', INITIAL_RESIDENTS);
    const pgs = getStorage('pg_list', INITIAL_PGS);
    const targetPg = pgs.find(p => p.id === (profileData.pg_id || 'pg_1'));

    let resident = residents.find(r => r.user_id === userId);
    if (resident) {
      resident.full_name = profileData.full_name;
      resident.mobile = profileData.mobile;
      if (profileData.room_number) resident.room_number = profileData.room_number;
      if (profileData.branch) resident.branch = profileData.branch;
      if (profileData.pg_id) {
        resident.pg_id = profileData.pg_id;
        resident.pg_name = targetPg?.name || resident.branch;
      }
    } else {
      resident = {
        id: 'prof_' + Date.now(),
        user_id: userId,
        pg_id: profileData.pg_id || 'pg_1',
        pg_name: targetPg?.name || 'PG Connect Luxury (Main Branch)',
        full_name: profileData.full_name,
        mobile: profileData.mobile,
        room_number: profileData.room_number || '101',
        branch: profileData.branch || targetPg?.name || 'Main Branch',
        is_active: 1
      };
      residents.push(resident);
    }
    setStorage('residents', residents);
    setStorage('profile', resident);

    // Sync name & mobile across fee records and complaints
    const fees = getStorage<FeeRecord[]>('fees', INITIAL_FEES);
    fees.forEach(f => {
      if (f.user_id === userId) {
        f.full_name = profileData.full_name;
        f.mobile = profileData.mobile;
      }
    });
    setStorage('fees', fees);

    const complaints = getStorage<Complaint[]>('complaints', INITIAL_COMPLAINTS);
    complaints.forEach(c => {
      if (c.user_id === userId) {
        c.full_name = profileData.full_name;
        c.mobile = profileData.mobile;
      }
    });
    setStorage('complaints', complaints);

    return resident;
  },

  async updateResident(userId: string, data: { room_number: string; branch: string; pg_id?: string; is_active: boolean }): Promise<void> {
    try {
      await apiRequest(`/residents/${userId}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch {
      // fallback
    }

    const residents = getStorage('residents', INITIAL_RESIDENTS);
    const pgs = getStorage('pg_list', INITIAL_PGS);
    const pg = pgs.find(p => p.id === data.pg_id);

    const resident = residents.find(r => r.user_id === userId);
    if (resident) {
      resident.room_number = data.room_number;
      resident.branch = data.branch;
      if (data.pg_id) {
        resident.pg_id = data.pg_id;
        resident.pg_name = pg?.name || data.branch;
      }
      resident.is_active = data.is_active ? 1 : 0;
      setStorage('residents', residents);
    }

    const activeProfile = getStorage<ResidentProfile | null>('profile', null);
    if (activeProfile && activeProfile.user_id === userId) {
      activeProfile.room_number = data.room_number;
      activeProfile.branch = data.branch;
      if (data.pg_id) {
        activeProfile.pg_id = data.pg_id;
        activeProfile.pg_name = pg?.name || data.branch;
      }
      activeProfile.is_active = data.is_active ? 1 : 0;
      setStorage('profile', activeProfile);
    }
  },

  // ----------------------------------------------------
  // STATS (Scoped to PG or Aggregate)
  // ----------------------------------------------------
  async getOwnerStats(pgId?: string): Promise<OwnerStats> {
    try {
      const url = pgId && pgId !== 'all' ? `/stats?pg_id=${pgId}` : '/stats';
      return await apiRequest<OwnerStats>(url);
    } catch {
      const rooms = getStorage('rooms', INITIAL_ROOMS);
      const complaints = getStorage('complaints', INITIAL_COMPLAINTS);
      const fees = getStorage('fees', INITIAL_FEES);
      const polls = getStorage('polls', INITIAL_POLLS);
      const residents = getStorage('residents', INITIAL_RESIDENTS);

      const scopedRooms = pgId && pgId !== 'all' ? rooms.filter(r => r.pg_id === pgId) : rooms;
      const scopedComplaints = pgId && pgId !== 'all' ? complaints.filter(c => c.pg_id === pgId) : complaints;
      const scopedFees = pgId && pgId !== 'all' ? fees.filter(f => f.pg_id === pgId) : fees;
      const scopedResidents = pgId && pgId !== 'all' ? residents.filter(r => r.pg_id === pgId) : residents;

      return {
        totalResidents: scopedResidents.length,
        totalRooms: scopedRooms.length,
        availableRooms: scopedRooms.filter(r => r.is_available).length,
        occupiedRooms: scopedRooms.filter(r => !r.is_available).length,
        openComplaints: scopedComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length,
        pendingFees: scopedFees.reduce((acc, f) => acc + (f.payment_status !== 'Paid' ? f.balance : 0), 0),
        activePolls: polls.filter(p => !p.is_closed).length
      };
    }
  },

  // ----------------------------------------------------
  // GOOGLE AUTHENTICATION
  // ----------------------------------------------------
  async loginWithGoogle(credential: string): Promise<{ token: string; user: User; profile: ResidentProfile | null; hasProfile: boolean }> {
    try {
      return await apiRequest<{ token: string; user: User; profile: ResidentProfile | null; hasProfile: boolean }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential })
      });
    } catch (err: any) {
      // Standalone Google login simulation
      const mockGoogleUser: User = {
        id: 'usr_g_' + Date.now(),
        email: 'google.resident@example.com',
        role: 'resident',
        auth_provider: 'google',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      };

      const mockGoogleProfile: ResidentProfile = {
        id: 'prof_g_' + Date.now(),
        user_id: mockGoogleUser.id,
        pg_id: 'pg_1',
        pg_name: 'PG Connect Luxury (Main Branch)',
        full_name: 'Google Resident User',
        mobile: '+91 98765 43299',
        room_number: '102',
        branch: 'PG Connect Luxury (Main Branch)',
        is_active: 1,
        auth_provider: 'google'
      };

      return {
        token: 'mock_google_jwt_' + Date.now(),
        user: mockGoogleUser,
        profile: mockGoogleProfile,
        hasProfile: true
      };
    }
  }
};
