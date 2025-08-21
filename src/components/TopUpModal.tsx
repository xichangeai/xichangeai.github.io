import { useState } from "react";
import { CreditCard, DollarSign, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentModal } from "./PaymentModal";

const QUICK_AMOUNTS = [
  { amount: 50, bonus: 0, label: "$50" },
  { amount: 100, bonus: 10, label: "$100", popular: true },
  { amount: 250, bonus: 50, label: "$250" },
  { amount: 500, bonus: 125, label: "$500" },
];

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TopUpModal = ({ open, onOpenChange }: TopUpModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  const handleTopUp = () => {
    setShowPayment(true);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const bonus = QUICK_AMOUNTS.find(q => q.amount === finalAmount)?.bonus || 0;
  const totalCredits = finalAmount + bonus;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Top Up Wallet
            </DialogTitle>
            <DialogDescription>
              Add Universal AI Credits (UAC) to your wallet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Quick amounts</Label>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_AMOUNTS.map((option) => (
                  <Card
                    key={option.amount}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedAmount === option.amount && !customAmount
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    } ${option.popular ? "ring-2 ring-primary/30" : ""}`}
                    onClick={() => {
                      setSelectedAmount(option.amount);
                      setCustomAmount("");
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{option.amount}</span>
                      </div>
                      {option.bonus > 0 && (
                        <div className="text-xs text-primary">+{option.bonus} bonus</div>
                      )}
                      {option.popular && (
                        <div className="text-xs text-primary font-medium mt-1">Popular</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="custom-amount" className="text-base font-medium">Custom amount</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-10"
                  min="1"
                  max="10000"
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Amount:</span>
                  <span>${finalAmount}</span>
                </div>
                {bonus > 0 && (
                  <div className="flex justify-between items-center mb-2 text-primary">
                    <span>Bonus credits:</span>
                    <span>+{bonus} UAC</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                  <span>Total UAC:</span>
                  <span>{totalCredits} UAC</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleTopUp} 
              className="w-full" 
              size="lg"
              disabled={!finalAmount || finalAmount < 1}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Continue to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal 
        open={showPayment} 
        onOpenChange={setShowPayment}
        amount={finalAmount}
        credits={totalCredits}
        type="topup"
      />
    </>
  );
};