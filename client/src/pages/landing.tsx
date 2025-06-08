import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, CheckCircle, Clock, Mic, Users, Sparkles, Zap, Star } from "lucide-react";

export default function Landing() {
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
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="gradient-primary hover:shadow-lg hover:scale-105 transition-all duration-200 text-white font-semibold px-6 py-2.5 rounded-xl"
            >
              <Zap className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 opacity-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-2xl floating">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Star className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 bg-clip-text text-transparent">
                Next-Generation
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Interview Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience intelligent assessments with <span className="font-semibold text-purple-600">MCQ</span>, 
              <span className="font-semibold text-blue-600"> subjective</span>, and 
              <span className="font-semibold text-indigo-600"> voice-based</span> interviews. 
              Get real-time AI feedback and comprehensive skill evaluation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="gradient-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white font-bold px-10 py-4 text-lg rounded-2xl group"
            >
              <Sparkles className="h-5 w-5 mr-3 group-hover:animate-spin" />
              Start Your Assessment
              <Zap className="h-5 w-5 ml-3" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg rounded-2xl font-semibold"
            >
              <Brain className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Real-time Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Comprehensive Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/20 to-blue-50/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Advanced AI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Comprehensive Assessment
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform evaluates candidates across multiple dimensions with 
              real-time analysis and personalized feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="assessment-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 group">
              <CardHeader className="pb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">MCQ Assessment</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Multiple choice questions with instant scoring and detailed explanations powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Clock className="h-4 w-4 mr-3 text-blue-500" />
                    <span>Smart timed questions</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Brain className="h-4 w-4 mr-3 text-indigo-500" />
                    <span>AI-generated content</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Zap className="h-4 w-4 mr-3 text-blue-500" />
                    <span>Instant feedback</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="assessment-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 group">
              <CardHeader className="pb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Subjective Evaluation</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Open-ended questions with AI-powered natural language understanding and evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Users className="h-4 w-4 mr-3 text-green-500" />
                    <span>Deep understanding</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 mr-3 text-emerald-500" />
                    <span>Detailed feedback</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Star className="h-4 w-4 mr-3 text-green-500" />
                    <span>Quality scoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="assessment-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 group">
              <CardHeader className="pb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Voice Interview</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Speech-to-text conversion with advanced communication skills assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Mic className="h-4 w-4 mr-3 text-purple-500" />
                    <span>Real-time transcription</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Brain className="h-4 w-4 mr-3 text-violet-500" />
                    <span>Communication analysis</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                    <Users className="h-4 w-4 mr-3 text-purple-500" />
                    <span>Confidence scoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Types */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bot className="h-4 w-4 mr-2" />
              Ready-to-Use Assessments
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Available
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Assessments
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive range of technical and behavioral assessments designed by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="assessment-card border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Bot className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Frontend Developer</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">Technical Assessment</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold border-0">
                    Intermediate
                  </Badge>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Comprehensive evaluation covering React.js, JavaScript ES6+, CSS, and modern frontend development practices with real-world scenarios.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">45 min</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">30 questions</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Mic className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Voice</div>
                    <div className="text-xs text-gray-600">Included</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="assessment-card border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-green-50 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/20 to-transparent rounded-bl-full"></div>
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Brain className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Data Scientist</CardTitle>
                      <CardDescription className="text-green-600 font-medium">Analytics Assessment</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold border-0">
                    Advanced
                  </Badge>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  In-depth evaluation of Python, machine learning algorithms, statistical analysis, and data visualization skills with practical case studies.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Clock className="h-5 w-5 text-green-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">60 min</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">25 questions</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Mic className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Voice</div>
                    <div className="text-xs text-gray-600">Included</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 floating">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Showcase
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Your Skills?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of candidates who have experienced our AI-powered assessment platform 
            and unlocked their career potential
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-12 py-4 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
              Get Started Now
              <Star className="h-6 w-6 ml-3" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-4 text-xl rounded-2xl font-semibold"
            >
              <Users className="h-6 w-6 mr-3" />
              View Demo
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Assessments Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-white/80">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-white/80">Companies Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AI Interviewer</h3>
                  <p className="text-gray-400">Intelligent Assessment Platform</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Revolutionizing the way assessments are conducted with AI-powered evaluation, 
                real-time feedback, and comprehensive skill analysis.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">tw</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Assessments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 AI Interviewer. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Powered by</span>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-400">Advanced AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
