import {
  users,
  assessments,
  questions,
  assessmentSessions,
  responses,
  type User,
  type UpsertUser,
  type Assessment,
  type InsertAssessment,
  type Question,
  type InsertQuestion,
  type AssessmentSession,
  type InsertAssessmentSession,
  type Response,
  type InsertResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, avg, sum, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Assessment operations
  getActiveAssessments(): Promise<Assessment[]>;
  getAssessmentById(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, data: Partial<InsertAssessment>): Promise<Assessment>;
  
  // Question operations
  getQuestionsByAssessmentId(assessmentId: number): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Session operations
  createSession(session: InsertAssessmentSession): Promise<AssessmentSession>;
  getSessionById(id: number): Promise<AssessmentSession | undefined>;
  getActiveSessionByUserAndAssessment(userId: string, assessmentId: number): Promise<AssessmentSession | undefined>;
  updateSession(id: number, data: Partial<InsertAssessmentSession>): Promise<AssessmentSession>;
  getUserSessions(userId: string): Promise<AssessmentSession[]>;
  
  // Response operations
  createResponse(response: InsertResponse): Promise<Response>;
  getResponsesBySessionId(sessionId: number): Promise<Response[]>;
  
  // Stats operations
  getUserStats(userId: string): Promise<any>;
  getAdminStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Assessment operations
  async getActiveAssessments(): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.isActive, true))
      .orderBy(desc(assessments.createdAt));
  }

  async getAssessmentById(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id));
    return assessment;
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db
      .insert(assessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async updateAssessment(id: number, data: Partial<InsertAssessment>): Promise<Assessment> {
    const [updatedAssessment] = await db
      .update(assessments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return updatedAssessment;
  }

  // Question operations
  async getQuestionsByAssessmentId(assessmentId: number): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.assessmentId, assessmentId))
      .orderBy(questions.order);
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id));
    return question;
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  // Session operations
  async createSession(session: InsertAssessmentSession): Promise<AssessmentSession> {
    const [newSession] = await db
      .insert(assessmentSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getSessionById(id: number): Promise<AssessmentSession | undefined> {
    const [session] = await db
      .select()
      .from(assessmentSessions)
      .where(eq(assessmentSessions.id, id));
    return session;
  }

  async getActiveSessionByUserAndAssessment(
    userId: string, 
    assessmentId: number
  ): Promise<AssessmentSession | undefined> {
    const [session] = await db
      .select()
      .from(assessmentSessions)
      .where(
        and(
          eq(assessmentSessions.userId, userId),
          eq(assessmentSessions.assessmentId, assessmentId),
          eq(assessmentSessions.status, "in_progress")
        )
      );
    return session;
  }

  async updateSession(id: number, data: Partial<InsertAssessmentSession>): Promise<AssessmentSession> {
    const [updatedSession] = await db
      .update(assessmentSessions)
      .set(data)
      .where(eq(assessmentSessions.id, id))
      .returning();
    return updatedSession;
  }

  async getUserSessions(userId: string): Promise<AssessmentSession[]> {
    return await db
      .select({
        id: assessmentSessions.id,
        userId: assessmentSessions.userId,
        assessmentId: assessmentSessions.assessmentId,
        status: assessmentSessions.status,
        startedAt: assessmentSessions.startedAt,
        completedAt: assessmentSessions.completedAt,
        currentQuestionIndex: assessmentSessions.currentQuestionIndex,
        timeRemaining: assessmentSessions.timeRemaining,
        totalScore: assessmentSessions.totalScore,
        mcqScore: assessmentSessions.mcqScore,
        subjectiveScore: assessmentSessions.subjectiveScore,
        voiceScore: assessmentSessions.voiceScore,
        feedback: assessmentSessions.feedback,
        assessment: {
          id: assessments.id,
          title: assessments.title,
          category: assessments.category,
          difficulty: assessments.difficulty,
        }
      })
      .from(assessmentSessions)
      .leftJoin(assessments, eq(assessmentSessions.assessmentId, assessments.id))
      .where(eq(assessmentSessions.userId, userId))
      .orderBy(desc(assessmentSessions.startedAt));
  }

  // Response operations
  async createResponse(response: InsertResponse): Promise<Response> {
    const [newResponse] = await db
      .insert(responses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getResponsesBySessionId(sessionId: number): Promise<Response[]> {
    return await db
      .select()
      .from(responses)
      .where(eq(responses.sessionId, sessionId))
      .orderBy(responses.answeredAt);
  }

  // Stats operations
  async getUserStats(userId: string): Promise<any> {
    // Get completed sessions
    const completedSessions = await db
      .select({
        totalScore: assessmentSessions.totalScore,
        duration: assessmentSessions.timeRemaining,
      })
      .from(assessmentSessions)
      .where(
        and(
          eq(assessmentSessions.userId, userId),
          eq(assessmentSessions.status, "completed")
        )
      );

    const testsCompleted = completedSessions.length;
    
    let averageScore = 0;
    let totalTime = 0;
    
    if (testsCompleted > 0) {
      const validScores = completedSessions
        .filter(s => s.totalScore !== null)
        .map(s => s.totalScore!);
      
      if (validScores.length > 0) {
        averageScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
      }
      
      // Calculate total time spent (initial time - remaining time)
      totalTime = completedSessions.reduce((sum, session) => {
        // Estimate based on typical assessment duration
        const estimatedDuration = 45 * 60; // 45 minutes in seconds
        const timeSpent = session.timeRemaining ? estimatedDuration - session.timeRemaining : estimatedDuration;
        return sum + Math.max(0, timeSpent);
      }, 0);
    }

    // Determine skill level based on average score
    let skillLevel = "Beginner";
    if (averageScore >= 90) skillLevel = "Expert";
    else if (averageScore >= 80) skillLevel = "Advanced";
    else if (averageScore >= 70) skillLevel = "Intermediate";

    return {
      testsCompleted,
      averageScore,
      totalTime, // in seconds
      skillLevel,
    };
  }

  async getAdminStats(): Promise<any> {
    // Get active tests count
    const [activeTestsResult] = await db
      .select({ count: count() })
      .from(assessmentSessions)
      .where(eq(assessmentSessions.status, "in_progress"));

    // Get completed today count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [completedTodayResult] = await db
      .select({ count: count() })
      .from(assessmentSessions)
      .where(
        and(
          eq(assessmentSessions.status, "completed"),
          eq(assessmentSessions.completedAt >= today && assessmentSessions.completedAt < tomorrow, true)
        )
      );

    // Get total users count
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users);

    return {
      activeTests: activeTestsResult?.count || 0,
      completedToday: completedTodayResult?.count || 0,
      totalUsers: totalUsersResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
