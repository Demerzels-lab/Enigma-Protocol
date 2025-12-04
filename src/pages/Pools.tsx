import { useState, useEffect } from 'react';
import { Shield, Droplet, Activity, Lock, RefreshCw, Copy, Check, EyeOff, Hash, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivacyScoreBreakdown from '@/components/pools/PrivacyScoreBreakdown';
import GasEstimator from '@/components/pools/GasEstimator';
import { calculatePrivacyScore, estimateGasCost } from '@/utils/privacyCalculations';
import { useWallet } from '@/contexts/WalletContext';
import { generateMockTransactions, Transaction } from '@/lib/mockData';

// --- Terminal Log Component (Reused for Stealth Gen) ---
const TerminalLog = ({ steps, onComplete }: { steps: string[], onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    let delay = 0;
    steps.forEach((step, index) => {
      delay += Math.random() * 800 + 400;
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${step}`]);
        if (index === steps.length - 1) setTimeout(onComplete, 500);
      }, delay);
    });
  }, []);

  return (
    <div className="bg-[#0A0A0A] border border-neutral-800 rounded-lg p-4 font-mono text-xs text-accent-500 h-48 overflow-y-auto custom-scrollbar">
      {logs.map((log, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-1">
          {log}
        </motion.div>
      ))}
      <motion.div 
        animate={{ opacity: [0, 1] }} 
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-2 h-4 bg-accent-500 inline-block align-middle ml-1"
      />
    </div>
  );
};

export default function Pools() {
  const { account } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<'standard' | 'advanced' | 'maximum'>('standard');
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // --- 1. Live Data State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [poolStats, setPoolStats] = useState({ size: 12450000, mixers: 128, anonymity: 4500 });

  // --- 2. Live Data Generators ---
  useEffect(() => {
    // Initial Load
    setTransactions(generateMockTransactions(5));

    // Periodic "Live Mix" Injection
    const txInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance to add new mix event
        const newTx = generateMockTransactions(1)[0];
        newTx.type = 'deposit'; // Force type to deposit/mix
        newTx.timestamp = new Date();
        newTx.status = 'success';
        
        setTransactions(prev => [newTx, ...prev].slice(0, 8)); // Keep last 8
        
        // Update pool stats slightly
        setPoolStats(prev => ({
          size: prev.size + parseFloat(newTx.amount) * 2000,
          mixers: prev.mixers + 1,
          anonymity: prev.anonymity + 1
        }));
      }
    }, 2500);

    return () => clearInterval(txInterval);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowTerminal(true);
    setGeneratedAddress('');
  };

  const onGenerationComplete = () => {
    setIsGenerating(false);
    setShowTerminal(false);
    const randomHex = Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setGeneratedAddress(`0x${randomHex}`);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(generatedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const privacyMetrics = calculatePrivacyScore(poolStats.size, poolStats.mixers, poolStats.anonymity, privacyLevel);
  const gasEstimate = estimateGasCost(parseFloat(depositAmount) || 0, privacyLevel);

  return (
    <div className="min-h-screen text-text-primary pt-28 pb-12 px-6 bg-[#020404]">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Header */}
          <div className="mb-12 border-b border-neutral-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Privacy Pools</h1>
              <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
                // Transaction Mixing & Stealth Address Generation
              </p>
            </div>
            
            <div className="flex gap-6 text-xs font-mono text-neutral-500">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"/>
                 <span className="text-accent-500">POOL_ACTIVE</span>
               </div>
               <div>ANONYMITY_SET: {poolStats.anonymity.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mb-12">
            
            {/* LEFT: DEPOSIT INTERFACE */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#050A0A] border border-neutral-800 p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,224,208,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,224,208,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                
                <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                  <Droplet className="w-5 h-5 text-accent-500" />
                  Deposit Assets
                </h2>

                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 uppercase mb-2">Amount (ETH)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black border border-neutral-800 text-white p-4 font-mono focus:border-accent-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-500 uppercase mb-2">Privacy Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['standard', 'advanced', 'maximum'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setPrivacyLevel(level as any)}
                          className={`p-3 border text-xs font-mono uppercase tracking-wider transition-all ${
                            privacyLevel === level 
                              ? 'bg-accent-500/10 border-accent-500 text-accent-400' 
                              : 'bg-black border-neutral-800 text-neutral-500 hover:border-neutral-600'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {depositAmount && (
                    <GasEstimator estimate={gasEstimate} amount={depositAmount} privacyLevel={privacyLevel} />
                  )}

                  <button className="w-full bg-accent-500 text-black font-bold font-mono uppercase tracking-widest py-4 hover:bg-accent-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,224,208,0.3)]">
                    <Lock className="w-4 h-4" />
                    <span>Initialize Deposit</span>
                  </button>
                </div>
              </div>
              
              <PrivacyScoreBreakdown metrics={privacyMetrics} />
            </div>

            {/* RIGHT: STEALTH & STATS */}
            <div className="lg:col-span-5 space-y-6">
              {/* Stealth Generator */}
              <div className="bg-[#050A0A] border border-neutral-800 p-8 relative overflow-hidden">
                <h2 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-accent-500" />
                  Stealth Address
                </h2>
                <p className="text-neutral-400 text-sm mb-8">Generate a one-time address unlinked to your identity.</p>

                <div className="flex-1 flex flex-col justify-center min-h-[150px]">
                  <AnimatePresence mode="wait">
                    {showTerminal ? (
                      <motion.div
                        key="terminal"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <TerminalLog 
                          steps={[
                            "Initializing ZK-SNARK circuits...",
                            "Deriving ephemeral public key...",
                            "Mixing entropy from pool...",
                            "Validating nullifier hash...",
                            "Generating stealth meta-address...",
                            "PROOF_VERIFIED: VALID"
                          ]} 
                          onComplete={onGenerationComplete} 
                        />
                      </motion.div>
                    ) : generatedAddress ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-accent-500/5 border border-accent-500/30 p-6 rounded-lg text-center"
                      >
                        <div className="text-[10px] font-mono text-accent-500 uppercase mb-2">Stealth Identity Generated</div>
                        <div className="font-mono text-sm text-white break-all mb-4">{generatedAddress}</div>
                        <div className="flex gap-2">
                          <button onClick={copyAddress} className="flex-1 flex items-center justify-center gap-2 py-2 bg-accent-500 text-black font-bold text-xs uppercase hover:bg-accent-400">
                            {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                          <button onClick={handleGenerate} className="px-3 border border-accent-500/30 text-accent-500 hover:bg-accent-500/10">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="cta" className="text-center">
                        <button 
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className="w-full px-8 py-4 border border-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-widest hover:border-accent-500 hover:text-accent-500 transition-all"
                        >
                          Generate Identity
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* LIVE MIXING FEED */}
              <div className="bg-[#030505] border border-neutral-800 p-6 h-64 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent-500" />
                    Live Mixing Queue
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-ping" />
                    <span className="text-[10px] text-accent-500 font-mono">LIVE</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                  {/* Fade out bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#030505] to-transparent z-10" />
                  
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {transactions.map((tx) => (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, x: -20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between text-xs font-mono p-2 hover:bg-white/5 rounded border border-transparent hover:border-neutral-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Hash className="w-3 h-3 text-neutral-600" />
                            <span className="text-neutral-400">{tx.txHash.slice(0, 10)}...</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-white">{tx.amount} ETH</span>
                            <span className="text-accent-500 bg-accent-500/10 px-1 rounded">MIXED</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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