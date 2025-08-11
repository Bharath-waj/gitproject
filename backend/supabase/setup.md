
# Supabase Backend Setup for Oblivian Vault

## Prerequisites
1. Supabase account at https://supabase.com
2. Node.js (v18 or higher)

## Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Wait for the project to be ready

### 2. Configure Database
1. Go to SQL Editor in your Supabase dashboard
2. Run the SQL script from `schema.sql` to create tables and policies

### 3. Configure Storage
1. Go to Storage in your Supabase dashboard
2. The `vault-files` bucket should be created automatically by the schema
3. Verify the bucket exists and policies are in place

### 4. Configure Authentication
1. Go to Authentication → Settings in your Supabase dashboard
2. Enable Email authentication
3. Configure email templates if needed
4. Set up email confirmation (optional)

### 5. Get API Keys
1. Go to Settings → API in your Supabase dashboard
2. Copy the Project URL and anon/public key
3. Update the frontend `.env` file:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Security Configuration
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own files
- Storage policies enforce user isolation
- All operations require authentication

## File Structure

```
backend/
└── supabase/
    ├── schema.sql      # Database schema and policies
    └── setup.md        # This setup guide
```

## Features

- **User Authentication**: Email/password auth with Supabase Auth
- **File Storage**: Secure file uploads to Supabase Storage
- **Database**: PostgreSQL with Row Level Security
- **Real-time**: Optional real-time subscriptions
- **APIs**: Auto-generated REST and GraphQL APIs

## Security Features

- **Row Level Security**: Database-level access control
- **Storage Policies**: File-level access control
- **JWT Authentication**: Secure token-based auth
- **User Isolation**: Complete data separation between users
- **Encryption**: Client-side file encryption before upload

## Usage Limits (Free Tier)

- **Database**: 500MB
- **Storage**: 1GB
- **Bandwidth**: 2GB/month
- **API Requests**: 50,000/month

## Monitoring

Monitor your Supabase usage:
1. Supabase Dashboard → Settings → Usage
2. View API requests, storage usage, and database size
3. Set up alerts for usage limits
