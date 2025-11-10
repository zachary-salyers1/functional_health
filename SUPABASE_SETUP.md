# 🚀 Quick Supabase Setup Guide

Follow these steps to set up your database:

## Step 1: Add Your Credentials to `.env.local`

Open `.env.local` and replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find these:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the values

## Step 2: Run the Database Schema

### Option A: Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open `supabase/migrations/20251110000000_initial_schema.sql`
5. Copy the entire file contents
6. Paste into the SQL editor
7. Click **Run** (or Ctrl+Enter)

Wait 10-30 seconds for it to complete. You should see "Success. No rows returned"

### Option B: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project (get ref from project settings)
supabase link --project-ref your-project-ref

# Push the migration
supabase db push
```

## Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor**
2. You should see 40+ tables including:
   - ✅ users
   - ✅ biomarkers
   - ✅ interventions
   - ✅ research_studies
   - ✅ user_lab_uploads
   - ✅ user_biomarker_results
   - ✅ generated_protocols
   - ✅ protocol_recommendations
   - And many more...

## Step 4: Set Up Storage for Lab PDFs

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it: `lab-uploads`
4. Set to **Private** (not public)
5. Click **Create Bucket**

## Step 5: Test the Connection

Run this command from your project root:

```bash
npm run test:db
```

You should see:
```
✅ Database connection successful!
📊 Found 20 biomarkers
✅ All required tables exist
```

## Step 6: Enable Supabase Auth (Optional - do this when ready)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Later: Add Google/GitHub OAuth if desired

## Troubleshooting

### "Failed to connect" error
- Check that your `.env.local` has the correct values
- Restart your dev server: Stop and run `npm run dev` again
- Make sure your Supabase project is not paused

### "Table does not exist" error
- Make sure you ran the full schema migration (Step 2)
- Check for errors in the SQL Editor output

### "Row level security" errors
- During development, RLS is not strictly enforced with service role key
- We'll add RLS policies when we implement authentication

## Next Steps

Once database is set up:
- ✅ Database schema created
- ⏭️ Test connection (`npm run test:db`)
- ⏭️ Build authentication flow
- ⏭️ Create lab upload functionality

---

**Need help?** Check the detailed guide in `supabase/README.md`
