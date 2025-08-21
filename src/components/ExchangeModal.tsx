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
  { id: 'lovable', name: 'Lovable', icon: Heart, rate: 1.00, color: 'text-red-500' },
  { id: 'manus', name: 'Manus.ai', icon: FileText, rate: 0.80, color: 'text-blue-500' },
  { id: 'midjourney', name: 'Midjourney', icon: Image, rate: 1.20, color: 'text-purple-500' },
  { id: 'openai', name: 'OpenAI', icon: Brain, rate: 1.50, color: 'text-green-500' },
  { id: 'anthropic', name: 'Anthropic', icon: Zap, rate: 1.10, color: 'text-orange-500' },
  { id: 'huggingface', name: 'Hugging Face', icon: Users, rate: 0.90, color: 'text-yellow-500' }
];

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExchangeModal = ({ open, onOpenChange }: ExchangeModalProps) => {
  const [uacAmount, setUacAmount] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedPlatformData = PLATFORMS.find(p => p.id === selectedPlatform);
  const platformCredits = selectedPlatformData && uacAmount 
    ? (parseFloat(uacAmount) * selectedPlatformData.rate).toFixed(2)
    : "0";

  const handleExchange = async () => {
    if (!uacAmount || !selectedPlatform) return;
    
    setProcessing(true);
    
    // Simulate exchange processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessing(false);
    onOpenChange(false);
    
    toast.success(`Successfully exchanged ${uacAmount} UAC for ${platformCredits} ${selectedPlatformData?.name} credits!`);
    
    // Reset form
    setUacAmount("");
    setSelectedPlatform("");
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
            Convert your UAC to platform-specific credits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="uac-amount">UAC Amount</Label>
              <Input
                id="uac-amount"
                type="number"
                placeholder="Enter UAC amount"
                value={uacAmount}
                onChange={(e) => setUacAmount(e.target.value)}
                className="mt-2"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="platform">Target Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select platform" />
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
                          <span className="text-muted-foreground">({platform.rate}x)</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPlatformData && uacAmount && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span>UAC Amount:</span>
                  <span className="font-semibold">{uacAmount} UAC</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Exchange Rate:</span>
                  <span className="font-semibold">{selectedPlatformData.rate}x</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span>You'll receive:</span>
                  <span className="font-semibold text-primary">
                    {platformCredits} {selectedPlatformData.name} credits
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleExchange} 
            className="w-full" 
            size="lg"
            disabled={processing || !uacAmount || !selectedPlatform || parseFloat(uacAmount || "0") <= 0}
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