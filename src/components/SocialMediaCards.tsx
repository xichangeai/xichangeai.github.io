import { ExternalLink, Users, MessageCircle, Briefcase, Camera, Globe, Play, Music, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SocialMediaCards = () => {
  const socialPlatforms = [
    {
      name: "X",
      handle: "@aicreditsapp",
      description: "Latest updates and AI news",
      color: "bg-black",
      icon: MessageCircle,
      url: "#"
    },
    {
      name: "Discord",
      handle: "AI Credits Community",
      description: "Join our community discussions",
      color: "bg-indigo-500",
      icon: Users,
      url: "#"
    },
    {
      name: "LinkedIn",
      handle: "AI Credits",
      description: "Professional AI insights",
      color: "bg-blue-600",
      icon: Briefcase,
      url: "#"
    },
    {
      name: "Instagram",
      handle: "@aicredits",
      description: "Visual AI content & tips",
      color: "bg-pink-500",
      icon: Camera,
      url: "#"
    },
    {
      name: "Facebook",
      handle: "AI Credits",
      description: "Connect with our community",
      color: "bg-blue-500",
      icon: Globe,
      url: "#"
    },
    {
      name: "YouTube",
      handle: "@aicredits",
      description: "AI tutorials and demos",
      color: "bg-red-500",
      icon: Play,
      url: "#"
    },
    {
      name: "TikTok",
      handle: "@aicredits",
      description: "Quick AI tips and tricks",
      color: "bg-black",
      icon: Music,
      url: "#"
    },
    {
      name: "Reddit",
      handle: "r/aicredits",
      description: "Community discussions",
      color: "bg-orange-500",
      icon: MessageSquare,
      url: "#"
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Connect With Us</h2>
        <p className="text-muted-foreground">Stay updated with the latest AI news and community updates</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.name} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{platform.handle}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {platform.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => window.open(platform.url, '_blank')}
                >
                  Follow
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};