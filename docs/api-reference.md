# API Reference - Frontend Integration 📚

Dokumentasi API untuk integrasi frontend Enigma Protocol

## 🔗 Base Configuration

### Supabase Client Setup

```typescript
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

// Database types
export interface AIAgent {
  id: string
  name: string
  description: string
  agent_type: 'strategy' | 'privacy' | 'risk' | 'arbitrage' | 'liquidity' | 'multi-strategy'
  capabilities: string[]
  reputation_score: number
  performance_metrics: {
    totalExecutions: number
    successRate: number
    averageApy: number
  }
  pricing_model: 'free' | 'subscription' | 'performance'
  avg_yield: number
  active: boolean
  created_at: string
}

export interface PoolStatistics {
  totalPoolSize: number
  activeMixers: number
  anonymitySet: number
  privacyScore: number
  updatedAt: string
}
```

## 🏊 Privacy Pools API

### Get Pool Statistics

```typescript
export const getPoolStats = async () => {
  const { data, error } = await supabase.functions.invoke('get-pool-stats')
  if (error) throw error
  return data.data
}

// React Hook
export const usePoolStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getPoolStats()
        setStats(result)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])
  
  return { stats, loading }
}
```

### Create Deposit

```typescript
export const createDeposit = async (params: {
  userWallet: string
  amount: string
  token: string
  poolType: 'main' | 'high_volume' | 'private'
}) => {
  const { data, error } = await supabase.functions.invoke('create-deposit', {
    body: params
  })
  if (error) throw error
  return data.data
}
```

## 🤖 AI Agents API

### Get Available Agents

```typescript
export const getAIAgents = async (filters?: {
  agentType?: string
  active?: boolean
}) => {
  let query = supabase
    .from('ai_agents')
    .select('*')
    .order('reputation_score', { ascending: false })

  if (filters?.agentType) {
    query = query.eq('agent_type', filters.agentType)
  }
  
  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

// React Hook
export const useAIAgents = (filters?: { agentType?: string; active?: boolean }) => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAIAgents(filters)
        setAgents(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAgents()
  }, [filters?.agentType, filters?.active])
  
  return { agents, loading }
}
```

### Activate AI Agent

```typescript
export const activateAgent = async (params: {
  userWallet: string
  agentId: string
  configuration: {
    riskLevel?: 'low' | 'medium' | 'high'
    maxAllocation?: string
    strategies?: string[]
  }
}) => {
  const { data, error } = await supabase.functions.invoke('activate-agent', {
    body: params
  })
  if (error) throw error
  return data.data
}
```

## 🔐 Privacy Features API

### Generate Stealth Address

```typescript
export const generateStealthAddress = async (userWallet: string) => {
  const { data, error } = await supabase.functions.invoke('generate-stealth-address', {
    body: { userWallet }
  })
  if (error) throw error
  return data.data
}

// React Hook
export const useStealthAddress = () => {
  const [loading, setLoading] = useState(false)
  
  const generateStealthAddress = async (userWallet: string) => {
    setLoading(true)
    try {
      const result = await generateStealthAddress(userWallet)
      return result
    } finally {
      setLoading(false)
    }
  }
  
  return { generateStealthAddress, loading }
}
```

## 📊 Real-time Subscriptions

### Pool Statistics Real-time

```typescript
export const subscribeToPoolStats = (callback: (stats: any) => void) => {
  return supabase
    .channel('pool_statistics')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'pool_statistics' },
      (payload) => callback(payload.new)
    )
    .subscribe()
}

// React Hook
export const useRealTimePoolStats = () => {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    // Initial fetch
    getPoolStats().then(setStats)
    
    // Subscribe to changes
    const subscription = subscribeToPoolStats((newStats) => {
      setStats(newStats)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  return stats
}
```

## 🔐 Authentication

### Wallet Connection

```typescript
// Wallet context
export const WalletContext = createContext()

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    
    setAccount(accounts[0])
    setProvider(provider)
    setSigner(signer)
  }
  
  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
  }
  
  return { account, provider, signer, connectWallet, disconnectWallet }
}
```

## 🛠️ Error Handling & Loading

### Error Handling

```typescript
export const handleAPIError = (error: any) => {
  if (error.message?.includes('fetch')) {
    return 'Network error. Please check your connection.'
  }
  return error.message || 'An unexpected error occurred'
}

// Loading component
export const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }
  return <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
}
```

## 📱 Usage Examples

### Complete Dashboard Component

```tsx
function PrivacyDeFiDashboard() {
  const { stats, loading: statsLoading } = usePoolStats()
  const { agents, loading: agentsLoading } = useAIAgents({ active: true })
  const { createDeposit } = useCreateDeposit()
  const { connectWallet } = useWallet()
  
  if (statsLoading || agentsLoading) {
    return <LoadingSkeleton type="card" />
  }
  
  return (
    <div className="space-y-6">
      {/* Pool Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <h3>Total Pool Size</h3>
          <p className="text-2xl font-bold">
            ${stats ? (stats.totalPoolSize / 1000000).toFixed(1) + 'M' : '0'}
          </p>
        </div>
        <div className="stat-card">
          <h3>Privacy Score</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats?.privacyScore || 0}/100
          </p>
        </div>
        <div className="stat-card">
          <h3>Active Mixers</h3>
          <p className="text-2xl font-bold">
            {stats?.activeMixers.toLocaleString() || 0}
          </p>
        </div>
      </div>
      
      {/* AI Agents */}
      <div className="agents-section">
        <h2>Available AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <AgentCard 
              key={agent.id} 
              agent={agent}
              onActivate={() => activateAgent(agent.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Connect Wallet Button */}
      <button onClick={connectWallet} className="wallet-button">
        Connect Wallet
      </button>
    </div>
  )
}
```

### Agent Activation

```tsx
function AgentCard({ agent, onActivate }) {
  return (
    <div className="agent-card">
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>
      <div className="agent-stats">
        <span>Reputation: {agent.reputation_score}%</span>
        <span>Avg Yield: {agent.avg_yield}%</span>
        <span>Pricing: {agent.pricing_model}</span>
      </div>
      <button onClick={() => onActivate()} className="activate-btn">
        Activate Agent
      </button>
    </div>
  )
}
```

---

**API Version:** 1.0.0  
**Last Updated:** December 2025  
**Rate Limits:** 100 requests/minute per IP