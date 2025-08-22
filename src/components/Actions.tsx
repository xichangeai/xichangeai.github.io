import { useState } from "react";
import { ArrowRightLeft, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExchangeModal } from "./ExchangeModal";
import { SendCreditsModal } from "./SendCreditsModal";

export const Actions = () => {
  const [showExchange, setShowExchange] = useState(false);
  const [showSend, setShowSend] = useState(false);

  return (
    <>
      <Card className="bg-primary/5 border-primary/20 ring-1 ring-primary/10">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Exchange or send your credits.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 flex-col gap-2 bg-primary/15 border-primary/40 text-white hover:bg-primary/25 hover:border-primary/50 hover:text-white"
              onClick={() => setShowExchange(true)}
            >
              <ArrowRightLeft className="w-5 h-5 text-white" />
              Exchange Credits
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 flex-col gap-2 bg-primary/15 border-primary/40 text-white hover:bg-primary/25 hover:border-primary/50 hover:text-white"
              onClick={() => setShowSend(true)}
            >
              <Send className="w-5 h-5 text-white" />
              Send Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExchangeModal open={showExchange} onOpenChange={setShowExchange} />
      <SendCreditsModal open={showSend} onOpenChange={setShowSend} />
    </>
  );
};