import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, CheckCircle, Clock, Mic, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Interviewer</h1>
                <p className="text-xs text-muted-foreground">Intelligent Assessment Platform</p>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Brain className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Next-Generation
            <span className="text-primary block">AI Interview Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience intelligent assessments with MCQ, subjective, and voice-based interviews. 
            Get real-time AI feedback and comprehensive skill evaluation.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
          >
            Start Your Assessment
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Assessment Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered platform evaluates candidates across multiple dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="assessment-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>MCQ Assessment</CardTitle>
                <CardDescription>
                  Multiple choice questions with instant scoring and detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Timed questions</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>AI-generated content</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="assessment-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Subjective Evaluation</CardTitle>
                <CardDescription>
                  Open-ended questions with AI-powered natural language evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Deep understanding</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Detailed feedback</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="assessment-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Voice Interview</CardTitle>
                <CardDescription>
                  Speech-to-text conversion with communication skills assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mic className="h-4 w-4 mr-2" />
                    <span>Real-time transcription</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>Communication analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Available Assessments
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose from our comprehensive range of technical and behavioral assessments
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="assessment-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Frontend Developer</CardTitle>
                      <CardDescription>Technical Assessment</CardDescription>
                    </div>
                  </div>
                  <Badge className="difficulty-intermediate">Intermediate</Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Comprehensive evaluation covering React.js, JavaScript ES6+, CSS, and modern frontend development practices.
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      45 min
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      30 questions
                    </span>
                    <span className="flex items-center">
                      <Mic className="h-4 w-4 mr-1" />
                      Voice included
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="assessment-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Brain className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle>Data Scientist</CardTitle>
                      <CardDescription>Analytics Assessment</CardDescription>
                    </div>
                  </div>
                  <Badge className="difficulty-advanced">Advanced</Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  In-depth evaluation of Python, machine learning algorithms, statistical analysis, and data visualization skills.
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      60 min
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      25 questions
                    </span>
                    <span className="flex items-center">
                      <Mic className="h-4 w-4 mr-1" />
                      Voice included
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Showcase Your Skills?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of candidates who have experienced our AI-powered assessment platform
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
