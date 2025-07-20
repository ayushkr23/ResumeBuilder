import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { resumeDataSchema, type ResumeData } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // AI suggestions endpoint
  app.post("/api/ai/suggestions", async (req, res) => {
    try {
      const { resumeData, role } = req.body;
      
      const prompt = `Analyze this resume data for a ${role} role and provide improvement suggestions. 
      Resume: ${JSON.stringify(resumeData)}
      
      Respond with JSON in this format:
      {
        "suggestions": [
          {
            "type": "skill|improvement|content",
            "title": "suggestion title",
            "description": "detailed suggestion",
            "priority": "low|medium|high"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume advisor. Provide specific, actionable suggestions to improve resumes for different career roles."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI suggestions error:", error);
      res.status(500).json({ error: "Failed to generate AI suggestions" });
    }
  });

  // Resume scoring endpoint
  app.post("/api/ai/score", async (req, res) => {
    try {
      const { resumeData, role } = req.body;
      
      const prompt = `Score this resume for a ${role} role on a scale of 1-10 and provide feedback.
      Resume: ${JSON.stringify(resumeData)}
      
      Respond with JSON in this format:
      {
        "score": 7,
        "feedback": "specific feedback about strengths and areas for improvement",
        "suggestions": [
          {
            "type": "skill|improvement|content",
            "title": "suggestion title", 
            "description": "detailed suggestion",
            "priority": "low|medium|high"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume scorer. Evaluate resumes objectively based on industry standards, completeness, and relevance to the target role."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI scoring error:", error);
      res.status(500).json({ error: "Failed to generate resume score" });
    }
  });

  // AI content enhancement endpoint
  app.post("/api/ai/enhance", async (req, res) => {
    try {
      const { text, type, role } = req.body;
      
      const prompt = `Enhance this ${type} for a ${role} resume to be more professional and impactful:
      "${text}"
      
      Respond with JSON in this format:
      {
        "enhanced": "improved version of the text",
        "explanation": "brief explanation of improvements made"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Enhance resume content to be more impactful while maintaining accuracy and relevance."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI enhancement error:", error);
      res.status(500).json({ error: "Failed to enhance content" });
    }
  });

  // Skill suggestions for role
  app.get("/api/skills/:role", async (req, res) => {
    try {
      const { role } = req.params;
      
      const prompt = `Suggest 10-15 relevant technical and soft skills for a ${role} role.
      
      Respond with JSON in this format:
      {
        "skills": [
          {
            "name": "skill name",
            "category": "technical|soft|tool"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a career advisor. Suggest relevant skills for different job roles based on current industry requirements."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("Skill suggestions error:", error);
      res.status(500).json({ error: "Failed to get skill suggestions" });
    }
  });

  // Simple resume operations (using localStorage on frontend)
  app.get("/api/resumes", async (req, res) => {
    try {
      const resumes = storage.getResumes();
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const resumeData = req.body;
      storage.saveResume(resumeData);
      res.json({ success: true, message: "Resume saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
