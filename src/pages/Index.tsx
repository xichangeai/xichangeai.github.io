import { Header } from "@/components/Header";
import { WalletBalance } from "@/components/WalletBalance";
import { LinkedAccounts } from "@/components/LinkedAccounts";
import { ExchangeRates } from "@/components/ExchangeRates";
import { Actions } from "@/components/Actions";

const Index = () => {
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
