# Enigma Protocol 🛡️🤖

> Platform Privacy DeFi dengan AI Agents Terdecentralisasi dan Zero Knowledge Proofs

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/enigma-protocol/core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E.svg)](https://supabase.com/)

## 📋 Deskripsi Proyek

Enigma Protocol adalah platform Privacy DeFi terdepan yang menggabungkan teknologi Zero Knowledge Proofs (ZKP), AI Agents berbasis ERC-8004, dan smart contracts untuk menciptakan pengalaman DeFi yang benar-benar приват dan terdesentralisasi.

### 🎯 Visi & Misi
- **Visi**: Menjadi platform DeFi terdepan yang mengutamakan privasi tanpa mengorbankan fungsionalitas
- **Misi**: Menghubungkan teknologi ZKP dengan AI agents untuk menciptakan masa depan DeFi yang приват, efisien, dan terdesentralisasi

## ✨ Fitur Utama

### 🔒 Privacy DeFi
- **Stealth Address Generation**: Alamat único untuk setiap transaksi dengan teknologi EIP-5564
- **Zero Knowledge Proofs**: Verifikasi transaksi tanpa mengungkap informasi sensitif
- **Anonymity Pool**: Pool privasi dengan sistem mixing untuk memastikan anonimitas transaksi
- **Transaction Anonymity**: Privasi total dalam setiap transaksi DeFi

### 🤖 ERC-8004 AI Agents
- **Intelligent Agents**: 6 jenis AI agent untuk berbagai strategi DeFi
  - Yield Optimizer Pro: Optimasi hasil farming lintas protokol
  - Privacy Sentinel: Jaminan privasi dengan ZKP verification
  - Risk Shield AI: Pemantauan risiko real-time dengan circuit breakers
  - Arbitrage Hunter: Deteksi arbitrase otomatis dengan eksekusi kecepatan tinggi
  - Liquidity Manager: Manajemen likuiditas otomatis dengan rebalancing dinamis
  - DeFi Strategy Bot: Multi-strategy trading untuk diversifikasi hasil

### 🔐 Zero Knowledge Proofs
- **Cryptographic Verification**: Verifikasi tanpa pengungkapan
- **zkSNARKs Integration**: Teknologi zkSNARKs untuk privasi maksimal
- **Commitment Schemes**: Sistem commitment untuk validasi transaksi
- **Privacy-First Architecture**: Arsitektur yang mengutamakan privasi

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18.3**: Framework UI modern dengan hooks dan context API
- **TypeScript**: Type safety dan developer experience yang superior
- **Vite**: Build tool generasi terbaru untuk development yang cepat
- **Tailwind CSS**: Utility-first CSS framework untuk styling yang efisien
- **Framer Motion**: Animasi dan interaksi yang smooth
- **Radix UI**: Komponen UI yang accessible dan customizable

### Backend & Database
- **Supabase**: Backend-as-a-Service dengan PostgreSQL dan real-time subscriptions
- **PostgreSQL**: Database relasional dengan support JSON dan full-text search
- **Row Level Security (RLS)**: Security layer untuk data protection

### Blockchain & Crypto
- **Ethers.js v6**: Library Ethereum untuk smart contract interactions
- **ERC-8004 Standard**: Standar AI Agents untuk DeFi
- **EIP-5564**: Stealth address standard
- **Web3 Integration**: Koneksi seamless dengan wallet Ethereum

### Infrastructure
- **Edge Functions**: Serverless functions di edge untuk latency minimal
- **Vercel/Netlify**: Deployment platform untuk aplikasi modern
- **pnpm**: Package manager yang efisien

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) atau npm
- Git

### 1. Clone Repository
```bash
git clone https://github.com/enigma-protocol/core.git
cd enigma-protocol
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup
Buat file `.env.local` di root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ETHEREUM_RPC_URL=your_ethereum_rpc_url
VITE_CHAIN_ID=1
```

### 4. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Start Development Server
```bash
# Start development server
pnpm dev

# Build untuk production
pnpm build

# Preview production build
pnpm preview
```

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server dengan hot reload |
| `pnpm build` | Build aplikasi untuk production |
| `pnpm build:prod` | Build production dengan optimizations |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint untuk code quality |
| `pnpm clean` | Clean node_modules dan reinstall dependencies |

## 🏗️ Arsitektur Proyek

```
src/
├── components/          # Reusable UI components
│   ├── marketplace/     # AI Agent marketplace components
│   ├── pools/          # Privacy pool components
│   └── ...
├── contexts/           # React contexts (Wallet, Theme, etc.)
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries (API, Supabase config)
├── pages/             # Route pages
│   ├── Landing.tsx    # Homepage dengan platform stats
│   ├── Marketplace.tsx # AI Agent marketplace
│   ├── Pools.tsx      # Privacy pools interface
│   ├── DeFi.tsx       # DeFi features
│   └── ...
└── utils/             # Helper functions dan calculations
```

## 🔗 API Integration

### Supabase Edge Functions
Platform menggunakan 5 edge functions utama:

1. **get-pool-stats**: Statistik real-time privacy pools
2. **generate-stealth-address**: Generasi alamat rahasia dengan ZKP
3. **create-deposit**: Pembuatan deposit ke privacy pools
4. **activate-agent**: Aktivasi dan konfigurasi AI agents
5. **update-agent-data**: Update data dan performa AI agents

## 📊 Database Schema

### Core Tables
- **ai_agents**: Informasi AI agents dengan capabilities dan pricing
- **users**: Data user dengan wallet address
- **transactions**: Log transaksi dengan privacy level
- **stealth_addresses**: Alamat rahasia yang dihasilkan
- **pool_statistics**: Statistik privacy pools real-time
- **user_agents**: Mappings user dengan agents yang digunakan

### RLS Policies
Semua tabel menggunakan Row Level Security untuk proteksi data:
- Public read access untuk data publik
- User-specific access untuk data private
- Secure insertion dengan proper validation

## 🧪 Testing

### Manual Testing
```bash
# Start testing mode
pnpm test:manual

# Test specific components
pnpm test:marketplace
pnpm test:pools
```

### Automated Testing
```bash
# Run all tests
pnpm test

# Run tests dengan coverage
pnpm test:coverage
```

## 🚀 Deployment

### Production Build
```bash
# Build dengan optimizations
pnpm build:prod

# Preview production build
pnpm preview
```

### Supabase Edge Functions
```bash
# Deploy semua functions
supabase functions deploy

# Deploy specific function
supabase functions deploy get-pool-stats
```

### Database Migrations
```bash
# Apply migrations
supabase db push

# Reset database (development only)
supabase db reset
```

## 📈 Monitoring & Analytics

### Real-time Metrics
- **Pool Statistics**: Total pool size, active mixers, anonymity set
- **Agent Performance**: Success rate, average APY, reputation scores
- **Transaction Volume**: Deposit/withdrawal tracking dengan privacy scores

### Privacy Score Calculation
Privacy Score = (Pool Size Score + Mixer Score + Anonymity Score)
- Pool Size Score: Max 40 points (berdasarkan total pool size)
- Mixer Score: Max 30 points (berdasarkan active mixers)
- Anonymity Score: Max 30 points (berdasarkan anonymity set)

## 🔐 Security Features

### Data Protection
- **Row Level Security**: RLS pada semua tabel
- **Encrypted Storage**: Sensitive data dienkripsi
- **API Rate Limiting**: Proteção terhadap abuse
- **Input Validation**: Validasi input dengan Zod schemas

### Privacy Protection
- **Stealth Addresses**: Alamat únicas untuk setiap transaksi
- **ZK Proofs**: Zero-knowledge verification
- **Anonymity Pools**: Mixing untuk anonimitas
- **Private Transactions**: Transaksi tanpa pengungkapan identitas

## 🛡️ Contributing

Kami welcome kontribusi dari komunitas! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk guidelines.

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔗 Useful Links

- [Documentation](./docs/)
- [API Reference](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Edge Functions](./docs/edge-functions.md)
- [Supabase Setup](./docs/supabase-setup.md)

## 🤝 Support

- **Discord**: [Join our community](https://discord.gg/enigma-protocol)
- **Twitter**: [@EnigmaProtocol](https://twitter.com/EnigmaProtocol)
- **Email**: support@enigma-protocol.xyz
- **Documentation**: [docs.enigma-protocol.xyz](https://docs.enigma-protocol.xyz)

---

**Built with ❤️ by the Enigma Protocol Team**

*Empowering DeFi dengan Privacy dan AI* 🚀