import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("candidate").notNull(), // candidate, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // beginner, intermediate, advanced
  duration: integer("duration").notNull(), // in minutes
  totalQuestions: integer("total_questions").notNull(),
  hasVoice: boolean("has_voice").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").references(() => assessments.id).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // mcq, subjective, voice
  question: text("question").notNull(),
  options: jsonb("options"), // for MCQ questions
  correctAnswer: text("correct_answer"), // for MCQ questions
  rubric: text("rubric"), // evaluation criteria for subjective/voice
  points: integer("points").default(1),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentSessions = pgTable("assessment_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  assessmentId: integer("assessment_id").references(() => assessments.id).notNull(),
  status: varchar("status", { length: 20 }).default("in_progress"), // in_progress, completed, paused
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  currentQuestionIndex: integer("current_question_index").default(0),
  timeRemaining: integer("time_remaining"), // in seconds
  totalScore: real("total_score"),
  mcqScore: real("mcq_score"),
  subjectiveScore: real("subjective_score"),
  voiceScore: real("voice_score"),
  feedback: text("feedback"),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => assessmentSessions.id).notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  answer: text("answer"), // text answer or selected option
  audioUrl: varchar("audio_url"), // for voice responses
  transcription: text("transcription"), // speech-to-text result
  score: real("score"),
  aiEvaluation: text("ai_evaluation"),
  answeredAt: timestamp("answered_at").defaultNow(),
});

// Relations
export const assessmentsRelations = relations(assessments, ({ many }) => ({
  questions: many(questions),
  sessions: many(assessmentSessions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [questions.assessmentId],
    references: [assessments.id],
  }),
  responses: many(responses),
}));

export const assessmentSessionsRelations = relations(assessmentSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [assessmentSessions.userId],
    references: [users.id],
  }),
  assessment: one(assessments, {
    fields: [assessmentSessions.assessmentId],
    references: [assessments.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  session: one(assessmentSessions, {
    fields: [responses.sessionId],
    references: [assessmentSessions.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;
export type AssessmentSession = typeof assessmentSessions.$inferSelect;
export type InsertAssessmentSession = typeof assessmentSessions.$inferInsert;
export type Response = typeof responses.$inferSelect;
export type InsertResponse = typeof responses.$inferInsert;

// Zod schemas
export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(assessmentSessions).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  answeredAt: true,
});
