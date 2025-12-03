# Deployment Guide 🚀

Panduan lengkap untuk deploy Enigma Protocol ke production

## 📋 Overview

Enigma Protocol menggunakan arsitektur modern dengan React frontend dan Supabase backend. Deployment dapat dilakukan dengan berbagai platform seperti Vercel, Netlify, atau Vultr untuk maksimum flexibility dan performance.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Edge Functions│    │   PostgreSQL    │
│   (React/Vite)  │────│   (Supabase)    │────│   (Database)    │
│   Static Files  │    │   Serverless    │    │   + RLS         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Monitoring    │    │   Backups       │
│   (Cloudflare)  │    │   (Logs)        │    │   (Auto)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Prerequisites

### Required Accounts
- [Supabase](https://supabase.com) - Backend & Database
- [Vercel](https://vercel.com) atau [Netlify](https://netlify.com) - Frontend hosting
- [Cloudflare](https://cloudflare.com) - CDN & Security
- [Ethereum RPC Provider](https://infura.io) - Blockchain connectivity

### Development Environment
```bash
# Node.js & pnpm
node --version  # v18+
pnpm --version  # v8+

# Git
git --version

# Supabase CLI
npm install -g supabase
supabase --version
```

### Environment Variables Template
```env
# Frontend Environment
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
VITE_CHAIN_ID=1
VITE_APP_ENV=production

# Backend Environment (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
PRIVATE_KEY=your_private_key_for_contracts
```

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

```bash
# Login ke Supabase
supabase login

# Create new project
supabase projects create enigma-protocol --org your-org-id

# Link dengan project
supabase link --project-ref your-project-ref
```

### 2. Setup Database Schema

```bash
# Apply migrations
supabase db push

# Verify schema
supabase db diff

# Check tables
supabase db status
```

### 3. Configure RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stealth_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_statistics ENABLE ROW LEVEL SECURITY;

-- Apply policies (see database-schema.md for full policies)
```

### 4. Setup Database Backup

```bash
# Enable automatic backups di Supabase Dashboard
# Settings > Database > Backups

# Set retention policy (7 days recommended)
# Configure backup schedule
```

### 5. Database Monitoring

```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## ⚡ Edge Functions Deployment

### 1. Deploy All Functions

```bash
# Deploy edge functions
supabase functions deploy

# Deploy specific function
supabase functions deploy get-pool-stats
supabase functions deploy generate-stealth-address
supabase functions deploy create-deposit
supabase functions deploy activate-agent
supabase functions deploy update-agent-data

# Verify deployment
supabase functions list
```

### 2. Configure Environment Variables

```bash
# Set production secrets
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id

# Verify secrets
supabase secrets list
```

### 3. Test Edge Functions

```bash
# Test pool stats function
curl -X POST 'https://your-project.supabase.co/functions/v1/get-pool-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{}'

# Test stealth address generation
curl -X POST 'https://your-project.supabase.co/functions/v1/generate-stealth-address' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"userWallet": "0x1234567890abcdef1234567890abcdef12345678"}'
```

### 4. Setup Monitoring

```bash
# View function logs
supabase functions logs --follow

# Setup log retention
# Dashboard > Logs > Retention Policy
```

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare for Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Build production bundle
pnpm build:prod

# Test production build locally
pnpm preview
```

### 2. Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key",
    "VITE_ETHEREUM_RPC_URL": "@vite_ethereum_rpc_url",
    "VITE_CHAIN_ID": "@vite_chain_id"
  }
}
```

### 3. Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Deploy preview for testing
vercel

# Custom domain setup
vercel domains add enigma-protocol.xyz
vercel alias https://your-deployment.vercel.app enigma-protocol.xyz
```

### 4. Environment Variables Setup

```bash
# Set production environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_ETHEREUM_RPC_URL production
vercel env add VITE_CHAIN_ID production
```

## 🌐 Alternative: Netlify Deployment

### 1. Netlify Configuration

```toml
# netlify.toml
[build]
  command = "pnpm build:prod"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_APP_ENV = "production"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 2. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
netlify deploy --prod --dir=dist

# Setup environment variables
netlify env:set VITE_SUPABASE_URL https://your-project.supabase.co
netlify env:set VITE_SUPABASE_ANON_KEY your_anon_key
```

## 🔒 Security Configuration

### 1. CORS Configuration

```typescript
// Update edge functions CORS for production
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://enigma-protocol.xyz',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};
```

### 2. HTTPS & Security Headers

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: true, // Enable HTTPS in development
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true
      }
    }
  }
})
```

### 3. Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.infura.io;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

## 📊 Monitoring & Analytics

### 1. Performance Monitoring

```javascript
// Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### 2. Error Monitoring

```typescript
// lib/errorReporting.ts
export class ErrorReporter {
  static init() {
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    })
  }

  static reportError(error: any) {
    // Report to monitoring service
    console.error('Application Error:', error)
  }
}
```

### 3. Health Checks

```typescript
// Health check endpoint (can be implemented as edge function)
Deno.serve(async (req) => {
  try {
    // Check database connection
    const dbHealth = await checkDatabaseHealth()
    
    // Check edge functions
    const functionHealth = await checkFunctionsHealth()
    
    // Check external services
    const ethHealth = await checkEthereumRPC()
    
    const overallHealth = dbHealth && functionHealth && ethHealth
    
    return new Response(
      JSON.stringify({
        status: overallHealth ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: dbHealth,
          functions: functionHealth,
          ethereum: ethHealth
        }
      }),
      {
        status: overallHealth ? 200 : 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Deploy Supabase Functions
        run: |
          npx supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### 2. Environment-specific Deployments

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Staging
        run: |
          # Deploy to staging environment
          echo "Deploying to staging..."
```

## 📈 Scaling Considerations

### 1. Database Scaling

```sql
-- Add indexes for better performance
CREATE INDEX CONCURRENTLY idx_transactions_created_user 
ON transactions(created_at, user_id);

CREATE INDEX CONCURRENTLY idx_deposits_status_type 
ON deposits(status, pool_type);

-- Partition large tables (if needed)
CREATE TABLE transactions_2025 PARTITION OF transactions
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 2. CDN Configuration

```javascript
// Add to netlify.toml or vercel.json
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### 3. Database Connection Pooling

```typescript
// supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
    pool: {
      min: 2,
      max: 10
    }
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## 🔧 Maintenance & Updates

### 1. Regular Maintenance Tasks

```bash
# Weekly database maintenance
# Update statistics
ANALYZE;

# Vacuum tables
VACUUM ANALYZE ai_agents;
VACUUM ANALYZE transactions;
VACUUM ANALYZE stealth_addresses;

# Check for unused indexes
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
AND indexrelname NOT LIKE '%_pkey';
```

### 2. Backup Strategy

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="enigma_protocol_backup_$DATE.sql"

# Create database backup
pg_dump --host=$DB_HOST --username=postgres \
  --clean --create $DB_NAME > $BACKUP_FILE

# Upload to cloud storage
aws s3 cp $BACKUP_FILE s3://enigma-protocol-backups/

# Clean up local backup
rm $BACKUP_FILE
```

### 3. Update Procedures

```bash
# Feature deployment
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request
# After merge to main:
git checkout main
git pull origin main

# Deploy to production
vercel --prod
supabase functions deploy
```

## 🚨 Rollback Procedures

### 1. Frontend Rollback

```bash
# Rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback https://your-deployment-url.vercel.app
```

### 2. Database Rollback

```bash
# Check migration status
supabase migration list

# Rollback last migration (if safe)
supabase db reset

# Or manually restore from backup
psql --host=host --username=postgres $DB_NAME < backup.sql
```

### 3. Edge Functions Rollback

```bash
# Redeploy previous version
supabase functions deploy get-pool-stats --no-verify-jwt

# Check function logs
supabase functions logs get-pool-stats --follow
```

## 📞 Support & Troubleshooting

### 1. Common Issues

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf node_modules
rm -rf dist
pnpm install
pnpm build
```

**Database Connection Issues:**
```bash
# Check project status
supabase status

# Reset local environment
supabase stop
supabase start
```

**Function Timeout:**
```typescript
// Add timeout handling
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 10000)

try {
  const result = await fetch(url, { signal: controller.signal })
  clearTimeout(timeoutId)
  return result
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('Function timeout')
  }
}
```

### 2. Monitoring Resources

- **Supabase Dashboard**: Database, functions, auth monitoring
- **Vercel Dashboard**: Build logs, performance metrics
- **Cloudflare Analytics**: CDN performance, security events
- **Error Tracking**: Sentry, LogRocket, atau custom solution

### 3. Emergency Contacts

- **Database Issues**: Supabase Support
- **Deployment Issues**: Vercel/Netlify Support
- **Security Issues**: Incident response team
- **Performance Issues**: DevOps team

---

**Last Updated:** December 2025
**Version:** 1.0.0
**Environment:** Production

**Need Help?** 
- 📚 [Full Documentation](./)
- 💬 [Discord Community](https://discord.gg/enigma-protocol)
- 🐛 [GitHub Issues](https://github.com/enigma-protocol/issues)