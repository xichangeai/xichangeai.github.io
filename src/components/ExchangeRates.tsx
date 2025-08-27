import { TrendingUp, Heart, FileText, Image, Brain, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXCHANGE_RATES = [
  {
    platform: 'Lovable',
    icon: Heart,
    color: 'text-red-500',
    rate: 1.00,
    description: 'Code generation'
  },
  {
    platform: 'Manus.ai',
    icon: FileText,
    color: 'text-blue-500',
    rate: 0.80,
    description: 'Document AI'
  },
  {
    platform: 'Midjourney',
    icon: Image,
    color: 'text-purple-500',
    rate: 1.20,
    description: 'Image generation'
  },
  {
    platform: 'OpenAI',
    icon: Brain,
    color: 'text-green-500',
    rate: 1.50,
    description: 'GPT models'
  },
  {
    platform: 'Anthropic',
    icon: Sparkles,
    color: 'text-orange-500',
    rate: 1.10,
    description: 'Claude AI'
  },
  {
    platform: 'Hugging Face',
    icon: Users,
    color: 'text-yellow-500',
    rate: 0.90,
    description: 'ML models'
  }
];

export const ExchangeRates = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="w-5 h-5" />
          Exchange Rates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rates for converting UAC to platform credits.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground mb-4">
            <div>Platform</div>
            <div className="text-right">1 UAC equals</div>
          </div>
          
          {EXCHANGE_RATES.map((rate) => {
            const IconComponent = rate.icon;
            return (
              <div 
                key={rate.platform}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md bg-muted/50 flex items-center justify-center ${rate.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">{rate.platform}</div>
                    <div className="text-xs text-muted-foreground">{rate.description}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">{rate.rate.toFixed(2)} credits</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="text-sm text-center text-muted-foreground">
            Exchange rates update daily • Best rates available with Premium plans
          </div>
        </div>
      </CardContent>
    </Card>
  );
};