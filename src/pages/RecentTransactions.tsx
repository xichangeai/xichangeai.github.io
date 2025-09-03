import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, CreditCard, Repeat, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  type: 'exchange' | 'sent' | 'received' | 'purchase' | 'subscription';
  amount: number;
  currency: string;
  targetCurrency?: string;
  targetAmount?: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'subscription',
    amount: 19.99,
    currency: 'USD',
    description: 'Basic Plan - Monthly Subscription',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '2',
    type: 'exchange',
    amount: 100,
    currency: 'UAC',
    targetCurrency: 'ChatGPT',
    targetAmount: 85,
    description: 'Exchange UAC to ChatGPT Credits',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '3',
    type: 'sent',
    amount: 50,
    currency: 'UAC',
    description: 'Sent to john.doe@email.com',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '4',
    type: 'purchase',
    amount: 25.00,
    currency: 'USD',
    targetCurrency: 'UAC',
    targetAmount: 125,
    description: 'Top-up Credits Purchase',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '5',
    type: 'received',
    amount: 30,
    currency: 'UAC',
    description: 'Received from alice@email.com',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'completed'
  }
];

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'exchange':
      return <Repeat className="w-4 h-4" />;
    case 'sent':
      return <ArrowUpRight className="w-4 h-4 text-destructive" />;
    case 'received':
      return <ArrowDownRight className="w-4 h-4 text-success" />;
    case 'purchase':
      return <CreditCard className="w-4 h-4" />;
    case 'subscription':
      return <Crown className="w-4 h-4 text-primary" />;
    default:
      return <CreditCard className="w-4 h-4" />;
  }
};

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-success/10 text-success border-success/20';
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'failed':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const RecentTransactions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Recent Transactions</h1>
            <p className="text-muted-foreground">Your latest transaction history</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Last 5 Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted/50">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.timestamp.toLocaleDateString()} at{' '}
                      {transaction.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">
                      {transaction.type === 'sent' ? '-' : transaction.type === 'purchase' ? '-' : ''}
                      {transaction.amount} {transaction.currency}
                    </div>
                    {transaction.targetCurrency && (
                      <div className="text-sm text-muted-foreground">
                        → {transaction.targetAmount} {transaction.targetCurrency}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentTransactions;