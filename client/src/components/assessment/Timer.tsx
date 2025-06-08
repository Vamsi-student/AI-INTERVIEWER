import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  className?: string;
}

export default function Timer({ initialTime, onTimeUp, className = "" }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Set warning states
        if (newTime <= 300 && !isCritical) { // 5 minutes
          setIsCritical(true);
        } else if (newTime <= 600 && !isWarning) { // 10 minutes
          setIsWarning(true);
        }
        
        // Time's up
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, isWarning, isCritical]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerVariant = () => {
    if (isCritical) return "destructive";
    if (isWarning) return "secondary";
    return "outline";
  };

  const getTimerIcon = () => {
    if (isCritical) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <Badge 
      variant={getTimerVariant()}
      className={`flex items-center space-x-2 px-3 py-1 ${className} ${
        isCritical ? 'animate-pulse' : ''
      }`}
    >
      {getTimerIcon()}
      <span className="font-mono font-medium">
        {formatTime(timeRemaining)}
      </span>
    </Badge>
  );
}
