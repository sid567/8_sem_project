# Intervue.ai — AI Interview Coach 🎤🤖

> **Final Year Project (8th Semester)**  
> An intelligent, full-stack AI-powered mock interview platform that simulates realistic technical and behavioral interviews, tailored to each candidate's uploaded resume.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Live Demo & Screenshots](#-live-demo--screenshots)
3. [Key Features](#-key-features)
4. [Tech Stack](#-tech-stack)
5. [System Architecture](#-system-architecture)
6. [Project Structure](#-project-structure)
7. [Database Schema](#-database-schema)
8. [API Reference](#-api-reference)
9. [Interview Flow](#-interview-flow)
10. [Scoring System](#-scoring-system)
11. [Authentication System](#-authentication-system)
12. [Getting Started](#-getting-started)
13. [Environment Variables](#-environment-variables)
14. [Frontend Pages & Routes](#-frontend-pages--routes)
15. [AI Prompt Engineering](#-ai-prompt-engineering)
16. [Security Considerations](#-security-considerations)
17. [Known Limitations](#-known-limitations)
18. [Future Roadmap](#-future-roadmap)

---

## 🌐 Project Overview

**Intervue.ai** is a full-stack web application that acts as your personal AI interview coach. The platform allows students and job-seekers to:

1. Upload their CV (PDF or DOCX)
2. Have an AI extract their profile, skills, projects, and experience
3. Conduct a multi-stage mock interview entirely through voice
4. Receive a detailed, quantitative performance report

The AI interviewer is powered by **Groq's LLaMA 3.3 70B** — one of the fastest and most capable open-weight language models available. The system is built around three core pillars:

- **Personalization** — every question is generated fresh based on the candidate's actual CV
- **Voice-first UX** — the interview is conducted using the browser's Web Speech API (TTS for the interviewer, STT for the candidate)
- **Actionable feedback** — a multi-dimensional scoring system breaks down performance across technical depth, clarity, confidence, and answer depth

---

## ✨ Key Features

### 🗂️ CV-Powered Personalization
- Accepts **PDF** and **DOCX** files up to 5 MB
- Uses Groq LLM to extract a structured JSON profile: name, skills, projects, experience level, education
- Every interview question is dynamically generated based on this profile — no generic questions

### 🎙️ Live Voice Interview
- **Text-to-Speech** (Web Speech API): the AI interviewer speaks each question in a natural voice
- **Speech-to-Text** (Web Speech API): the candidate answers out loud; transcript appears live on screen
- **3-Second Countdown**: visual 3 → 2 → 1 → GO! before recording begins so candidates are never caught off-guard
- **Live Word Count Bar**: a 150-word soft cap encourages concise, structured answers
- **Session Timer**: MM:SS elapsed time displayed in the interview header

### 📏 Speech Metrics Engine
Real-time tracking of:
| Metric | Description |
|--------|-------------|
| **WPM** | Words per minute — ideal range 120–160 |
| **Filler Words** | Tracks "um", "uh", "like", "you know", "basically", etc. |
| **Pause Count** | Detects mid-answer hesitations |
| **Confidence Score** | Heuristic score derived from WPM deviation and pause count |
| **Answer Depth** | Penalizes very short (<30 word) answers |

### 📊 AI Scoring (Per Question)
Each answer is evaluated on four dimensions:
- **Technical Score** (40%) — AI judges correctness and relevance of the content
- **Depth Score** (20%) — Word count relative to 150-word ideal
- **Clarity Score** (20%) — Penalizes filler word usage
- **Confidence Score** (20%) — Speech pacing and pause analysis

### 📈 Detailed Performance Report
After the interview completes:
- **Overall weighted score** (0–100)
- **Per-stage scores** (Intro / CV Deep-Dive / Technical / Problem Solving), visualized with **Recharts**
- **Voice metrics summary** (avg WPM, filler count, longest pause)
- **Top 3 Strengths** and **Top 3 Areas to Improve** extracted by AI
- **Full Q&A transcript** with per-question scores and feedback
- **Print/PDF export** support

### ⏱️ Interview Length Presets
| Preset | Questions | Duration |
|--------|-----------|----------|
| ⚡ Quick | 5 | ~5 min |
| 🎯 Standard | 10 | ~12 min |
| 🏆 Full | 15 | ~20 min |

### 🔐 User Authentication & Session History
- Full **JWT-based** registration and sign-in
- Passwords hashed with **bcryptjs** (10 salt rounds)
- All upload sessions tied to the authenticated user's `userId`
- **Dashboard** shows real session history fetched from MongoDB, with status badges (completed / in_progress / ready)
- Protected routes: upload and session history require a valid Bearer token

### 🎨 Premium UI/UX
- Dark mode by default — deep slate palette with indigo/purple accent gradients
- **Google Fonts**: Outfit (headings) + Inter (body)
- **Framer Motion** page and element animations
- **Lucide React** icon set throughout
- Glassmorphism panels, ambient glows, subtle micro-interactions
- Responsive — works from 320px mobile to wide desktop
- Custom scrollbar styling
- Password visibility toggle (Eye / EyeOff) on auth forms

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Component Framework |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | v4.x | Utility-first styling |
| Framer Motion | latest | Page & element animations |
| Lucide React | latest | Icon library |
| React Router Dom | v7.x | Client-side routing |
| Recharts | 3.x | Data visualization charts |
| Axios | 1.x | HTTP client with interceptors |
| react-dropzone | 15.x | CV drag-and-drop upload |
| Web Speech API | Browser | Text-to-speech & speech-to-text |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express | v5.x | REST API framework |
| MongoDB | — | NoSQL document database |
| Mongoose | — | MongoDB ODM |
| Groq SDK | latest | LLaMA 3.3 70B API client |
| bcryptjs | — | Password hashing |
| jsonwebtoken | — | JWT auth token generation/verification |
| Multer v2 | — | Multipart file upload handling |
| pdf-parse | — | PDF text extraction |
| Mammoth | — | DOCX text extraction |
| dotenv | — | Environment variable management |
| cors | — | Cross-origin request handling |

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        BROWSER (React + Vite)                      │
│                                                                    │
│   LandingPage → SignUp/SignIn → Upload → Interview → Report        │
│         │              │           │         │          │          │
│      AuthContext    JWT Token   useUpload useInterview useReport   │
│         └──────────────┴─────────────┘         │                  │
│                     Axios (+ Bearer header)     │                  │
│                          │                      │                  │
└──────────────────────────┼──────────────────────┘                  │
                           │ HTTP/REST                                │
┌──────────────────────────▼──────────────────────────────────────── │
│                    EXPRESS API SERVER (:5000)                       │
│                                                                     │
│  /api/auth/*   /api/upload   /api/session/*   /api/session/history │
│       │              │              │                   │           │
│  authMiddleware  multer+protect  protect (JWT)      protect (JWT)  │
│       │              │              │                   │           │
│  auth.controller upload.ctrl  interview.ctrl        interview.ctrl │
│       │              │              │                   │           │
│  User.model    Session.model  Question.model        Session.model  │
│       │              │              │                   │           │
└───────┼──────────────┼──────────────┼───────────────────┼──────────┘
        │              │              │                   │
        └──────────────┴──────────────┴───────────────────┘
                                │
                         MongoDB Atlas / Local
                                │
                         ┌──────┴──────┐
                         │  Groq API   │
                         │ LLaMA 3.3   │
                         │   70B       │
                         └─────────────┘
```

---

## 📂 Project Structure

```
ai-interview-coach/
│
├── README.md
│
├── frontend/                          ← React + Vite SPA
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                   ← React DOM root
│       ├── App.jsx                    ← Router + AuthProvider + AppLayout
│       ├── index.css                  ← Global styles, Tailwind v4, fonts
│       │
│       ├── context/
│       │   └── AuthContext.jsx        ← Global auth state (login, register, logout)
│       │
│       ├── services/
│       │   └── api.js                 ← Axios instance with JWT interceptor
│       │
│       ├── hooks/
│       │   ├── useInterview.js        ← Interview state machine, question flow
│       │   ├── useUpload.js           ← File upload logic
│       │   ├── useSpeechRecognition.js← Browser STT hook
│       │   ├── useSpeechSynthesis.js  ← Browser TTS hook
│       │   └── useReport.js           ← Report data fetching
│       │
│       ├── pages/
│       │   ├── LandingPage.jsx        ← Hero, How it Works, Testimonials, CTA
│       │   ├── SignInPage.jsx         ← Login form with JWT auth
│       │   ├── SignUpPage.jsx         ← Registration form
│       │   ├── DashboardPage.jsx      ← User session history + stats
│       │   ├── UploadPage.jsx         ← CV upload + length picker
│       │   ├── InterviewPage.jsx      ← Live interview UI (voice + transcript)
│       │   └── ReportPage.jsx         ← Performance report + charts
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx         ← Auth-aware top navigation
│       │   │   └── Footer.jsx         ← Site-wide footer
│       │   ├── upload/
│       │   │   ├── DropZone.jsx       ← react-dropzone file input
│       │   │   └── UploadProgress.jsx ← Upload state feedback
│       │   └── report/
│       │       ├── OverallScore.jsx   ← Score ring/circle
│       │       └── (other panels)     ← Stage scores, voice metrics, transcript
│       │
│       └── utils/
│           ├── constants.js           ← Interview stages, filler word list
│           └── voiceMetrics.js        ← WPM, filler, and confidence calculators
│
└── backend/                           ← Node.js + Express API
    ├── server.js                      ← App entry: middleware, routes, listen
    ├── package.json
    ├── .env                           ← Secret keys (not committed)
    ├── .env.example                   ← Template for .env
    ├── .gitignore
    │
    ├── config/
    │   ├── db.js                      ← Mongoose connection
    │   └── groq.js                    ← Groq SDK client initialization
    │
    ├── models/
    │   ├── User.model.js              ← User schema (name, email, hashed password)
    │   ├── Session.model.js           ← Session schema (userId, status, profileJSON)
    │   ├── Question.model.js          ← Question schema (text, transcript, scores, feedback)
    │   └── Report.model.js            ← Report schema (overallScore, stageScores, voiceMetrics)
    │
    ├── controllers/
    │   ├── auth.controller.js         ← registerUser, loginUser
    │   ├── upload.controller.js       ← uploadCV (parse + Groq profile extraction)
    │   ├── interview.controller.js    ← getSession, getNextQuestion, submitAnswer, completeSession, getHistory
    │   └── report.controller.js       ← getReport
    │
    ├── routes/
    │   ├── auth.routes.js             ← POST /register, POST /login
    │   ├── upload.routes.js           ← POST /api/upload (protected)
    │   ├── session.routes.js          ← GET /history, GET /:id, POST /:id/complete (protected)
    │   ├── interview.routes.js        ← POST /:id/question, POST /:id/answer, GET /:id/questions
    │   └── report.routes.js           ← GET /:id/report
    │
    ├── middleware/
    │   ├── authMiddleware.js          ← JWT Bearer token verification → req.user
    │   ├── upload.js                  ← Multer config (memory storage, 5 MB limit, PDF+DOCX only)
    │   └── errorHandler.js            ← Global Express error handler
    │
    ├── services/
    │   ├── cvParser.service.js        ← pdf-parse + Mammoth text extraction
    │   ├── gemini.service.js          ← Groq API calls (extractProfile, generateQuestion, evaluateAnswer)
    │   └── scoreAggregator.service.js ← Aggregates per-question scores into final report
    │
    └── prompts/                       ← LLM prompt builder functions
        ├── extractProfile.prompt.js
        ├── generateQuestion.prompt.js
        └── evaluateAnswer.prompt.js
```

---

## 🗃️ Database Schema

### `users` Collection
```js
{
  _id: ObjectId,
  name: String,           // Full name
  email: String,          // Unique, lowercase
  password: String,       // bcrypt hash (10 rounds)
  createdAt: Date,
  updatedAt: Date
}
```

### `sessions` Collection
```js
{
  _id: ObjectId,
  sessionId: String,      // UUID (crypto.randomUUID)
  userId: ObjectId,       // Ref → users._id (optional – allows guest mode)
  candidateName: String,
  uploadedAt: Date,
  status: String,         // 'processing' | 'ready' | 'in_progress' | 'completed'
  profileJSON: {
    name: String,
    skills: [String],
    projects: [String],
    experienceLevel: String,
    education: String
  }
}
```

### `questions` Collection
```js
{
  _id: ObjectId,
  sessionId: String,            // Ref → sessions.sessionId
  stage: String,                // 'intro' | 'cv_deep_dive' | 'technical' | 'problem_solving'
  questionText: String,
  transcribedAnswer: String,
  questionIndex: Number,
  scores: {
    technicalScore: Number,     // 0–100 (AI evaluated)
    depthScore: Number,         // 0–100 (word count heuristic)
    clarityScore: Number,       // 0–100 (filler word penalty)
    confidenceScore: Number     // 0–100 (WPM + pause heuristic)
  },
  feedback: {
    summary: String,            // AI-generated answer summary
    suggestion: String          // AI-generated improvement tip
  },
  createdAt: Date
}
```

### `reports` Collection
```js
{
  _id: ObjectId,
  sessionId: String,            // Ref → sessions.sessionId (unique)
  overallScore: Number,         // Weighted average 0–100
  stageScores: {
    intro: Number,
    cv_deep_dive: Number,
    technical: Number,
    problem_solving: Number
  },
  voiceMetrics: {
    avgWPM: Number,
    totalFillerWords: Number,
    longestPause: Number,       // seconds
    answerCount: Number
  },
  topStrengths: [String],       // 3 AI-generated bullet points
  topImprovements: [String],    // 3 AI-generated bullet points
  createdAt: Date
}
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| `POST` | `/api/auth/register` | ❌ | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | `{ user, token }` |

### Upload

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| `POST` | `/api/upload` | ✅ JWT | `multipart/form-data: cv (file)` | `{ sessionId, candidateName, profile }` |

### Session

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/session/history` | ✅ JWT | Returns all sessions for the logged-in user |
| `GET` | `/api/session/:id` | ✅ JWT | Returns full session document |
| `POST` | `/api/session/:id/complete` | ✅ JWT | Marks session as completed, triggers score aggregation |
| `POST` | `/api/session/:id/question` | ❌ | `{ stage, conversationHistory[] }` → generates next question |
| `POST` | `/api/session/:id/answer` | ❌ | `{ questionId, transcriptText, voiceMetrics }` → evaluates answer |
| `GET` | `/api/session/:id/questions` | ❌ | Returns all Q&A for a session |
| `GET` | `/api/session/:id/report` | ❌ | Returns the final performance report |

> **Note:** Question and answer endpoints currently do not require auth to allow guest/test sessions. Production deployments should protect them.

### Error Responses
All endpoints return consistent JSON errors:
```json
{ "message": "Not authorized, token failed" }   // 401
{ "message": "User already exists" }            // 400
{ "error": "No file uploaded." }                // 400
{ "error": "Internal server error." }           // 500
```

---

## 🎬 Interview Flow

```
╔══════════════════════════════════════════════════════════════╗
║             INTERVUE.AI — COMPLETE FLOW                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. User creates account / signs in                          ║
║         │                                                    ║
║  2. Uploads CV (PDF/DOCX, max 5MB)                           ║
║         │                                                    ║
║  3. Backend (Multer) → cvParser → text extracted             ║
║         │                                                    ║
║  4. Groq LLM → structured profileJSON saved in Session DB    ║
║         │                                                    ║
║  5. User selects: Quick (5) / Standard (10) / Full (15)      ║
║         │                                                    ║
║  6. INTERVIEW BEGINS                                         ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ For each question:                                     │  ║
║  │                                                        │  ║
║  │  a. POST /question → Groq generates personalized Q    │  ║
║  │  b. TTS speaks the question aloud                      │  ║
║  │  c. 3-2-1-GO countdown → STT recording starts         │  ║
║  │  d. Candidate answers verbally (live transcript)       │  ║
║  │  e. Word count bar updates in real time                │  ║
║  │  f. Candidate submits answer                           │  ║
║  │  g. POST /answer →                                     │  ║
║  │       • Groq evaluates content (technicalScore)        │  ║
║  │       • Backend computes depthScore, clarityScore,     │  ║
║  │         confidenceScore from voice metrics             │  ║
║  │       • Weighted score stored on Question document     │  ║
║  │  h. AI feedback summary + suggestion shown briefly     │  ║
║  │  i. Move to next question                              │  ║
║  └────────────────────────────────────────────────────────┘  ║
║         │                                                    ║
║  7. POST /complete → scoreAggregator runs                    ║
║         │                                                    ║
║  8. Report generated → stored in reports collection          ║
║         │                                                    ║
║  9. Redirect to /report/:sessionId (charts + transcript)     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Interview Stages (in order)
| Stage | ID | Purpose |
|-------|----|---------|
| Introduction | `intro` | Warm-up: background, motivation, teamwork |
| CV Deep-Dive | `cv_deep_dive` | Probe specific projects, skills, and experience on the resume |
| Technical | `technical` | Skills assessment: language features, system design, algorithms |
| Problem Solving | `problem_solving` | Logic, approach, and tradeoff reasoning |

---

## 📐 Scoring System

### Per-Answer Score (Weighted Composite)

```
Composite = (technicalScore × 0.40)
          + (depthScore     × 0.20)
          + (clarityScore   × 0.20)
          + (confidenceScore× 0.20)
```

**Technical Score** — AI evaluates:
- Is the answer factually correct?
- Does it address the question topic?
- Is it relevant to the candidate's background?

**Depth Score** — Heuristic:
```
depthScore = min(100, round((wordCount / 150) × 100))
```
Penalizes very brief "I don't know" type responses.

**Clarity Score** — Heuristic:
```
clarityScore = max(0, 100 − (fillerWordCount × 10))
```
Each detected filler word ("um", "uh", "like", "basically", "you know") costs 10 points.

**Confidence Score** — Heuristic:
```
wpmDeviation = |actualWPM − idealRange(120–160)|
wpmPenalty   = min(50, deviation)
pausePenalty = min(50, pauseCount × 10)
confidenceScore = max(0, 100 − wpmPenalty − pausePenalty)
```

### Session-Level Report Aggregation
- **Stage scores** = mean of all composite scores per stage
- **Overall score** = mean of all individual composite scores
- **Top strengths** and **improvements** = extracted by Groq from the complete transcript

---

## 🔐 Authentication System

The application uses **stateless JWT (JSON Web Token)** authentication:

### Registration Flow
```
POST /api/auth/register
  → Validate: name, email, password (min 6 chars)
  → Check email uniqueness
  → Hash password: bcrypt.hash(password, 10)
  → Create User document
  → Generate JWT: jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' })
  → Return: { user (no password), token }
```

### Login Flow
```
POST /api/auth/login
  → Find user by email
  → Verify: bcrypt.compare(candidatePassword, storedHash)
  → Generate JWT
  → Return: { user, token }
```

### Token Storage & Transmission
- Token stored in **localStorage** as `JSON.stringify({ user, token })`
- Axios **request interceptor** automatically appends `Authorization: Bearer <token>` to all protected requests
- `authMiddleware.js` verifies and decodes token on protected routes, attaches `req.user`

### Protected Routes (Backend)
| Route | Middleware |
|-------|------------|
| `POST /api/upload` | `protect` |
| `GET /api/session/history` | `protect` |
| `GET /api/session/:id` | `protect` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+
- **MongoDB** — local instance (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Groq API Key** — free tier available at [console.groq.com](https://console.groq.com) → API Keys
- **Google Chrome** or **Microsoft Edge** — required for Web Speech API (TTS + STT)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sid567/8_sem_project.git
cd 8_sem_project/ai-interview-coach
```

### Step 2 — Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
GROQ_API_KEY=gsk_your_groq_api_key_here
JWT_SECRET=your_very_long_random_secret_string_here
```

> 💡 **JWT_SECRET** can be any long random string. Use `openssl rand -hex 32` to generate one.

### Step 3 — Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 4 — Start Development Servers

Open **two separate terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### Step 5 — Open the App

Navigate to **http://localhost:5173** in **Google Chrome** or **Microsoft Edge**.

> ⚠️ Web Speech API (voice features) **only works in Chromium-based browsers**. Firefox does not support `SpeechRecognition`.

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port for the Express server (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `GROQ_API_KEY` | Yes | API key from console.groq.com |
| `JWT_SECRET` | Yes | Secret key for signing JWTs (keep long & random) |

---

## 📱 Frontend Pages & Routes

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | `LandingPage` | No | Hero, How it Works, Testimonials, CTA |
| `/signin` | `SignInPage` | No | Email + password login with JWT |
| `/signup` | `SignUpPage` | No | Registration form |
| `/dashboard` | `DashboardPage` | Yes* | Session history, stats, quick start |
| `/upload` | `UploadPage` | Yes* | CV upload + interview length selector |
| `/interview/:sessionId` | `InterviewPage` | No | Live voice interview session |
| `/report/:sessionId` | `ReportPage` | No | Performance report + charts |

> *Dashboard and Upload redirect to `/` if the user is not authenticated (handled via `useAuth`).

### Global Layout
- **`Navbar`** — always visible except on `/signin` and `/signup`; shows "Sign In / Get Started" when logged out, "Dashboard / Logout" when logged in
- **`Footer`** — visible on all pages except `/signin`, `/signup`, and `/interview/*`

---

## 🧠 AI Prompt Engineering

The backend uses three purpose-built prompts:

### 1. Profile Extraction (`extractProfile.prompt.js`)
Instructs the LLM to parse raw CV text and return a strict JSON object:
```json
{
  "name": "...",
  "skills": ["React", "Node.js", ...],
  "projects": ["Built X using Y", ...],
  "experienceLevel": "fresher|junior|mid|senior",
  "education": "B.Tech Computer Science, XYZ University"
}
```

### 2. Question Generation (`generateQuestion.prompt.js`)
Given the candidate profile, current stage, and full conversation history:
- Generates a **single, conversational question**
- Avoids repetition by reviewing conversation history
- Adapts tone and difficulty by stage
- Questions are designed to be **short and speakable** (no bullet-point structures or code blocks)

### 3. Answer Evaluation (`evaluateAnswer.prompt.js`)
Given the question, the transcribed answer, and the candidate profile:
- Returns `{ technicalScore: 0–100, summary: "...", suggestion: "..." }`
- Summary: concise recap of what the candidate said
- Suggestion: one specific, actionable improvement

---

## 🛡️ Security Considerations

| Concern | Mitigation |
|---------|------------|
| Password storage | bcryptjs with 10 salt rounds |
| Auth token exposure | JWT in localStorage (acceptable for academic project; production should use httpOnly cookies) |
| File upload abuse | Multer limits: 5 MB max, PDF/DOCX only, memory storage (not disk) |
| API key exposure | Keys in `.env`, never committed (`.gitignore`) |
| CORS | Express CORS middleware configured |
| NoSQL injection | Mongoose schema validation on all inputs |

---

## ⚠️ Known Limitations

1. **Browser compatibility** — Web Speech API is Chromium-only. The interview voice features will not work in Firefox or Safari.
2. **Speech recognition accuracy** — Browser STT is free but not as accurate as Whisper API; background noise can affect transcript quality.
3. **Groq rate limits** — The free tier has token-per-minute limits; very long answers may cause brief delays.
4. **No video analysis** — Eye contact, posture, and facial expressions are not analyzed.
5. **localStorage auth** — JWT is stored in localStorage which is vulnerable to XSS. A production app should use httpOnly cookies.
6. **No email verification** — User registration does not verify email addresses.

---

## 🔮 Future Roadmap

- [x] ~~User authentication & session history~~ ✅ Implemented
- [x] ~~Framer Motion animations~~ ✅ Implemented
- [ ] Whisper API for higher-accuracy speech transcription
- [ ] Email verification on registration
- [ ] Coding sandbox for live technical challenges (Monaco Editor)
- [ ] Video analysis — webcam posture and eye-contact scoring
- [ ] Multi-language interview support (Hindi, Bengali, etc.)
- [ ] Interview history export (PDF / CSV)
- [ ] Company-specific interview packs (Google, Microsoft, Amazon, etc.)
- [ ] Leaderboard / peer comparison
- [ ] Mobile native app (React Native)

---

## 👨‍💻 Team & Academic Context

This project was developed as an **8th Semester Final Year Project** for a B.Tech Computer Science degree.

**Technologies explored:**
- Full-stack MERN architecture (MongoDB, Express, React, Node.js)
- LLM integration via REST API (Groq / LLaMA 3.3 70B)
- Browser Web Speech APIs (SpeechRecognition + SpeechSynthesis)
- JWT stateless authentication
- Speech signal processing heuristics (WPM, filler detection, confidence scoring)
- Modern React patterns (Context API, custom hooks, code splitting)

---

## 📄 License

This project is for academic and educational purposes.

---

**Built with ❤️ for better career preparation.**  
*Intervue.ai — Practice smarter. Interview better.*
