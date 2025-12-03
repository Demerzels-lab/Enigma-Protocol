import { Fuel, Clock, DollarSign, Activity } from 'lucide-react';
import { GasEstimate } from '@/utils/privacyCalculations';
import { motion } from 'framer-motion';

interface GasEstimatorProps {
  estimate: GasEstimate;
  amount: string;
  privacyLevel: string;
}

export default function GasEstimator({ estimate, amount, privacyLevel }: GasEstimatorProps) {
  const congestionColor = {
    low: 'text-semantic-success',
    medium: 'text-semantic-warning',
    high: 'text-semantic-error',
  };

  const congestionBg = {
    low: 'bg-semantic-success/10',
    medium: 'bg-semantic-warning/10',
    high: 'bg-semantic-error/10',
  };

  const congestionLabel = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-50 rounded-xl p-5 border border-neutral-400/20 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center">
          <Fuel className="w-4 h-4 mr-2 text-accent-500" />
          Estimasi Biaya & Waktu
        </h4>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${congestionBg[estimate.networkCongestion]}`}>
          <Activity className={`w-3 h-3 ${congestionColor[estimate.networkCongestion]}`} />
          <span className={`text-xs font-medium ${congestionColor[estimate.networkCongestion]}`}>
            Jaringan: {congestionLabel[estimate.networkCongestion]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-100 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Fuel className="w-4 h-4 text-neutral-300" />
            <span className="text-xs text-neutral-300">Gas</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{estimate.estimatedGas}</p>
          <p className="text-xs text-neutral-300 mt-1">units</p>
        </div>

        <div className="bg-neutral-100 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-neutral-300" />
            <span className="text-xs text-neutral-300">Waktu</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{estimate.estimatedTime}</p>
          <p className="text-xs text-neutral-300 mt-1">estimasi</p>
        </div>

        <div className="bg-neutral-100 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-4 h-4 text-neutral-300" />
            <span className="text-xs text-neutral-300">Biaya (ETH)</span>
          </div>
          <p className="text-lg font-bold text-primary-500">{estimate.estimatedCostETH}</p>
          <p className="text-xs text-neutral-300 mt-1">ETH</p>
        </div>

        <div className="bg-neutral-100 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-4 h-4 text-neutral-300" />
            <span className="text-xs text-neutral-300">Biaya (USD)</span>
          </div>
          <p className="text-lg font-bold text-accent-500">${estimate.estimatedCostUSD}</p>
          <p className="text-xs text-neutral-300 mt-1">USD</p>
        </div>
      </div>

      <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-3">
        <p className="text-xs text-neutral-300">
          <strong className="text-primary-500">Catatan:</strong> Biaya final dapat berbeda bergantung 
          pada kondisi jaringan saat transaksi diproses. Level{' '}
          <span className="font-semibold capitalize">{privacyLevel}</span> memerlukan{' '}
          {privacyLevel === 'maximum' 
            ? 'beberapa hop untuk anonimitas maksimal' 
            : privacyLevel === 'advanced'
            ? 'timing randomization untuk privasi yang ditingkatkan'
            : 'mixing dasar dengan waktu pemrosesan tercepat'
          }.
        </p>
      </div>
    </motion.div>
  );
}
