import { useState } from "react";
import { Crown, Check, Zap, Star, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentModal } from "./PaymentModal";

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    credits: 100,
    features: [
      '100 UAC credits per month',
      'Access to 3 AI platforms',
      'Standard support',
      'Basic exchange rates'
    ],
    icon: Zap,
    color: 'text-blue-500'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    credits: 250,
    features: [
      '250 UAC credits per month',
      'Access to all AI platforms',
      'Priority support',
      'Better exchange rates',
      'Advanced analytics'
    ],
    icon: Star,
    color: 'text-primary',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    credits: 750,
    features: [
      '750 UAC credits per month',
      'Unlimited platform access',
      'Dedicated support',
      'Best exchange rates',
      'Advanced analytics',
      'Custom integrations',
      'Team management'
    ],
    icon: Crown,
    color: 'text-amber-500',
    premium: true
  }
];

interface SubscriptionPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionPlansModal = ({ open, onOpenChange }: SubscriptionPlansModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<typeof SUBSCRIPTION_PLANS[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubscribe = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-primary" />
              Choose Your Plan
            </DialogTitle>
            <DialogDescription>
              Select the perfect plan for your AI credit needs
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`relative transition-all duration-300 hover:shadow-lg cursor-pointer group ${
                    plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:border-primary/50'
                  } ${plan.premium ? 'bg-gradient-to-br from-amber-50/5 to-amber-100/5 border-amber-200/20' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  {plan.premium && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white">
                      Enterprise
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center ${plan.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{plan.credits} UAC</div>
                      <div className="text-sm text-muted-foreground">credits per month</div>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full mt-6 group-hover:scale-105 transition-transform ${
                        plan.popular ? 'bg-primary hover:bg-primary-hover' : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan)}
                    >
                      Choose {plan.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            All plans include a 7-day free trial • Cancel anytime • No hidden fees
          </div>
        </DialogContent>
      </Dialog>

      {selectedPlan && (
        <PaymentModal 
          open={showPayment} 
          onOpenChange={setShowPayment}
          amount={selectedPlan.price}
          credits={selectedPlan.credits}
          type="subscription"
          planName={selectedPlan.name}
        />
      )}
    </>
  );
};