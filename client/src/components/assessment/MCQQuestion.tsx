import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface MCQQuestionProps {
  question: {
    id: number;
    question: string;
    options: string[];
    points: number;
  };
  onSubmit: (answer: { answer: string }) => void;
  previousAnswer?: { answer: string };
}

export default function MCQQuestion({ question, onSubmit, previousAnswer }: MCQQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>(previousAnswer?.answer || "");
  const [hasSubmitted, setHasSubmitted] = useState(!!previousAnswer);

  useEffect(() => {
    setSelectedOption(previousAnswer?.answer || "");
    setHasSubmitted(!!previousAnswer);
  }, [question.id, previousAnswer]);

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setHasSubmitted(true);
    onSubmit({ answer: selectedOption });
  };

  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-foreground leading-relaxed text-lg">
            {question.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="ml-11">
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          disabled={hasSubmitted}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const optionValue = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedOption === optionValue;
            
            return (
              <div key={optionValue}>
                <Label
                  htmlFor={`option-${optionValue}`}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  } ${hasSubmitted ? "cursor-not-allowed opacity-75" : ""}`}
                >
                  <RadioGroupItem
                    value={optionValue}
                    id={`option-${optionValue}`}
                    className="mt-1"
                    disabled={hasSubmitted}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{optionValue}.</span>
                    <span className="text-foreground ml-2">{option}</span>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {/* Submit Button */}
        <div className="mt-6">
          {!hasSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Answer submitted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
