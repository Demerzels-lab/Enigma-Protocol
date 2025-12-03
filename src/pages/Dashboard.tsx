import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Bot, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getUserAgents, getUserPortfolio, getRecentTransactions } from '../lib/api';
import { useWallet } from '../contexts/WalletContext';

interface Agent {
  id: string;
  name: string;
  agent_type: string;
  reputation_score: number;
  performance_metrics: {
    averageApy: number;
    successRate: number;
  };
}

interface Transaction {
  id: string;
  tx_type: string;
  amount: number;
  privacy_level: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { account } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState({
    totalValue: 125000,
    apy: 38.5,
    activeAgents: 3,
    privacyStatus: 'anonymous'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [account]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadAgents(),
        loadTransactions(),
        loadPortfolio()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPortfolio = async () => {
    if (account) {
      try {
        const portfolioData = await getUserPortfolio(account);
        if (portfolioData) {
          // Calculate APY from active agents
          const activeAgentsData = await getUserAgents(account);
          let totalApy = 0;
          if (activeAgentsData && activeAgentsData.length > 0) {
            totalApy = activeAgentsData.reduce((sum: number, ua: any) => {
              return sum + (ua.ai_agents?.performance_metrics?.averageApy || 0);
            }, 0) / activeAgentsData.length;
          }
          
          setPortfolio({
            totalValue: portfolioData.total_value || 125000,
            apy: totalApy || 38.5,
            activeAgents: activeAgentsData?.length || 0,
            privacyStatus: portfolioData.privacy_status || 'anonymous'
          });
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      }
    }
  };

  const loadAgents = async () => {
    const { data } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('active', true)
      .limit(3);
    
    if (data) setAgents(data);
  };

  const loadTransactions = async () => {
    try {
      const data = await getRecentTransactions(5);
      if (data) {
        // Transform data to match Transaction interface
        const formattedTransactions = data.map((tx: any) => ({
          id: tx.id,
          tx_type: tx.tx_type || tx.type || 'unknown',
          amount: tx.amount || 0,
          privacy_level: tx.privacy_level || 'anonymous',
          status: tx.status || 'pending',
          created_at: tx.created_at
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      // Fallback to direct supabase query
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setTransactions(data);
    }
  };

  const portfolioMetrics = [
    {
      label: 'Total Portfolio Value',
      value: `$${portfolio.totalValue.toLocaleString()}`,
      change: '+12.5%',
      positive: true,
      icon: TrendingUp
    },
    {
      label: 'Average APY',
      value: `${portfolio.apy}%`,
      change: '+5.2%',
      positive: true,
      icon: Activity
    },
    {
      label: 'Active AI Agents',
      value: portfolio.activeAgents.toString(),
      change: 'All Running',
      positive: true,
      icon: Bot
    },
  ];

  return (
    <div className="min-h-screen text-text-primary pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
              <p className="text-neutral-300">Anonymous portfolio tracking with privacy preservation</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-neutral-50 rounded-lg border border-semantic-success/20">
              <Shield className="w-4 h-4 text-semantic-success animate-pulse-glow" />
              <span className="text-sm text-semantic-success font-medium">Fully Protected</span>
            </div>
          </div>

          {/* Portfolio Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {portfolioMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20 hover:border-primary-500/40 transition-all duration-normal hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className="w-8 h-8 text-primary-500" />
                  <div className={`flex items-center space-x-1 text-sm font-medium ${metric.positive ? 'text-semantic-success' : 'text-semantic-error'}`}>
                    {metric.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-neutral-300">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Active AI Agents */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Active AI Agents</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-neutral-50 rounded-xl p-6 border border-neutral-400/20 hover:border-accent-500/40 transition-all duration-normal"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-accent-500/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-accent-500" />
                    </div>
                    <div className="px-2 py-1 bg-semantic-success/20 text-semantic-success rounded text-xs font-semibold">
                      Active
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                  <p className="text-sm text-neutral-300 mb-4 capitalize">{agent.agent_type.replace('_', ' ')}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-300">APY:</span>
                    <span className="text-semantic-success font-semibold">{agent.performance_metrics.averageApy}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-neutral-300">Success Rate:</span>
                    <span className="text-primary-500 font-semibold">{agent.performance_metrics.successRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
            <div className="bg-neutral-50 rounded-2xl border border-neutral-400/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-400/20">
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Type</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Amount</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Privacy Level</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-neutral-400/10 hover:bg-neutral-100/50">
                          <td className="p-4 text-sm capitalize">{tx.tx_type.replace('_', ' ')}</td>
                          <td className="p-4 text-sm font-mono">${tx.amount.toFixed(2)}</td>
                          <td className="p-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.privacy_level === 'anonymous' ? 'bg-semantic-success/20 text-semantic-success' :
                              tx.privacy_level === 'mixed' ? 'bg-semantic-warning/20 text-semantic-warning' :
                              'bg-semantic-error/20 text-semantic-error'
                            }`}>
                              {tx.privacy_level}
                            </span>
                          </td>
                          <td className="p-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.status === 'completed' ? 'bg-semantic-success/20 text-semantic-success' :
                              'bg-semantic-warning/20 text-semantic-warning'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-neutral-300">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-300">
                          No transactions yet. Start trading to see your history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
