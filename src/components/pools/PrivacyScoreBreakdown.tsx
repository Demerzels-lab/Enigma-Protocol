import { Info, TrendingUp, Users, Shield, Clock } from 'lucide-react';
import { PrivacyMetrics, getScoreColor } from '@/utils/privacyCalculations';
import { motion } from 'framer-motion';

interface PrivacyScoreBreakdownProps {
  metrics: PrivacyMetrics;
}

export default function PrivacyScoreBreakdown({ metrics }: PrivacyScoreBreakdownProps) {
  const breakdownItems = [
    {
      label: 'Pool Liquidity',
      value: metrics.breakdown.poolLiquidity,
      weight: '30%',
      icon: TrendingUp,
      description: 'Larger pool size increases anonymity',
    },
    {
      label: 'Mixer Activity',
      value: metrics.breakdown.mixerActivity,
      weight: '25%',
      icon: Users,
      description: 'High mixer activity makes tracking difficult',
    },
    {
      label: 'Anonymity Set Size',
      value: metrics.breakdown.anonymitySetSize,
      weight: '30%',
      icon: Shield,
      description: 'Larger set size makes identification harder',
    },
    {
      label: 'Time Randomization',
      value: metrics.breakdown.timeRandomization,
      weight: '15%',
      icon: Clock,
      description: 'Time randomization breaks temporal patterns',
    },
  ];

  return (
    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Info className="w-5 h-5 mr-2 text-primary-500" />
          Privacy Score Methodology
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-300">Total Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor(metrics.totalScore)}`}>
            {metrics.totalScore}%
          </span>
        </div>
      </div>

      <p className="text-sm text-neutral-300 mb-6">
        Privacy Score is calculated based on 4 factors with different weights to provide 
        a transparent view of your anonymity level.
      </p>

      <div className="space-y-4">
        {breakdownItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-100 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-xs text-neutral-300 bg-neutral-50 px-2 py-0.5 rounded">
                      Weight: {item.weight}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1">{item.description}</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${getScoreColor(item.value)}`}>
                {item.value}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-neutral-50 rounded-full h-2 mt-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                className={`h-2 rounded-full ${
                  item.value >= 90
                    ? 'bg-semantic-success'
                    : item.value >= 70
                    ? 'bg-accent-500'
                    : item.value >= 50
                    ? 'bg-semantic-warning'
                    : 'bg-semantic-error'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg">
        <p className="text-xs text-neutral-300">
          <strong className="text-primary-500">Note:</strong> This score is calculated in real-time 
          based on current pool conditions. Higher scores indicate better privacy levels.
        </p>
      </div>
    </div>
  );
}
