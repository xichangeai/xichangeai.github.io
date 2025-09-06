
import { useState, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown, CreditCard, Moon, Sun, History, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VirtualCardModal } from "./VirtualCardModal";
import { AuthModal } from "./AuthModal";
import { SettingsModal } from "./SettingsModal";

export const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [profile, setProfile] = useState<{ full_name?: string; email?: string } | null>(null);
  const [showVirtualCard, setShowVirtualCard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.user_metadata?.full_name || user.email,
        email: user.email,
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-9 h-9"
          >
            <Sun className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <Moon className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {loading ? (
            <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          ) : user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">{profile.full_name}</div>
                      <div className="text-sm text-muted-foreground">{profile.email}</div>
                    </div>
                    <Avatar className="w-9 h-9 bg-primary/20 border border-primary/30">
                      <AvatarFallback className="bg-primary/20 text-primary border-0">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/transactions")}>
                  <History className="w-4 h-4 mr-3" />
                  Recent Transactions
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowVirtualCard(true)}>
                  <CreditCard className="w-4 h-4 mr-3" />
                  <div className="flex flex-col">
                    <span>Virtual Card</span>
                    <span className="text-xs text-muted-foreground">AI Credits Only</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-3" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowAuth(true)}>
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowAuth(true)}>
                  <History className="w-4 h-4 mr-3" />
                  Recent Transactions
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowAuth(true)}>
                  <CreditCard className="w-4 h-4 mr-3" />
                  <div className="flex flex-col">
                    <span>Virtual Card</span>
                    <span className="text-xs text-muted-foreground">AI Credits Only</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowAuth(true)}>
                  <LogIn className="w-4 h-4 mr-3" />
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowAuth(true)}>
                  <User className="w-4 h-4 mr-3" />
                  Create Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <VirtualCardModal open={showVirtualCard} onOpenChange={setShowVirtualCard} />
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </header>
  );
};
