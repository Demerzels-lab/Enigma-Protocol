// Privacy calculation utilities untuk Privacy Pools

export interface PrivacyMetrics {
  poolSize: number;
  activeMixers: number;
  anonymitySet: number;
  totalScore: number;
  breakdown: {
    poolLiquidity: number;
    mixerActivity: number;
    anonymitySetSize: number;
    timeRandomization: number;
  };
}

export interface GasEstimate {
  estimatedGas: string;
  estimatedCostETH: string;
  estimatedCostUSD: string;
  estimatedTime: string;
  networkCongestion: 'low' | 'medium' | 'high';
}

/**
 * Hitung Privacy Score dengan metodologi transparan
 * Breakdown: 30% Pool Liquidity + 25% Mixer Activity + 30% Anonymity Set + 15% Time Randomization
 */
export function calculatePrivacyScore(
  poolSize: number,
  activeMixers: number,
  anonymitySet: number,
  privacyLevel: 'standard' | 'advanced' | 'maximum'
): PrivacyMetrics {
  // Pool Liquidity Score (30%) - semakin besar pool, semakin tinggi privacy
  const poolLiquidity = Math.min((poolSize / 100000000) * 100, 100); // Max 100M for full score
  
  // Mixer Activity Score (25%) - semakin banyak mixer aktif, semakin sulit tracking
  const mixerActivity = Math.min((activeMixers / 5000) * 100, 100); // Max 5000 for full score
  
  // Anonymity Set Score (30%) - semakin besar set, semakin anonim
  const anonymitySetSize = Math.min((anonymitySet / 15000) * 100, 100); // Max 15000 for full score
  
  // Time Randomization Score (15%) - berdasarkan privacy level
  const timeRandomization = privacyLevel === 'maximum' ? 100 : privacyLevel === 'advanced' ? 75 : 50;
  
  // Total weighted score
  const totalScore = 
    poolLiquidity * 0.30 +
    mixerActivity * 0.25 +
    anonymitySetSize * 0.30 +
    timeRandomization * 0.15;

  return {
    poolSize,
    activeMixers,
    anonymitySet,
    totalScore: Math.round(totalScore * 10) / 10,
    breakdown: {
      poolLiquidity: Math.round(poolLiquidity * 10) / 10,
      mixerActivity: Math.round(mixerActivity * 10) / 10,
      anonymitySetSize: Math.round(anonymitySetSize * 10) / 10,
      timeRandomization: Math.round(timeRandomization * 10) / 10,
    },
  };
}

/**
 * Estimasi gas dan biaya berdasarkan privacy level
 */
export function estimateGasCost(
  amount: number,
  privacyLevel: 'standard' | 'advanced' | 'maximum',
  ethPrice: number = 2000 // default ETH price in USD
): GasEstimate {
  // Base gas untuk deposit: 150,000 gas
  let gasUnits = 150000;
  
  // Tambahan gas berdasarkan privacy level
  if (privacyLevel === 'advanced') {
    gasUnits += 50000; // +50k untuk timing randomization
  } else if (privacyLevel === 'maximum') {
    gasUnits += 120000; // +120k untuk multiple hops
  }
  
  // Simulasi network congestion (dapat diganti dengan data real-time)
  const baseFeeGwei = 30; // Base fee dalam Gwei
  const priorityFeeGwei = 2; // Priority fee
  const totalGasPrice = baseFeeGwei + priorityFeeGwei;
  
  // Hitung biaya
  const gasCostETH = (gasUnits * totalGasPrice) / 1e9;
  const gasCostUSD = gasCostETH * ethPrice;
  
  // Estimasi waktu berdasarkan privacy level
  let estimatedMinutes = 2; // Standard: 2 menit
  if (privacyLevel === 'advanced') {
    estimatedMinutes = 8; // Advanced: 5-10 menit (randomization)
  } else if (privacyLevel === 'maximum') {
    estimatedMinutes = 20; // Maximum: 15-25 menit (multiple hops)
  }
  
  // Network congestion level
  const networkCongestion = baseFeeGwei < 20 ? 'low' : baseFeeGwei < 50 ? 'medium' : 'high';
  
  return {
    estimatedGas: gasUnits.toLocaleString(),
    estimatedCostETH: gasCostETH.toFixed(6),
    estimatedCostUSD: gasCostUSD.toFixed(2),
    estimatedTime: `${estimatedMinutes} menit`,
    networkCongestion,
  };
}

/**
 * Format angka untuk display
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Get color class berdasarkan score
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-semantic-success';
  if (score >= 70) return 'text-accent-500';
  if (score >= 50) return 'text-semantic-warning';
  return 'text-semantic-error';
}
