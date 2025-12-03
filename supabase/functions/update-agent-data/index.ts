Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Agent descriptions in English
    const agentUpdates = [
      {
        name: 'Yield Optimizer Pro',
        description: 'Advanced AI agent for optimizing yield farming strategies across multiple DeFi protocols with ZK proof verification',
        pricing_model: 'performance',
        performance_fee_percentage: 15
      },
      {
        name: 'Privacy Sentinel',
        description: 'Privacy-first AI agent that ensures transaction anonymity with ZK proof verification and stealth address generation',
        pricing_model: 'free'
      },
      {
        name: 'Risk Shield AI',
        description: 'Real-time risk monitoring and portfolio protection with automated circuit breakers to safeguard your assets',
        pricing_model: 'subscription',
        subscription_fee: 29
      },
      {
        name: 'Arbitrage Hunter',
        description: 'High-speed arbitrage detection across DEXs with automatic execution for maximum profit opportunities',
        pricing_model: 'performance',
        performance_fee_percentage: 20
      },
      {
        name: 'Liquidity Manager',
        description: 'Automated liquidity provisioning with dynamic rebalancing for optimal returns and minimal impermanent loss',
        pricing_model: 'free'
      },
      {
        name: 'DeFi Strategy Bot',
        description: 'Multi-strategy trading agent combining yield farming, staking, and liquidity provision for diversified returns',
        pricing_model: 'performance',
        performance_fee_percentage: 15
      }
    ];

    const results = [];

    // Update each agent
    for (const agent of agentUpdates) {
      const response = await fetch(`${supabaseUrl}/rest/v1/ai_agents?name=eq.${encodeURIComponent(agent.name)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          description: agent.description,
          pricing_model: agent.pricing_model,
          subscription_fee: agent.subscription_fee || null,
          performance_fee_percentage: agent.performance_fee_percentage || null,
          cost_per_execution: null
        })
      });

      if (!response.ok) {
        const error = await response.text();
        results.push({ name: agent.name, status: 'error', error });
      } else {
        const data = await response.json();
        results.push({ name: agent.name, status: 'updated', data });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Agent descriptions and pricing updated to English',
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
