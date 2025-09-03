import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { WalletBalance } from "@/components/WalletBalance";
import { LinkedAccounts } from "@/components/LinkedAccounts";
import { ExchangeRates } from "@/components/ExchangeRates";
import { Actions } from "@/components/Actions";

const Index = () => {
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
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet & Actions */}
          <div className="lg:col-span-2 space-y-8">
            <WalletBalance />
            <Actions />
            <LinkedAccounts />
          </div>
          
          {/* Right Column - Exchange Rates */}
          <div className="lg:col-span-1">
            <ExchangeRates />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
