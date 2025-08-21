import { RefreshCw } from "lucide-react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
          <div className="text-lg font-bold text-primary">X</div>
        </div>
        <RefreshCw className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
      </div>
      <span className="text-xl font-bold">Xchange.ai</span>
    </div>
  );
};