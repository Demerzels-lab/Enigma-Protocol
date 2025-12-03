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

    // Get pool statistics
    const response = await fetch(
      `${supabaseUrl}/rest/v1/pool_statistics?pool_type=eq.main&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pool statistics');
    }

    const pools = await response.json();
    
    if (!pools || pools.length === 0) {
      // Return default values if no data
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            totalPoolSize: 52000000,
            activeMixers: 2345,
            anonymitySet: 10000,
            totalDeposits: 15420,
            totalWithdrawals: 12350,
            privacyScore: 85
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pool = pools[0];

    // Calculate privacy score based on pool metrics
    const poolSizeScore = Math.min((pool.total_pool_size / 100000000) * 40, 40); // Max 40 points
    const mixerScore = Math.min((pool.active_mixers / 5000) * 30, 30); // Max 30 points
    const anonymityScore = Math.min((pool.anonymity_set / 20000) * 30, 30); // Max 30 points
    const privacyScore = Math.round(poolSizeScore + mixerScore + anonymityScore);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          totalPoolSize: parseFloat(pool.total_pool_size),
          activeMixers: pool.active_mixers,
          anonymitySet: pool.anonymity_set,
          totalDeposits: pool.total_deposits,
          totalWithdrawals: pool.total_withdrawals,
          privacyScore,
          updatedAt: pool.updated_at
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
