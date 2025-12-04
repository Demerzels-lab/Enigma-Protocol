import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Activity, Bot, Shield, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { generateMockAgents, generateMockTransactions, Transaction, Agent } from '../lib/mockData';

export default function Dashboard() {
  const { account } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    apy: 0,
    activeAgents: 0,
    privacyStatus: 'Protected'
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Initial Data Load ---
  useEffect(() => {
    loadDashboardData();
  }, [account]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const allAgents = generateMockAgents();
      const activeAgents = allAgents.filter(a => a.status === 'active').slice(0, 3);
      setAgents(activeAgents);

      // Initial batch of transactions
      const mockTxs = generateMockTransactions(8);
      setTransactions(mockTxs);

      const avgApy = activeAgents.reduce((acc, curr) => acc + curr.performance_metrics.averageApy, 0) / activeAgents.length;

      setPortfolio({
        totalValue: 12450.80, 
        apy: parseFloat(avgApy.toFixed(2)),
        activeAgents: activeAgents.length,
        privacyStatus: 'Maximum'
      });

      setIsLoading(false);
    }, 1200);
  };

  // --- 2. Live Data Simulation Effects ---
  
  // Effect: Randomly add new transactions every few seconds
  useEffect(() => {
    if (isLoading) return;

    const txInterval = setInterval(() => {
      // 30% chance to add a new transaction to make it feel organic (not robotic)
      if (Math.random() > 0.7) {
        const newTx = generateMockTransactions(1)[0];
        // Set timestamp to "now"
        newTx.timestamp = new Date();
        
        setTransactions(prev => {
          const updated = [newTx, ...prev];
          return updated.slice(0, 10); // Keep only last 10
        });
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(txInterval);
  }, [isLoading]);

  // Effect: Fluctuate Portfolio Value (Market Ticker)
  useEffect(() => {
    if (isLoading) return;

    const priceInterval = setInterval(() => {
      setPortfolio(prev => ({
        ...prev,
        // Fluctuate value by -0.5% to +0.5%
        totalValue: prev.totalValue * (1 + (Math.random() * 0.01 - 0.005))
      }));
    }, 3000);

    return () => clearInterval(priceInterval);
  }, [isLoading]);


  const portfolioMetrics = [
    {
      label: 'Total Portfolio Value',
      value: `$${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.5%',
      positive: true,
      icon: TrendingUp
    },
    {
      label: 'Average APY',
      value: `${portfolio.apy}%`,
      change: '+2.4%',
      positive: true,
      icon: Activity
    },
    {
      label: 'Active AI Agents',
      value: portfolio.activeAgents.toString(),
      change: 'All Systems Operational',
      positive: true,
      icon: Bot
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-semantic-success" />;
      case 'processing': return <Loader2 className="w-4 h-4 text-accent-500 animate-spin" />;
      case 'error': return <XCircle className="w-4 h-4 text-semantic-error" />;
      default: return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="min-h-screen text-text-primary pt-28 pb-12 px-6 bg-[#000202] font-body">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 text-white">Command Center</h1>
              <p className="text-neutral-400 font-mono text-sm">
                Welcome back, <span className="text-accent-500">{account ? `${account.slice(0,6)}...${account.slice(-4)}` : 'GHOST_USER'}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#050A0A] rounded border border-accent-500/30 shadow-[0_0_15px_rgba(0,224,208,0.1)]">
              <Shield className="w-4 h-4 text-accent-500 animate-pulse" />
              <span className="text-xs font-mono text-accent-500 font-medium tracking-wider uppercase">Privacy: {portfolio.privacyStatus}</span>
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
                className="bg-[#030505] p-6 border border-neutral-800 hover:border-accent-500/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <metric.icon className="w-16 h-16 text-accent-500" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="p-2 bg-accent-500/10 rounded-sm border border-accent-500/20">
                    <metric.icon className="w-6 h-6 text-accent-500" />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-mono ${metric.positive ? 'text-semantic-success' : 'text-semantic-error'}`}>
                    {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight tabular-nums">
                    {isLoading ? <div className="h-8 w-24 bg-neutral-800 animate-pulse rounded" /> : metric.value}
                  </div>
                  <div className="text-xs text-neutral-500 font-mono uppercase tracking-wider">{metric.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active AI Agents Column */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-white">
                <Bot className="w-5 h-5 text-accent-500" /> Active Agents
              </h2>
              <div className="space-y-4">
                {isLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-24 bg-[#030505] border border-neutral-800 animate-pulse" />)
                ) : (
                  agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="bg-[#030505] p-5 border border-neutral-800 hover:border-accent-500/40 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white group-hover:text-accent-400 transition-colors">{agent.name}</h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-500/10 rounded text-[10px] font-mono text-accent-500 uppercase">
                          <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
                          Active
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-neutral-400 text-xs font-mono">
                          APY: <span className="text-white">{agent.performance_metrics.averageApy}%</span>
                        </div>
                        <div className="text-neutral-400 text-xs font-mono">
                          SR: <span className="text-accent-500">{agent.performance_metrics.successRate}%</span>
                        </div>
                      </div>
                      <div className="mt-3 w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-500/50 w-3/4 animate-pulse" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Transactions Column - LIVE FEED */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-accent-500" /> Live Feed
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono text-accent-500 tracking-widest uppercase">RECEIVING_DATA</span>
                </div>
              </div>
              
              <div className="bg-[#030505] border border-neutral-800 overflow-hidden relative">
                {/* Scanline decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500/50 to-transparent opacity-20" />
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#050A0A] border-b border-neutral-800">
                      <tr>
                        <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">Status</th>
                        <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">Type</th>
                        <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">Amount</th>
                        <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">Privacy</th>
                        <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500 text-right">Time</th>
                      </tr>
                    </thead>
                    {/* Animated Table Body */}
                    <tbody className="divide-y divide-neutral-800">
                      <AnimatePresence initial={false} mode='popLayout'>
                        {isLoading ? (
                          [1, 2, 3, 4, 5].map(i => (
                            <tr key={i}>
                              <td colSpan={5} className="p-4"><div className="h-4 bg-neutral-800/50 animate-pulse rounded" /></td>
                            </tr>
                          ))
                        ) : transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <motion.tr
                              layout
                              initial={{ opacity: 0, x: -20, backgroundColor: "rgba(0, 224, 208, 0.1)" }}
                              animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              key={tx.id}
                              className="hover:bg-white/[0.02] transition-colors group relative"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(tx.status)}
                                  <span className={`text-xs font-mono uppercase ${tx.status === 'success' ? 'text-semantic-success' : 'text-neutral-400'}`}>
                                    {tx.status}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-sm font-medium text-white capitalize">{tx.type.replace('_', ' ')}</span>
                                <div className="text-[10px] font-mono text-neutral-500">{tx.txHash.slice(0, 12)}...</div>
                              </td>
                              <td className="p-4">
                                <span className="text-sm font-mono text-accent-400">{tx.amount} {tx.token}</span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 text-[10px] uppercase font-mono rounded border ${
                                  tx.privacyLevel === 'maximum' 
                                    ? 'border-accent-500/30 text-accent-500 bg-accent-500/5' 
                                    : 'border-neutral-700 text-neutral-400'
                                }`}>
                                  {tx.privacyLevel}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <span className="text-xs text-neutral-500 font-mono">
                                  {tx.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                </span>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-neutral-500 font-mono">
                              // NO_DATA_FOUND
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}