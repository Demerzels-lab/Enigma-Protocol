import { useState, useMemo, useEffect } from 'react';
import { Shield, Droplet, ArrowRight, Eye, EyeOff, Copy, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import PrivacyScoreBreakdown from '@/components/pools/PrivacyScoreBreakdown';
import GasEstimator from '@/components/pools/GasEstimator';
import TransactionTracker, { Transaction } from '@/components/pools/TransactionTracker';
import SecurityAudit from '@/components/pools/SecurityAudit';
import { calculatePrivacyScore, estimateGasCost } from '@/utils/privacyCalculations';
import { createDeposit, generateStealthAddress, getPoolStatistics, getTransactionCounts, getUserTransactions } from '@/lib/api';
import { useWallet } from '@/contexts/WalletContext';

export default function Pools() {
  const { account } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<'standard' | 'advanced' | 'maximum'>('standard');
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | Transaction['status']>('all');
  const [poolData, setPoolData] = useState({
    poolSize: 52000000,
    activeMixers: 2345,
    anonymitySet: 10000,
  });
  const [transactionCounts, setTransactionCounts] = useState({
    pending: 0,
    processing: 0,
    success: 0,
    error: 0
  });
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);

  // Refresh data handler
  const refreshData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const stats = await getPoolStatistics();
      if (stats.success) {
        setPoolData({
          poolSize: stats.data.totalPoolSize || 52000000,
          activeMixers: stats.data.activeMixers || 2345,
          anonymitySet: stats.data.anonymitySet || 10000,
        });
      }
    } catch (error) {
      console.error('Failed to load pool stats:', error);
      setError('Failed to load pool statistics. Please refresh the page.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load pool statistics from database
  useEffect(() => {
    const loadPoolStats = async () => {
      setIsRefreshing(true);
      setError(null);
      try {
        const stats = await getPoolStatistics();
        if (stats.success) {
          setPoolData({
            poolSize: stats.data.totalPoolSize || 52000000,
            activeMixers: stats.data.activeMixers || 2345,
            anonymitySet: stats.data.anonymitySet || 10000,
          });
        }
      } catch (error) {
        console.error('Failed to load pool stats:', error);
        setError('Failed to load pool statistics. Please refresh the page.');
      } finally {
        setIsRefreshing(false);
      }
    };

    const loadTransactionData = async () => {
      try {
        // Load transaction counts for filters
        const counts = await getTransactionCounts();
        setTransactionCounts(counts);
        
        // Load user transactions if wallet connected
        if (account) {
          const userTx = await getUserTransactions(account);
          // Convert to Transaction format for compatibility
          const formattedTx: Transaction[] = userTx.map((tx: any) => ({
            id: `tx-${tx.id}`,
            type: tx.tx_type === 'privacy_deposit' ? 'deposit' : tx.tx_type,
            status: tx.status,
            amount: tx.amount?.toString(),
            timestamp: new Date(tx.created_at),
            txHash: tx.tx_hash,
            privacyLevel: tx.privacy_level
          }));
          setUserTransactions(formattedTx);
        }
      } catch (error) {
        console.error('Failed to load transaction data:', error);
      }
    };

    loadPoolStats();
    loadTransactionData();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      loadPoolStats();
      loadTransactionData();
    }, 30000);

    return () => clearInterval(interval);
  }, [account]);

  const privacyLevels = [
    {
      value: 'standard' as const,
      label: 'Standard',
      description: 'Basic transaction mixing',
      anonymitySet: '100+ users',
    },
    {
      value: 'advanced' as const,
      label: 'Advanced',
      description: 'Enhanced mixing with timing randomization',
      anonymitySet: '500+ users',
    },
    {
      value: 'maximum' as const,
      label: 'Maximum',
      description: 'Maximum anonymity with multiple hops',
      anonymitySet: '1000+ users',
    },
  ];

  // Hitung privacy score dengan metodologi transparan
  const privacyMetrics = useMemo(() => {
    return calculatePrivacyScore(
      poolData.poolSize,
      poolData.activeMixers,
      poolData.anonymitySet,
      privacyLevel
    );
  }, [poolData, privacyLevel]);

  // Estimasi gas dan biaya
  const gasEstimate = useMemo(() => {
    const amount = parseFloat(depositAmount) || 0;
    return estimateGasCost(amount, privacyLevel);
  }, [depositAmount, privacyLevel]);

  const handleGenerateStealthAddress = async () => {
    const userWallet = account || `demo_${Date.now()}`;
    setIsLoading(true);

    // Create transaction record
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'stealth_gen',
      status: 'processing',
      timestamp: new Date(),
    };
    setTransactions(prev => [newTx, ...prev]);

    try {
      // Call backend edge function
      const result = await generateStealthAddress(userWallet);
      
      setGeneratedAddress(result.data.stealthAddress);
      
      // Update transaction status
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTx.id
            ? { ...tx, status: 'success', txHash: result.data.zkProofCommitment }
            : tx
        )
      );
    } catch (error) {
      console.error('Failed to generate stealth address:', error);
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTx.id
            ? { ...tx, status: 'error', errorMessage: 'Failed to generate address' }
            : tx
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }

    const userWallet = account || `demo_${Date.now()}`;
    setIsLoading(true);

    // Create transaction record
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount: depositAmount,
      privacyLevel: privacyLevel,
      status: 'pending',
      timestamp: new Date(),
    };
    setTransactions(prev => [newTx, ...prev]);

    try {
      // Update to processing
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTx.id ? { ...tx, status: 'processing' } : tx
        )
      );

      // Call backend edge function
      const result = await createDeposit(userWallet, depositAmount, privacyLevel);
      
      // Wait for estimated processing time
      const delay = privacyLevel === 'maximum' ? 3000 : privacyLevel === 'advanced' ? 2000 : 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Update transaction status
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTx.id
            ? { ...tx, status: 'success', txHash: result.data.txHash }
            : tx
        )
      );

      // Refresh pool stats and transaction data
      const [stats, userTx] = await Promise.all([
        getPoolStatistics(),
        account ? getUserTransactions(account) : Promise.resolve([])
      ]);
      
      if (stats.success) {
        setPoolData({
          poolSize: stats.data.totalPoolSize || poolData.poolSize,
          activeMixers: stats.data.activeMixers || poolData.activeMixers,
          anonymitySet: stats.data.anonymitySet || poolData.anonymitySet,
        });
      }
      
      if (account && userTx.length > 0) {
        const formattedTx: Transaction[] = userTx.map((tx: any) => ({
          id: `tx-${tx.id}`,
          type: tx.tx_type === 'privacy_deposit' ? 'deposit' : tx.tx_type,
          status: tx.status,
          amount: tx.amount?.toString(),
          timestamp: new Date(tx.created_at),
          txHash: tx.tx_hash,
          privacyLevel: tx.privacy_level
        }));
        setUserTransactions(formattedTx);
      }
      
      // Refresh transaction counts
      const counts = await getTransactionCounts();
      setTransactionCounts(counts);

      // Clear deposit amount
      setDepositAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === newTx.id
            ? { ...tx, status: 'error', errorMessage: 'Deposit failed. Please try again.' }
            : tx
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(generatedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const poolStatistics = [
    { 
      label: 'Total Pool Size', 
      value: `$${(poolData.poolSize / 1000000).toFixed(1)}M`,
      tooltip: 'Total funds available in privacy pool - dynamically updated'
    },
    { 
      label: 'Active Mixers', 
      value: poolData.activeMixers.toLocaleString(),
      tooltip: 'Active users currently mixing - real-time count'
    },
    { 
      label: 'Anonymity Set', 
      value: poolData.anonymitySet.toLocaleString() + '+',
      tooltip: 'Total users in anonymity set - larger means more anonymous'
    },
    { 
      label: 'Privacy Score', 
      value: `${privacyMetrics.totalScore}%`,
      tooltip: 'Privacy score based on transparent methodology'
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Privacy Pools</h1>
            <p className="text-neutral-300">Transaction mixing and stealth addresses for enhanced anonymity</p>
            
            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-semantic-error/10 border border-semantic-error/20 rounded-lg">
                <p className="text-semantic-error text-sm">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    refreshData();
                  }}
                  className="mt-2 text-semantic-error text-xs hover:underline"
                >
                  Retry
                </button>
              </div>
            )}
            
            {/* Loading/Refresh Indicator */}
            {isRefreshing && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-neutral-300">
                <div className="animate-spin w-4 h-4 border-2 border-neutral-300 border-t-primary-500 rounded-full"></div>
                <span className="text-sm">Refreshing data...</span>
              </div>
            )}
            
            {/* Security Info Toggle */}
            <button
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-semantic-success/10 text-semantic-success rounded-lg hover:bg-semantic-success/20 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showSecurityInfo ? 'Hide' : 'View'} Security Audit & Bug Bounty
              </span>
            </button>
          </div>

          {/* Security Audit Section (Conditional) */}
          {showSecurityInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <SecurityAudit />
            </motion.div>
          )}

          {/* Pool Stats dengan Tooltip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {poolStatistics.map((stat, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl p-4 border border-neutral-400/20 group relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-neutral-300">{stat.label}</p>
                  <Info className="w-3 h-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{stat.value}</p>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-100 text-xs text-neutral-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-center z-10">
                  {stat.tooltip}
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Score Breakdown */}
          <div className="mb-8">
            <PrivacyScoreBreakdown metrics={privacyMetrics} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Deposit Interface */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Droplet className="w-6 h-6 text-primary-500 mr-3" />
                Deposit to Privacy Pool
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Deposit Amount (ETH)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-neutral-100 border border-neutral-400/20 rounded-lg text-text-primary placeholder-neutral-300 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Privacy Level</label>
                  <div className="space-y-3">
                    {privacyLevels.map((level) => (
                      <div
                        key={level.value}
                        onClick={() => setPrivacyLevel(level.value)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-fast ${
                          privacyLevel === level.value
                            ? 'border-primary-500 bg-primary-500/5'
                            : 'border-neutral-400/20 hover:border-neutral-400/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{level.label}</span>
                          <span className="text-xs text-neutral-300">{level.anonymitySet}</span>
                        </div>
                        <p className="text-sm text-neutral-300">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gas Estimator */}
                {depositAmount && parseFloat(depositAmount) > 0 && (
                  <GasEstimator 
                    estimate={gasEstimate} 
                    amount={depositAmount}
                    privacyLevel={privacyLevel}
                  />
                )}

                <button 
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isLoading}
                  className="w-full px-6 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-fast shadow-glow flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing Deposit...</span>
                    </>
                  ) : (
                    <>
                      <span>Deposit to Pool</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stealth Address Generator */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="w-6 h-6 text-accent-500 mr-3" />
                Stealth Address Generator
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-neutral-100 rounded-lg border border-accent-500/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <EyeOff className="w-5 h-5 text-accent-500" />
                    <h3 className="font-semibold">Privacy Features</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start">
                      <span className="text-semantic-success mr-2">✓</span>
                      <span>Unique address for each transaction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-semantic-success mr-2">✓</span>
                      <span>Not traceable to original identity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-semantic-success mr-2">✓</span>
                      <span>ZK proof for ownership verification</span>
                    </li>
                  </ul>
                </div>

                {generatedAddress ? (
                  <div className="p-4 bg-neutral-100 rounded-lg border border-semantic-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-semantic-success">Generated Address</span>
                      <button
                        onClick={copyAddress}
                        className="p-2 hover:bg-neutral-50 rounded transition-colors duration-fast"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-semantic-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-neutral-300" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-mono text-text-primary break-all">{generatedAddress}</p>
                  </div>
                ) : (
                  <div className="p-8 bg-neutral-100 rounded-lg border border-neutral-400/20 text-center">
                    <Eye className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-300">Generate stealth address for private transactions</p>
                  </div>
                )}

                <button
                  onClick={handleGenerateStealthAddress}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-fast shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating Address...
                    </>
                  ) : (
                    'Generate Stealth Address'
                  )}
                </button>

                <div className="p-4 bg-semantic-warning/10 rounded-lg border border-semantic-warning/20">
                  <p className="text-sm text-semantic-warning">
                    <strong>Note:</strong> Save private key securely. This address can only be accessed by you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Tracker */}
          <div className="mb-8">
            <TransactionTracker 
              transactions={transactions}
              onClearAll={() => {
                setTransactions([]);
                setUserTransactions([]);
                setTransactionCounts({ pending: 0, processing: 0, success: 0, error: 0 });
              }}
              transactionCounts={transactionCounts}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Privacy Metrics */}
          <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
            <h2 className="text-2xl font-bold mb-6">Privacy Status</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-semantic-success animate-pulse-glow" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Current Privacy Level</p>
                  <p className="text-xl font-bold text-semantic-success capitalize">{privacyLevel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Pool Participation</p>
                  <p className="text-xl font-bold">
                    {transactions.filter(tx => tx.status === 'success' && tx.type === 'deposit').length > 0 
                      ? 'Active' 
                      : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Anonymity Score</p>
                  <p className="text-xl font-bold text-accent-500">{privacyMetrics.totalScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
