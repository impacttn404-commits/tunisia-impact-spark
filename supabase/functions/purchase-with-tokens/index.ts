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

    console.log('[PURCHASE_START]', { 
      timestamp: new Date().toISOString(),
      user_id: user.id, 
      product_id, 
      tokens_required 
    });

    // Use atomic transaction function to prevent race conditions
    const { data, error } = await supabaseClient.rpc('purchase_product_atomic', {
      p_user_id: user.id,
      p_product_id: product_id,
      p_tokens_required: tokens_required
    });

    if (error) {
      console.error('[PURCHASE_ERROR]', {
        timestamp: new Date().toISOString(),
        user_id: user.id,
        error_message: error.message,
        error_code: error.code
      });

      // Map specific errors to user-friendly messages
      let statusCode = 400;
      let userMessage = 'Purchase failed. Please try again.';

      if (error.message.includes('Insufficient tokens')) {
        userMessage = 'Insufficient tokens for this purchase.';
      } else if (error.message.includes('Product unavailable')) {
        userMessage = 'Product is no longer available.';
        statusCode = 404;
      } else if (error.message.includes('invalid token amount')) {
        userMessage = 'Invalid purchase amount.';
      }

      return new Response(
        JSON.stringify({ error: userMessage }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[PURCHASE_SUCCESS]', {
      timestamp: new Date().toISOString(),
      user_id: user.id,
      remaining_tokens: data.remaining_tokens
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Purchase completed successfully',
        remaining_tokens: data.remaining_tokens
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