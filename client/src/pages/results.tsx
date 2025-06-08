import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Download, 
  Share, 
  RotateCcw, 
  Bot,
  TrendingUp,
  Edit,
  Mic,
  Lightbulb,
  Home
} from "lucide-react";

export default function Results() {
  const [, params] = useRoute("/results/:sessionId");
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();

  const sessionId = parseInt(params?.sessionId || "0");

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

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!user && sessionId > 0,
  });

  const { data: assessment } = useQuery({
    queryKey: ["/api/assessments", session?.assessmentId],
    enabled: !!session?.assessmentId,
  });

  if (userLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session.userId !== user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">Results Not Found</h1>
            <p className="text-muted-foreground">The requested results could not be found.</p>
            <Link href="/">
              <Button className="mt-4">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse AI evaluation feedback
  let parsedFeedback = null;
  try {
    if (session.feedback && session.feedback.startsWith('{')) {
      parsedFeedback = JSON.parse(session.feedback);
    }
  } catch (e) {
    // Use feedback as plain text
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "text-green-600" };
    if (score >= 80) return { level: "Very Good", color: "text-green-500" };
    if (score >= 70) return { level: "Good", color: "text-blue-500" };
    if (score >= 60) return { level: "Fair", color: "text-yellow-500" };
    return { level: "Needs Improvement", color: "text-red-500" };
  };

  const performance = getPerformanceLevel(session.totalScore || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Assessment Results</h1>
              <p className="text-sm text-muted-foreground">{assessment?.title}</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Header */}
        <Card className="shadow-lg border-border mb-8">
          <CardHeader className="border-b border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Assessment Completed!</CardTitle>
              <p className="text-muted-foreground">Great job! Here's your comprehensive evaluation.</p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Overall Score</h3>
                <div className="text-4xl font-bold text-accent mb-2">
                  {session.totalScore?.toFixed(1)}%
                </div>
                <p className={`font-medium ${performance.color}`}>
                  {performance.level}
                </p>
                <Progress 
                  value={session.totalScore || 0} 
                  className="w-full max-w-md mx-auto mt-4"
                />
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {session.mcqScore !== null && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">MCQ Section</h4>
                  <p className="text-2xl font-bold text-foreground">
                    {session.mcqScore?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Multiple Choice</p>
                </div>
              )}
              
              {session.subjectiveScore !== null && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Edit className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Subjective</h4>
                  <p className="text-2xl font-bold text-foreground">
                    {session.subjectiveScore?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Written Answers</p>
                </div>
              )}
              
              {session.voiceScore !== null && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mic className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Voice Interview</h4>
                  <p className="text-2xl font-bold text-foreground">
                    {session.voiceScore?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Communication</p>
                </div>
              )}
            </div>

            {/* AI Feedback */}
            {session.feedback && (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Bot className="h-5 w-5 text-primary mr-2" />
                    AI-Generated Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {parsedFeedback ? (
                    <div className="space-y-4">
                      {parsedFeedback.strengths && (
                        <div>
                          <h5 className="font-medium text-foreground mb-2 flex items-center">
                            <TrendingUp className="h-4 w-4 text-accent mr-2" />
                            Strengths
                          </h5>
                          <ul className="text-muted-foreground space-y-1">
                            {parsedFeedback.strengths.map((strength: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {parsedFeedback.improvements && (
                        <div>
                          <h5 className="font-medium text-foreground mb-2 flex items-center">
                            <Lightbulb className="h-4 w-4 text-warning mr-2" />
                            Areas for Improvement
                          </h5>
                          <ul className="text-muted-foreground space-y-1">
                            {parsedFeedback.improvements.map((improvement: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Lightbulb className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">
                      {session.feedback}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              {assessment && (
                <Link href={`/assessment/${assessment.id}`}>
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Assessment
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assessment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Assessment</p>
                <p className="font-medium">{assessment?.title}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{assessment?.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Difficulty</p>
                <Badge variant="outline">{assessment?.difficulty}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="font-medium">
                  {session.completedAt ? 
                    new Date(session.completedAt).toLocaleDateString() : 
                    'In Progress'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
