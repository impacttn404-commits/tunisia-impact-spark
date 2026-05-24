import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Strict input validation — prevents injection of invalid product_id/token amounts.
// tokens_required is capped to avoid overflow & abuse.
const PurchaseSchema = z.object({
  product_id: z.string().uuid({ message: 'product_id must be a valid UUID' }),
  tokens_required: z.number().int().positive().max(1_000_000),
});

// Mask user_id in logs (keep first 8 chars for traceability, no PII leak).
const maskId = (id: string) => `${id.slice(0, 8)}…`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error('[AUTH_ERROR]', { timestamp: new Date().toISOString(), message: authError?.message });
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate body with Zod before any DB call.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsed = PurchaseSchema.safeParse(body);
    if (!parsed.success) {
      console.warn('[VALIDATION_FAIL]', {
        timestamp: new Date().toISOString(),
        user: maskId(user.id),
        issues: parsed.error.issues.map((i) => ({ path: i.path, code: i.code })),
      });
      return new Response(
        JSON.stringify({ error: 'Invalid request payload', details: parsed.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { product_id, tokens_required } = parsed.data;

    console.log('[PURCHASE_START]', {
      timestamp: new Date().toISOString(),
      user: maskId(user.id),
      product_id,
      tokens_required,
    });

    const { data, error } = await supabaseClient.rpc('purchase_product_atomic', {
      p_user_id: user.id,
      p_product_id: product_id,
      p_tokens_required: tokens_required,
    });

    if (error) {
      console.error('[PURCHASE_ERROR]', {
        timestamp: new Date().toISOString(),
        user: maskId(user.id),
        error_message: error.message,
        error_code: error.code,
      });

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
      user: maskId(user.id),
      remaining_tokens: data.remaining_tokens,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Purchase completed successfully',
        remaining_tokens: data.remaining_tokens,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[UNEXPECTED_ERROR]', {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
    });
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
