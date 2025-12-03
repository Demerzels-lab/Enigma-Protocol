import { DollarSign } from 'lucide-react';

interface PricingBadgeProps {
  pricingModel: 'free' | 'subscription' | 'performance' | 'one_time';
  costPerExecution?: number;
  subscriptionFee?: number;
  performanceFeePercentage?: number;
}

export default function PricingBadge({
  pricingModel,
  costPerExecution,
  subscriptionFee,
  performanceFeePercentage,
}: PricingBadgeProps) {
  const getPricingDisplay = () => {
    switch (pricingModel) {
      case 'free':
        return {
          label: 'FREE',
          detail: 'No cost',
          bgColor: 'bg-semantic-success/10',
          textColor: 'text-semantic-success',
          borderColor: 'border-semantic-success/30',
        };
      case 'subscription':
        return {
          label: 'SUBSCRIPTION',
          detail: `$${subscriptionFee}/month`,
          bgColor: 'bg-accent-500/10',
          textColor: 'text-accent-500',
          borderColor: 'border-accent-500/30',
        };
      case 'performance':
        return {
          label: 'PERFORMANCE FEE',
          detail: `${performanceFeePercentage}% of profit`,
          bgColor: 'bg-accent-500/10',
          textColor: 'text-accent-500',
          borderColor: 'border-accent-500/30',
        };
      case 'one_time':
        return {
          label: 'PAY PER USE',
          detail: `$${costPerExecution}/execution`,
          bgColor: 'bg-semantic-warning/10',
          textColor: 'text-semantic-warning',
          borderColor: 'border-semantic-warning/30',
        };
      default:
        return {
          label: 'FREE',
          detail: 'No cost',
          bgColor: 'bg-neutral-100',
          textColor: 'text-neutral-300',
          borderColor: 'border-neutral-400/30',
        };
    }
  };

  const pricing = getPricingDisplay();

  return (
    <div className={`${pricing.bgColor} ${pricing.textColor} rounded-sm p-3 flex items-start space-x-2 border ${pricing.borderColor} terminal-text`}>
      <DollarSign className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider">{pricing.label}</p>
        <p className="text-sm font-medium mt-0.5">{pricing.detail}</p>
      </div>
    </div>
  );
}
