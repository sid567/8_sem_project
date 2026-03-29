# AI Interview Coach 🎤🤖

An intelligent, full-stack mock interview platform powered by **Groq (LLaMA 3.3 70B)** that simulates realistic technical and behavioral interviews. It parses your CV, generates personalized questions, conducts a live spoken interview, and provides a detailed performance report to help you land your dream job.

---

## 🌟 Key Features

- **📄 Smart CV Analysis** — Extracts skills, projects, experience level, and education from PDF and DOCX files.
- **🎙️ Live Spoken Interview** — 4-stage interview (Intro → CV Deep-Dive → Technical → Problem Solving) with browser-native text-to-speech (interviewer voice) and speech-to-text (your answers).
- **⏱️ Interview Length Choice** — Choose between Quick (5 Qs, ~5 min), Standard (10 Qs, ~12 min), or Full (15 Qs, ~20 min) before starting.
- **⏳ 3-Second Countdown** — A visual 3 → 2 → 1 → GO! countdown fires before recording starts so you're never caught off-guard.
- **📏 Live Response Meter** — A real-time word-count bar gives you a 150-word soft cap to keep answers concise and on-point.
- **⏰ Session Timer** — A live MM:SS timer shows total elapsed interview time in the header.
- **📊 Speech Metrics** — Analyzes your spoken performance:
  - **WPM (Words Per Minute):** Measures your pacing (ideal: 120–160 WPM).
  - **Filler Words:** Tracks "um", "uh", "like", "you know", etc.
  - **Confidence Score:** Heuristic score based on fluency and pauses.
- **🧠 AI Evaluation** — Detailed, per-answer feedback on technical depth, clarity, and relevance.
- **📈 Performance Report** — Visual dashboards (Recharts) with per-stage scores, voice metrics, strengths, and improvement areas.
- **🖨️ PDF Export** — Print-friendly report layout for archiving.
- **🛡️ Robustness** — Retry-with-backoff on all AI calls, loading skeletons, global error handler, and automatic speech recognition recovery.

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React + Vite | UI framework |
| Tailwind CSS v4 | Styling |
| React Router Dom | Navigation |
| Recharts | Data visualization |
| Web Speech API | Browser-native TTS & STT |
| react-dropzone | CV file upload |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express v5 | API server |
| MongoDB + Mongoose | Database |
| Groq SDK (LLaMA 3.3 70B) | AI question generation & evaluation |
| Multer v2 | File upload handling |
| pdf-parse v1 | PDF text extraction |
| Mammoth | DOCX text extraction |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI
- **Groq API Key** — free at [console.groq.com](https://console.groq.com) → API Keys
- **Google Chrome** or **Microsoft Edge** — required for Web Speech API

### 2. Clone & Setup Environment

```bash
git clone https://github.com/sid567/8_sem_project.git
cd 8_sem_project/ai-interview-coach
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
GROQ_API_KEY=gsk_your_groq_key_here
```

### 3. Install & Run

Open **two** terminal windows:

**Backend:**
```bash
cd backend
npm install
npm run dev       # runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

Open **http://localhost:5173** in Chrome to start.

---

## 📂 Project Structure

```
ai-interview-coach/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── report/       # Score cards, metric panels, transcript viewer
│       │   └── upload/       # DropZone, UploadProgress
│       ├── hooks/            # useInterview, useReport, useSpeechRecognition, useSpeechSynthesis, useUpload
│       ├── pages/            # UploadPage, InterviewPage, ReportPage
│       ├── services/         # axios instance (api.js)
│       └── utils/            # constants.js, voiceMetrics.js
│
└── backend/
    ├── config/               # db.js, groq.js
    ├── controllers/          # upload, interview, report controllers
    ├── middleware/            # errorHandler.js, upload.js (multer)
    ├── models/               # Session, Question, Report schemas
    ├── prompts/              # AI prompt builders (extractProfile, generateQuestion, evaluateAnswer)
    ├── routes/               # upload.routes, interview.routes, report.routes
    └── services/             # cvParser, gemini (actually Groq), scoreAggregator
```

---

## 🧪 Interview Flow

```
Upload CV (PDF/DOCX)
      ↓
AI extracts profile (name, skills, projects, experience)
      ↓
Choose length: Quick (5) / Standard (10) / Full (15)
      ↓
  ┌─────────────────────────────────────────────────────┐
  │  Stage 1: Introduction     (warm-up questions)      │
  │  Stage 2: CV Deep-Dive     (probe real experience)  │
  │  Stage 3: Technical        (skills & concepts)      │
  │  Stage 4: Problem Solving  (logic & approach)       │
  └─────────────────────────────────────────────────────┘
  For each question:
    • AI generates question → TTS speaks it
    • 3-second countdown → mic opens
    • You answer verbally → live transcript + word count
    • Submit → AI evaluates content + speech metrics
      ↓
Final Report: scores, voice stats, strengths, improvements
```

---

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload CV, extract profile, create session |
| `GET` | `/api/session/:id` | Get session with profile JSON |
| `POST` | `/api/session/:id/question` | Generate next question for a stage |
| `POST` | `/api/session/:id/answer` | Submit answer, get scores + feedback |
| `POST` | `/api/session/:id/complete` | Mark session done, aggregate report |
| `GET` | `/api/session/:id/report` | Get final performance report |
| `GET` | `/api/session/:id/questions` | Get all questions with transcripts |

---

## 🔥 Future Roadmap

- [ ] User authentication & session history
- [ ] Whisper API for higher-accuracy transcription
- [ ] Coding sandbox for live technical challenges
- [ ] Video analysis (eye contact, posture)
- [ ] Multi-language interview support
- [ ] Framer Motion animations between questions

---

**Built with ❤️ for better career preparation.**
