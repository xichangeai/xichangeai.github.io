import { useState } from "react";
import { Link, Unlink, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

const ADDITIONAL_PLATFORMS = [
  { id: 'perplexity', name: 'Perplexity AI', description: 'AI search engine' },
  { id: 'replicate', name: 'Replicate', description: 'Run AI models' },
  { id: 'cohere', name: 'Cohere', description: 'NLP platform' },
  { id: 'stability', name: 'Stability AI', description: 'Stable Diffusion' },
  { id: 'runway', name: 'Runway ML', description: 'Creative AI tools' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'AI voice generation' },
];

export const LinkedAccounts = () => {
  const [platforms, setPlatforms] = useState(AI_PLATFORMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleAddPlatform = (platformId: string) => {
    const additionalPlatform = ADDITIONAL_PLATFORMS.find(p => p.id === platformId);
    if (additionalPlatform) {
      const newPlatform = {
        ...additionalPlatform,
        credits: Math.floor(Math.random() * 100) + 10,
        connected: true,
        logo: '',
        color: 'text-primary'
      };
      setPlatforms(prev => [...prev, newPlatform]);
      toast.success(`Successfully added ${additionalPlatform.name}!`);
      setShowAddModal(false);
      setSearchQuery("");
    }
  };

  const filteredAdditionalPlatforms = ADDITIONAL_PLATFORMS.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !platforms.some(p => p.id === platform.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Linked Accounts
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add AI Platform Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search AI platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredAdditionalPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleAddPlatform(platform.id)}
                >
                  <div>
                    <h4 className="font-medium">{platform.name}</h4>
                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {filteredAdditionalPlatforms.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  {searchQuery ? "No platforms found" : "All available platforms are already added"}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};