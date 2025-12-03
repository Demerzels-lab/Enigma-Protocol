import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'error';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'stealth_gen';
  amount?: string;
  privacyLevel?: string;
  status: TransactionStatus;
  timestamp: Date;
  txHash?: string;
  errorMessage?: string;
}

interface TransactionTrackerProps {
  transactions: Transaction[];
  onClearAll?: () => void;
}

export default function TransactionTracker({ transactions, onClearAll }: TransactionTrackerProps) {
  const [filter, setFilter] = useState<'all' | TransactionStatus>('all');

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.status === filter);

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-neutral-300',
      bg: 'bg-neutral-300/10',
      label: 'Pending',
    },
    processing: {
      icon: Loader2,
      color: 'text-accent-500',
      bg: 'bg-accent-500/10',
      label: 'Processing',
      animate: true,
    },
    success: {
      icon: CheckCircle,
      color: 'text-semantic-success',
      bg: 'bg-semantic-success/10',
      label: 'Success',
    },
    error: {
      icon: AlertCircle,
      color: 'text-semantic-error',
      bg: 'bg-semantic-error/10',
      label: 'Error',
    },
  };

  const typeLabels = {
    deposit: 'Pool Deposit',
    withdrawal: 'Withdrawal',
    stealth_gen: 'Generate Stealth Address',
  };

  return (
    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Transaction History</h3>
        {transactions.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-neutral-300 hover:text-semantic-error transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'processing', 'success', 'error'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label}
            {status !== 'all' && (
              <span className="ml-1">({transactions.filter(tx => tx.status === status).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3 opacity-50" />
              <p className="text-neutral-300">
                {filter === 'all' ? 'No transactions yet' : `No ${statusConfig[filter].label.toLowerCase()} transactions`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const config = statusConfig[tx.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-neutral-100 rounded-lg p-4 border border-neutral-400/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                        <Icon 
                          className={`w-5 h-5 ${config.color} ${'animate' in config && config.animate ? 'animate-spin' : ''}`} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">{typeLabels[tx.type]}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        
                        {tx.amount && (
                          <p className="text-sm text-neutral-300">
                            Amount: <span className="font-semibold text-text-primary">{tx.amount} ETH</span>
                            {tx.privacyLevel && (
                              <span className="ml-2 text-xs">
                                • Level: <span className="capitalize">{tx.privacyLevel}</span>
                              </span>
                            )}
                          </p>
                        )}
                        
                        <p className="text-xs text-neutral-300 mt-1">
                          {tx.timestamp.toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        {tx.errorMessage && (
                          <p className="text-xs text-semantic-error mt-2 bg-semantic-error/5 px-2 py-1 rounded">
                            {tx.errorMessage}
                          </p>
                        )}

                        {tx.txHash && (
                          <a
                            href={`https://etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-500 hover:text-primary-700 flex items-center mt-2 space-x-1"
                          >
                            <span>View on Etherscan</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-400/20">
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span>Total: {filteredTransactions.length} transactions</span>
            <span>
              Success: {transactions.filter(tx => tx.status === 'success').length} • 
              Processing: {transactions.filter(tx => tx.status === 'processing').length} • 
              Error: {transactions.filter(tx => tx.status === 'error').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
