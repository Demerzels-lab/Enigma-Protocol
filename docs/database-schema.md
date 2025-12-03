# Database Schema Documentation 📊

Dokumentasi lengkap struktur database Enigma Protocol

## 📋 Overview

Enigma Protocol menggunakan PostgreSQL dengan Supabase sebagai backend service. Database dirancang untuk mendukung fitur Privacy DeFi, AI Agents, dan Zero Knowledge Proofs.

## 🗄️ Core Tables

### 1. ai_agents
Menyimpan informasi AI Agents ERC-8004 untuk strategi DeFi otomatis.

```sql
CREATE TABLE ai_agents (
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
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Nama AI agent
- `description`: Deskripsi lengkap agent
- `agent_type`: Tipe agent (strategy, privacy, risk, arbitrage, liquidity, multi-strategy)
- `capabilities`: Array capabilities dalam format JSON
- `reputation_score`: Skor reputasi (0-100)
- `performance_metrics`: Metrics performa dalam JSON format
- `zk_proof_commitment`: Commitment untuk ZKP verification
- `trust_model`: Model trust (verified, unverified, deprecated)
- `pricing_model`: Model pricing (free, subscription, performance)
- `cost_per_execution`: Biaya per eksekusi
- `subscription_fee`: Biaya subscription bulanan
- `performance_fee_percentage`: Fee berdasarkan performance
- `avg_yield`: Average yield yang dihasilkan
- `active`: Status aktif/inaktif
- `created_at`, `updated_at`: Timestamps

**Indexes:**
```sql
CREATE INDEX idx_ai_agents_active ON ai_agents(active);
CREATE INDEX idx_ai_agents_type ON ai_agents(agent_type);
CREATE INDEX idx_ai_agents_pricing ON ai_agents(pricing_model);
```

**RLS Policies:**
```sql
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on ai_agents" ON ai_agents FOR SELECT USING (true);
```

### 2. users
Data user dengan wallet address untuk DeFi operations.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique user identifier
- `wallet_address`: Ethereum wallet address
- `email`: Email address (optional)
- `created_at`, `updated_at`: Timestamps

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_email ON users(email);
```

**RLS Policies:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow insert on users" ON users FOR INSERT WITH CHECK (true);
```

### 3. transactions
Log semua transaksi DeFi dengan privacy level tracking.

```sql
CREATE TABLE transactions (
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
```

**Fields:**
- `id`: Transaction ID
- `user_id`: Foreign key to users
- `type`: Tipe transaksi (deposit, withdrawal, transfer, stealth_gen)
- `amount`: Jumlah transaksi
- `token`: Token yang digunakan (ETH, USDC, etc.)
- `status`: Status transaksi (pending, completed, failed)
- `tx_hash`: Transaction hash
- `tx_type`: Tipe transaksi detail
- `privacy_level`: Level privasi (public, private, anonymous)
- `created_at`: Timestamp transaksi

**Transaction Types:**
- `deposit`: Deposit ke privacy pool
- `withdrawal`: Withdrawal dari pool
- `transfer`: Transfer antar addresses
- `stealth_gen`: Generation stealth address
- `agent_activation`: AI agent activation
- `zk_proof`: ZKP related transactions

**Privacy Levels:**
- `public`: Transaksi publik normal
- `private`: Transaksi dengan privacy
- `anonymous`: Transaksi dengan anonimitas maksimal

**Indexes:**
```sql
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at);
```

**RLS Policies:**
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow insert on transactions" ON transactions FOR INSERT WITH CHECK (true);
```

### 4. stealth_addresses
Stealth addresses untuk transaksi privat.

```sql
CREATE TABLE stealth_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet VARCHAR(255) NOT NULL,
  stealth_address VARCHAR(255) NOT NULL,
  ephemeral_pubkey VARCHAR(255),
  zk_proof_commitment VARCHAR(255),
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique stealth address ID
- `user_wallet`: Original user wallet address
- `stealth_address`: Generated stealth address
- `ephemeral_pubkey`: Ephemeral public key
- `zk_proof_commitment`: ZKP commitment string
- `is_used`: Status penggunaan address
- `created_at`: Generation timestamp

**Indexes:**
```sql
CREATE INDEX idx_stealth_addresses_wallet ON stealth_addresses(user_wallet);
CREATE INDEX idx_stealth_addresses_address ON stealth_addresses(stealth_address);
CREATE INDEX idx_stealth_addresses_used ON stealth_addresses(is_used);
```

**RLS Policies:**
```sql
ALTER TABLE stealth_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on stealth_addresses" ON stealth_addresses FOR SELECT USING (true);
CREATE POLICY "Allow insert on stealth_addresses" ON stealth_addresses FOR INSERT WITH CHECK (true);
```

### 5. pool_statistics
Statistik real-time privacy pools.

```sql
CREATE TABLE pool_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_type VARCHAR(50) DEFAULT 'main',
  total_pool_size NUMERIC(20,8) DEFAULT 0,
  active_mixers INTEGER DEFAULT 0,
  anonymity_set INTEGER DEFAULT 0,
  total_deposits INTEGER DEFAULT 0,
  total_withdrawals INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id`: Pool statistics ID
- `pool_type`: Type of pool (main, high_volume, private)
- `total_pool_size`: Total value locked dalam pool
- `active_mixers`: Jumlah mixer aktif
- `anonymity_set`: Ukuran anonymity set
- `total_deposits`: Total deposit count
- `total_withdrawals`: Total withdrawal count
- `updated_at`: Last update timestamp

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_pool_stats_type ON pool_statistics(pool_type);
CREATE INDEX idx_pool_stats_updated ON pool_statistics(updated_at);
```

**RLS Policies:**
```sql
ALTER TABLE pool_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on pool_statistics" ON pool_statistics FOR SELECT USING (true);
```

## 🔗 Relationship Tables

### 6. user_agents
Mapping antara user dan AI agents yang mereka gunakan.

```sql
CREATE TABLE user_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
  configuration JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, agent_id)
);
```

**Fields:**
- `user_id`: Foreign key to users
- `agent_id`: Foreign key to ai_agents
- `configuration`: Konfigurasi khusus user untuk agent
- `is_active`: Status aktivasi
- `created_at`, `updated_at`: Timestamps

**Indexes:**
```sql
CREATE INDEX idx_user_agents_user ON user_agents(user_id);
CREATE INDEX idx_user_agents_agent ON user_agents(agent_id);
CREATE INDEX idx_user_agents_active ON user_agents(is_active);
```

### 7. deposits
Detail deposit ke privacy pools.

```sql
CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(20,8) NOT NULL,
  token VARCHAR(50) NOT NULL,
  pool_type VARCHAR(50) DEFAULT 'main',
  stealth_address_id UUID REFERENCES stealth_addresses(id),
  tx_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  privacy_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

**Fields:**
- `user_id`: User yang melakukan deposit
- `amount`: Jumlah deposit
- `token`: Token yang didepositkan
- `pool_type`: Tipe pool
- `stealth_address_id`: Related stealth address
- `tx_hash`: Transaction hash
- `status`: Status deposit (pending, completed, failed)
- `privacy_score`: Skor privasi deposit
- `created_at`, `completed_at`: Timestamps

**Indexes:**
```sql
CREATE INDEX idx_deposits_user ON deposits(user_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_created ON deposits(created_at);
```

## 📊 Views & Materialized Views

### Pool Overview View
```sql
CREATE VIEW pool_overview AS
SELECT 
  pool_type,
  total_pool_size,
  active_mixers,
  anonymity_set,
  total_deposits,
  total_withdrawals,
  updated_at,
  -- Calculate privacy score
  LEAST(40, (total_pool_size / 100000000 * 40)::numeric) +
  LEAST(30, (active_mixers / 5000 * 30)::numeric) +
  LEAST(30, (anonymity_set / 20000 * 30)::numeric) as privacy_score
FROM pool_statistics;
```

### Agent Performance View
```sql
CREATE VIEW agent_performance AS
SELECT 
  a.id,
  a.name,
  a.agent_type,
  a.reputation_score,
  a.avg_yield,
  a.performance_metrics,
  COUNT(ua.id) as active_users,
  AVG(ua.created_at - a.created_at) as avg_usage_duration
FROM ai_agents a
LEFT JOIN user_agents ua ON a.id = ua.agent_id AND ua.is_active = true
WHERE a.active = true
GROUP BY a.id, a.name, a.agent_type, a.reputation_score, a.avg_yield, a.performance_metrics;
```

## 🔒 Security & Access Control

### Row Level Security (RLS)
Semua tabel menggunakan RLS untuk keamanan data:

```sql
-- Example RLS policy structure
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Public read access (for public data)
CREATE POLICY "Allow public read on table_name" ON table_name
  FOR SELECT USING (true);

-- User-specific access
CREATE POLICY "User can access own data" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- Authenticated user insert
CREATE POLICY "Authenticated users can insert" ON table_name
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Database Roles
```sql
-- Create application role
CREATE ROLE app_user;

-- Grant permissions
GRANT SELECT ON ai_agents TO app_user;
GRANT INSERT ON transactions TO app_user;
GRANT SELECT ON pool_statistics TO app_user;

-- Create service role (for edge functions)
CREATE ROLE service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
```

## 📈 Performance Optimization

### Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_transactions_user_status ON transactions(user_id, status);
CREATE INDEX idx_agents_type_active ON ai_agents(agent_type, active);
CREATE INDEX idx_deposits_user_created ON deposits(user_id, created_at);

-- Partial indexes for active records
CREATE INDEX idx_agents_active ON ai_agents(id) WHERE active = true;
CREATE INDEX idx_user_agents_active ON user_agents(user_id) WHERE is_active = true;
```

### Query Optimization
```sql
-- Optimized pool stats query
SELECT 
  total_pool_size,
  active_mixers,
  anonymity_set,
  -- Privacy score calculation
  LEAST(40, (total_pool_size / 100000000 * 40)::numeric) +
  LEAST(30, (active_mixers / 5000 * 30)::numeric) +
  LEAST(30, (anonymity_set / 20000 * 30)::numeric) as privacy_score
FROM pool_statistics 
WHERE pool_type = 'main';

-- Optimized agent listing
SELECT id, name, description, agent_type, avg_yield, reputation_score
FROM ai_agents 
WHERE active = true 
ORDER BY reputation_score DESC, avg_yield DESC
LIMIT 20;
```

## 🔄 Data Migration & Backup

### Migration Scripts
```sql
-- Add new column
ALTER TABLE ai_agents ADD COLUMN IF NOT EXISTS new_field VARCHAR(255);

-- Update existing data
UPDATE ai_agents 
SET new_field = 'default_value' 
WHERE new_field IS NULL;

-- Create index for new column
CREATE INDEX idx_ai_agents_new_field ON ai_agents(new_field);
```

### Backup Strategy
```bash
# Full database backup
pg_dump --host=host --username=username --clean --create database_name > backup.sql

# Schema only backup
pg_dump --host=host --username=username --schema-only database_name > schema.sql

# Data only backup
pg_dump --host=host --username=username --data-only database_name > data.sql
```

## 📊 Monitoring & Analytics

### Performance Metrics
```sql
-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Connection statistics
SELECT count(*), state 
FROM pg_stat_activity 
GROUP BY state;
```

### Audit Triggers
```sql
-- Create audit function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, new_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply to sensitive tables
CREATE TRIGGER audit_transactions 
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## 🔧 Maintenance

### Regular Maintenance Tasks
```sql
-- Update statistics
ANALYZE;

-- Vacuum tables
VACUUM ANALYZE ai_agents;
VACUUM ANALYZE transactions;
VACUUM ANALYZE stealth_addresses;

-- Reindex if needed
REINDEX TABLE ai_agents;
REINDEX TABLE transactions;
```

### Cleanup Old Data
```sql
-- Archive old transactions (older than 1 year)
INSERT INTO transactions_archive 
SELECT * FROM transactions 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM transactions 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Clean up unused stealth addresses
DELETE FROM stealth_addresses 
WHERE is_used = false 
AND created_at < NOW() - INTERVAL '30 days';
```

---

**Database Version:** PostgreSQL 15+
**Supabase Version:** Latest
**Last Updated:** December 2025