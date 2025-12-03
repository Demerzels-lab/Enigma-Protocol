// Database Update Utility Script
// Run this in browser console on deployed site to update agent data

async function updateAgentData() {
  const { createClient } = supabase;
  
  // Get Supabase client from window (already initialized in app)
  const supabaseClient = window.supabaseClient || createClient(
    'https://bpbtgkunrdzcoyfdhskh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50'
  );

  const agentUpdates = [
    {
      name: 'Yield Optimizer Pro',
      description: 'Advanced AI agent for optimizing yield farming strategies across multiple DeFi protocols with ZK proof verification',
      pricing_model: 'performance',
      performance_fee_percentage: 15,
      subscription_fee: null,
      cost_per_execution: null
    },
    {
      name: 'Privacy Sentinel',
      description: 'Privacy-first AI agent that ensures transaction anonymity with ZK proof verification and stealth address generation',
      pricing_model: 'free',
      performance_fee_percentage: null,
      subscription_fee: null,
      cost_per_execution: null
    },
    {
      name: 'Risk Shield AI',
      description: 'Real-time risk monitoring and portfolio protection with automated circuit breakers to safeguard your assets',
      pricing_model: 'subscription',
      subscription_fee: 29,
      performance_fee_percentage: null,
      cost_per_execution: null
    },
    {
      name: 'Arbitrage Hunter',
      description: 'High-speed arbitrage detection across DEXs with automatic execution for maximum profit opportunities',
      pricing_model: 'performance',
      performance_fee_percentage: 20,
      subscription_fee: null,
      cost_per_execution: null
    },
    {
      name: 'Liquidity Manager',
      description: 'Automated liquidity provisioning with dynamic rebalancing for optimal returns and minimal impermanent loss',
      pricing_model: 'free',
      performance_fee_percentage: null,
      subscription_fee: null,
      cost_per_execution: null
    },
    {
      name: 'DeFi Strategy Bot',
      description: 'Multi-strategy trading agent combining yield farming, staking, and liquidity provision for diversified returns',
      pricing_model: 'performance',
      performance_fee_percentage: 15,
      subscription_fee: null,
      cost_per_execution: null
    }
  ];

  console.log('Starting agent data update...');
  const results = [];

  for (const agent of agentUpdates) {
    try {
      const { data, error } = await supabaseClient
        .from('ai_agents')
        .update({
          description: agent.description,
          pricing_model: agent.pricing_model,
          subscription_fee: agent.subscription_fee,
          performance_fee_percentage: agent.performance_fee_percentage,
          cost_per_execution: agent.cost_per_execution
        })
        .eq('name', agent.name)
        .select();

      if (error) {
        console.error(`❌ Error updating ${agent.name}:`, error);
        results.push({ name: agent.name, status: 'error', error: error.message });
      } else {
        console.log(`✅ Updated ${agent.name}`);
        results.push({ name: agent.name, status: 'success', data });
      }
    } catch (err) {
      console.error(`❌ Exception updating ${agent.name}:`, err);
      results.push({ name: agent.name, status: 'exception', error: err.message });
    }
  }

  console.log('\n=== Update Summary ===');
  console.table(results);
  
  return results;
}

// Execute update
console.log('🚀 Agent Data Update Utility');
console.log('Run: await updateAgentData()');

// Auto-execute if you want
// updateAgentData().then(results => {
//   console.log('✅ All updates completed!', results);
// });
