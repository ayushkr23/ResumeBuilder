// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  resumes = /* @__PURE__ */ new Map();
  getResumes() {
    return Array.from(this.resumes.values());
  }
  saveResume(resumeData) {
    const id = Date.now().toString();
    this.resumes.set(id, resumeData);
  }
  deleteResume(id) {
    return this.resumes.delete(id);
  }
};
var storage = new MemStorage();

// server/routes.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function registerRoutes(app2) {
  app2.post("/api/ai/suggestions", async (req, res) => {
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
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume advisor. Provide specific, actionable suggestions to improve resumes for different career roles."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI suggestions error:", error);
      res.status(500).json({ error: "Failed to generate AI suggestions" });
    }
  });
  app2.post("/api/ai/score", async (req, res) => {
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
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume scorer. Evaluate resumes objectively based on industry standards, completeness, and relevance to the target role."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI scoring error:", error);
      res.status(500).json({ error: "Failed to generate resume score" });
    }
  });
  app2.post("/api/ai/enhance", async (req, res) => {
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
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Enhance resume content to be more impactful while maintaining accuracy and relevance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI enhancement error:", error);
      res.status(500).json({ error: "Failed to enhance content" });
    }
  });
  app2.get("/api/skills/:role", async (req, res) => {
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
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a career advisor. Suggest relevant skills for different job roles based on current industry requirements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("Skill suggestions error:", error);
      res.status(500).json({ error: "Failed to get skill suggestions" });
    }
  });
  app2.get("/api/resumes", async (req, res) => {
    try {
      const resumes = storage.getResumes();
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });
  app2.post("/api/resumes", async (req, res) => {
    try {
      const resumeData = req.body;
      storage.saveResume(resumeData);
      res.json({ success: true, message: "Resume saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save resume" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
