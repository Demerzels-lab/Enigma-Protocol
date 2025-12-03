import { useState } from 'react';
import { Shield, Bell, Lock, Database, Eye, EyeOff, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [privacyLevel, setPrivacyLevel] = useState('maximum');
  const [notifications, setNotifications] = useState(true);
  const [autoMixing, setAutoMixing] = useState(true);
  const [zkProofRequired, setZkProofRequired] = useState(true);

  const privacyLevels = [
    { value: 'basic', label: 'Basic', description: 'Standard privacy features' },
    { value: 'enhanced', label: 'Enhanced', description: 'Advanced mixing and stealth addresses' },
    { value: 'maximum', label: 'Maximum', description: 'Full anonymity with all features enabled' },
  ];

  return (
    <div className="min-h-screen bg-background-page text-text-primary pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-neutral-300">Manage privacy controls, security, and agent permissions</p>
          </div>

          <div className="space-y-6">
            {/* Privacy Controls */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="w-6 h-6 text-primary-500 mr-3" />
                Privacy Controls
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Default Privacy Level</label>
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
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{level.label}</p>
                            <p className="text-sm text-neutral-300">{level.description}</p>
                          </div>
                          {privacyLevel === level.value && (
                            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-accent-500" />
                    <div>
                      <p className="font-medium">Auto Transaction Mixing</p>
                      <p className="text-sm text-neutral-300">Automatically mix transactions for enhanced privacy</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoMixing(!autoMixing)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-fast ${
                      autoMixing ? 'bg-primary-500' : 'bg-neutral-400'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-fast ${
                        autoMixing ? 'transform translate-x-6' : ''
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium">Require ZK Proof</p>
                      <p className="text-sm text-neutral-300">Require ZK proof verification for all transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setZkProofRequired(!zkProofRequired)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-fast ${
                      zkProofRequired ? 'bg-primary-500' : 'bg-neutral-400'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-fast ${
                        zkProofRequired ? 'transform translate-x-6' : ''
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Lock className="w-6 h-6 text-semantic-error mr-3" />
                Security Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-accent-500" />
                    <div>
                      <p className="font-medium">Transaction Notifications</p>
                      <p className="text-sm text-neutral-300">Get notified for all transaction activities</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-fast ${
                      notifications ? 'bg-primary-500' : 'bg-neutral-400'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-fast ${
                        notifications ? 'transform translate-x-6' : ''
                      }`}
                    ></div>
                  </button>
                </div>

                <button className="w-full px-6 py-3 bg-neutral-100 border border-neutral-400/20 text-text-primary rounded-lg font-medium hover:bg-neutral-200 transition-all duration-fast">
                  Change Password
                </button>

                <button className="w-full px-6 py-3 bg-neutral-100 border border-neutral-400/20 text-text-primary rounded-lg font-medium hover:bg-neutral-200 transition-all duration-fast">
                  Enable Two-Factor Authentication
                </button>
              </div>
            </div>

            {/* Wallet Management */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Wallet className="w-6 h-6 text-primary-500 mr-3" />
                Connected Wallet
              </h2>

              <div className="p-4 bg-neutral-100 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-300">Address:</span>
                  <span className="font-mono text-sm">0x742d...a4b8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-300">Network:</span>
                  <span className="text-sm font-medium">Ethereum Mainnet</span>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-semantic-error text-white rounded-lg font-medium hover:bg-semantic-error/80 transition-all duration-fast">
                Disconnect Wallet
              </button>
            </div>

            {/* Data Management */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Database className="w-6 h-6 text-accent-500 mr-3" />
                Data Management
              </h2>

              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-neutral-100 border border-neutral-400/20 text-text-primary rounded-lg font-medium hover:bg-neutral-200 transition-all duration-fast text-left">
                  Export Transaction History
                </button>

                <button className="w-full px-6 py-3 bg-neutral-100 border border-neutral-400/20 text-text-primary rounded-lg font-medium hover:bg-neutral-200 transition-all duration-fast text-left">
                  Download ZK Proof Records
                </button>

                <div className="p-4 bg-semantic-warning/10 rounded-lg border border-semantic-warning/20">
                  <p className="text-sm text-semantic-warning">
                    <strong>Privacy Notice:</strong> All exported data maintains zero-knowledge properties and does not reveal your identity.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Status */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Current Privacy Status</h3>
                  <p className="opacity-90">Your identity is fully protected with maximum anonymity</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 animate-pulse-glow" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
