import { Bot, Star, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import PricingBadge from './PricingBadge';

interface Agent {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  capabilities: any;
  reputation_score: number;
  performance_metrics: {
    totalExecutions: number;
    successRate: number;
    averageApy: number;
  };
  zk_proof_commitment: string;
  trust_model: string;
  pricing_model?: 'free' | 'subscription' | 'performance' | 'one_time';
  cost_per_execution?: number;
  subscription_fee?: number;
  performance_fee_percentage?: number;
}

// Default pricing based on agent type
const getDefaultPricing = (agentType: string) => {
  switch (agentType) {
    case 'strategy':
      return { 
        pricing_model: 'performance' as const, 
        performance_fee_percentage: 15,
        subscription_fee: undefined,
        cost_per_execution: undefined,
      };
    case 'risk_management':
      return { 
        pricing_model: 'subscription' as const, 
        subscription_fee: 29,
        performance_fee_percentage: undefined,
        cost_per_execution: undefined,
      };
    case 'arbitrage':
      return { 
        pricing_model: 'performance' as const, 
        performance_fee_percentage: 20,
        subscription_fee: undefined,
        cost_per_execution: undefined,
      };
    case 'liquidity':
      return { 
        pricing_model: 'free' as const,
        subscription_fee: undefined,
        performance_fee_percentage: undefined,
        cost_per_execution: undefined,
      };
    case 'privacy':
      return { 
        pricing_model: 'free' as const,
        subscription_fee: undefined,
        performance_fee_percentage: undefined,
        cost_per_execution: undefined,
      };
    default:
      return { 
        pricing_model: 'free' as const,
        subscription_fee: undefined,
        performance_fee_percentage: undefined,
        cost_per_execution: undefined,
      };
  }
}

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
  onSelectAgent: (agent: Agent) => void;
}

export default function AgentCard({ agent, onViewDetails, onSelectAgent }: AgentCardProps) {
  // Determine if this agent generates yield
  const isYieldAgent = !['privacy', 'risk_management'].includes(agent.agent_type);
  
  // Get pricing info with defaults
  const defaultPricing = getDefaultPricing(agent.agent_type);
  const pricingModel = agent.pricing_model || defaultPricing.pricing_model;
  const costPerExecution = agent.cost_per_execution || defaultPricing.cost_per_execution;
  const subscriptionFee = agent.subscription_fee || defaultPricing.subscription_fee;
  const performanceFeePercentage = agent.performance_fee_percentage || defaultPricing.performance_fee_percentage;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative bg-neutral-50/80 backdrop-blur-sm rounded-md p-6 terminal-border hover:terminal-border-hover transition-all duration-normal hover:shadow-card-hover group"
    >
      {/* Coordinate Label */}
      <div className="coordinate-label absolute top-2 left-2">X:{Math.floor(Math.random() * 100)} Y:{Math.floor(Math.random() * 100)}</div>
      
      <div className="flex items-start justify-between mb-4 mt-4">
        <div className="w-12 h-12 bg-accent-500/10 rounded-md flex items-center justify-center terminal-border group-hover:shadow-glow">
          <Bot className="w-6 h-6 text-accent-500" />
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 rounded-md terminal-border">
          <Star className="w-4 h-4 text-semantic-warning fill-current" />
          <span className="text-sm font-semibold terminal-text">{agent.reputation_score}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2 terminal-text uppercase tracking-wide">{agent.name}</h3>
      <p className="text-sm text-neutral-300 mb-4 line-clamp-2">{agent.description}</p>

      <div className="flex items-center space-x-2 mb-4">
        <span className="px-2 py-1 bg-accent-500/10 text-accent-500 rounded-sm text-xs font-medium capitalize terminal-border">
          {agent.agent_type.replace('_', ' ')}
        </span>
        <span className="px-2 py-1 bg-neutral-100 text-neutral-300 rounded-sm text-xs font-medium capitalize terminal-border">
          {agent.trust_model}
        </span>
      </div>

      {/* Pricing Information */}
      <div className="mb-4">
        <PricingBadge
          pricingModel={pricingModel}
          costPerExecution={costPerExecution}
          subscriptionFee={subscriptionFee}
          performanceFeePercentage={performanceFeePercentage}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-3 pt-4 mb-4 border-t terminal-border">
        <div className="bg-neutral-100/30 p-2 rounded-sm terminal-border">
          <p className="text-xs text-neutral-300 mb-1 uppercase tracking-wide">Success Rate</p>
          <p className="text-sm font-semibold text-semantic-success terminal-text">
            {agent.performance_metrics.successRate.toFixed(1)}%
          </p>
        </div>
        <div className="group relative bg-neutral-100/30 p-2 rounded-sm terminal-border">
          <p className="text-xs text-neutral-300 mb-1 uppercase tracking-wide">Avg APY</p>
          {isYieldAgent ? (
            <p className="text-sm font-semibold text-accent-500 terminal-text">
              {agent.performance_metrics.averageApy.toFixed(1)}%
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-neutral-300">N/A</p>
              <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 px-2 py-1 bg-neutral-100 text-xs text-neutral-300 rounded-sm shadow-glow-strong z-10 terminal-border">
                This agent focuses on {agent.agent_type === 'privacy' ? 'privacy protection' : 'risk management'}, not yield generation
              </div>
            </>
          )}
        </div>
        <div className="bg-neutral-100/30 p-2 rounded-sm terminal-border">
          <p className="text-xs text-neutral-300 mb-1 uppercase tracking-wide">Executions</p>
          <p className="text-sm font-semibold terminal-text">{agent.performance_metrics.totalExecutions}</p>
        </div>
      </div>

      {/* Action Buttons - Terminal Style */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewDetails(agent)}
          className="flex-1 px-4 py-2.5 bg-neutral-100/50 text-neutral-300 rounded-sm font-medium hover:bg-neutral-200 hover:text-text-primary transition-all duration-fast flex items-center justify-center space-x-2 terminal-border hover:terminal-border-hover uppercase tracking-wider text-xs"
          aria-label={`View details for ${agent.name}`}
        >
          <Info className="w-4 h-4" />
          <span>DETAILS</span>
        </button>
        <button
          onClick={() => onSelectAgent(agent)}
          className="flex-1 px-4 py-2.5 bg-accent-500/20 border border-accent-500/50 text-accent-500 rounded-sm font-semibold hover:bg-accent-500/30 hover:border-accent-500 hover:shadow-glow transition-all duration-fast uppercase tracking-wider text-xs"
          aria-label={`Select ${agent.name} agent`}
        >
          SELECT AGENT &gt;
        </button>
      </div>
    </motion.div>
  );
}
