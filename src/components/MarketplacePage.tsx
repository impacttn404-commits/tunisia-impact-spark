import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Coins } from "lucide-react";

export const MarketplacePage = () => {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Utilisez vos tokens pour découvrir des produits locaux à impact
        </p>
      </div>

      {/* Token Balance Card */}
      <div className="px-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-token-bg to-token/10 border-token/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-token" />
              <div>
                <div className="text-2xl font-bold text-token">750</div>
                <p className="text-sm text-muted-foreground">tokens disponibles</p>
              </div>
            </div>
            <Button className="bg-token hover:bg-token/90 text-white">
              Gagner des tokens
            </Button>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" className="rounded-full bg-primary text-primary-foreground">
            Tous <Badge variant="secondary" className="ml-1 bg-white text-primary">2</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Alimentaire <Badge variant="secondary" className="ml-1">1</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Cosmétique
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 space-y-6">
        {/* Product 1 */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200"></div>
          <div className="p-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
              Alimentaire
            </Badge>
            <h3 className="text-lg font-bold mb-2">Huile d'olive bio premium</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Huile d'olive extra vierge produite dans les...
            </p>
            
            <div className="text-sm text-muted-foreground mb-4">
              Vendu par: <span className="font-medium">Fatma Trabelsi</span>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full bg-token/10 text-token border-token/30">
                <Coins className="w-4 h-4 mr-2" />
                100 tokens
              </Button>
              <Button size="sm" className="w-full bg-primary hover:bg-primary-dark text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                25 TND
              </Button>
            </div>
          </div>
        </Card>

        {/* Product 2 */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-48 bg-gradient-to-br from-green-100 to-green-200"></div>
          <div className="p-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
              Cosmétique
            </Badge>
            <h3 className="text-lg font-bold mb-2">Savon artisanal naturel</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Savons fabriqués à partir d'ingrédients naturels...
            </p>
            
            <div className="text-sm text-muted-foreground mb-4">
              Vendu par: <span className="font-medium">Fatma Trabelsi</span>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full bg-token/10 text-token border-token/30">
                <Coins className="w-4 h-4 mr-2" />
                50 tokens
              </Button>
              <Button size="sm" className="w-full bg-primary hover:bg-primary-dark text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                12 TND
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};