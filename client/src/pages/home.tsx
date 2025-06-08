import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Bell, 
  Plus, 
  History, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Star,
  Code,
  BarChart3,
  Users,
  Paintbrush,
  Mic
} from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
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
  }, [user, isLoading, toast]);

  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/assessments"],
    enabled: !!user,
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const { data: userSessions = [] } = useQuery({
    queryKey: ["/api/user/sessions"],
    enabled: !!user,
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-intermediate';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical': return <Code className="h-5 w-5" />;
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'behavioral': return <Users className="h-5 w-5" />;
      case 'design': return <Paintbrush className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

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
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                My Tests
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Results
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl} alt={user.firstName || 'User'} />
                  <AvatarFallback>
                    {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {user.firstName || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Overview */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {user.firstName || 'there'}!
              </h2>
              <p className="text-muted-foreground">Ready to showcase your skills? Choose an assessment to get started.</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                    <p className="text-2xl font-bold text-foreground">
                      {userStats?.testsCompleted || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold text-accent">
                      {userStats?.averageScore ? `${userStats.averageScore.toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time Invested</p>
                    <p className="text-2xl font-bold text-warning">
                      {userStats?.totalTime ? `${Math.round(userStats.totalTime / 60)}h` : '0h'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Skill Level</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {userStats?.skillLevel || 'Beginner'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Available Assessments */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-foreground">Available Assessments</h3>
            <div className="flex space-x-2">
              <Button variant="default" size="sm">All</Button>
              <Button variant="outline" size="sm">Technical</Button>
              <Button variant="outline" size="sm">Behavioral</Button>
              <Button variant="outline" size="sm">Skills</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assessments.map((assessment: any) => (
              <Card key={assessment.id} className="assessment-card border-border hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(assessment.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.category} Assessment</CardDescription>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(assessment.difficulty)}>
                      {assessment.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {assessment.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {assessment.duration} min
                      </span>
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {assessment.totalQuestions} questions
                      </span>
                      {assessment.hasVoice && (
                        <span className="flex items-center">
                          <Mic className="h-4 w-4 mr-1" />
                          Voice included
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        Popular assessment
                      </span>
                    </div>
                    <Link href={`/assessment/${assessment.id}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Start Assessment
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {userSessions.slice(0, 3).map((session: any) => (
                  <div key={session.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      session.status === 'completed' ? 'bg-accent text-white' : 
                      session.status === 'in_progress' ? 'bg-warning text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {session.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : session.status === 'in_progress' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {session.status === 'completed' ? 'Completed' : 
                         session.status === 'in_progress' ? 'In Progress' : 'Started'}{' '}
                        {session.assessment?.title || 'Assessment'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.totalScore ? `Score: ${session.totalScore.toFixed(1)}%` : 'No score yet'} • {' '}
                        {new Date(session.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {session.status === 'completed' ? (
                      <Link href={`/results/${session.id}`}>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </Link>
                    ) : session.status === 'in_progress' ? (
                      <Link href={`/assessment/${session.assessmentId}?sessionId=${session.id}`}>
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                ))}
                
                {userSessions.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No assessments taken yet. Start your first assessment!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  );
}
