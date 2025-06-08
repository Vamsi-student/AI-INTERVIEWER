import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateMCQQuestions, 
  generateSubjectiveQuestions, 
  generateVoiceQuestions,
  evaluateSubjectiveAnswer,
  evaluateVoiceResponse,
  transcribeAudio,
  generateFinalFeedback
} from "./openai";
import multer from "multer";
import path from "path";
import { 
  insertAssessmentSchema, 
  insertQuestionSchema, 
  insertSessionSchema,
  insertResponseSchema 
} from "@shared/schema";

const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Assessment routes
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getActiveAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessmentById(parseInt(req.params.id));
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const data = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(data);
      res.json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  // Question routes
  app.get("/api/assessments/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByAssessmentId(parseInt(req.params.id));
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/assessments/:id/generate-questions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessmentById(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const { mcqCount = 20, subjectiveCount = 5, voiceCount = 3 } = req.body;

      // Generate MCQ questions
      const mcqQuestions = await generateMCQQuestions(
        assessment.title, 
        assessment.difficulty, 
        mcqCount
      );

      // Generate subjective questions
      const subjectiveQuestions = await generateSubjectiveQuestions(
        assessment.title,
        assessment.difficulty,
        subjectiveCount
      );

      // Generate voice questions if assessment has voice
      const voiceQuestions = assessment.hasVoice 
        ? await generateVoiceQuestions(assessment.title, assessment.difficulty, voiceCount)
        : [];

      // Save questions to database
      let order = 1;
      const allQuestions = [];

      // Save MCQ questions
      for (const mcq of mcqQuestions) {
        const questionData = {
          assessmentId,
          type: "mcq" as const,
          question: mcq.question,
          options: mcq.options,
          correctAnswer: mcq.correctAnswer,
          points: 1,
          order: order++
        };
        const question = await storage.createQuestion(questionData);
        allQuestions.push(question);
      }

      // Save subjective questions
      for (const subjective of subjectiveQuestions) {
        const questionData = {
          assessmentId,
          type: "subjective" as const,
          question: subjective,
          points: 5,
          order: order++
        };
        const question = await storage.createQuestion(questionData);
        allQuestions.push(question);
      }

      // Save voice questions
      for (const voice of voiceQuestions) {
        const questionData = {
          assessmentId,
          type: "voice" as const,
          question: voice,
          points: 5,
          order: order++
        };
        const question = await storage.createQuestion(questionData);
        allQuestions.push(question);
      }

      // Update total questions count
      await storage.updateAssessment(assessmentId, { 
        totalQuestions: allQuestions.length 
      });

      res.json({ 
        message: "Questions generated successfully", 
        questions: allQuestions.length 
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Session routes
  app.post("/api/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { assessmentId } = req.body;

      // Check if user already has an active session for this assessment
      const existingSession = await storage.getActiveSessionByUserAndAssessment(
        userId, 
        assessmentId
      );

      if (existingSession) {
        return res.json(existingSession);
      }

      // Get assessment to set initial time
      const assessment = await storage.getAssessmentById(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const sessionData = {
        userId,
        assessmentId,
        timeRemaining: assessment.duration * 60, // convert to seconds
        currentQuestionIndex: 0
      };

      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.get("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = parseInt(req.params.id);
      
      const session = await storage.getSessionById(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  app.patch("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = parseInt(req.params.id);
      
      const session = await storage.getSessionById(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ message: "Session not found" });
      }

      const updatedSession = await storage.updateSession(sessionId, req.body);
      res.json(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Response routes
  app.post("/api/responses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertResponseSchema.parse(req.body);

      // Verify session belongs to user
      const session = await storage.getSessionById(data.sessionId);
      if (!session || session.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get question for evaluation
      const question = await storage.getQuestionById(data.questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      let score = 0;
      let aiEvaluation = "";

      // Evaluate based on question type
      if (question.type === "mcq") {
        score = data.answer === question.correctAnswer ? question.points : 0;
        aiEvaluation = score > 0 ? "Correct answer" : "Incorrect answer";
      } else if (question.type === "subjective" && data.answer) {
        const evaluation = await evaluateSubjectiveAnswer(
          question.question, 
          data.answer, 
          question.rubric
        );
        score = (evaluation.score / 100) * question.points;
        aiEvaluation = JSON.stringify(evaluation);
      } else if (question.type === "voice" && data.transcription) {
        const evaluation = await evaluateVoiceResponse(
          question.question,
          data.transcription,
          question.rubric
        );
        score = (evaluation.score / 100) * question.points;
        aiEvaluation = JSON.stringify(evaluation);
      }

      const responseData = {
        ...data,
        score,
        aiEvaluation
      };

      const response = await storage.createResponse(responseData);
      res.json(response);
    } catch (error) {
      console.error("Error creating response:", error);
      res.status(500).json({ message: "Failed to create response" });
    }
  });

  // Audio upload and transcription
  app.post("/api/transcribe", isAuthenticated, upload.single('audio'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      const transcription = await transcribeAudio(req.file.path);
      
      // Clean up uploaded file
      const fs = await import("fs");
      fs.unlinkSync(req.file.path);

      res.json({ transcription });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ message: "Failed to transcribe audio" });
    }
  });

  // Complete session and generate final results
  app.post("/api/sessions/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = parseInt(req.params.id);
      
      const session = await storage.getSessionById(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Calculate scores
      const responses = await storage.getResponsesBySessionId(sessionId);
      const assessment = await storage.getAssessmentById(session.assessmentId);
      
      let mcqScore = 0, mcqTotal = 0;
      let subjectiveScore = 0, subjectiveTotal = 0;
      let voiceScore = 0, voiceTotal = 0;

      for (const response of responses) {
        const question = await storage.getQuestionById(response.questionId);
        if (!question) continue;

        if (question.type === "mcq") {
          mcqScore += response.score || 0;
          mcqTotal += question.points;
        } else if (question.type === "subjective") {
          subjectiveScore += response.score || 0;
          subjectiveTotal += question.points;
        } else if (question.type === "voice") {
          voiceScore += response.score || 0;
          voiceTotal += question.points;
        }
      }

      const mcqPercentage = mcqTotal > 0 ? (mcqScore / mcqTotal) * 100 : 0;
      const subjectivePercentage = subjectiveTotal > 0 ? (subjectiveScore / subjectiveTotal) * 100 : 0;
      const voicePercentage = voiceTotal > 0 ? (voiceScore / voiceTotal) * 100 : 0;

      // Calculate weighted overall score
      let totalWeight = 0;
      let weightedScore = 0;

      if (mcqTotal > 0) { totalWeight += 40; weightedScore += mcqPercentage * 0.4; }
      if (subjectiveTotal > 0) { totalWeight += 35; weightedScore += subjectivePercentage * 0.35; }
      if (voiceTotal > 0) { totalWeight += 25; weightedScore += voicePercentage * 0.25; }

      const overallScore = totalWeight > 0 ? weightedScore : 0;

      // Generate AI feedback
      const feedback = await generateFinalFeedback(
        mcqPercentage,
        subjectivePercentage,
        voicePercentage,
        assessment?.title || "Assessment"
      );

      // Update session with final scores
      const completedSession = await storage.updateSession(sessionId, {
        status: "completed",
        completedAt: new Date(),
        totalScore: overallScore,
        mcqScore: mcqPercentage,
        subjectiveScore: subjectivePercentage,
        voiceScore: voicePercentage,
        feedback
      });

      res.json(completedSession);
    } catch (error) {
      console.error("Error completing session:", error);
      res.status(500).json({ message: "Failed to complete session" });
    }
  });

  // User stats and history
  app.get("/api/user/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get("/api/user/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ message: "Failed to fetch user sessions" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
