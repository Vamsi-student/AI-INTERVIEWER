import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Flag } from "lucide-react";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
  flaggedQuestions?: number[];
  answeredQuestions?: number[];
  className?: string;
}

export default function ProgressBar({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  flaggedQuestions = [],
  answeredQuestions = [],
  className = ""
}: ProgressBarProps) {
  const progressPercentage = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;
  const questionsAnswered = answeredQuestions.length;
  const questionsFlagged = flaggedQuestions.length;

  const formatTime = (seconds?: number): string => {
    if (!seconds) return "--:--";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeVariant = () => {
    if (!timeRemaining) return "outline";
    if (timeRemaining <= 300) return "destructive"; // 5 minutes
    if (timeRemaining <= 600) return "secondary"; // 10 minutes
    return "outline";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-muted-foreground">
            {progressPercentage.toFixed(0)}% Complete
          </span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="w-full h-3 progress-indicator"
        />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Answered Questions */}
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              {questionsAnswered} answered
            </span>
          </div>

          {/* Flagged Questions */}
          {questionsFlagged > 0 && (
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">
                {questionsFlagged} flagged
              </span>
            </div>
          )}
        </div>

        {/* Timer */}
        {timeRemaining !== undefined && (
          <Badge 
            variant={getTimeVariant()}
            className={`flex items-center space-x-2 ${
              timeRemaining <= 300 ? 'animate-pulse' : ''
            }`}
          >
            <Clock className="h-3 w-3" />
            <span className="font-mono">
              {formatTime(timeRemaining)}
            </span>
          </Badge>
        )}
      </div>

      {/* Question Navigator (Optional - for larger screens) */}
      <div className="hidden md:block">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const isAnswered = answeredQuestions.includes(index);
            const isFlagged = flaggedQuestions.includes(index);
            const isCurrent = index === currentQuestion;
            
            return (
              <div
                key={index}
                className={`
                  w-8 h-8 rounded-md border text-xs font-medium flex items-center justify-center relative
                  ${isCurrent 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : isAnswered
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }
                  transition-colors duration-200
                `}
              >
                {questionNumber}
                {isFlagged && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
