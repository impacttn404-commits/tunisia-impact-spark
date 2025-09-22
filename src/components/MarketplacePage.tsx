import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Coins, Plus, Package } from "lucide-react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { CreateProductModal } from "./CreateProductModal";

export const MarketplacePage = () => {
  const { products, loading, purchaseWithTokens } = useMarketplace();
  const { profile } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Tous", count: products.length },
    { id: "Alimentaire", label: "Alimentaire", count: products.filter(p => p.category === "Alimentaire").length },
    { id: "Cosmétique", label: "Cosmétique", count: products.filter(p => p.category === "Cosmétique").length },
    { id: "Artisanat", label: "Artisanat", count: products.filter(p => p.category === "Artisanat").length },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handlePurchase = async (productId: string, tokensRequired: number) => {
    if (!profile || profile.tokens_balance < tokensRequired) {
      return;
    }
    await purchaseWithTokens(productId, tokensRequired);
  };

  if (loading) {
    return (
      <div className="pb-20 px-6 pt-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de la marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Utilisez vos tokens pour découvrir des produits locaux à impact
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Vendre
          </Button>
        </div>
      </div>

      {/* Token Balance Card */}
      <div className="px-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">{profile?.tokens_balance || 0}</div>
                <p className="text-sm text-muted-foreground">tokens disponibles</p>
              </div>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Gagner des tokens
            </Button>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 space-y-6">
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit disponible</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory === "all" 
                ? "Aucun produit n'est actuellement disponible sur la marketplace."
                : `Aucun produit dans la catégorie "${selectedCategory}".`
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Ajouter le premier produit
            </Button>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-lg border-0">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {product.stock_quantity <= 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive">Rupture de stock</Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {product.category && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                    {product.category}
                  </Badge>
                )}
                <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...`
                    : product.description
                  }
                </p>
                
                <div className="text-sm text-muted-foreground mb-4">
                  Stock: <span className="font-medium">{product.stock_quantity} disponible(s)</span>
                </div>

                <div className="space-y-2">
                  {product.price_tokens && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:text-white"
                      onClick={() => handlePurchase(product.id, product.price_tokens!)}
                      disabled={
                        product.stock_quantity <= 0 || 
                        !profile || 
                        profile.tokens_balance < product.price_tokens
                      }
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {product.price_tokens} tokens
                      {profile && profile.tokens_balance < product.price_tokens && " (Insuffisant)"}
                    </Button>
                  )}
                  
                  {product.price_tnd && (
                    <Button 
                      size="sm" 
                      className="w-full bg-accent hover:bg-accent-dark text-white"
                      disabled={product.stock_quantity <= 0}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.price_tnd} TND
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Product Modal */}
      <CreateProductModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};