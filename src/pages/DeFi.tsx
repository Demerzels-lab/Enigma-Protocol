import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Lock, Coins, AlertCircle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';

// Mock Data Generator for DeFi Stats
const generatePoolData = () => {
  return [
    { asset: 'ETH', supplyAPY: (3 + Math.random()).toFixed(2), borrowAPY: (5 + Math.random()).toFixed(2), total: (120 + Math.random() * 5).toFixed(1), util: Math.floor(60 + Math.random() * 10) },
    { asset: 'USDC', supplyAPY: (4 + Math.random()).toFixed(2), borrowAPY: (7 + Math.random()).toFixed(2), total: (80 + Math.random() * 5).toFixed(1), util: Math.floor(70 + Math.random() * 10) },
    { asset: 'WBTC', supplyAPY: (2 + Math.random()).toFixed(2), borrowAPY: (4 + Math.random()).toFixed(2), total: (40 + Math.random() * 5).toFixed(1), util: Math.floor(50 + Math.random() * 10) },
  ];
};

export default function DeFi() {
  const [activeTab, setActiveTab] = useState<'lending' | 'staking' | 'farming'>('lending');
  const [lendingPools, setLendingPools] = useState(generatePoolData());
  const { account } = useWallet();

  // Simulate Live Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLendingPools(generatePoolData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#000202] text-text-primary pt-28 pb-12 px-6 font-body">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-white">DeFi Protocols</h1>
              <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">
                // Execute on-chain strategies with privacy
              </p>
            </div>
            {account && (
              <div className="px-4 py-2 bg-accent-500/10 border border-accent-500/30 rounded text-xs font-mono text-accent-500">
                WALLET CONNECTED :: {account.slice(0,6)}...
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8">
            {['lending', 'staking', 'farming'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border transition-all ${
                  activeTab === tab
                    ? 'bg-accent-500 text-black border-accent-500 font-bold'
                    : 'bg-[#050A0A] text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Action Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#030505] border border-neutral-800">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                  <h3 className="font-mono text-xs uppercase text-neutral-400">Live Markets</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-500 font-mono">UPDATED</span>
                  </div>
                </div>
                
                <table className="w-full text-left">
                  <thead className="bg-[#050A0A] border-b border-neutral-800">
                    <tr>
                      <th className="p-4 text-[10px] font-mono text-neutral-500 uppercase">Asset</th>
                      <th className="p-4 text-[10px] font-mono text-neutral-500 uppercase">Supply APY</th>
                      <th className="p-4 text-[10px] font-mono text-neutral-500 uppercase">Borrow APY</th>
                      <th className="p-4 text-[10px] font-mono text-neutral-500 uppercase">Total Supplied</th>
                      <th className="p-4 text-[10px] font-mono text-neutral-500 uppercase">Util</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {lendingPools.map((pool, idx) => (
                      <tr key={idx} className="hover:bg-accent-500/5 transition-colors group cursor-pointer">
                        <td className="p-4 font-bold text-white">{pool.asset}</td>
                        <td className="p-4 font-mono text-semantic-success">{pool.supplyAPY}%</td>
                        <td className="p-4 font-mono text-neutral-400">{pool.borrowAPY}%</td>
                        <td className="p-4 font-mono text-white">${pool.total}M</td>
                        <td className="p-4">
                          <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-accent-500" style={{ width: `${pool.util}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar / Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#050A0A] border border-neutral-800 p-6">
                <h3 className="font-display font-bold text-xl text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">Asset to Supply</label>
                    <select className="w-full bg-black border border-neutral-800 text-white p-3 font-mono text-sm focus:border-accent-500 outline-none">
                      <option>ETH</option>
                      <option>USDC</option>
                      <option>WBTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">Amount</label>
                    <input type="number" placeholder="0.00" className="w-full bg-black border border-neutral-800 text-white p-3 font-mono text-sm focus:border-accent-500 outline-none" />
                  </div>
                  <button className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-accent-400 transition-colors">
                    Execute Supply
                  </button>
                </div>
              </div>

              <div className="bg-accent-500/5 border border-accent-500/20 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent-500 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Privacy Mode Active</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      All lending positions are wrapped in a ZK-proof container. Your wallet address is not directly linked to the lending pool.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}