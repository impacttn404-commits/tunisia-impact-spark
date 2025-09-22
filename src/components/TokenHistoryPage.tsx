import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";

interface TokenHistoryPageProps {
  onBack: () => void;
}

export const TokenHistoryPage = ({ onBack }: TokenHistoryPageProps) => {
  const { transactions, loading, balance, getTransactionTypeLabel, getTransactionIcon } = useTokens();

  if (loading) {
    return (
      <div className="pb-20 px-6 pt-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Historique des Tokens</h1>
            <p className="text-muted-foreground">
              Suivez tous vos gains et dépenses de tokens
            </p>
          </div>
        </div>
      </div>

      {/* Current Balance */}
      <div className="px-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{balance}</div>
            <p className="text-muted-foreground">Solde actuel</p>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-success" />
              <div>
                <div className="text-xl font-bold text-success">
                  +{transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Gains totaux</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-8 h-8 text-destructive" />
              <div>
                <div className="text-xl font-bold text-destructive">
                  {transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)}
                </div>
                <p className="text-sm text-muted-foreground">Dépenses totales</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Historique des transactions</h2>
        
        {transactions.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune transaction</h3>
            <p className="text-muted-foreground">
              Vos transactions apparaîtront ici au fur et à mesure
            </p>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {getTransactionTypeLabel(transaction.type)}
                    </div>
                    {transaction.description && (
                      <div className="text-sm text-muted-foreground">
                        {transaction.description}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    transaction.amount > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </div>
                  <Badge 
                    variant={transaction.amount > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {transaction.amount > 0 ? 'Crédit' : 'Débit'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};