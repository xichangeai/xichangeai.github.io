import { useState } from "react";
import { ArrowRightLeft, Heart, FileText, Image, Brain, Zap, Users } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const PLATFORMS = [
  { id: 'lovable', name: 'Lovable', icon: Heart, credits: 120, color: 'text-red-500' },
  { id: 'manus', name: 'Manus.ai', icon: FileText, credits: 300, color: 'text-blue-500' },
  { id: 'midjourney', name: 'Midjourney', icon: Image, credits: 85, color: 'text-purple-500' },
  { id: 'openai', name: 'OpenAI', icon: Brain, credits: 50, color: 'text-green-500' },
  { id: 'anthropic', name: 'Anthropic', icon: Zap, credits: 75, color: 'text-orange-500' },
  { id: 'huggingface', name: 'Hugging Face', icon: Users, credits: 45, color: 'text-yellow-500' }
];

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExchangeModal = ({ open, onOpenChange }: ExchangeModalProps) => {
  const [fromPlatform, setFromPlatform] = useState("");
  const [toPlatform, setToPlatform] = useState("");
  const [creditsAmount, setCreditsAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const fromPlatformData = PLATFORMS.find(p => p.id === fromPlatform);
  const toPlatformData = PLATFORMS.find(p => p.id === toPlatform);
  
  // Simple 1:1 exchange rate for now
  const exchangeRate = 1.0;
  const receivedCredits = creditsAmount ? parseFloat(creditsAmount) * exchangeRate : 0;

  const handleExchange = async () => {
    if (!creditsAmount || !fromPlatform || !toPlatform || fromPlatform === toPlatform) return;
    
    const amount = parseFloat(creditsAmount);
    if (amount <= 0 || !fromPlatformData || amount > fromPlatformData.credits) return;
    
    setProcessing(true);
    
    // Simulate exchange processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessing(false);
    onOpenChange(false);
    
    toast.success(`Successfully exchanged ${amount} ${fromPlatformData.name} credits for ${receivedCredits} ${toPlatformData?.name} credits!`);
    
    // Reset form
    setCreditsAmount("");
    setFromPlatform("");
    setToPlatform("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            Exchange Credits
          </DialogTitle>
          <DialogDescription>
            Exchange credits between AI platforms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="from-platform">From Platform</Label>
              <Select value={fromPlatform} onValueChange={setFromPlatform}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select platform to exchange from" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 ${platform.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span>{platform.name}</span>
                          <span className="text-muted-foreground">({platform.credits} available)</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="to-platform">To Platform</Label>
              <Select value={toPlatform} onValueChange={setToPlatform}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select platform to exchange to" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.filter(p => p.id !== fromPlatform).map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 ${platform.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span>{platform.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="credits-amount">Credits to Exchange</Label>
              <Input
                id="credits-amount"
                type="number"
                placeholder="Enter credits amount"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                className="mt-2"
                min="1"
                max={fromPlatformData?.credits || 0}
              />
              {fromPlatformData && (
                <p className="text-sm text-muted-foreground mt-1">
                  Available: {fromPlatformData.credits} credits
                </p>
              )}
            </div>
          </div>

          {fromPlatformData && toPlatformData && creditsAmount && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span>From {fromPlatformData.name}:</span>
                  <span className="font-semibold">{creditsAmount} credits</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Exchange Rate:</span>
                  <span className="font-semibold">1:1</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span>You'll receive in {toPlatformData.name}:</span>
                  <span className="font-semibold text-primary">
                    {receivedCredits} credits
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleExchange} 
            className="w-full" 
            size="lg"
            disabled={processing || !creditsAmount || !fromPlatform || !toPlatform || fromPlatform === toPlatform || parseFloat(creditsAmount || "0") <= 0 || parseFloat(creditsAmount || "0") > (fromPlatformData?.credits || 0)}
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing Exchange...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                Exchange Credits
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};