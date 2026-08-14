import { Env } from './types';
import { authenticateRequest, hashPassword, generateSalt, createJwtToken } from './auth';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const searchParams = url.searchParams;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    };

    try {
      // ----------------------------------------------------
      // AUTH ROUTES
      // ----------------------------------------------------
      if (path === '/api/auth/signup' && method === 'POST') {
        const body: any = await request.json();
        const { email, password } = body;
        if (!email || !password || password.length < 6) {
          return jsonResponse({ error: 'Valid email and password (min 6 chars) required' }, 400);
        }

        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (existing) {
          return jsonResponse({ error: 'An account with this email already exists' }, 409);
        }

        const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);

        await env.DB.prepare(
          `INSERT INTO users (id, email, password_hash, salt, role, auth_provider, last_login)
           VALUES (?, ?, ?, ?, 'resident', 'password', CURRENT_TIMESTAMP)`
        ).bind(userId, email.toLowerCase(), hashedPassword, salt).run();

        const token = await createJwtToken({ id: userId, email: email.toLowerCase(), role: 'resident' }, env.JWT_SECRET);
        return jsonResponse({
          token,
          user: { id: userId, email: email.toLowerCase(), role: 'resident', auth_provider: 'password' },
          hasProfile: false
        }, 201);
      }

      if (path === '/api/auth/login' && method === 'POST') {
        const body: any = await request.json();
        const { email, password, loginType } = body;

        if (!email || !password) {
          return jsonResponse({ error: 'Email and password are required' }, 400);
        }

        const user: any = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (!user) {
          return jsonResponse({ error: 'Invalid email or password' }, 401);
        }

        if (loginType && user.role !== loginType) {
          return jsonResponse({ error: `This account is not authorized for ${loginType} login` }, 403);
        }

        const calculatedHash = await hashPassword(password, user.salt || '');
        if (calculatedHash !== user.password_hash) {
          return jsonResponse({ error: 'Invalid email or password' }, 401);
        }

        await env.DB.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').bind(user.id).run();

        const token = await createJwtToken({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET);

        let profile: any = null;
        if (user.role === 'resident') {
          profile = await env.DB.prepare('SELECT * FROM resident_profiles WHERE user_id = ?').bind(user.id).first();
        }

        return jsonResponse({
          token,
          user: { id: user.id, email: user.email, role: user.role, auth_provider: user.auth_provider || 'password' },
          hasProfile: !!profile,
          profile
        });
      }

      // GOOGLE AUTHENTICATION ENDPOINT
      if (path === '/api/auth/google' && method === 'POST') {
        const body: any = await request.json();
        const { credential } = body;

        if (!credential) {
          return jsonResponse({ error: 'Google credential token is required' }, 400);
        }

        let googlePayload: any = null;
        try {
          // Verify with Google tokeninfo endpoint
          const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
          if (!googleRes.ok) {
            throw new Error('Invalid Google token');
          }
          googlePayload = await googleRes.json();
        } catch (err: any) {
          return jsonResponse({ error: 'Failed to verify Google token: ' + err.message }, 401);
        }

        const googleId = googlePayload.sub;
        const email = (googlePayload.email || '').toLowerCase();
        const name = googlePayload.name || '';
        const picture = googlePayload.picture || '';

        if (!email) {
          return jsonResponse({ error: 'Google account must have an associated email' }, 400);
        }

        // Check if user already exists
        let user: any = await env.DB.prepare('SELECT * FROM users WHERE email = ? OR google_id = ?').bind(email, googleId).first();

        if (user) {
          // Update last_login, google_id, avatar_url
          await env.DB.prepare(
            `UPDATE users SET google_id = ?, avatar_url = ?, auth_provider = 'google', last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
          ).bind(googleId, picture, user.id).run();
        } else {
          // Create new resident user
          const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
          await env.DB.prepare(
            `INSERT INTO users (id, email, password_hash, salt, role, auth_provider, google_id, avatar_url, last_login)
             VALUES (?, ?, '', '', 'resident', 'google', ?, ?, CURRENT_TIMESTAMP)`
          ).bind(userId, email, googleId, picture).run();

          user = { id: userId, email, role: 'resident', auth_provider: 'google', avatar_url: picture };
        }

        const token = await createJwtToken({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET);

        const profile: any = await env.DB.prepare('SELECT * FROM resident_profiles WHERE user_id = ?').bind(user.id).first();

        return jsonResponse({
          token,
          user: { id: user.id, email: user.email, role: user.role, auth_provider: 'google', avatar_url: picture },
          hasProfile: !!profile && !!profile.mobile,
          profile
        });
      }

      if (path === '/api/auth/profile' && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401);

        const body: any = await request.json();
        const { fullName, mobile, roomNumber, branch, pgId } = body;

        if (!fullName || !mobile) {
          return jsonResponse({ error: 'Full name and mobile number are required' }, 400);
        }

        const profileId = 'prof_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
        const targetPgId = pgId || 'pg_1';

        await env.DB.prepare(
          `INSERT INTO resident_profiles (id, user_id, pg_id, full_name, mobile, room_number, branch, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)
           ON CONFLICT(user_id) DO UPDATE SET full_name=?, mobile=?, room_number=?, branch=?, pg_id=?, updated_at=CURRENT_TIMESTAMP`
        ).bind(
          profileId, auth.id, targetPgId, fullName, mobile, roomNumber || '101', branch || 'Main Branch',
          fullName, mobile, roomNumber || '101', branch || 'Main Branch', targetPgId
        ).run();

        const updatedProfile = await env.DB.prepare('SELECT * FROM resident_profiles WHERE user_id = ?').bind(auth.id).first();
        return jsonResponse({ message: 'Profile saved successfully', profile: updatedProfile });
      }

      if (path === '/api/auth/me' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401);

        const user: any = await env.DB.prepare('SELECT id, email, role, auth_provider, avatar_url, last_login, created_at FROM users WHERE id = ?').bind(auth.id).first();
        let profile = null;
        if (user.role === 'resident') {
          profile = await env.DB.prepare('SELECT * FROM resident_profiles WHERE user_id = ?').bind(auth.id).first();
        }

        return jsonResponse({ user, profile, hasProfile: !!profile });
      }

      // ----------------------------------------------------
      // MULTI-PG PROPERTIES API
      // ----------------------------------------------------
      if (path === '/api/pgs' && method === 'GET') {
        const pgs = await env.DB.prepare('SELECT * FROM pg_properties ORDER BY name ASC').all();
        return jsonResponse({ pgs: pgs.results });
      }

      if (path === '/api/pgs' && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const body: any = await request.json();
        const { name, tagline, description, address, google_maps_link, owner_name, mobile_number, whatsapp_number } = body;

        const pgId = 'pg_' + crypto.randomUUID().replace(/-/g, '').substring(0, 8);
        await env.DB.prepare(
          `INSERT INTO pg_properties (id, name, tagline, description, address, google_maps_link, owner_name, mobile_number, whatsapp_number)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(pgId, name, tagline || 'Comfortable Living, Connected Digitally', description || '', address || '', google_maps_link || '', owner_name || '', mobile_number || '', whatsapp_number || '').run();

        // Seed default 7-day menu for new PG
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (const day of days) {
          const menuId = `menu_${pgId}_${day.toLowerCase()}`;
          await env.DB.prepare(
            `INSERT INTO weekly_menus (id, pg_id, day_of_week, breakfast, lunch, dinner) VALUES (?, ?, ?, 'Healthy Breakfast', 'Balanced Lunch', 'Delicious Dinner')`
          ).bind(menuId, pgId, day).run();
        }

        const newPG = await env.DB.prepare('SELECT * FROM pg_properties WHERE id = ?').bind(pgId).first();
        return jsonResponse({ message: 'PG Property created successfully', pg: newPG }, 201);
      }

      if (path.startsWith('/api/pgs/') && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const pgId = path.split('/')[3];
        const body: any = await request.json();
        const { name, tagline, description, address, google_maps_link, owner_name, mobile_number, whatsapp_number } = body;

        await env.DB.prepare(
          `UPDATE pg_properties SET name=?, tagline=?, description=?, address=?, google_maps_link=?, owner_name=?, mobile_number=?, whatsapp_number=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
        ).bind(name, tagline, description, address, google_maps_link, owner_name, mobile_number, whatsapp_number, pgId).run();

        const updated = await env.DB.prepare('SELECT * FROM pg_properties WHERE id=?').bind(pgId).first();
        return jsonResponse({ message: 'PG Information updated', pg: updated });
      }

      // ----------------------------------------------------
      // PG INFO & FACILITIES API (Auto-scoped for residents)
      // ----------------------------------------------------
      if (path === '/api/pg-info' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        let targetPgId = searchParams.get('pg_id') || 'pg_1';

        if (auth && auth.role === 'resident') {
          const profile: any = await env.DB.prepare('SELECT pg_id FROM resident_profiles WHERE user_id = ?').bind(auth.id).first();
          if (profile && profile.pg_id) {
            targetPgId = profile.pg_id;
          }
        }

        let pgInfo = await env.DB.prepare('SELECT * FROM pg_properties WHERE id = ?').bind(targetPgId).first();
        if (!pgInfo) {
          pgInfo = await env.DB.prepare('SELECT * FROM pg_properties LIMIT 1').first();
        }

        const facilities = await env.DB.prepare('SELECT * FROM facilities WHERE pg_id = ? AND is_active = 1').bind(targetPgId).all();
        return jsonResponse({ info: pgInfo, facilities: facilities.results || [] });
      }

      // ----------------------------------------------------
      // ROOMS API (Scoped by PG)
      // ----------------------------------------------------
      if (path === '/api/rooms' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        let targetPgId = searchParams.get('pg_id');

        if (auth && auth.role === 'resident') {
          const profile: any = await env.DB.prepare('SELECT pg_id FROM resident_profiles WHERE user_id = ?').bind(auth.id).first();
          if (profile && profile.pg_id) {
            targetPgId = profile.pg_id;
          }
        }

        let rooms;
        if (targetPgId && targetPgId !== 'all') {
          rooms = await env.DB.prepare('SELECT * FROM rooms WHERE pg_id = ? ORDER BY room_number ASC').bind(targetPgId).all();
        } else {
          rooms = await env.DB.prepare('SELECT * FROM rooms ORDER BY room_number ASC').all();
        }

        return jsonResponse({ rooms: rooms.results });
      }

      if (path === '/api/rooms' && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const body: any = await request.json();
        const { room_number, room_type, sharing_capacity, monthly_rent, yearly_rent, is_available, facilities, pg_id } = body;

        const roomId = 'rm_' + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
        const targetPgId = pg_id || 'pg_1';

        await env.DB.prepare(
          `INSERT INTO rooms (id, pg_id, room_number, room_type, sharing_capacity, monthly_rent, yearly_rent, is_available, facilities)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(roomId, targetPgId, room_number, room_type, sharing_capacity, monthly_rent, yearly_rent, is_available ? 1 : 0, facilities).run();

        return jsonResponse({ message: 'Room created successfully', id: roomId }, 201);
      }

      if (path.startsWith('/api/rooms/') && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const roomId = path.split('/')[3];
        const body: any = await request.json();
        const { room_number, room_type, sharing_capacity, monthly_rent, yearly_rent, is_available, facilities, pg_id } = body;

        await env.DB.prepare(
          `UPDATE rooms SET 
            room_number=?, room_type=?, sharing_capacity=?, monthly_rent=?, yearly_rent=?, is_available=?, facilities=?, pg_id=COALESCE(?, pg_id), updated_at=CURRENT_TIMESTAMP
           WHERE id=?`
        ).bind(room_number, room_type, sharing_capacity, monthly_rent, yearly_rent, is_available ? 1 : 0, facilities, pg_id || null, roomId).run();

        return jsonResponse({ message: 'Room rent updated successfully.' });
      }

      if (path.startsWith('/api/rooms/') && method === 'DELETE') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const roomId = path.split('/')[3];
        await env.DB.prepare('DELETE FROM rooms WHERE id=?').bind(roomId).run();
        return jsonResponse({ message: 'Room deleted successfully' });
      }

      // ----------------------------------------------------
      // WEEKLY FOOD MENU API (Scoped by PG)
      // ----------------------------------------------------
      if (path === '/api/menu' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        let targetPgId = searchParams.get('pg_id') || 'pg_1';

        if (auth && auth.role === 'resident') {
          const profile: any = await env.DB.prepare('SELECT pg_id FROM resident_profiles WHERE user_id = ?').bind(auth.id).first();
          if (profile && profile.pg_id) {
            targetPgId = profile.pg_id;
          }
        }

        let menus = await env.DB.prepare('SELECT * FROM weekly_menus WHERE pg_id = ?').bind(targetPgId).all();
        if (!menus.results || menus.results.length === 0) {
          menus = await env.DB.prepare('SELECT * FROM weekly_menus LIMIT 7').all();
        }

        return jsonResponse({ menu: menus.results });
      }

      if (path === '/api/menu' && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const body: any = await request.json(); // Array of menu items
        const targetPgId = searchParams.get('pg_id') || 'pg_1';

        for (const item of body) {
          await env.DB.prepare(
            `INSERT INTO weekly_menus (id, pg_id, day_of_week, breakfast, lunch, dinner, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(pg_id, day_of_week) DO UPDATE SET breakfast=?, lunch=?, dinner=?, updated_at=CURRENT_TIMESTAMP`
          ).bind(
            item.id || `menu_${targetPgId}_${item.day_of_week.toLowerCase()}`, targetPgId, item.day_of_week, item.breakfast, item.lunch, item.dinner,
            item.breakfast, item.lunch, item.dinner
          ).run();
        }

        return jsonResponse({ message: 'Weekly food menu updated successfully' });
      }

      // ----------------------------------------------------
      // GLOBAL FOOD POLLS API (Shared across all PGs)
      // ----------------------------------------------------
      if (path === '/api/polls' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        const pollsResult: any = await env.DB.prepare('SELECT * FROM food_polls ORDER BY created_at DESC').all();
        const polls = pollsResult.results || [];

        const fullPolls = [];
        for (const poll of polls) {
          const optionsResult: any = await env.DB.prepare('SELECT * FROM poll_options WHERE poll_id = ?').bind(poll.id).all();
          let userVotedOptionId = null;

          if (auth) {
            const userVote: any = await env.DB.prepare('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?').bind(poll.id, auth.id).first();
            if (userVote) {
              userVotedOptionId = userVote.option_id;
            }
          }

          fullPolls.push({
            ...poll,
            options: optionsResult.results,
            userVotedOptionId
          });
        }

        return jsonResponse({ polls: fullPolls });
      }

      if (path === '/api/polls' && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const body: any = await request.json();
        const { question, startDate, endDate, options } = body;

        const pollId = 'poll_' + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
        await env.DB.prepare(
          'INSERT INTO food_polls (id, question, start_date, end_date, is_closed) VALUES (?, ?, ?, ?, 0)'
        ).bind(pollId, question, startDate, endDate).run();

        for (const opt of options) {
          const optId = 'opt_' + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
          await env.DB.prepare(
            'INSERT INTO poll_options (id, poll_id, option_text, vote_count) VALUES (?, ?, ?, 0)'
          ).bind(optId, pollId, opt).run();
        }

        return jsonResponse({ message: 'Global food poll published successfully', id: pollId }, 201);
      }

      if (path.endsWith('/vote') && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401);

        const pollId = path.split('/')[3];
        const body: any = await request.json();
        const { optionId } = body;

        const poll: any = await env.DB.prepare('SELECT * FROM food_polls WHERE id = ?').bind(pollId).first();
        if (!poll) return jsonResponse({ error: 'Poll not found' }, 404);
        if (poll.is_closed) return jsonResponse({ error: 'This poll is closed' }, 400);

        try {
          const voteId = 'vt_' + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
          await env.DB.prepare(
            'INSERT INTO poll_votes (id, poll_id, user_id, option_id) VALUES (?, ?, ?, ?)'
          ).bind(voteId, pollId, auth.id, optionId).run();

          await env.DB.prepare(
            'UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?'
          ).bind(optionId).run();

          return jsonResponse({ message: 'Vote recorded successfully' });
        } catch (err: any) {
          return jsonResponse({ error: 'You have already voted in this poll' }, 400);
        }
      }

      if (path.endsWith('/close') && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);
        const pollId = path.split('/')[3];

        await env.DB.prepare('UPDATE food_polls SET is_closed = 1 WHERE id = ?').bind(pollId).run();
        return jsonResponse({ message: 'Poll closed' });
      }

      if (path.startsWith('/api/polls/') && method === 'DELETE') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);
        const pollId = path.split('/')[3];

        await env.DB.prepare('DELETE FROM food_polls WHERE id = ?').bind(pollId).run();
        return jsonResponse({ message: 'Poll deleted' });
      }

      // ----------------------------------------------------
      // FEE RECORDS API
      // ----------------------------------------------------
      if (path === '/api/fees/my' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401);

        const fees = await env.DB.prepare('SELECT * FROM fee_records WHERE user_id = ? ORDER BY created_at DESC').bind(auth.id).all();
        return jsonResponse({ fees: fees.results });
      }

      if (path === '/api/fees/all' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const targetPgId = searchParams.get('pg_id');
        let query = `SELECT f.*, p.full_name, p.mobile, p.room_number, p.branch, prop.name as pg_name
                     FROM fee_records f
                     JOIN resident_profiles p ON f.user_id = p.user_id
                     LEFT JOIN pg_properties prop ON f.pg_id = prop.id`;
        
        let fees;
        if (targetPgId && targetPgId !== 'all') {
          fees = await env.DB.prepare(`${query} WHERE f.pg_id = ? ORDER BY f.created_at DESC`).bind(targetPgId).all();
        } else {
          fees = await env.DB.prepare(`${query} ORDER BY f.created_at DESC`).all();
        }

        return jsonResponse({ fees: fees.results });
      }

      if (path === '/api/fees' && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const body: any = await request.json();
        const { userId, monthYear, monthlyFee, paidAmount, dueDate, notes, pgId } = body;

        const balance = Math.max(0, monthlyFee - paidAmount);
        let paymentStatus = 'Pending';
        if (balance === 0 && paidAmount > 0) paymentStatus = 'Paid';
        else if (paidAmount > 0 && balance > 0) paymentStatus = 'Partially Paid';

        const feeId = 'fee_' + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
        const targetPgId = pgId || 'pg_1';

        await env.DB.prepare(
          `INSERT INTO fee_records (id, user_id, pg_id, month_year, monthly_fee, paid_amount, balance, due_date, payment_status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(feeId, userId, targetPgId, monthYear, monthlyFee, paidAmount, balance, dueDate, paymentStatus, notes || '').run();

        return jsonResponse({ message: 'Fee record created successfully', id: feeId }, 201);
      }

      if (path.startsWith('/api/fees/') && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const feeId = path.split('/')[3];
        const body: any = await request.json();
        const { monthlyFee, paidAmount, dueDate, paymentStatus, notes } = body;

        const balance = Math.max(0, monthlyFee - paidAmount);
        await env.DB.prepare(
          `UPDATE fee_records SET monthly_fee=?, paid_amount=?, balance=?, due_date=?, payment_status=?, notes=?, updated_at=CURRENT_TIMESTAMP
           WHERE id=?`
        ).bind(monthlyFee, paidAmount, balance, dueDate, paymentStatus, notes || '', feeId).run();

        return jsonResponse({ message: 'Fee record updated successfully' });
      }

      // ----------------------------------------------------
      // COMPLAINTS API
      // ----------------------------------------------------
      if (path === '/api/complaints/my' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401);

        const complaints = await env.DB.prepare('SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC').bind(auth.id).all();
        return jsonResponse({ complaints: complaints.results });
      }

      if (path === '/api/complaints/all' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const targetPgId = searchParams.get('pg_id');
        let query = `SELECT c.*, p.full_name, p.mobile, p.room_number, p.branch, prop.name as pg_name
                     FROM complaints c
                     JOIN resident_profiles p ON c.user_id = p.user_id
                     LEFT JOIN pg_properties prop ON c.pg_id = prop.id`;

        let complaints;
        if (targetPgId && targetPgId !== 'all') {
          complaints = await env.DB.prepare(`${query} WHERE c.pg_id = ? ORDER BY c.created_at DESC`).bind(targetPgId).all();
        } else {
          complaints = await env.DB.prepare(`${query} ORDER BY c.created_at DESC`).all();
        }

        return jsonResponse({ complaints: complaints.results });
      }

      if (path === '/api/complaints' && method === 'POST') {
        const auth = await authenticateRequest(request, env);
        if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401);

        const body: any = await request.json();
        const { category, title, description } = body;

        const profile: any = await env.DB.prepare('SELECT pg_id FROM resident_profiles WHERE user_id = ?').bind(auth.id).first();
        const targetPgId = profile?.pg_id || 'pg_1';

        const complaintId = 'comp_' + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
        await env.DB.prepare(
          `INSERT INTO complaints (id, user_id, pg_id, category, title, description, status)
           VALUES (?, ?, ?, ?, ?, ?, 'Open')`
        ).bind(complaintId, auth.id, targetPgId, category, title, description).run();

        return jsonResponse({ message: 'Complaint submitted successfully', id: complaintId }, 201);
      }

      if (path.startsWith('/api/complaints/') && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const complaintId = path.split('/')[3];
        const body: any = await request.json();
        const { status, owner_response } = body;

        await env.DB.prepare(
          `UPDATE complaints SET status=?, owner_response=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
        ).bind(status, owner_response || null, complaintId).run();

        return jsonResponse({ message: 'Complaint status updated successfully' });
      }

      // ----------------------------------------------------
      // RESIDENTS MANAGEMENT (OWNER ONLY)
      // ----------------------------------------------------
      if (path === '/api/residents' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const targetPgId = searchParams.get('pg_id');
        let query = `SELECT u.id as user_id, u.email, u.auth_provider, u.avatar_url, u.last_login, u.created_at as user_created_at,
                            p.id as profile_id, p.pg_id, p.full_name, p.mobile, p.room_number, p.branch, p.is_active, p.created_at, prop.name as pg_name
                     FROM users u
                     LEFT JOIN resident_profiles p ON u.id = p.user_id
                     LEFT JOIN pg_properties prop ON p.pg_id = prop.id
                     WHERE u.role = 'resident'`;

        let residents;
        if (targetPgId && targetPgId !== 'all') {
          residents = await env.DB.prepare(`${query} AND p.pg_id = ? ORDER BY p.created_at DESC`).bind(targetPgId).all();
        } else {
          residents = await env.DB.prepare(`${query} ORDER BY p.created_at DESC`).all();
        }

        return jsonResponse({ residents: residents.results });
      }

      if (path.startsWith('/api/residents/') && method === 'PUT') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const targetUserId = path.split('/')[3];
        const body: any = await request.json();
        const { room_number, branch, pg_id, is_active } = body;

        await env.DB.prepare(
          `UPDATE resident_profiles SET room_number=?, branch=?, pg_id=COALESCE(?, pg_id), is_active=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`
        ).bind(room_number, branch, pg_id || null, is_active ? 1 : 0, targetUserId).run();

        return jsonResponse({ message: 'Resident profile updated successfully' });
      }

      // ----------------------------------------------------
      // OWNER DASHBOARD STATS (Filterable by PG)
      // ----------------------------------------------------
      if (path === '/api/stats' && method === 'GET') {
        const auth = await authenticateRequest(request, env);
        if (!auth || auth.role !== 'owner') return jsonResponse({ error: 'Forbidden' }, 403);

        const targetPgId = searchParams.get('pg_id');

        let totalResidents: any;
        let totalRooms: any;
        let availableRooms: any;
        let occupiedRooms: any;
        let openComplaints: any;
        let pendingFees: any;

        if (targetPgId && targetPgId !== 'all') {
          totalResidents = await env.DB.prepare("SELECT COUNT(*) as count FROM resident_profiles WHERE pg_id = ?").bind(targetPgId).first();
          totalRooms = await env.DB.prepare("SELECT COUNT(*) as count FROM rooms WHERE pg_id = ?").bind(targetPgId).first();
          availableRooms = await env.DB.prepare("SELECT COUNT(*) as count FROM rooms WHERE pg_id = ? AND is_available = 1").bind(targetPgId).first();
          occupiedRooms = await env.DB.prepare("SELECT COUNT(*) as count FROM rooms WHERE pg_id = ? AND is_available = 0").bind(targetPgId).first();
          openComplaints = await env.DB.prepare("SELECT COUNT(*) as count FROM complaints WHERE pg_id = ? AND status != 'Resolved' AND status != 'Closed'").bind(targetPgId).first();
          pendingFees = await env.DB.prepare("SELECT SUM(balance) as total FROM fee_records WHERE pg_id = ? AND payment_status != 'Paid'").bind(targetPgId).first();
        } else {
          totalResidents = await env.DB.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'resident'").first();
          totalRooms = await env.DB.prepare("SELECT COUNT(*) as count FROM rooms").first();
          availableRooms = await env.DB.prepare("SELECT COUNT(*) as count FROM rooms WHERE is_available = 1").first();
          occupiedRooms = await env.DB.prepare("SELECT COUNT(*) as count FROM rooms WHERE is_available = 0").first();
          openComplaints = await env.DB.prepare("SELECT COUNT(*) as count FROM complaints WHERE status != 'Resolved' AND status != 'Closed'").first();
          pendingFees = await env.DB.prepare("SELECT SUM(balance) as total FROM fee_records WHERE payment_status != 'Paid'").first();
        }

        const activePolls: any = await env.DB.prepare("SELECT COUNT(*) as count FROM food_polls WHERE is_closed = 0").first();

        return jsonResponse({
          totalResidents: totalResidents?.count || 0,
          totalRooms: totalRooms?.count || 0,
          availableRooms: availableRooms?.count || 0,
          occupiedRooms: occupiedRooms?.count || 0,
          openComplaints: openComplaints?.count || 0,
          pendingFees: pendingFees?.total || 0,
          activePolls: activePolls?.count || 0,
        });
      }

      return jsonResponse({ error: 'Endpoint Not Found' }, 404);
    } catch (err: any) {
      console.error('Worker error:', err);
      return jsonResponse({ error: err.message || 'Internal Server Error' }, 500);
    }
  },
};
