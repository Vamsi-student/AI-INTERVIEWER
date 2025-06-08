import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MCQQuestion from "@/components/assessment/MCQQuestion";
import SubjectiveQuestion from "@/components/assessment/SubjectiveQuestion";
import VoiceQuestion from "@/components/assessment/VoiceQuestion";
import Timer from "@/components/assessment/Timer";
import { Bot, Pause, Flag, ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function Assessment() {
  const [, params] = useRoute("/assessment/:id");
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [session, setSession] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: any }>({});

  const assessmentId = parseInt(params?.id || "0");

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, userLoading, toast]);

  const { data: assessment, isLoading: assessmentLoading } = useQuery({
    queryKey: ["/api/assessments", assessmentId],
    enabled: !!user && assessmentId > 0,
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["/api/assessments", assessmentId, "questions"],
    enabled: !!user && assessmentId > 0,
  });

  // Create or get session
  const createSessionMutation = useMutation({
    mutationFn: async (data: { assessmentId: number }) => {
      const response = await apiRequest("POST", "/api/sessions", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSession(data);
      setCurrentQuestionIndex(data.currentQuestionIndex || 0);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to start assessment session",
        variant: "destructive",
      });
    },
  });

  // Submit answer
  const submitAnswerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/responses", data);
      return response.json();
    },
    onSuccess: () => {
      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        updateSessionMutation.mutate({ currentQuestionIndex: nextIndex });
      } else {
        // Complete assessment
        completeAssessmentMutation.mutate();
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    },
  });

  // Update session
  const updateSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!session) return;
      const response = await apiRequest("PATCH", `/api/sessions/${session.id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      setSession(data);
    },
  });

  // Complete assessment
  const completeAssessmentMutation = useMutation({
    mutationFn: async () => {
      if (!session) return;
      const response = await apiRequest("POST", `/api/sessions/${session.id}/complete`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Assessment Complete!",
        description: "Your results are ready for review.",
      });
      window.location.href = `/results/${data.id}`;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete assessment",
        variant: "destructive",
      });
    },
  });

  // Initialize session when assessment loads
  useEffect(() => {
    if (assessment && user && !session) {
      createSessionMutation.mutate({ assessmentId: assessment.id });
    }
  }, [assessment, user, session]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSubmit = (answer: any) => {
    if (!session || !currentQuestion) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    const responseData = {
      sessionId: session.id,
      questionId: currentQuestion.id,
      ...answer
    };

    submitAnswerMutation.mutate(responseData);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      updateSessionMutation.mutate({ currentQuestionIndex: prevIndex });
    }
  };

  const handleTimeUp = () => {
    completeAssessmentMutation.mutate();
  };

  if (userLoading || assessmentLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">Assessment Not Found</h1>
            <p className="text-muted-foreground">The requested assessment could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-semibold text-foreground">{assessment.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {session && (
                <Timer
                  initialTime={session.timeRemaining}
                  onTimeUp={handleTimeUp}
                />
              )}
              <Button variant="ghost" size="icon">
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <Progress value={progress} className="w-full h-2" />
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">
                    {currentQuestion?.type?.toUpperCase() || 'Question'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion?.points || 1} point{(currentQuestion?.points || 1) > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {currentQuestion && (
              <div className="mb-6">
                {currentQuestion.type === 'mcq' && (
                  <MCQQuestion
                    question={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                    previousAnswer={answers[currentQuestion.id]}
                  />
                )}
                {currentQuestion.type === 'subjective' && (
                  <SubjectiveQuestion
                    question={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                    previousAnswer={answers[currentQuestion.id]}
                  />
                )}
                {currentQuestion.type === 'voice' && (
                  <VoiceQuestion
                    question={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                    previousAnswer={answers[currentQuestion.id]}
                  />
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Flag className="h-4 w-4 mr-2" />
                  Flag for Review
                </Button>
                
                {submitAnswerMutation.isPending ? (
                  <Button disabled>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </Button>
                ) : currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => completeAssessmentMutation.mutate()}
                  >
                    Complete Assessment
                  </Button>
                ) : (
                  <Button disabled>
                    <ChevronRight className="h-4 w-4 ml-2" />
                    Next (Auto after answer)
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
