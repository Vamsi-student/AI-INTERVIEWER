import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, FileText } from "lucide-react";

interface SubjectiveQuestionProps {
  question: {
    id: number;
    question: string;
    points: number;
    rubric?: string;
  };
  onSubmit: (answer: { answer: string }) => void;
  previousAnswer?: { answer: string };
}

export default function SubjectiveQuestion({ question, onSubmit, previousAnswer }: SubjectiveQuestionProps) {
  const [answer, setAnswer] = useState<string>(previousAnswer?.answer || "");
  const [hasSubmitted, setHasSubmitted] = useState(!!previousAnswer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnswer(previousAnswer?.answer || "");
    setHasSubmitted(!!previousAnswer);
  }, [question.id, previousAnswer]);

  const handleSubmit = async () => {
    if (!answer.trim() || hasSubmitted) return;
    
    setIsSubmitting(true);
    setHasSubmitted(true);
    
    try {
      await onSubmit({ answer: answer.trim() });
    } catch (error) {
      setHasSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 50; // Minimum recommended words for a good answer

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-foreground leading-relaxed text-lg mb-4">
            {question.question}
          </p>
          
          {question.rubric && (
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Evaluation Criteria:</p>
                    <p className="text-sm text-muted-foreground">{question.rubric}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Answer Input */}
      <div className="ml-11">
        <div className="space-y-4">
          <div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your detailed answer here..."
              disabled={hasSubmitted}
              className="min-h-[200px] resize-y"
              maxLength={2000}
            />
            
            {/* Word count and guidance */}
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className={`${
                wordCount >= minWords ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {wordCount} words {wordCount < minWords && `(minimum ${minWords} recommended)`}
              </span>
              <span className="text-muted-foreground">
                {answer.length}/2000 characters
              </span>
            </div>
          </div>

          {/* Guidelines */}
          {!hasSubmitted && (
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Tips for a great answer:</strong> Provide specific examples, explain your reasoning, 
                  and demonstrate deep understanding of the topic. Aim for clarity and detail.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div>
            {!hasSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Answer...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Answer submitted and being evaluated by AI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
