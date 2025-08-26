# QRly Setup Guide

## Supabase Configuration

To run this application, you need to configure your Supabase credentials. Follow these steps:

### 1. Create Environment File

Create a `.env.local` file in your project root (same directory as `package.json`):

```bash
# Windows PowerShell
New-Item -Path ".env.local" -ItemType File

# Or manually create the file in your code editor
```

### 2. Add Supabase Credentials

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Get Your Supabase Credentials

1. Go to [Supabase](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Example Configuration

Your `.env.local` file should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU2NjQwMCwiZXhwIjoxOTUyMTQyNDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NTY2NDAwLCJleHAiOjE5NTIxNDI0MDB9.example
```

### 5. Restart Your Development Server

After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
```

### 6. Verify Setup

Visit `/dashboard` in your browser. You should now see the dashboard instead of the configuration error.

## Database Setup

Make sure your Supabase project has the following table:

### campaigns table
```sql
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

- **"supabaseKey is required" error**: Make sure your `.env.local` file exists and has the correct values
- **Environment variables not loading**: Restart your development server after creating `.env.local`
- **File not found**: Ensure `.env.local` is in the same directory as `package.json`
- **Permission denied**: Make sure you have write access to the project directory

## Security Notes

- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore`
- `NEXT_PUBLIC_` variables are exposed to the browser (safe for public keys)
- `SUPABASE_SERVICE_ROLE_KEY` should be kept secret (server-side only)
