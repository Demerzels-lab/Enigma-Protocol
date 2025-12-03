import { useState } from 'react';
import { TrendingUp, DollarSign, Lock, Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

export default function DeFi() {
  const [activeTab, setActiveTab] = useState('lending');
  const [supplyAmount, setSupplyAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  
  const { account, signer, provider } = useWallet();

  const tabs = [
    { id: 'lending', label: 'Lending', icon: DollarSign },
    { id: 'staking', label: 'Staking', icon: Lock },
    { id: 'farming', label: 'Yield Farming', icon: TrendingUp },
  ];

  const lendingPools = [
    { asset: 'ETH', supplyAPY: 3.2, borrowAPY: 5.8, totalSupplied: '$125M', utilization: 68 },
    { asset: 'USDC', supplyAPY: 4.5, borrowAPY: 7.2, totalSupplied: '$89M', utilization: 72 },
    { asset: 'WBTC', supplyAPY: 2.8, borrowAPY: 4.9, totalSupplied: '$45M', utilization: 55 },
  ];

  const stakingPools = [
    { name: 'ETH 2.0 Staking', apy: 6.5, minStake: '32 ETH', lockPeriod: 'Flexible' },
    { name: 'Privacy Staking Pool', apy: 12.3, minStake: '0.1 ETH', lockPeriod: '30 days' },
    { name: 'Anonymous Validator', apy: 8.7, minStake: '1 ETH', lockPeriod: '90 days' },
  ];

  const farmingPools = [
    { pair: 'ETH-USDC', apy: 28.5, tvl: '$42M', rewards: 'MASK + Trading Fees' },
    { pair: 'WBTC-ETH', apy: 35.2, tvl: '$28M', rewards: 'MASK + Trading Fees' },
    { pair: 'MASK-ETH', apy: 45.8, tvl: '$15M', rewards: 'MASK + Trading Fees' },
  ];

  // Transaction simulation with wallet signature
  const handleSupply = async () => {
    if (!account || !signer) {
      alert('Please connect wallet first');
      return;
    }

    if (!supplyAmount || parseFloat(supplyAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setTxStatus('pending');

    try {
      // In production, this will interact with smart contracts
      // For demo, we simulate with message signing
      const message = `Supply ${supplyAmount} ETH to Masquerade Privacy Lending Pool\nTimestamp: ${Date.now()}`;
      
      const signature = await signer.signMessage(message);
      
      // Generate mock transaction hash
      const mockTxHash = ethers.keccak256(ethers.toUtf8Bytes(signature));
      setTxHash(mockTxHash);
      
      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('success');
      alert(`Transaction successful! Amount ${supplyAmount} ETH has been supplied to privacy pool.\n\nTx Hash: ${mockTxHash.slice(0, 20)}...`);
      
      setSupplyAmount('');
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxStatus('error');
      alert('Transaction failed: ' + (error.message || 'User rejected'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setTxStatus(null);
        setTxHash('');
      }, 3000);
    }
  };

  const handleBorrow = async () => {
    if (!account || !signer) {
      alert('Please connect wallet first');
      return;
    }

    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setTxStatus('pending');

    try {
      const message = `Borrow ${borrowAmount} ETH from Masquerade Privacy Lending Pool\nTimestamp: ${Date.now()}`;
      
      const signature = await signer.signMessage(message);
      const mockTxHash = ethers.keccak256(ethers.toUtf8Bytes(signature));
      setTxHash(mockTxHash);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('success');
      alert(`Transaction successful! Amount ${borrowAmount} ETH has been borrowed anonymously.\n\nTx Hash: ${mockTxHash.slice(0, 20)}...`);
      
      setBorrowAmount('');
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxStatus('error');
      alert('Transaction failed: ' + (error.message || 'User rejected'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setTxStatus(null);
        setTxHash('');
      }, 3000);
    }
  };

  const handleStake = async (poolName: string, minStake: string) => {
    if (!account || !signer) {
      alert('Please connect wallet first');
      return;
    }

    setIsProcessing(true);
    setTxStatus('pending');

    try {
      const message = `Stake to ${poolName}\nMinimum: ${minStake}\nTimestamp: ${Date.now()}`;
      
      const signature = await signer.signMessage(message);
      const mockTxHash = ethers.keccak256(ethers.toUtf8Bytes(signature));
      setTxHash(mockTxHash);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('success');
      alert(`Staking successful at ${poolName}!\n\nTx Hash: ${mockTxHash.slice(0, 20)}...`);
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxStatus('error');
      alert('Transaction failed: ' + (error.message || 'User rejected'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setTxStatus(null);
        setTxHash('');
      }, 3000);
    }
  };

  const handleFarm = async (pair: string) => {
    if (!account || !signer) {
      alert('Please connect wallet first');
      return;
    }

    setIsProcessing(true);
    setTxStatus('pending');

    try {
      const message = `Start farming ${pair}\nTimestamp: ${Date.now()}`;
      
      const signature = await signer.signMessage(message);
      const mockTxHash = ethers.keccak256(ethers.toUtf8Bytes(signature));
      setTxHash(mockTxHash);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('success');
      alert(`Farming started successfully for ${pair}!\n\nTx Hash: ${mockTxHash.slice(0, 20)}...`);
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxStatus('error');
      alert('Transaction failed: ' + (error.message || 'User rejected'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setTxStatus(null);
        setTxHash('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background-page text-text-primary pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">DeFi Protocols</h1>
            <p className="text-neutral-300">
              {account 
                ? 'Execute DeFi transactions on-chain with privacy preservation' 
                : 'Connect wallet to access DeFi protocols'}
            </p>
          </div>

          {/* Transaction Status */}
          {txStatus && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              txStatus === 'pending' ? 'bg-semantic-warning/10 border-semantic-warning/20' :
              txStatus === 'success' ? 'bg-semantic-success/10 border-semantic-success/20' :
              'bg-semantic-error/10 border-semantic-error/20'
            }`}>
              <div className="flex items-center space-x-3">
                {txStatus === 'pending' && (
                  <>
                    <div className="w-5 h-5 border-2 border-semantic-warning border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-semantic-warning font-medium">Transaction processing...</span>
                  </>
                )}
                {txStatus === 'success' && (
                  <>
                    <CheckCircle className="w-5 h-5 text-semantic-success" />
                    <span className="text-semantic-success font-medium">Transaction confirmed!</span>
                  </>
                )}
                {txStatus === 'error' && (
                  <>
                    <AlertCircle className="w-5 h-5 text-semantic-error" />
                    <span className="text-semantic-error font-medium">Transaction failed</span>
                  </>
                )}
              </div>
              {txHash && (
                <p className="text-xs font-mono text-neutral-300 mt-2 break-all">Tx Hash: {txHash}</p>
              )}
            </div>
          )}

          {!account && (
            <div className="mb-8 p-6 bg-semantic-warning/10 border border-semantic-warning/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-semantic-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-semantic-warning mb-1">Wallet Not Connected</h3>
                  <p className="text-sm text-neutral-300">
                    Connect MetaMask wallet to execute DeFi transactions on-chain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-2 mb-8 border-b border-neutral-400/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-fast ${
                  activeTab === tab.id
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-neutral-300 hover:text-text-primary'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Lending Tab */}
          {activeTab === 'lending' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
                  <h2 className="text-2xl font-bold mb-6">Supply Assets</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount</label>
                      <input
                        type="number"
                        value={supplyAmount}
                        onChange={(e) => setSupplyAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={!account}
                        className="w-full px-4 py-3 bg-neutral-100 border border-neutral-400/20 rounded-lg text-text-primary placeholder-neutral-300 focus:outline-none focus:border-primary-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Asset</label>
                      <select 
                        disabled={!account}
                        className="w-full px-4 py-3 bg-neutral-100 border border-neutral-400/20 rounded-lg text-text-primary focus:outline-none focus:border-primary-500 disabled:opacity-50"
                      >
                        <option>ETH</option>
                        <option>USDC</option>
                        <option>WBTC</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleSupply}
                      disabled={!account || isProcessing}
                      className="w-full px-6 py-4 bg-semantic-success text-white rounded-xl font-semibold hover:bg-semantic-success/80 transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Supply with Privacy</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
                  <h2 className="text-2xl font-bold mb-6">Borrow Assets</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount</label>
                      <input
                        type="number"
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={!account}
                        className="w-full px-4 py-3 bg-neutral-100 border border-neutral-400/20 rounded-lg text-text-primary placeholder-neutral-300 focus:outline-none focus:border-primary-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Asset</label>
                      <select 
                        disabled={!account}
                        className="w-full px-4 py-3 bg-neutral-100 border border-neutral-400/20 rounded-lg text-text-primary focus:outline-none focus:border-primary-500 disabled:opacity-50"
                      >
                        <option>ETH</option>
                        <option>USDC</option>
                        <option>WBTC</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleBorrow}
                      disabled={!account || isProcessing}
                      className="w-full px-6 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-fast shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Borrow Anonymously</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-2xl border border-neutral-400/20 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-400/20 bg-neutral-100">
                      <th className="text-left p-4 text-sm font-semibold">Asset</th>
                      <th className="text-left p-4 text-sm font-semibold">Supply APY</th>
                      <th className="text-left p-4 text-sm font-semibold">Borrow APY</th>
                      <th className="text-left p-4 text-sm font-semibold">Total Supplied</th>
                      <th className="text-left p-4 text-sm font-semibold">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lendingPools.map((pool, index) => (
                      <tr key={index} className="border-b border-neutral-400/10 hover:bg-neutral-100/50">
                        <td className="p-4 font-semibold">{pool.asset}</td>
                        <td className="p-4 text-semantic-success">{pool.supplyAPY}%</td>
                        <td className="p-4 text-semantic-error">{pool.borrowAPY}%</td>
                        <td className="p-4">{pool.totalSupplied}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500"
                                style={{ width: `${pool.utilization}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{pool.utilization}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Staking Tab */}
          {activeTab === 'staking' && (
            <div className="grid md:grid-cols-3 gap-6">
              {stakingPools.map((pool, index) => (
                <div
                  key={index}
                  className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20 hover:shadow-card-hover transition-all duration-normal"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Lock className="w-8 h-8 text-primary-500" />
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-lg text-sm font-semibold">
                      {pool.apy}% APY
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{pool.name}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-300">Min Stake:</span>
                      <span className="font-medium">{pool.minStake}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-300">Lock Period:</span>
                      <span className="font-medium">{pool.lockPeriod}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStake(pool.name, pool.minStake)}
                    disabled={!account || isProcessing}
                    className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Stake Now'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Farming Tab */}
          {activeTab === 'farming' && (
            <div className="grid md:grid-cols-3 gap-6">
              {farmingPools.map((pool, index) => (
                <div
                  key={index}
                  className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20 hover:shadow-card-hover transition-all duration-normal"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-accent-500" />
                    <span className="px-3 py-1 bg-semantic-success/10 text-semantic-success rounded-lg text-sm font-semibold">
                      {pool.apy}% APY
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{pool.pair}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-300">TVL:</span>
                      <span className="font-medium">{pool.tvl}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-300">Rewards:</span>
                      <span className="font-medium text-xs">{pool.rewards}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFarm(pool.pair)}
                    disabled={!account || isProcessing}
                    className="w-full px-4 py-3 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Start Farming'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}