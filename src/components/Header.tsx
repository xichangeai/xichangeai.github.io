import { useState } from "react";
import { User, Settings, LogOut, ChevronDown, CreditCard, Moon, Sun, History } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VirtualCardModal } from "./VirtualCardModal";

export const Header = () => {
  const [user] = useState({
    name: "Lungelo Sigudla",
    email: "lungelosigudla@gmail.com",
    initials: "LS"
  });
  const [showVirtualCard, setShowVirtualCard] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newTheme = theme === "light" ? "dark" : "light";
              setTheme(newTheme);
              document.documentElement.classList.toggle('dark');
            }}
            className="w-9 h-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-2">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
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
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-3" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <VirtualCardModal open={showVirtualCard} onOpenChange={setShowVirtualCard} />
    </header>
  );
};