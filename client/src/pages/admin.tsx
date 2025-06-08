import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Settings, 
  Bot,
  TrendingUp,
  Clock,
  CheckCircle,
  Edit,
  Trash2
} from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();
  const [newAssessmentOpen, setNewAssessmentOpen] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!userLoading && (!user || user.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [user, userLoading, toast]);

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && user.role === 'admin',
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/assessments"],
    enabled: !!user && user.role === 'admin',
  });

  // Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/assessments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      setNewAssessmentOpen(false);
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
        description: "Failed to create assessment",
        variant: "destructive",
      });
    },
  });

  // Generate questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async ({ assessmentId, mcqCount, subjectiveCount, voiceCount }: any) => {
      const response = await apiRequest("POST", `/api/assessments/${assessmentId}/generate-questions`, {
        mcqCount,
        subjectiveCount,
        voiceCount
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Questions generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate questions",
        variant: "destructive",
      });
    },
  });

  const handleCreateAssessment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      difficulty: formData.get('difficulty') as string,
      duration: parseInt(formData.get('duration') as string),
      totalQuestions: 0, // Will be updated when questions are generated
      hasVoice: formData.get('hasVoice') === 'on',
      isActive: true,
    };

    createAssessmentMutation.mutate(data);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Assessment Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => window.location.href = '/api/logout'}
                variant="ghost"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold text-foreground">
                    {assessments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Tests</p>
                  <p className="text-2xl font-bold text-foreground">
                    {adminStats?.activeTests || 0}
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
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold text-foreground">
                    {adminStats?.completedToday || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">
                    {adminStats?.totalUsers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assessments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Assessment Management</h2>
              <Dialog open={newAssessmentOpen} onOpenChange={setNewAssessmentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Create New Assessment</DialogTitle>
                    <DialogDescription>
                      Create a new assessment that will be available to candidates.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateAssessment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Assessment Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Frontend Developer" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Behavioral">Behavioral</SelectItem>
                            <SelectItem value="Analytics">Analytics</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Describe what this assessment covers..."
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select name="difficulty" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input 
                          id="duration" 
                          name="duration" 
                          type="number" 
                          placeholder="45" 
                          min="1" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="hasVoice" name="hasVoice" />
                      <Label htmlFor="hasVoice">Include voice interview questions</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setNewAssessmentOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createAssessmentMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {createAssessmentMutation.isPending ? 'Creating...' : 'Create Assessment'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {assessments.map((assessment: any) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{assessment.title}</span>
                          {assessment.hasVoice && (
                            <Badge variant="outline" className="text-xs">
                              Voice Enabled
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{assessment.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={
                            assessment.difficulty === 'beginner' ? 'difficulty-beginner' :
                            assessment.difficulty === 'intermediate' ? 'difficulty-intermediate' :
                            'difficulty-advanced'
                          }
                        >
                          {assessment.difficulty}
                        </Badge>
                        <Badge variant="outline">{assessment.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {assessment.duration} min
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {assessment.totalQuestions} questions
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Active: {assessment.isActive ? 'Yes' : 'No'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {assessment.totalQuestions === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => generateQuestionsMutation.mutate({
                              assessmentId: assessment.id,
                              mcqCount: 15,
                              subjectiveCount: 5,
                              voiceCount: assessment.hasVoice ? 3 : 0
                            })}
                            disabled={generateQuestionsMutation.isPending}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground"
                          >
                            <Bot className="h-4 w-4 mr-2" />
                            {generateQuestionsMutation.isPending ? 'Generating...' : 'Generate Questions'}
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Questions
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {assessments.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Assessments Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first assessment to get started with the platform.
                    </p>
                    <Button onClick={() => setNewAssessmentOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Assessment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Detailed insights into assessment performance and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global settings for the assessment platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
