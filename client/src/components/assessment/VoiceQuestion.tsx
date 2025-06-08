import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VoiceRecorder from "@/components/ui/voice-recorder";
import { Bot, Volume2, FileText, Mic } from "lucide-react";
import { speakText } from "@/lib/speechUtils";

interface VoiceQuestionProps {
  question: {
    id: number;
    question: string;
    points: number;
    rubric?: string;
  };
  onSubmit: (answer: { transcription: string; audioUrl?: string }) => void;
  previousAnswer?: { transcription: string; audioUrl?: string };
}

export default function VoiceQuestion({ question, onSubmit, previousAnswer }: VoiceQuestionProps) {
  const [hasSubmitted, setHasSubmitted] = useState(!!previousAnswer);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [transcription, setTranscription] = useState<string>(previousAnswer?.transcription || "");

  useEffect(() => {
    setHasSubmitted(!!previousAnswer);
    setTranscription(previousAnswer?.transcription || "");
  }, [question.id, previousAnswer]);

  const handlePlayQuestion = async () => {
    setIsPlayingQuestion(true);
    try {
      await speakText(question.question);
    } catch (error) {
      console.error("Error playing question:", error);
    } finally {
      setIsPlayingQuestion(false);
    }
  };

  const handleRecordingComplete = (result: { transcription: string; audioUrl?: string }) => {
    setHasSubmitted(true);
    setTranscription(result.transcription);
    onSubmit(result);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Mic className="h-3 w-3 mr-1" />
              Voice Response
            </Badge>
          </div>
          
          <p className="text-foreground leading-relaxed text-lg mb-4">
            {question.question}
          </p>
          
          {/* Audio Controls */}
          <div className="flex items-center space-x-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayQuestion}
              disabled={isPlayingQuestion}
              className="flex items-center space-x-2"
            >
              <Volume2 className="h-4 w-4" />
              <span>{isPlayingQuestion ? "Playing..." : "Listen to Question"}</span>
            </Button>
            <span className="text-sm text-muted-foreground">AI will read the question aloud</span>
          </div>

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

      {/* Voice Recording Interface */}
      <div className="ml-11">
        {!hasSubmitted ? (
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            maxDuration={300} // 5 minutes max
          />
        ) : (
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-foreground mb-2">Voice Response Recorded</p>
                <p className="text-sm text-muted-foreground">
                  Your response has been transcribed and is being evaluated by AI
                </p>
              </div>
              
              {transcription && (
                <div className="mt-4 p-4 bg-background rounded-lg border">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Transcription:
                  </h4>
                  <p className="text-sm text-muted-foreground italic">
                    "{transcription}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Voice Guidelines */}
        {!hasSubmitted && (
          <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 mt-4">
            <CardContent className="pt-4">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Voice Interview Tips:</strong> Speak clearly and at a moderate pace. 
                Explain your thought process, provide examples, and take time to think before responding. 
                You can pause during recording if needed.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
