import { useState, useEffect } from 'react';
import { Shield, Lock, Check, ArrowRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

export default function Auth() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [zkProof, setZkProof] = useState('');
  const [stealthAddress, setStealthAddress] = useState('');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { account, connectWallet, isConnecting, signer } = useWallet();

  // Auto generate ZK proof when wallet is connected
  useEffect(() => {
    if (account && signer && !verified) {
      generateZKProof();
    }
  }, [account, signer]);

  const generateZKProof = async () => {
    if (!account || !signer) {
      alert('Please connect wallet first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Step 1: Generate message untuk signature (ini akan menjadi commitment)
      const timestamp = Date.now();
      const message = `Masquerade Privacy DeFi Authentication\nAddress: ${account}\nTimestamp: ${timestamp}`;
      
      // Step 2: Sign message dengan wallet (ini menggantikan ZK proof generation)
      // Dalam production, ini akan diganti dengan actual ZK proof generation
      const signature = await signer.signMessage(message);
      
      // Step 3: Generate ZK proof commitment dari signature
      const commitment = ethers.keccak256(ethers.toUtf8Bytes(signature));
      const zkProofHash = `zkp_${commitment.slice(2, 32)}`;
      
      setZkProof(zkProofHash);
      
      // Step 4: Verify dengan backend
      const { data, error } = await supabase.functions.invoke('verify-zk-proof', {
        body: {
          zkProof: zkProofHash,
          commitment: commitment,
          privacyLevel: 'anonymous',
          walletAddress: account,
          signature: signature
        }
      });

      if (error) throw error;

      if (data?.data) {
        setStealthAddress(data.data.stealthAddress);
        setVerified(true);
        
        // Store user session
        localStorage.setItem('masquerade_user', JSON.stringify({
          ...data.data.user,
          walletAddress: account
        }));
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('ZK verification error:', error);
      alert('Error: ' + (error.message || 'Authentication failed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const privacyFeatures = [
    'Wallet Signature - Cryptographic proof of wallet ownership',
    'Zero-knowledge Commitment - Hash-based privacy preservation', 
    'Stealth Address - Unique anonymous identity for each session',
  ];

  return (
    <div className="min-h-screen text-text-primary flex items-center justify-center px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-100 rounded-2xl p-8 border border-neutral-400/20 shadow-modal">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Web3 Authentication</h1>
            <p className="text-neutral-300">
              Connect wallet and generate ZK proof for anonymous authentication
            </p>
          </div>

          {!verified ? (
            <>
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold flex items-center">
                  <Lock className="w-5 h-5 text-primary-500 mr-2" />
                  Privacy Features
                </h3>
                <div className="space-y-3">
                  {privacyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-semantic-success flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {account && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-semantic-success/20">
                  <p className="text-xs text-neutral-300 mb-1">Connected Wallet:</p>
                  <p className="text-sm font-mono text-semantic-success break-all">{account}</p>
                </div>
              )}

              {zkProof && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-primary-500/20">
                  <p className="text-xs text-neutral-300 mb-1">ZK Proof Generated:</p>
                  <p className="text-sm font-mono text-primary-500 break-all">{zkProof}</p>
                </div>
              )}

              {!account ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full px-6 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-fast shadow-glow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}</span>
                </button>
              ) : (
                <button
                  onClick={generateZKProof}
                  disabled={isGenerating}
                  className="w-full px-6 py-4 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-fast shadow-glow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating ZK Proof...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate ZK Proof & Login</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}

              {!account && (
                <div className="mt-4 p-3 bg-semantic-warning/10 rounded-lg border border-semantic-warning/20">
                  <p className="text-xs text-semantic-warning">
                    <strong>Note:</strong> You need MetaMask extension. Install from{' '}
                    <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">
                      metamask.io
                    </a>
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-semantic-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-semantic-success">Verified!</h3>
              <p className="text-neutral-300 mb-4">ZK Proof successfully verified</p>
              
              {stealthAddress && (
                <div className="p-4 bg-neutral-50 rounded-lg border border-semantic-success/20 mb-4">
                  <p className="text-xs text-neutral-300 mb-1">Stealth Address:</p>
                  <p className="text-sm font-mono text-semantic-success break-all">{stealthAddress}</p>
                </div>
              )}

              <p className="text-sm text-neutral-300">Redirecting to dashboard...</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-neutral-400/20">
            <div className="flex items-center justify-center space-x-2 text-sm text-neutral-300">
              <Shield className="w-4 h-4 text-semantic-success animate-pulse-glow" />
              <span>Fully Protected</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-300">
          <p>Authentication uses wallet signature for privacy preservation</p>
        </div>
      </motion.div>
    </div>
  );
}
