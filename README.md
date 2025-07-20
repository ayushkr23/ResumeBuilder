
# 💼 ResumeAI - AI Powered Resume Builder for Tier-2/Tier-3 Students

> ✨ Build job-winning resumes effortlessly with AI-powered suggestions, 6 professional templates, offline save, and PDF export – all in one stunning desktop app!

## 🔍 Overview

**ResumeAI** is a full-featured, modern **desktop resume builder** powered by AI suggestions, built using **React, Electron, TailwindCSS, Express.js**, and **OpenAI GPT-4o**.

It guides students through a **multi-step wizard**, provides **real-time suggestions**, enables **offline/local save**, supports **multiple professional templates**, and generates **PDF resumes with a QR code and timestamp**.

## 🧠 Key Features

| Feature | Description |
|--------|-------------|
| 🪄 **Step-by-Step Wizard** | Friendly form with tooltips and examples for each section |
| 🤖 **AI Suggestions** | Enhances bullet points, summaries, and action verbs |
| 🎨 **6 Resume Templates** | Professionally designed layouts for different roles |
| 📥 **Save Draft (Offline)** | Draft saved as `.resu` file or localStorage |
| 📂 **Load Draft** | Resume progress can be restored instantly |
| 🎯 **Role-Based Guidance** | Smart recommendations for Web Dev, Analyst, CyberSec, etc. |
| 📊 **Resume Score** | AI grades your resume and gives improvement tips |
| 🌗 **Dark Mode** | Auto toggle or manual switch |
| 📄 **PDF Export** | With QR Code + Timestamp, using PDFBox / jsPDF |
| 🌐 **Multilingual Support** | English (default) — expandable to Hindi |
| 💬 **AI Panel** | Role-specific feedback and suggestions |
| 📸 **QR Code Generator** | Resume download QR embedded in the PDF |
| 📁 **Electron Desktop App** | Runs offline, cross-platform ready |
| ⚡ **Animations + Transitions** | Smooth user experience with Tailwind motion |

## 🏗️ Project Structure

```
resume-builder-ai/
├── client/                 # React Frontend (Tailwind, Shadcn/ui, Wouter)
│   ├── components/         # Custom UI components (wizard, role picker, AI panel, templates)
│   ├── pages/              # Home, Not Found
│   ├── lib/                # Utilities: PDF, QR, AI, hooks
│   ├── App.tsx             # App entry point
│   └── main.tsx            # React bootstrap
├── server/                 # Express backend
│   ├── index.ts            # Main server
│   ├── routes.ts           # AI and API endpoints
│   └── vite.ts             # Vite + Express middleware
├── shared/                 # Zod schemas and types
├── public/                 # Static assets and illustrations
└── electron/               # Electron main process files
```

## 🛠️ Setup Instructions

### ⚙️ Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- OpenAI API Key (optional but recommended)
- VS Code or any IDE

### 🚀 Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/resume-builder-ai
cd resume-builder-ai

# 2. Install dependencies
npm install

# 3. Create `.env` file in root
OPENAI_API_KEY=your_openai_key

# 4. Start the development server
npm run dev
```

Client runs on `http://localhost:3000`, backend on `http://localhost:5000`.

### 💻 Electron Desktop App

```bash
npm run electron:dev
```

Build a desktop app using:

```bash
npm run electron:build
```

### 🧪 Linting + Type Checking

```bash
npm run lint
npm run check
```

### 📄 PDF Export

- Injects:
  - Name, contact, sections
  - QR code with download link
  - Export timestamp
- Optionally uses jsPDF or PDFBox (backend)

### 🧠 AI Features

- `POST /api/ai/suggestions` → Role-based improvement suggestions
- `POST /api/ai/score` → Score out of 10 + fix tips

## 📦 Technologies Used

| Layer       | Tech Stack |
|-------------|------------|
| Frontend    | React, Tailwind CSS, Shadcn UI, Wouter |
| Backend     | Express.js, TypeScript, Vite |
| AI          | OpenAI GPT-4o API |
| Desktop App | Electron |
| Icons       | Lucide Icons |
| Forms       | React Hook Form + Zod |
| State       | TanStack Query, localStorage |
| PDF         | jsPDF / PDFBox |
| QR Code     | `qrcode` lib |
| Animations  | Tailwind + Animate.css |

## 📱 Templates Included

1. Modern Professional
2. Minimalist Elite
3. Creative Portfolio
4. Executive Premium
5. Tech Innovator
6. Classic Executive

## 🌟 Why This Project Stands Out?

✅ Made for real users (Tier-2/3 students)  
✅ Offline-first, beautiful UI  
✅ AI-enhanced resumes  
✅ Export-ready PDF with QR + Timestamp  
✅ Cross-platform Desktop & Web  
✅ Hackathon-ready polish and features  

## 🙌 Contributing

Fork, star 🌟 and improve the project!

## 📜 License

MIT © 2025 ResumeAI
