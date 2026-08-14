# PG Connect - Production PG Management Application

A modern, cloud-native PG Management Web Application built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Cloudflare Workers + D1 Database**.

---

## 🌟 Key Architecture & Multi-PG Design

### 1. Multi-PG Management for the Owner
- **PG Switcher**: Easily switch between individual PG properties or view a consolidated "All PGs" overview.
- **Add New PG**: Expand your PG business by adding new branches directly from the dashboard.
- **PG-Specific Controls**:
  - Scoped room tariffs & occupancy
  - Scoped weekly meal plans
  - Scoped resident assignments & account statuses
  - Scoped fee payment tracking & dues
  - Scoped resident complaint tickets & responses
  - Scoped property descriptions, contacts, and facilities

### 2. Unchanged & Familiar Resident Experience
- **Zero UI Disruption**: The resident interface remains 100% clean, familiar, and unchanged.
- **Automatic PG Scoping**: The system automatically identifies the resident's assigned PG (`pg_id`) upon login and serves the correct room details, food menu, fee history, and support tickets without requiring any manual branch selection.

### 3. Global Food Polls (Shared Across All PGs)
- Food Polls are **GLOBAL** across all PG properties.
- Residents from any PG branch participate in the same poll and cast 1 vote each.
- The Owner views consolidated voting results from all residents across all branches.

### 4. Authentication (Google Sign-In & Email/Password)
- **Continue with Google**: One-click sign-in with Google account.
- **Auto-Onboarding**: New Google users complete a one-time profile setup (mobile, room, branch) before accessing the portal.
- **Security**: Google ID tokens verified server-side on Cloudflare Workers; Google secrets are never exposed to the frontend.

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
cd pg-connect
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔐 Google Cloud OAuth 2.0 Setup Guide

Follow these exact steps in the [Google Cloud Console](https://console.cloud.google.com/) to configure Google Sign-In:

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top bar and click **New Project**.
3. Name your project (e.g. `PG Connect App`) and click **Create**.

### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services** > **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the required fields:
   - **App name**: `PG Connect`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue** through Scopes (default `email`, `profile`, `openid`).
5. Under **Test users**, add your own Google email for local testing, then click **Save and Continue**.

### Step 3: Create OAuth 2.0 Client ID
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. Select **Application type**: `Web application`.
4. Name it: `PG Connect Web Client`.

### Step 4: Configure Authorized JavaScript Origins & Redirect URIs
Enter the following exact URLs based on the PG Connect architecture:

- **Authorized JavaScript origins**:
  - `http://localhost:3000` *(for local development)*
  - `https://your-pages-subdomain.pages.dev` *(for production)*

- **Authorized redirect URIs**:
  - `http://localhost:3000` *(for local development)*
  - `https://your-pages-subdomain.pages.dev` *(for production)*

5. Click **Create**. You will receive your **Client ID** and **Client Secret**.

### Step 5: Add Credentials to PG Connect

1. **Frontend (`.env` file)**:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

2. **Backend (Cloudflare Worker Secrets)**:
   ```bash
   npx wrangler secret put GOOGLE_CLIENT_ID
   # Paste your Client ID

   npx wrangler secret put GOOGLE_CLIENT_SECRET
   # Paste your Client Secret
   ```

---

## ☁️ Cloudflare Free Tier Deployment

### 1. Create Cloudflare D1 Database
```bash
npx wrangler d1 create pg-connect-db
```
Copy the generated `database_id` into `wrangler.toml`.

### 2. Execute Database Schema & Migrations
```bash
npx wrangler d1 execute pg-connect-db --file=./schema.sql
```

### 3. Deploy Worker Backend
```bash
npx wrangler deploy
```

### 4. Deploy Frontend with Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist --project-name=pg-connect
```

---

## 👥 Demo Accounts
- **Owner Demo**: `owner@pgconnect.com` / `OwnerPass123!`
- **Resident 1 (Main Branch)**: `rahul.sharma@example.com` / `Resident123!`
- **Resident 2 (HSR Layout)**: `priya.patel@example.com` / `Resident123!`
- **Google Sign-In**: Click **Continue with Google** on the login page.
