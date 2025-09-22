import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarketplace } from "@/hooks/useMarketplace";
import type { Database } from '@/integrations/supabase/types';

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  'Alimentaire',
  'Cosmétique',
  'Artisanat',
  'Technologie',
  'Services',
  'Formation',
  'Autres'
];

export const CreateProductModal = ({ open, onOpenChange }: CreateProductModalProps) => {
  const { createProduct } = useMarketplace();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_tokens: '',
    price_tnd: '',
    stock_quantity: '1',
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: Database['public']['Tables']['marketplace_products']['Insert'] = {
        title: formData.title,
        description: formData.description,
        category: formData.category || null,
        price_tokens: formData.price_tokens ? parseInt(formData.price_tokens) : null,
        price_tnd: formData.price_tnd ? parseFloat(formData.price_tnd) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: formData.image_url || null,
        is_active: true,
        seller_id: '', // Will be set by the hook
      };

      const result = await createProduct(productData);
      
      if (result?.error === null) {
        onOpenChange(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          price_tokens: '',
          price_tnd: '',
          stock_quantity: '1',
          image_url: '',
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un produit à la marketplace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Nom du produit *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Huile d'olive bio premium"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre produit, sa qualité et son origine..."
                rows={4}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock_quantity">Quantité en stock *</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="1"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_tokens">Prix en tokens</Label>
              <Input
                id="price_tokens"
                type="number"
                min="1"
                value={formData.price_tokens}
                onChange={(e) => handleInputChange('price_tokens', e.target.value)}
                placeholder="100"
              />
            </div>

            <div>
              <Label htmlFor="price_tnd">Prix en TND</Label>
              <Input
                id="price_tnd"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_tnd}
                onChange={(e) => handleInputChange('price_tnd', e.target.value)}
                placeholder="25.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Ajouter le produit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};