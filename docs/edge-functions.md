# Edge Functions API Documentation ⚡

Dokumentasi lengkap untuk Supabase Edge Functions dalam Enigma Protocol

## 📋 Overview

Edge Functions adalah serverless functions yang berjalan di edge untuk обработка запросов API, обработки данных, dan интеграции с внешними сервисами. Все функции используют Deno runtime с поддержкой современных Web APIs.

## 🏗️ Architecture

### Function Structure
```typescript
// Standard function template
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Business logic here
    const result = await processRequest(req);
    
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

### Environment Variables
```bash
# Required for all functions
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional for specific functions
ETHEREUM_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

## 🔗 Available Functions

### 1. get-pool-stats

Mengambil statistik real-time privacy pools dan menghitung privacy score.

**Endpoint:** `POST /functions/v1/get-pool-stats`

**Purpose:** 
- Fetch pool statistics dari database
- Calculate privacy score berdasarkan metrics
- Provide fallback data jika database kosong

**Request:**
```json
{
  // No body required
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPoolSize": 52000000,
    "activeMixers": 2345,
    "anonymitySet": 10000,
    "totalDeposits": 15420,
    "totalWithdrawals": 12350,
    "privacyScore": 85,
    "updatedAt": "2025-12-03T18:14:22Z"
  }
}
```

**Privacy Score Calculation:**
```typescript
const poolSizeScore = Math.min((pool.total_pool_size / 100000000) * 40, 40);
const mixerScore = Math.min((pool.active_mixers / 5000) * 30, 30);
const anonymityScore = Math.min((pool.anonymity_set / 20000) * 30, 30);
const privacyScore = Math.round(poolSizeScore + mixerScore + anonymityScore);
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch pool statistics"
}
```

**Implementation:**
```typescript
// Query pool statistics
const response = await fetch(
  `${supabaseUrl}/rest/v1/pool_statistics?pool_type=eq.main&select=*`,
  {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
  }
);

if (!response.ok) {
  throw new Error('Failed to fetch pool statistics');
}
```

### 2. generate-stealth-address

Generate cryptographically secure stealth addresses dengan ZKP commitment.

**Endpoint:** `POST /functions/v1/generate-stealth-address`

**Purpose:**
- Generate unique stealth address untuk setiap transaksi
- Create ephemeral public key
- Generate ZKP commitment untuk verification
- Store address di database untuk tracking

**Request:**
```json
{
  "userWallet": "0x1234567890abcdef..."
}
```

**Parameters:**
- `userWallet` (string, required): Original user wallet address

**Response:**
```json
{
  "success": true,
  "message": "Stealth address generated successfully",
  "data": {
    "stealthAddress": "0xabcdef1234567890...",
    "ephemeralPubkey": "0x04abcdef...",
    "zkProofCommitment": "zk_proof_12345678-...",
    "id": "uuid-here",
    "createdAt": "2025-12-03T18:14:22Z",
    "privacyFeatures": [
      "Unique address for each transaction",
      "Not traceable to original identity",
      "ZK proof for ownership verification",
      "Compatible with EIP-5564 standard"
    ]
  }
}
```

**Implementation Details:**
```typescript
// Generate cryptographically secure random bytes
const randomBytes = crypto.getRandomValues(new Uint8Array(32));
const hexString = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');

// Stealth address format: 0x + 40 hex characters
const stealthAddress = `0x${hexString.substring(0, 40)}`;

// Ephemeral public key (simulated)
const ephemeralPubkey = `0x04${hexString}${crypto.randomUUID().replace(/-/g, '')}`.substring(0, 130);

// ZK proof commitment (simulated)
const zkProofCommitment = `zk_proof_${crypto.randomUUID().replace(/-/g, '')}`;
```

### 3. create-deposit

Membuat deposit ke privacy pools dengan privacy verification.

**Endpoint:** `POST /functions/v1/create-deposit`

**Purpose:**
- Process deposit ke privacy pool
- Calculate privacy score untuk deposit
- Generate transaction record
- Update pool statistics

**Request:**
```json
{
  "userWallet": "0x1234567890abcdef...",
  "amount": "1.5",
  "token": "ETH",
  "poolType": "main",
  "stealthAddressId": "uuid-here"
}
```

**Parameters:**
- `userWallet` (string): User wallet address
- `amount` (string): Amount to deposit
- `token` (string): Token symbol (ETH, USDC, etc.)
- `poolType` (string): Pool type (main, high_volume, private)
- `stealthAddressId` (string, optional): Related stealth address

**Response:**
```json
{
  "success": true,
  "message": "Deposit created successfully",
  "data": {
    "depositId": "uuid-here",
    "transactionHash": "0xabcdef123456...",
    "privacyScore": 87,
    "expectedCompletion": "2025-12-03T18:20:22Z",
    "poolStats": {
      "newTotalPoolSize": 52001500,
      "newAnonymitySet": 10001
    }
  }
}
```

**Implementation:**
```typescript
// Create deposit record
const depositResponse = await fetch(`${supabaseUrl}/rest/v1/deposits`, {
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    user_id: userId,
    amount: parseFloat(amount),
    token: token.toUpperCase(),
    pool_type: poolType,
    stealth_address_id: stealthAddressId,
    privacy_score: calculatePrivacyScore(amount, poolType)
  })
});

// Create transaction record
await fetch(`${supabaseUrl}/rest/v1/transactions`, {
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'deposit',
    tx_type: 'pool_deposit',
    amount: parseFloat(amount),
    token: token.toUpperCase(),
    privacy_level: 'anonymous',
    status: 'pending'
  })
});
```

### 4. activate-agent

Mengaktifkan dan mengkonfigurasi AI agents ERC-8004 untuk user.

**Endpoint:** `POST /functions/v1/activate-agent`

**Purpose:**
- Activate AI agent untuk user
- Set configuration khusus user
- Update agent usage statistics
- Create user-agent mapping

**Request:**
```json
{
  "userWallet": "0x1234567890abcdef...",
  "agentId": "uuid-here",
  "configuration": {
    "riskLevel": "medium",
    "maxAllocation": "0.5",
    "strategies": ["yield_farming", "liquidity_provision"]
  }
}
```

**Parameters:**
- `userWallet` (string): User wallet address
- `agentId` (string): AI agent ID to activate
- `configuration` (object): User-specific configuration

**Response:**
```json
{
  "success": true,
  "message": "AI agent activated successfully",
  "data": {
    "userAgentId": "uuid-here",
    "agent": {
      "name": "Yield Optimizer Pro",
      "type": "strategy",
      "reputationScore": 94.5
    },
    "configuration": {
      "riskLevel": "medium",
      "maxAllocation": "0.5"
    },
    "estimatedYield": "15.2%",
    "activationTime": "2025-12-03T18:14:22Z"
  }
}
```

**Available Agents:**
```json
[
  {
    "name": "Yield Optimizer Pro",
    "type": "strategy",
    "description": "Advanced AI agent for optimizing yield farming strategies across multiple DeFi protocols with ZK proof verification",
    "pricingModel": "performance"
  },
  {
    "name": "Privacy Sentinel",
    "type": "privacy",
    "description": "Privacy-first AI agent that ensures transaction anonymity with ZKP verification and stealth address generation",
    "pricingModel": "free"
  },
  {
    "name": "Risk Shield AI",
    "type": "risk",
    "description": "Real-time risk monitoring and portfolio protection with automated circuit breakers to safeguard your assets",
    "pricingModel": "subscription"
  },
  {
    "name": "Arbitrage Hunter",
    "type": "arbitrage",
    "description": "High-speed arbitrage detection across DEXs with automatic execution for maximum profit opportunities",
    "pricingModel": "performance"
  },
  {
    "name": "Liquidity Manager",
    "type": "liquidity",
    "description": "Automated liquidity provisioning with dynamic rebalancing for optimal returns and minimal impermanent loss",
    "pricingModel": "free"
  },
  {
    "name": "DeFi Strategy Bot",
    "type": "multi-strategy",
    "description": "Multi-strategy trading agent combining yield farming, staking, and liquidity provision for diversified returns",
    "pricingModel": "performance"
  }
]
```

### 5. update-agent-data

Update data dan performa AI agents (admin function).

**Endpoint:** `POST /functions/v1/update-agent-data`

**Purpose:**
- Update agent descriptions dan capabilities
- Refresh performance metrics
- Update pricing models
- Synchronize dengan latest protocol features

**Request:**
```json
{
  "forceUpdate": false
}
```

**Parameters:**
- `forceUpdate` (boolean): Force update even if recent

**Response:**
```json
{
  "success": true,
  "message": "Agent descriptions and pricing updated to English",
  "results": [
    {
      "name": "Yield Optimizer Pro",
      "status": "updated",
      "data": {
        "description": "Advanced AI agent for optimizing yield farming strategies across multiple DeFi protocols with ZK proof verification",
        "pricingModel": "performance",
        "performanceFeePercentage": 15
      }
    }
  ]
}
```

## 🔐 Security & Authentication

### CORS Configuration
Semua functions menggunakan CORS headers untuk web compatibility:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};
```

### API Key Authentication
```typescript
// Extract API key from request
const apiKey = req.headers.get('apikey');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Validate API key
if (!apiKey || apiKey !== supabaseKey) {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { 
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
```

### Input Validation
```typescript
// Validate required parameters
const { userWallet, amount } = await req.json();

if (!userWallet || !amount) {
  return new Response(
    JSON.stringify({ error: 'Missing required parameters' }),
    { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Validate wallet address format
if (!/^0x[a-fA-F0-9]{40}$/.test(userWallet)) {
  return new Response(
    JSON.stringify({ error: 'Invalid wallet address format' }),
    { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
```

## 🚀 Deployment & Management

### Deploy Functions
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy get-pool-stats
supabase functions deploy generate-stealth-address
supabase functions deploy create-deposit
supabase functions deploy activate-agent
supabase functions deploy update-agent-data

# Deploy dengan environment file
supabase functions deploy --env-file .env.local
```

### Environment Variables
```bash
# Set secrets
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# List secrets
supabase secrets list

# Remove secret
supabase secrets unset VARIABLE_NAME
```

### Local Development
```bash
# Serve functions locally
supabase functions serve

# Serve specific function
supabase functions serve get-pool-stats --port 54321

# Test function locally
curl -X POST 'http://localhost:54321/functions/v1/get-pool-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json'
```

### Monitoring & Logs
```bash
# View function logs
supabase functions logs

# Follow logs in real-time
supabase functions logs --follow

# Filter logs by function
supabase functions logs get-pool-stats

# View specific time range
supabase functions logs --since 1h
```

## 📊 Performance & Optimization

### Caching Strategy
```typescript
// Cache pool statistics untuk 30 seconds
const cacheKey = 'pool_stats_main';
const cached = await redis.get(cacheKey);

if (cached && !forceRefresh) {
  return new Response(JSON.parse(cached), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Generate new data
const data = await generatePoolStats();

// Cache for 30 seconds
await redis.setex(cacheKey, 30, JSON.stringify({ success: true, data }));
```

### Error Handling
```typescript
try {
  // Business logic
  const result = await processData(data);
  
  return new Response(
    JSON.stringify({ success: true, data: result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
} catch (error) {
  console.error('Function error:', error);
  
  // Return appropriate error response
  const errorResponse = {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(errorResponse), {
    status: error.name === 'ValidationError' ? 400 : 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
```

### Database Connection Pooling
```typescript
// Reuse database connections
const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
    pool: { min: 0, max: 10 }
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

## 🧪 Testing

### Unit Testing
```typescript
// Test function logic
Deno.test('generateStealthAddress', async () => {
  const mockRequest = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify({ userWallet: '0x1234567890abcdef1234567890abcdef12345678' })
  });
  
  const response = await generateStealthAddress(mockRequest);
  const data = await response.json();
  
  assert(response.status === 200);
  assert(data.success === true);
  assert(data.data.stealthAddress.startsWith('0x'));
});
```

### Integration Testing
```bash
# Test deployed function
curl -X POST 'https://your-project.supabase.co/functions/v1/get-pool-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{}' | jq '.'
```

### Load Testing
```bash
# Test function performance
hey -n 100 -c 10 -m POST \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{}' \
  'https://your-project.supabase.co/functions/v1/get-pool-stats'
```

## 🔧 Troubleshooting

### Common Issues

1. **Function Timeout**
   ```typescript
   // Add timeout protection
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 10000);
   
   try {
     const result = await fetch(url, { signal: controller.signal });
     clearTimeout(timeoutId);
     return result;
   } catch (error) {
     if (error.name === 'AbortError') {
       throw new Error('Function timeout');
     }
   }
   ```

2. **Database Connection Issues**
   ```typescript
   // Retry mechanism
   const maxRetries = 3;
   let attempt = 0;
   
   while (attempt < maxRetries) {
     try {
       const result = await supabase.from('table').select('*');
       return result;
     } catch (error) {
       attempt++;
       if (attempt === maxRetries) throw error;
       await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
     }
   }
   ```

3. **Memory Issues**
   ```typescript
   // Process large datasets in chunks
   const chunkSize = 1000;
   for (let i = 0; i < data.length; i += chunkSize) {
     const chunk = data.slice(i, i + chunkSize);
     await processChunk(chunk);
   }
   ```

### Debug Mode
```typescript
// Enable debug logging in development
const isDebug = Deno.env.get('DEBUG') === 'true';

if (isDebug) {
  console.log('Debug info:', {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    body: await req.text()
  });
}
```

## 📚 Best Practices

### Function Design
- Keep functions focused dan single-purpose
- Use TypeScript untuk type safety
- Implement proper error handling
- Add comprehensive logging
- Follow RESTful API conventions

### Performance Optimization
- Cache frequently accessed data
- Use connection pooling
- Implement proper indexing
- Minimize external API calls
- Use async/await untuk better performance

### Security
- Validate all input parameters
- Use proper authentication
- Implement rate limiting
- Sanitize data before database operations
- Use HTTPS untuk all communications

---

**Function Runtime:** Deno
**Max Execution Time:** 150 seconds
**Memory Limit:** 512MB
**Version:** 1.0.0