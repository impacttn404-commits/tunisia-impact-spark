-- Add check constraint to prevent negative token balance
ALTER TABLE profiles ADD CONSTRAINT positive_tokens_balance CHECK (tokens_balance >= 0);

-- Create atomic purchase function to prevent race conditions
CREATE OR REPLACE FUNCTION purchase_product_atomic(
  p_user_id uuid,
  p_product_id uuid,
  p_tokens_required integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance integer;
  v_new_stock integer;
  v_product_title text;
BEGIN
  -- Atomic update with row locking to prevent race conditions
  UPDATE profiles 
  SET tokens_balance = tokens_balance - p_tokens_required
  WHERE user_id = p_user_id AND tokens_balance >= p_tokens_required
  RETURNING tokens_balance INTO v_new_balance;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;
  
  -- Atomic stock update with row locking
  UPDATE marketplace_products 
  SET stock_quantity = stock_quantity - 1
  WHERE id = p_product_id 
    AND stock_quantity > 0 
    AND is_active = true
    AND price_tokens = p_tokens_required
  RETURNING stock_quantity, title INTO v_new_stock, v_product_title;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product unavailable or invalid token amount';
  END IF;
  
  -- Create transaction record
  INSERT INTO token_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, -p_tokens_required, 'marketplace_purchase', 'Achat: ' || v_product_title, p_product_id);
  
  RETURN jsonb_build_object(
    'success', true,
    'remaining_tokens', v_new_balance,
    'remaining_stock', v_new_stock
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;