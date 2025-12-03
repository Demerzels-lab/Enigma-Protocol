# Supabase Setup Guide 🚀

Panduan lengkap untuk setup Supabase dalam Enigma Protocol

## 📋 Prerequisites

- Akun Supabase (https://supabase.com)
- Supabase CLI terinstall
- Project sudah diinisialisasi

## 🛠️ Installation & Initial Setup

### 1. Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Using pnpm
pnpm add -g supabase

# Verify installation
supabase --version
```

### 2. Login ke Supabase

```bash
# Login dengan akun Supabase
supabase login

# Verify login status
supabase status
```

### 3. Initialize Project

```bash
# Di dalam directory project
supabase init

# Link dengan existing project
supabase link --project-ref your-project-ref
```

## 🗄️ Database Setup

### Migration Files Structure

```
supabase/
├── migrations/
│   ├── 1764754546_create_ai_agents_table.sql
│   ├── 1764754742_create_missing_tables.sql
│   ├── 1764754757_fix_transactions_table.sql
│   └── 1764755478_create_user_agents_and_deposits_tables.sql
└── functions/
    └── [edge functions]
```

### Run Migrations

```bash
# Apply semua migrations
supabase db push

# Reset database (development only)
supabase db reset

# Check migration status
supabase migration list
```

### Manual Migration

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ai_agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  agent_type VARCHAR(50) NOT NULL DEFAULT 'strategy',
  capabilities JSONB DEFAULT '[]'::jsonb,
  reputation_score NUMERIC(5,2) DEFAULT 0,
  performance_metrics JSONB DEFAULT '{"totalExecutions": 0, "successRate": 0, "averageApy": 0}'::jsonb,
  zk_proof_commitment VARCHAR(255),
  trust_model VARCHAR(50) DEFAULT 'verified',
  pricing_model VARCHAR(20) DEFAULT 'free',
  cost_per_execution NUMERIC(10,2),
  subscription_fee NUMERIC(10,2),
  performance_fee_percentage NUMERIC(5,2),
  avg_yield NUMERIC(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_agents
CREATE POLICY "Allow public read on ai_agents" ON ai_agents
  FOR SELECT USING (true);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow insert on users" ON users FOR INSERT WITH CHECK (true);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type VARCHAR(50) NOT NULL,
  amount NUMERIC(20,8),
  token VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  tx_hash VARCHAR(255),
  tx_type VARCHAR(50),
  privacy_level VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow insert on transactions" ON transactions FOR INSERT WITH CHECK (true);

-- Create additional tables for privacy features
CREATE TABLE IF NOT EXISTS stealth_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet VARCHAR(255) NOT NULL,
  stealth_address VARCHAR(255) NOT NULL,
  ephemeral_pubkey VARCHAR(255),
  zk_proof_commitment VARCHAR(255),
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stealth_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on stealth_addresses" ON stealth_addresses FOR SELECT USING (true);
CREATE POLICY "Allow insert on stealth_addresses" ON stealth_addresses FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS pool_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_type VARCHAR(50) DEFAULT 'main',
  total_pool_size NUMERIC(20,8) DEFAULT 0,
  active_mixers INTEGER DEFAULT 0,
  anonymity_set INTEGER DEFAULT 0,
  total_deposits INTEGER DEFAULT 0,
  total_withdrawals INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pool_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on pool_statistics" ON pool_statistics FOR SELECT USING (true);
```

## 🔗 Edge Functions Deployment

### Deploy All Functions

```bash
# Deploy semua edge functions
supabase functions deploy

# Deploy specific function
supabase functions deploy get-pool-stats
supabase functions deploy generate-stealth-address
supabase functions deploy create-deposit
supabase functions deploy activate-agent
supabase functions deploy update-agent-data
```

### Function Environment Variables

Set environment variables untuk edge functions:

```bash
# Set environment variables
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Verify secrets
supabase secrets list
```

### Test Edge Functions

```bash
# Test function locally
supabase functions serve get-pool-stats --env-file .env.local

# Deploy dan test
supabase functions deploy get-pool-stats
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/get-pool-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json'
```

## 🔐 Row Level Security (RLS)

### Understanding RLS

Row Level Security memungkinkan kontrol akses granular pada tingkat baris data:

```sql
-- Enable RLS on table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read on table_name" ON table_name
  FOR SELECT USING (true);

-- Allow user-specific access
CREATE POLICY "User can access own data" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- Allow authenticated users
CREATE POLICY "Authenticated users can insert" ON table_name
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### RLS Policies in Enigma Protocol

```sql
-- AI Agents (public read, admin write)
CREATE POLICY "Allow public read on ai_agents" ON ai_agents
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write on ai_agents" ON ai_agents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Transactions (user-specific)
CREATE POLICY "User can view own transactions" ON transactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "User can create own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Stealth Addresses (user-specific)
CREATE POLICY "User can access own stealth addresses" ON stealth_addresses
  FOR ALL USING (auth.uid()::text = user_wallet::text);
```

## 🔑 Authentication Setup

### Enable Authentication Providers

1. **Email/Password**: Enable di Supabase Dashboard
2. **Magic Link**: Enable untuk passwordless login
3. **OAuth Providers**: Configure Google, GitHub, Discord

### JWT Configuration

```javascript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## 📊 Real-time Subscriptions

### Setup Real-time

```javascript
// Subscribe to real-time changes
const subscription = supabase
  .channel('pool_statistics')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'pool_statistics' },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI with new data
    }
  )
  .subscribe()

// Cleanup subscription
subscription.unsubscribe()
```

### Database Triggers

```sql
-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_ai_agents_updated_at 
    BEFORE UPDATE ON ai_agents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🚨 Monitoring & Logging

### Enable Logging

```bash
# View logs
supabase logs

# Follow logs
supabase logs --follow

# Filter by service
supabase logs --service db
supabase logs --service edge-function
```

### Performance Monitoring

Monitor query performance:
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public';
```

## 🔧 Troubleshooting

### Common Issues

1. **Connection Errors**
   ```bash
   # Check project status
   supabase status
   
   # Reset local environment
   supabase stop
   supabase start
   ```

2. **Migration Errors**
   ```bash
   # Check migration conflicts
   supabase migration list
   
   # Reset migrations (development only)
   supabase db reset
   ```

3. **RLS Policy Issues**
   ```sql
   -- Check policies
   SELECT schemaname, tablename, policyname, cmd, roles 
   FROM pg_policies 
   WHERE tablename = 'your_table';
   ```

### Debug Edge Functions

```bash
# View function logs
supabase functions logs get-pool-stats

# Test function locally
supabase functions serve --env-file .env.local

# Check function response
curl -X POST 'http://localhost:54321/functions/v1/get-pool-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json'
```

## 🔗 Environment Variables

### Required Variables

```env
# .env.local
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Supabase CLI
SUPABASE_ACCESS_TOKEN=your_access_token
SUPABASE_PROJECT_ID=your_project_ref
```

### Edge Function Secrets

```bash
# Set secrets for edge functions
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set ETHEREUM_RPC_URL=your_rpc_url
supabase secrets set PRIVATE_KEY=your_private_key
```

## 📈 Database Backup & Restore

### Manual Backup

```bash
# Export database
pg_dump --host=your-db-host --username=postgres --no-password --clean --create your_db > backup.sql

# Import database
psql --host=your-db-host --username=postgres --no-password your_db < backup.sql
```

### Automated Backups

- Enable automated backups di Supabase Dashboard
- Set retention policies (7 days, 30 days, atau custom)
- Monitor backup status di Settings > Database

## 🔐 Security Best Practices

### 1. RLS Policies
- Enable RLS pada semua tabel
- Gunakan principle of least privilege
- Test policies dengan berbagai user roles

### 2. API Keys
- Rotasi keys secara regular
- Gunakan environment variables
- Monitor key usage

### 3. Data Validation
- Validate input pada edge functions
- Gunakan Zod schemas untuk type safety
- Sanitize user input

### 4. Audit Logging
- Enable audit logs
- Monitor suspicious activity
- Review logs secara regular

---

**Need Help?** 
- 📚 [Official Supabase Docs](https://supabase.com/docs)
- 💬 [Discord Community](https://discord.supabase.com)
- 🐛 [GitHub Issues](https://github.com/supabase/supabase/issues)