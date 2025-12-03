# 📚 Enigma Protocol Documentation Index

Selamat datang di dokumentasi lengkap Enigma Protocol - Platform Privacy DeFi dengan AI Agents dan Zero Knowledge Proofs.

## 📖 Dokumentasi Utama

### 🚀 Getting Started
- **[README.md](../README.md)** - Overview lengkap proyek dan teknologi yang digunakan
- **[Installation & Setup](supabase-setup.md)** - Panduan setup development environment

### 🏗️ Architecture & Backend
- **[Database Schema](database-schema.md)** - Struktur database, tabel, dan relationships
- **[Edge Functions](edge-functions.md)** - API documentation untuk serverless functions
- **[Supabase Setup](supabase-setup.md)** - Setup dan konfigurasi Supabase

### 🌐 Frontend Integration
- **[API Reference](api-reference.md)** - Documentation lengkap API untuk frontend integration
- **Hooks & Utils** - React hooks dan utility functions

### 🚀 Deployment
- **[Deployment Guide](deployment-guide.md)** - Panduan lengkap deploy ke production
- **CI/CD Pipeline** - Automated deployment workflows
- **Monitoring & Maintenance** - Best practices untuk production maintenance

## 📊 System Overview

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Blockchain**: Ethers.js + Web3 Integration
- **Privacy**: Zero Knowledge Proofs + Stealth Addresses
- **AI**: ERC-8004 AI Agents untuk DeFi automation

### Key Features
1. **Privacy DeFi**
   - Stealth Address Generation (EIP-5564)
   - Zero Knowledge Proofs
   - Anonymity Pools dengan mixing
   - Privacy score calculation

2. **AI Agents (ERC-8004)**
   - 6 jenis AI agents untuk strategi DeFi
   - Automated yield optimization
   - Risk management dengan circuit breakers
   - Arbitrage detection dan execution
   - Liquidity management otomatis

3. **Real-time Features**
   - Live pool statistics
   - Transaction tracking
   - Agent performance monitoring
   - WebSocket subscriptions

## 🛠️ Development Workflow

### 1. Local Development Setup
```bash
# Clone repository
git clone https://github.com/enigma-protocol/core.git
cd enigma-protocol

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Start development
pnpm dev
```

### 2. Database Setup
```bash
# Setup Supabase project
supabase login
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Deploy edge functions
supabase functions deploy
```

### 3. Testing
```bash
# Run tests
pnpm test

# Test edge functions
supabase functions serve
curl -X POST 'http://localhost:54321/functions/v1/get-pool-stats'
```

## 📈 API Endpoints Summary

### Privacy Pools
- `POST /functions/v1/get-pool-stats` - Get real-time pool statistics
- `POST /functions/v1/create-deposit` - Create deposit ke privacy pool
- `POST /functions/v1/generate-stealth-address` - Generate stealth address

### AI Agents
- `GET /rest/v1/ai_agents` - List available AI agents
- `POST /functions/v1/activate-agent` - Activate AI agent
- `GET /rest/v1/user_agents` - User's active agents

### Real-time
- `ws://supabase.co/realtime/v1/websocket` - WebSocket for real-time updates
- Subscriptions untuk pool stats, transactions, agent updates

## 🔐 Security Features

### Database Security
- Row Level Security (RLS) pada semua tabel
- API key authentication
- User-specific data access
- Encrypted sensitive data

### Privacy Protection
- Stealth addresses untuk setiap transaksi
- ZKP commitment untuk verification
- Anonymity pools untuk mixing
- No KYC requirements

### Smart Contract Integration
- EIP-5564 stealth address standard
- ERC-8004 AI agent standard
- Web3 wallet integration
- Transaction privacy guarantees

## 🏢 Production Deployment

### Architecture
```
Frontend (Vercel/Netlify)
    ↓
CDN (Cloudflare)
    ↓
Edge Functions (Supabase)
    ↓
PostgreSQL (Supabase)
    ↓
Ethereum RPC (Infura/Alchemy)
```

### Environment Setup
- **Production**: Real Ethereum mainnet
- **Staging**: Ethereum testnet
- **Development**: Local Ganache/Hardhat

### Monitoring
- Real-time error tracking
- Performance monitoring
- Database health checks
- API rate limiting

## 📊 Database Schema Overview

### Core Tables
- `ai_agents` - AI agent definitions dan performance
- `users` - User wallet addresses
- `transactions` - Privacy transaction log
- `stealth_addresses` - Generated stealth addresses
- `pool_statistics` - Real-time pool metrics
- `user_agents` - User-agent relationships
- `deposits` - Privacy pool deposits

### Key Relationships
```sql
users (1) → (N) transactions
users (1) → (N) user_agents → (1) ai_agents
users (1) → (N) stealth_addresses
users (1) → (N) deposits
```

## 🎯 Use Cases

### For Users
1. **Privacy Deposits**: Deposit ETH/USDC ke anonymity pools
2. **AI Agent Activation**: Activate automated DeFi strategies
3. **Stealth Transactions**: Generate private addresses untuk transactions
4. **Portfolio Management**: Monitor agent performance dan yields

### For Developers
1. **API Integration**: Build applications dengan privacy features
2. **Agent Development**: Create new AI agents dengan ERC-8004
3. **Privacy Enhancement**: Integrate ZKP features
4. **Analytics**: Query pool statistics dan user behavior

### For Researchers
1. **Privacy Metrics**: Analyze anonymity set sizes
2. **Agent Performance**: Study AI agent effectiveness
3. **DeFi Innovation**: Research automated strategies
4. **Cryptographic Research**: ZKP implementation studies

## 🔗 External Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Ethers.js Docs](https://docs.ethers.org)
- [TypeScript Docs](https://www.typescriptlang.org)

### Standards & RFCs
- [EIP-5564: Stealth Addresses](https://eips.ethereum.org/EIPS/eip-5564)
- [ERC-8004: AI Agents](https://eips.ethereum.org/EIPS/eip-8004)
- [Zero Knowledge Proofs](https://www.zkproof.org/)

### Tools & Services
- [Vercel](https://vercel.com) - Frontend hosting
- [Supabase](https://supabase.com) - Backend & Database
- [Cloudflare](https://cloudflare.com) - CDN & Security
- [Infura](https://infura.io) - Ethereum RPC

## 🤝 Contributing

Kami welcome contributions dari komunitas! Silakan baca:

1. [Contributing Guidelines](../CONTRIBUTING.md)
2. [Code of Conduct](../CODE_OF_CONDUCT.md)
3. [Security Policy](../SECURITY.md)

### Development Process
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript untuk type safety
- ESLint untuk code quality
- Prettier untuk formatting
- Jest untuk testing
- Conventional commits

## 📞 Support & Community

### Getting Help
- 📚 **Documentation**: Baca documentation terlebih dahulu
- 💬 **Discord**: [Join our community](https://discord.gg/enigma-protocol)
- 🐛 **GitHub Issues**: [Report bugs](https://github.com/enigma-protocol/issues)
- 📧 **Email**: support@enigma-protocol.xyz

### Community Channels
- **Discord**: Real-time community chat
- **Twitter**: [@EnigmaProtocol](https://twitter.com/EnigmaProtocol)
- **Medium**: Technical blog posts
- **YouTube**: Video tutorials

## 📜 License

Distributed under the MIT License. See [LICENSE](../LICENSE) for more information.

## 🙏 Acknowledgments

- Ethereum Foundation untuk EIP standards
- Supabase team untuk excellent backend platform
- React team untuk amazing frontend framework
- Open source community untuk tools dan libraries
- Privacy researchers untuk ZKP implementations

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintainers:** Enigma Protocol Core Team

*Happy coding! 🚀*