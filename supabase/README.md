# Supabase Setup Guide

This guide will help you set up your Supabase database for the Functional Health Lab Analysis app.

## Step 1: Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project (or use an existing one)
3. Go to **Project Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

5. Add these to your `.env.local` file in the root directory

## Step 2: Run the Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `migrations/20251110000000_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 3: Verify the Setup

After running the migration, verify that tables were created:

1. In Supabase Dashboard, go to **Table Editor**
2. You should see all tables including:
   - users
   - biomarkers
   - interventions
   - research_studies
   - user_lab_uploads
   - And 30+ more tables

## Step 4: Configure Row Level Security (RLS)

For production, you'll want to enable RLS on user-facing tables. Here are some starter policies:

### Users Table
```sql
-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### User Lab Uploads
```sql
-- Users can only see their own lab uploads
CREATE POLICY "Users can view own uploads" ON user_lab_uploads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own uploads
CREATE POLICY "Users can create uploads" ON user_lab_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Biomarkers (Reference Data)
```sql
-- Everyone can read biomarkers (reference data)
CREATE POLICY "Anyone can read biomarkers" ON biomarkers
  FOR SELECT USING (true);
```

⚠️ **Note:** We'll add comprehensive RLS policies once authentication is fully set up.

## Step 5: Enable Storage for Lab PDFs

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket called `lab-uploads`
3. Set it to **Private** (not public)
4. Add storage policies:

```sql
-- Users can upload their own lab files
CREATE POLICY "Users can upload labs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lab-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can read their own lab files
CREATE POLICY "Users can read own labs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'lab-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 6: Test the Connection

Run the test script to verify everything is working:

```bash
npm run test:db
```

Or test manually in your Next.js app by trying to fetch biomarkers.

## Troubleshooting

### Connection Issues
- Make sure your `.env.local` has the correct credentials
- Restart your Next.js dev server after adding environment variables
- Check that your Supabase project is active (not paused)

### Migration Errors
- If you get errors about existing tables, you may need to reset the database
- In Supabase Dashboard → Database → Reset Database (⚠️ This deletes all data!)

### RLS Errors
- If you get "new row violates row-level security policy" errors, check your RLS policies
- During development, you can temporarily disable RLS on tables (not recommended for production)

## Next Steps

After the database is set up:
1. ✅ Database schema created
2. ⏳ Set up authentication (Supabase Auth)
3. ⏳ Test database connection from app
4. ⏳ Build lab upload functionality
