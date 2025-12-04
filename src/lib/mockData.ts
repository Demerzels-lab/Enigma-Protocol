import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'stealth_gen' | 'swap' | 'yield_harvest';
  amount: string;
  token: string;
  privacyLevel: 'standard' | 'advanced' | 'maximum';
  status: 'pending' | 'processing' | 'success' | 'error';
  timestamp: Date;
  txHash: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  agent_type: 'strategy' | 'risk_management' | 'arbitrage' | 'liquidity' | 'privacy';
  capabilities: any;
  reputation_score: number;
  performance_metrics: {
    totalExecutions: number;
    successRate: number;
    averageApy: number;
    totalValueLocked: number;
  };
  zk_proof_commitment: string;
  trust_model: 'trustless' | 'verified' | 'community';
  pricing_model: 'free' | 'subscription' | 'performance' | 'one_time';
  status: 'active' | 'idle' | 'training';
}

// --- Helpers ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);
const randomHash = () => '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// --- Generators ---

export const generateMockTransactions = (count: number): Transaction[] => {
  const types: Transaction['type'][] = ['deposit', 'swap', 'yield_harvest', 'stealth_gen'];
  const statuses: Transaction['status'][] = ['success', 'success', 'success', 'processing', 'pending']; // bias towards success
  const tokens = ['ETH', 'USDC', 'WBTC', 'GLMR'];
  
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    type: types[randomInt(0, types.length - 1)],
    amount: randomFloat(0.1, 50),
    token: tokens[randomInt(0, tokens.length - 1)],
    privacyLevel: ['standard', 'advanced', 'maximum'][randomInt(0, 2)] as any,
    status: statuses[randomInt(0, statuses.length - 1)],
    timestamp: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()), // Last 7 days
    txHash: randomHash(),
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateMockAgents = (): Agent[] => {
  return [
    {
      id: 'agent-1',
      name: 'Yield Optimizer Pro',
      description: 'Advanced AI agent for optimizing yield farming strategies across multiple DeFi protocols with ZK proof verification.',
      agent_type: 'strategy',
      capabilities: { strategies: ['Delta Neutral', 'Yield Farming'], risk: 'Moderate' },
      reputation_score: 98,
      performance_metrics: {
        totalExecutions: randomInt(1000, 5000),
        successRate: parseFloat(randomFloat(95, 99.9)),
        averageApy: parseFloat(randomFloat(12, 45)),
        totalValueLocked: randomInt(1000000, 5000000)
      },
      zk_proof_commitment: randomHash(),
      trust_model: 'trustless',
      pricing_model: 'performance',
      status: 'active'
    },
    {
      id: 'agent-2',
      name: 'Privacy Sentinel',
      description: 'Privacy-first AI agent that ensures transaction anonymity with ZK proof verification and stealth address generation.',
      agent_type: 'privacy',
      capabilities: { features: ['Traffic Analysis Protection', 'Mixer Integration'] },
      reputation_score: 100,
      performance_metrics: {
        totalExecutions: randomInt(5000, 10000),
        successRate: 99.9,
        averageApy: 0,
        totalValueLocked: 0
      },
      zk_proof_commitment: randomHash(),
      trust_model: 'verified',
      pricing_model: 'free',
      status: 'active'
    },
    {
      id: 'agent-3',
      name: 'Arbitrage Hunter',
      description: 'High-speed arbitrage detection across DEXs with automatic execution for maximum profit opportunities.',
      agent_type: 'arbitrage',
      capabilities: { exchanges: ['Uniswap', 'Sushiswap', 'Curve'], speed: '<50ms' },
      reputation_score: 92,
      performance_metrics: {
        totalExecutions: randomInt(800, 2000),
        successRate: parseFloat(randomFloat(85, 95)),
        averageApy: parseFloat(randomFloat(20, 150)),
        totalValueLocked: randomInt(500000, 2000000)
      },
      zk_proof_commitment: randomHash(),
      trust_model: 'community',
      pricing_model: 'performance',
      status: 'active'
    },
    {
      id: 'agent-4',
      name: 'Liquidity Manager',
      description: 'Automated liquidity provisioning with dynamic rebalancing for optimal returns and minimal impermanent loss.',
      agent_type: 'liquidity',
      capabilities: { protocols: ['Aave', 'Compound'], rebalancing: 'Daily' },
      reputation_score: 95,
      performance_metrics: {
        totalExecutions: randomInt(300, 1000),
        successRate: parseFloat(randomFloat(92, 98)),
        averageApy: parseFloat(randomFloat(8, 25)),
        totalValueLocked: randomInt(2000000, 8000000)
      },
      zk_proof_commitment: randomHash(),
      trust_model: 'trustless',
      pricing_model: 'free',
      status: 'idle'
    },
    {
      id: 'agent-5',
      name: 'Risk Shield AI',
      description: 'Real-time risk monitoring and portfolio protection with automated circuit breakers to safeguard your assets.',
      agent_type: 'risk_management',
      capabilities: { monitoring: '24/7', reactionTime: 'Instant' },
      reputation_score: 99,
      performance_metrics: {
        totalExecutions: randomInt(100, 500),
        successRate: 100,
        averageApy: 0,
        totalValueLocked: randomInt(10000000, 50000000)
      },
      zk_proof_commitment: randomHash(),
      trust_model: 'verified',
      pricing_model: 'subscription',
      status: 'active'
    },
    {
      id: 'agent-6',
      name: 'DeFi Strategy Bot',
      description: 'Multi-strategy trading agent combining yield farming, staking, and liquidity provision for diversified returns.',
      agent_type: 'strategy',
      capabilities: { strategies: ['Long/Short', 'Staking'], risk: 'High' },
      reputation_score: 88,
      performance_metrics: {
        totalExecutions: randomInt(2000, 6000),
        successRate: parseFloat(randomFloat(88, 94)),
        averageApy: parseFloat(randomFloat(15, 60)),
        totalValueLocked: randomInt(1500000, 4000000)
      },
      zk_proof_commitment: randomHash(),
      trust_model: 'community',
      pricing_model: 'performance',
      status: 'training'
    }
  ];
};