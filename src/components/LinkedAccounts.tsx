import { useState } from "react";
import { Link, Unlink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import chatgptLogo from "@/assets/chatgpt-logo.png";
import claudeLogo from "@/assets/claude-logo.png";
import midjourneyLogo from "@/assets/midjourney-logo.png";
import huggingfaceLogo from "@/assets/huggingface-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
import manusLogo from "@/assets/manus-logo.png";

const AI_PLATFORMS = [
  {
    id: 'lovable',
    name: 'Lovable',
    credits: 120,
    connected: true,
    logo: lovableLogo,
    color: 'text-red-500',
    description: 'Code generation platform'
  },
  {
    id: 'manus',
    name: 'Manus.ai',
    credits: 300,
    connected: true,
    logo: manusLogo,
    color: 'text-blue-500',
    description: 'Document AI assistant'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    credits: 0,
    connected: false,
    logo: midjourneyLogo,
    color: 'text-purple-500',
    description: 'AI image generation'
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    credits: 50,
    connected: true,
    logo: chatgptLogo,
    color: 'text-green-500',
    description: 'GPT & AI models'
  },
  {
    id: 'anthropic',
    name: 'Claude',
    credits: 75,
    connected: true,
    logo: claudeLogo,
    color: 'text-orange-500',
    description: 'Claude AI assistant'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    credits: 0,
    connected: false,
    logo: huggingfaceLogo,
    color: 'text-yellow-500',
    description: 'ML model hub'
  }
];

export const LinkedAccounts = () => {
  const [platforms, setPlatforms] = useState(AI_PLATFORMS);

  const handleConnect = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: true, credits: Math.floor(Math.random() * 100) + 10 }
        : platform
    ));
    const platform = platforms.find(p => p.id === platformId);
    toast.success(`Successfully connected to ${platform?.name}!`);
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: false, credits: 0 }
        : platform
    ));
    const platform = platforms.find(p => p.id === platformId);
    toast.success(`Disconnected from ${platform?.name}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Linked Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            return (
              <Card 
                key={platform.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  platform.connected ? 'border-primary/30 bg-primary/5' : 'border-border'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                        <img 
                          src={platform.logo} 
                          alt={`${platform.name} logo`}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-xs text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>
                    {platform.connected && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        Connected
                      </Badge>
                    )}
                  </div>
                  
                  {platform.connected && (
                    <div className="mb-3">
                      <div className="text-sm text-muted-foreground">Credits</div>
                      <div className="text-lg font-semibold">{platform.credits}</div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {platform.connected ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        onClick={() => handleDisconnect(platform.id)}
                      >
                        <Unlink className="w-3 h-3 mr-2" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleConnect(platform.id)}
                      >
                        <Link className="w-3 h-3 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};