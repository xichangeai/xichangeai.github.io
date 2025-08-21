import { useState } from "react";
import { Send, User, Mail } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SendCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SendCreditsModal = ({ open, onOpenChange }: SendCreditsModalProps) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSend = async () => {
    if (!recipientEmail || !amount) return;
    
    setProcessing(true);
    
    // Simulate send processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessing(false);
    onOpenChange(false);
    
    toast.success(`Successfully sent ${amount} UAC to ${recipientEmail}!`);
    
    // Reset form
    setRecipientEmail("");
    setAmount("");
    setMessage("");
  };

  const fees = parseFloat(amount || "0") * 0.02; // 2% transaction fee
  const total = parseFloat(amount || "0") + fees;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send Credits
          </DialogTitle>
          <DialogDescription>
            Transfer UAC credits to another user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="recipient-email"
                  type="email"
                  placeholder="Enter recipient's email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (UAC)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Amount:</span>
                  <span className="font-semibold">{amount} UAC</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                  <span>Transaction fee (2%):</span>
                  <span>{fees.toFixed(2)} UAC</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total deducted:</span>
                  <span>{total.toFixed(2)} UAC</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-primary mb-1">Security Notice</div>
                <div className="text-muted-foreground">
                  Credits will be sent instantly to the recipient's wallet. This action cannot be undone.
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSend} 
            className="w-full" 
            size="lg"
            disabled={processing || !recipientEmail || !amount || parseFloat(amount || "0") <= 0}
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending Credits...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send {amount || "0"} UAC
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};