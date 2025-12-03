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

    const { userWallet, agentId } = await req.json();

    if (!userWallet || !agentId) {
      throw new Error('Missing required parameters: userWallet and agentId');
    }

    // Check if agent exists
    const agentResponse = await fetch(
      `${supabaseUrl}/rest/v1/ai_agents?id=eq.${agentId}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    const agents = await agentResponse.json();
    if (!agents || agents.length === 0) {
      throw new Error('Agent not found');
    }

    const agent = agents[0];

    // Check if already activated
    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_agents?user_wallet=eq.${userWallet}&agent_id=eq.${agentId}&status=eq.active&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    const existing = await existingResponse.json();
    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Agent already activated',
          data: existing[0]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create activation record
    const activationResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_agents`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_wallet: userWallet,
          agent_id: agentId,
          status: 'active',
          activated_at: new Date().toISOString()
        })
      }
    );

    if (!activationResponse.ok) {
      const error = await activationResponse.text();
      throw new Error(`Failed to activate agent: ${error}`);
    }

    const activationData = await activationResponse.json();

    // Update agent's total executions (simulate first execution)
    await fetch(
      `${supabaseUrl}/rest/v1/ai_agents?id=eq.${agentId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          performance_metrics: {
            ...agent.performance_metrics,
            totalExecutions: agent.performance_metrics.totalExecutions + 1
          }
        })
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Agent activated successfully',
        data: {
          activation: activationData[0],
          agent: agent
        }
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
