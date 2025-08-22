import { CreditCard, Copy, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface VirtualCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VirtualCardModal = ({ open, onOpenChange }: VirtualCardModalProps) => {
  const { toast } = useToast();

  const cardDetails = {
    number: "4532 1234 5678 9012",
    expiry: "12/28",
    cvv: "123",
    name: "AI CREDITS ONLY",
    balance: "2,450.00"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Virtual AI Credit Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Visual */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-8 h-6 bg-primary-foreground/20 rounded"></div>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  AI ONLY
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="text-lg font-mono tracking-wider">
                  {cardDetails.number}
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80">EXPIRES</div>
                    <div className="font-mono">{cardDetails.expiry}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">CVV</div>
                    <div className="font-mono">{cardDetails.cvv}</div>
                  </div>
                </div>
                
                <div className="text-sm font-semibold">
                  {cardDetails.name}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Available Balance</span>
              <span className="font-semibold">${cardDetails.balance} UAC</span>
            </div>

            <Separator />

            {/* Copy Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={() => copyToClipboard(cardDetails.number.replace(/\s/g, ''), "Card number")}
              >
                <span>Copy Card Number</span>
                <Copy className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(cardDetails.expiry, "Expiry date")}
                >
                  Copy Expiry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(cardDetails.cvv, "CVV")}
                >
                  Copy CVV
                </Button>
              </div>
            </div>

            <Separator />

            {/* Usage Instructions */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Usage Instructions:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Use this card at any AI platform that accepts payments</li>
                    <li>• Your UAC credits will be automatically converted</li>
                    <li>• Card only works for AI-related services</li>
                    <li>• Real-time balance updates after each transaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};