# Manual Database Update Guide

Karena Supabase access token expired, berikut adalah 3 cara alternatif untuk update data:

## Opsi 1: Supabase Dashboard SQL Editor (RECOMMENDED)

1. Login ke Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project: bpbtgkunrdzcoyfdhskh
3. Buka SQL Editor
4. Copy-paste SQL dari `fix_agent_descriptions.sql`:

```sql
-- Add pricing columns first
ALTER TABLE ai_agents 
ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'free' CHECK (pricing_model IN ('free', 'subscription', 'performance', 'one_time')),
ADD COLUMN IF NOT EXISTS cost_per_execution NUMERIC,
ADD COLUMN IF NOT EXISTS subscription_fee NUMERIC,
ADD COLUMN IF NOT EXISTS performance_fee_percentage NUMERIC;

-- Update descriptions to English and add pricing
UPDATE ai_agents 
SET description = 'Advanced AI agent for optimizing yield farming strategies across multiple DeFi protocols with ZK proof verification',
    pricing_model = 'performance',
    performance_fee_percentage = 15
WHERE name = 'Yield Optimizer Pro';

UPDATE ai_agents 
SET description = 'Privacy-first AI agent that ensures transaction anonymity with ZK proof verification and stealth address generation',
    pricing_model = 'free'
WHERE name = 'Privacy Sentinel';

UPDATE ai_agents 
SET description = 'Real-time risk monitoring and portfolio protection with automated circuit breakers to safeguard your assets',
    pricing_model = 'subscription',
    subscription_fee = 29
WHERE name = 'Risk Shield AI';

UPDATE ai_agents 
SET description = 'High-speed arbitrage detection across DEXs with automatic execution for maximum profit opportunities',
    pricing_model = 'performance',
    performance_fee_percentage = 20
WHERE name = 'Arbitrage Hunter';

UPDATE ai_agents 
SET description = 'Automated liquidity provisioning with dynamic rebalancing for optimal returns and minimal impermanent loss',
    pricing_model = 'free'
WHERE name = 'Liquidity Manager';

UPDATE ai_agents 
SET description = 'Multi-strategy trading agent combining yield farming, staking, and liquidity provision for diversified returns',
    pricing_model = 'performance',
    performance_fee_percentage = 15
WHERE name = 'DeFi Strategy Bot';

-- Verify
SELECT id, name, description, pricing_model, subscription_fee, performance_fee_percentage FROM ai_agents;
```

5. Click "Run" atau tekan Ctrl+Enter
6. Verify hasil di tabel ai_agents

## Opsi 2: Browser Console Script

1. Buka website: https://1ra25ugzf8aw.space.minimax.io
2. Buka DevTools (F12) → Console tab
3. Copy-paste script dari `update-agent-data-utility.js`
4. Run command: `await updateAgentData()`
5. Lihat hasil di console

## Opsi 3: Table Editor Manual Update

1. Login ke Supabase Dashboard
2. Buka Table Editor → ai_agents
3. Edit setiap row secara manual:
   - Update kolom `description` ke English
   - Set `pricing_model`, `subscription_fee`, `performance_fee_percentage`

## Verification

Setelah update, verify dengan:
```sql
SELECT id, name, description, pricing_model, subscription_fee, performance_fee_percentage 
FROM ai_agents 
ORDER BY name;
```

Semua description harus dalam Bahasa Inggris, dan pricing fields harus terisi sesuai agent type.
