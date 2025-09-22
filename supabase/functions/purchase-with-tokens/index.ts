import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseRequest {
  product_id: string;
  tokens_required: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { product_id, tokens_required }: PurchaseRequest = await req.json();

    console.log('Processing purchase:', { user_id: user.id, product_id, tokens_required });

    // Start transaction
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('tokens_balance')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has enough tokens
    if (profile.tokens_balance < tokens_required) {
      return new Response(
        JSON.stringify({ error: 'Insufficient tokens' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check product availability
    const { data: product, error: productError } = await supabaseClient
      .from('marketplace_products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      console.error('Product error:', productError);
      return new Response(
        JSON.stringify({ error: 'Product not found or unavailable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (product.stock_quantity <= 0) {
      return new Response(
        JSON.stringify({ error: 'Product out of stock' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!product.price_tokens || product.price_tokens !== tokens_required) {
      return new Response(
        JSON.stringify({ error: 'Invalid token amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user tokens balance
    const { error: updateTokensError } = await supabaseClient
      .from('profiles')
      .update({ tokens_balance: profile.tokens_balance - tokens_required })
      .eq('user_id', user.id);

    if (updateTokensError) {
      console.error('Update tokens error:', updateTokensError);
      return new Response(
        JSON.stringify({ error: 'Failed to update tokens balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update product stock
    const { error: updateStockError } = await supabaseClient
      .from('marketplace_products')
      .update({ stock_quantity: product.stock_quantity - 1 })
      .eq('id', product_id);

    if (updateStockError) {
      console.error('Update stock error:', updateStockError);
      // Rollback tokens balance
      await supabaseClient
        .from('profiles')
        .update({ tokens_balance: profile.tokens_balance })
        .eq('user_id', user.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to update product stock' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('token_transactions')
      .insert({
        user_id: user.id,
        amount: -tokens_required,
        type: 'marketplace_purchase',
        description: `Achat: ${product.title}`,
        reference_id: product_id
      });

    if (transactionError) {
      console.error('Transaction record error:', transactionError);
      // Don't rollback here as the purchase was successful
    }

    console.log('Purchase completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Purchase completed successfully',
        remaining_tokens: profile.tokens_balance - tokens_required
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});