import { CheckCircle2, Zap, TrendingUp, Shield, Activity } from 'lucide-react';

interface CapabilitiesDisplayProps {
  capabilities: any;
  agentType: string;
}

export default function CapabilitiesDisplay({ capabilities, agentType }: CapabilitiesDisplayProps) {
  // Parse capabilities into user-friendly format
  const parseCapabilities = () => {
    if (!capabilities || typeof capabilities !== 'object') return [];

    const items: { icon: React.ReactNode; label: string; value: string }[] = [];

    // Strategy agents
    if (agentType === 'strategy') {
      if (capabilities.strategies && Array.isArray(capabilities.strategies)) {
        items.push({
          icon: <TrendingUp className="w-4 h-4" />,
          label: 'Trading Strategies',
          value: capabilities.strategies.join(', '),
        });
      }
      if (capabilities.riskTolerance) {
        items.push({
          icon: <Shield className="w-4 h-4" />,
          label: 'Risk Tolerance',
          value: capabilities.riskTolerance,
        });
      }
      if (capabilities.targetApy && capabilities.targetApy.min && capabilities.targetApy.max) {
        items.push({
          icon: <Zap className="w-4 h-4" />,
          label: 'Target APY Range',
          value: `${capabilities.targetApy.min}% - ${capabilities.targetApy.max}%`,
        });
      }
    }

    // Privacy agents
    if (agentType === 'privacy') {
      if (capabilities.privacyFeatures && Array.isArray(capabilities.privacyFeatures)) {
        items.push({
          icon: <Shield className="w-4 h-4" />,
          label: 'Privacy Features',
          value: capabilities.privacyFeatures.join(', '),
        });
      }
      if (capabilities.zkProofTypes && Array.isArray(capabilities.zkProofTypes)) {
        items.push({
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'ZK Proof Types',
          value: capabilities.zkProofTypes.join(', '),
        });
      }
      // Fallback for different field names
      if (capabilities.features && Array.isArray(capabilities.features)) {
        items.push({
          icon: <Shield className="w-4 h-4" />,
          label: 'Key Features',
          value: capabilities.features.join(', '),
        });
      }
    }

    // Risk Management agents
    if (agentType === 'risk_management') {
      if (capabilities.monitoringFeatures) {
        items.push({
          icon: <Activity className="w-4 h-4" />,
          label: 'Monitoring Features',
          value: capabilities.monitoringFeatures.join(', '),
        });
      }
      if (capabilities.alertThresholds) {
        items.push({
          icon: <Shield className="w-4 h-4" />,
          label: 'Alert Thresholds',
          value: `Loss: ${capabilities.alertThresholds.maxLoss}%, Volatility: ${capabilities.alertThresholds.volatilityLimit}%`,
        });
      }
    }

    // Arbitrage agents
    if (agentType === 'arbitrage') {
      if (capabilities.exchanges) {
        items.push({
          icon: <TrendingUp className="w-4 h-4" />,
          label: 'Supported Exchanges',
          value: capabilities.exchanges.join(', '),
        });
      }
      if (capabilities.minProfitThreshold) {
        items.push({
          icon: <Zap className="w-4 h-4" />,
          label: 'Min Profit Threshold',
          value: `${capabilities.minProfitThreshold}%`,
        });
      }
    }

    // Liquidity agents
    if (agentType === 'liquidity') {
      if (capabilities.protocols && Array.isArray(capabilities.protocols)) {
        items.push({
          icon: <Activity className="w-4 h-4" />,
          label: 'Supported Protocols',
          value: capabilities.protocols.join(', '),
        });
      }
      if (capabilities.rebalancingFrequency) {
        items.push({
          icon: <Zap className="w-4 h-4" />,
          label: 'Rebalancing Frequency',
          value: capabilities.rebalancingFrequency,
        });
      }
    }

    // Generic fallback: Display all key-value pairs if no specific parsing matched
    if (items.length === 0 && capabilities) {
      Object.entries(capabilities).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          let displayValue = '';
          
          if (Array.isArray(value)) {
            displayValue = value.join(', ');
          } else if (typeof value === 'object') {
            displayValue = JSON.stringify(value, null, 2);
          } else {
            displayValue = String(value);
          }

          items.push({
            icon: <CheckCircle2 className="w-4 h-4" />,
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
            value: displayValue,
          });
        }
      });
    }

    return items;
  };

  const capabilityItems = parseCapabilities();

  if (capabilityItems.length === 0) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-neutral-50 rounded-lg text-center">
          <p className="text-sm text-neutral-300 mb-2">No detailed capabilities configured</p>
          {capabilities && (
            <details className="mt-2">
              <summary className="text-xs text-primary-500 cursor-pointer hover:underline">
                View raw data
              </summary>
              <pre className="text-xs text-neutral-300 overflow-x-auto mt-2 text-left">
                {JSON.stringify(capabilities, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {capabilityItems.map((item, index) => (
        <div
          key={index}
          className="p-4 bg-neutral-50 rounded-lg flex items-start space-x-3 hover:bg-neutral-100 transition-colors duration-fast"
        >
          <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-500 flex-shrink-0">
            {item.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary mb-1">{item.label}</p>
            <p className="text-sm text-neutral-300 capitalize">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
