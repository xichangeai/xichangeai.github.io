import { useState, useEffect } from "react";

interface CountdownTimerProps {
  resetHour: number; // Hour in UTC when credits reset (0-23)
}

export const CountdownTimer = ({ resetHour }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      
      // Create next reset time
      const nextReset = new Date(utcNow);
      nextReset.setUTCHours(resetHour, 0, 0, 0);
      
      // If we've passed today's reset time, set it to tomorrow
      if (utcNow >= nextReset) {
        nextReset.setUTCDate(nextReset.getUTCDate() + 1);
      }
      
      const diff = nextReset.getTime() - utcNow.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [resetHour]);

  return (
    <div className="text-xs text-muted-foreground mt-1">
      Free quota resets in: {timeRemaining}
    </div>
  );
};