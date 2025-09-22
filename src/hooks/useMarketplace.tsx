import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type MarketplaceProduct = Database['public']['Tables']['marketplace_products']['Row'];
type MarketplaceProductInsert = Database['public']['Tables']['marketplace_products']['Insert'];
type MarketplaceProductUpdate = Database['public']['Tables']['marketplace_products']['Update'];

export const useMarketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: MarketplaceProductInsert) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un produit",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('marketplace_products')
        .insert([{
          ...productData,
          seller_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Produit créé avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le produit",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateProduct = async (id: string, updates: MarketplaceProductUpdate) => {
    try {
      const { data, error } = await supabase
        .from('marketplace_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Succès",
        description: "Produit mis à jour avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const purchaseWithTokens = async (productId: string, tokensRequired: number) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour acheter",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call edge function to handle the purchase
      const { data, error } = await supabase.functions.invoke('purchase-with-tokens', {
        body: { 
          product_id: productId,
          tokens_required: tokensRequired
        }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Achat effectué avec succès !",
      });

      // Refresh products to update stock
      fetchProducts();

      return { data, error: null };
    } catch (error: any) {
      console.error('Error purchasing product:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'effectuer l'achat",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    purchaseWithTokens,
    refetch: fetchProducts,
  };
};