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
  Mic,
  Sparkles,
  Zap,
  Trophy,
  Target
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
      <header className="glass-effect shadow-lg border-b border-border/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Interviewer
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Intelligent Assessment Platform</p>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-foreground font-semibold px-3 py-2 rounded-lg bg-purple-50 text-purple-700">
                Dashboard
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                My Tests
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Results
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-purple-50">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                <Avatar className="h-10 w-10 ring-2 ring-purple-200">
                  <AvatarImage src={user.profileImageUrl} alt={user.firstName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                    {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.firstName || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.role || 'Member'}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
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
        <section className="mb-12">
          <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 overflow-hidden">
            <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg floating">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Welcome back, {(user as any).firstName || 'there'}!
                    </h2>
                    <p className="text-lg text-gray-600 mt-1">Ready to showcase your skills? Choose an assessment to get started.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button className="gradient-primary hover:shadow-lg hover:scale-105 transition-all duration-200 text-white font-semibold px-6 py-3 rounded-xl">
                  <Zap className="h-5 w-5 mr-2" />
                  New Assessment
                </Button>
                <Button variant="outline" className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold">
                  <History className="h-5 w-5 mr-2" />
                  View History
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 mb-2">Tests Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(userStats as any)?.testsCompleted || 0}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">+2 this week</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-2">Average Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(userStats as any)?.averageScore ? `${(userStats as any).averageScore.toFixed(1)}%` : '0%'}
                    </p>
                    <p className="text-xs text-green-500 mt-1">Above average</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-600 mb-2">Time Invested</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(userStats as any)?.totalTime ? `${Math.round((userStats as any).totalTime / 60)}h` : '0h'}
                    </p>
                    <p className="text-xs text-amber-500 mt-1">Learning time</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-600 mb-2">Skill Level</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(userStats as any)?.skillLevel || 'Beginner'}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">Keep improving</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Available Assessments */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Available Assessments
              </h3>
              <p className="text-gray-600">Choose from our curated selection of professional assessments</p>
            </div>
            <div className="flex space-x-2 mt-4 lg:mt-0">
              <Button className="gradient-primary text-white font-semibold px-4 py-2 rounded-xl">All</Button>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl">Technical</Button>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl">Behavioral</Button>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl">Skills</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(assessments as any[]).map((assessment: any) => (
              <Card key={assessment.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full"></div>
                <CardHeader className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(assessment.category)}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-1">{assessment.title}</CardTitle>
                        <CardDescription className="text-purple-600 font-semibold">{assessment.category} Assessment</CardDescription>
                      </div>
                    </div>
                    <Badge className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      assessment.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      assessment.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {assessment.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {assessment.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <Clock className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                      <div className="text-sm font-bold text-gray-900">{assessment.duration} min</div>
                      <div className="text-xs text-gray-600">Duration</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <Target className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                      <div className="text-sm font-bold text-gray-900">{assessment.totalQuestions}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <Mic className="h-5 w-5 text-green-500 mx-auto mb-2" />
                      <div className="text-sm font-bold text-gray-900">{assessment.hasVoice ? 'Yes' : 'No'}</div>
                      <div className="text-xs text-gray-600">Voice</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Popular choice</span>
                    </div>
                    <Link href={`/assessment/${assessment.id}`}>
                      <Button className="gradient-primary hover:shadow-lg hover:scale-105 transition-all duration-200 text-white font-bold px-8 py-3 rounded-xl">
                        <Zap className="h-4 w-4 mr-2" />
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
        <section className="mb-12">
          <div className="mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Recent Activity
            </h3>
            <p className="text-gray-600">Keep track of your assessment progress and performance</p>
          </div>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-8">
              <div className="space-y-6">
                {(userSessions as any[]).slice(0, 3).map((session: any) => (
                  <div key={session.id} className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      session.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                      session.status === 'in_progress' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                      'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {session.status === 'completed' ? (
                        <CheckCircle className="h-7 w-7 text-white" />
                      ) : session.status === 'in_progress' ? (
                        <Clock className="h-7 w-7 text-white" />
                      ) : (
                        <Bot className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="text-lg font-bold text-gray-900">
                          {session.status === 'completed' ? 'Completed' : 
                           session.status === 'in_progress' ? 'In Progress' : 'Started'}{' '}
                          {session.assessment?.title || 'Assessment'}
                        </p>
                        {session.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <Trophy className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {session.totalScore && (
                          <span className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-amber-400" />
                            <span className="font-semibold">Score: {session.totalScore.toFixed(1)}%</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      {session.status === 'completed' ? (
                        <Link href={`/results/${session.id}`}>
                          <Button className="gradient-secondary text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                            <Target className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        </Link>
                      ) : session.status === 'in_progress' ? (
                        <Link href={`/assessment/${session.assessmentId}?sessionId=${session.id}`}>
                          <Button className="gradient-primary text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                            <Zap className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
                
                {(userSessions as any[]).length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 floating">
                      <Bot className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No assessments yet</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start your journey with our AI-powered assessments and unlock your potential
                    </p>
                    <Button className="gradient-primary text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Take Your First Assessment
                    </Button>
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
