import { Wallet, CreditCard, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { TopUpModal } from "./TopUpModal";
import { SubscriptionPlansModal } from "./SubscriptionPlansModal";

export const WalletBalance = () => {
  const [balance] = useState(500.00);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Coins className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  Wallet Balance
                </h3>
                <p className="text-sm text-muted-foreground">Universal AI Credit</p>
                <p className="text-3xl font-bold text-foreground">{balance.toFixed(2)} UAC</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => setShowTopUp(true)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
              >
                Top Up
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPlans(true)}
                className="text-primary hover:text-primary-foreground hover:bg-primary/20"
              >
                View Monthly Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TopUpModal open={showTopUp} onOpenChange={setShowTopUp} />
      <SubscriptionPlansModal open={showPlans} onOpenChange={setShowPlans} />
    </>
  );
};