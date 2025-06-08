import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.API_KEY 
});

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SubjectiveEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  relevance: number;
  clarity: number;
  depth: number;
}

export interface VoiceEvaluation {
  score: number;
  feedback: string;
  communication: number;
  confidence: number;
  clarity: number;
  content: number;
}

export async function generateMCQQuestions(
  topic: string, 
  difficulty: string, 
  count: number = 5
): Promise<MCQQuestion[]> {
  try {
    const prompt = `Generate ${count} multiple choice questions for a ${difficulty} level ${topic} assessment. 
    Each question should have 4 options (A, B, C, D) with one correct answer.
    Respond with JSON in this format: 
    {
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "A",
          "explanation": "Why this answer is correct"
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer creating assessment questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    throw new Error(`Failed to generate MCQ questions: ${error.message}`);
  }
}

export async function generateSubjectiveQuestions(
  topic: string,
  difficulty: string,
  count: number = 3
): Promise<string[]> {
  try {
    const prompt = `Generate ${count} subjective/open-ended questions for a ${difficulty} level ${topic} assessment.
    These should test deep understanding and practical application.
    Respond with JSON in this format: { "questions": ["Question 1", "Question 2", ...] }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer creating in-depth assessment questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    throw new Error(`Failed to generate subjective questions: ${error.message}`);
  }
}

export async function generateVoiceQuestions(
  topic: string,
  difficulty: string,
  count: number = 2
): Promise<string[]> {
  try {
    const prompt = `Generate ${count} voice interview questions for a ${difficulty} level ${topic} assessment.
    These should test communication skills, thought process, and ability to explain concepts verbally.
    Questions should encourage detailed explanations and examples.
    Respond with JSON in this format: { "questions": ["Question 1", "Question 2", ...] }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer creating voice-based assessment questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    throw new Error(`Failed to generate voice questions: ${error.message}`);
  }
}

export async function evaluateSubjectiveAnswer(
  question: string,
  answer: string,
  rubric?: string
): Promise<SubjectiveEvaluation> {
  try {
    const prompt = `Evaluate this subjective answer for a technical interview:
    
    Question: ${question}
    Answer: ${answer}
    ${rubric ? `Evaluation Rubric: ${rubric}` : ''}
    
    Provide a comprehensive evaluation with scores from 0-100 for overall score and 0-10 for individual criteria.
    Respond with JSON in this format:
    {
      "score": number,
      "feedback": "Detailed feedback explaining the score",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "relevance": number,
      "clarity": number,
      "depth": number
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer evaluating candidate responses. Be fair but thorough in your assessment."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: Math.max(0, Math.min(100, result.score || 0)),
      feedback: result.feedback || "No feedback provided",
      strengths: result.strengths || [],
      improvements: result.improvements || [],
      relevance: Math.max(0, Math.min(10, result.relevance || 0)),
      clarity: Math.max(0, Math.min(10, result.clarity || 0)),
      depth: Math.max(0, Math.min(10, result.depth || 0)),
    };
  } catch (error) {
    throw new Error(`Failed to evaluate subjective answer: ${error.message}`);
  }
}

export async function evaluateVoiceResponse(
  question: string,
  transcription: string,
  rubric?: string
): Promise<VoiceEvaluation> {
  try {
    const prompt = `Evaluate this voice interview response:
    
    Question: ${question}
    Transcription: ${transcription}
    ${rubric ? `Evaluation Rubric: ${rubric}` : ''}
    
    Evaluate based on content quality, communication skills, clarity of expression, and confidence.
    Respond with JSON in this format:
    {
      "score": number,
      "feedback": "Detailed feedback on the voice response",
      "communication": number,
      "confidence": number,
      "clarity": number,
      "content": number
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer evaluating voice responses. Consider both content and communication skills."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: Math.max(0, Math.min(100, result.score || 0)),
      feedback: result.feedback || "No feedback provided",
      communication: Math.max(0, Math.min(10, result.communication || 0)),
      confidence: Math.max(0, Math.min(10, result.confidence || 0)),
      clarity: Math.max(0, Math.min(10, result.clarity || 0)),
      content: Math.max(0, Math.min(10, result.content || 0)),
    };
  } catch (error) {
    throw new Error(`Failed to evaluate voice response: ${error.message}`);
  }
}

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  try {
    const fs = await import("fs");
    const audioReadStream = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

export async function generateFinalFeedback(
  mcqScore: number,
  subjectiveScore: number,
  voiceScore: number,
  assessmentTitle: string
): Promise<string> {
  try {
    const overallScore = (mcqScore + subjectiveScore + voiceScore) / 3;
    
    const prompt = `Generate comprehensive feedback for a candidate who completed a ${assessmentTitle} assessment:
    
    MCQ Score: ${mcqScore}%
    Subjective Score: ${subjectiveScore}%
    Voice Score: ${voiceScore}%
    Overall Score: ${overallScore.toFixed(1)}%
    
    Provide encouraging but honest feedback highlighting strengths and areas for improvement.
    Include specific actionable recommendations for skill development.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a supportive career mentor providing constructive feedback to help candidates grow."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.choices[0].message.content || "Assessment completed successfully.";
  } catch (error) {
    throw new Error(`Failed to generate final feedback: ${error.message}`);
  }
}
