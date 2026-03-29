# AI Interview Coach 🎤🤖

An intelligent, full-stack mock interview platform that leverages **Gemini Flash 1.5** to simulate realistic technical and behavioral interviews. It parses your CV, generates personalized questions, and provides real-time speech-to-text feedback to help you land your dream job.

---

## 🌟 Key Features

- **📄 CV Analysis:** Smart extraction of skills, projects, and experience level from PDF and DOCX files.
- **🎙️ Real-time Spoken Interview:** Conducts a 4-stage interview (Intro, CV Deep-Dive, Technical, Problem Solving) with browser-native text-to-speech and speech-to-text.
- **📊 Speech Metrics:** Analyzes your performance in real-time:
  - **WPM (Words Per Minute):** Measures pacing.
  - **Filler Words:** Tracks "um", "uh", "like", etc.
  - **Confidence Scoring:** Heuristic scores based on fluency and pauses.
- **🧠 AI Evaluation:** Detailed feedback on technical depth and clarity for *every* answer.
- **📈 Growth Dashboard:** Visual reports with Recharts, showing stage-by-stage performance and total stats.
- **🖨️ PDF Export:** Print-optimized reports for personal archiving.
- **🛡️ Robustness:** Built-in Gemini retry logic (backoff), loading skeletons, and automatic speech recognition recovery.

---

## 🛠️ Tech Stack

### Frontend
- **React + Vite** (UI layer)
- **Tailwind CSS v4** (Modern styling)
- **Recharts** (Data visualization)
- **React Router Dom** (Navigation)
- **Web Speech API** (Native JS for Synthesis & Recognition)

### Backend
- **Node.js + Express** (Server)
- **MongoDB + Mongoose** (Database)
- **Google Generative AI SDK** (Gemini API)
- **Multer** (File handling)
- **PDF-Parse & Mammoth** (Text extraction from docs)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or Atlas URI)
- **Google Gemini API Key** (Get it free at [Google AI Studio](https://aistudio.google.com/))
- **Google Chrome / Microsoft Edge** (For Speech-to-Text support)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Installation
Open two terminal windows:

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start!

---

## 📂 Project Structure

```text
ai-interview-coach/
├── frontend/             # React App
│   ├── src/
│   │   ├── components/   # UI blocks (Carts, Metrics, etc)
│   │   ├── hooks/        # Speech Logic & API flows
│   │   ├── pages/        # Upload, Interview, Report
│   │   └── utils/        # Constants and Scoring math
├── backend/              # Express API
│   ├── components/       # Controllers, Models, Routes
│   ├── prompts/          # Gemini instruction templates
│   ├── services/         # CV parsing & Gemeni AI logic
│   └── middleware/       # Handlers for errors and uploads
└── README.md
```

---

## 🧪 Interview Flow

1. **Upload Resume:** PDF/DOCX analysis determines your persona.
2. **AI Warmup:** Covers introduction and background (3 questions).
3. **Deep-Dive:** AI grills you on specific projects found on your CV (4 questions).
4. **Technical Test:** Core programming and skill-based technical questions (5 questions).
5. **Logic Challenge:** Problem solving and situational logic (3 questions).
6. **Report:** View analysis of your speech, scores, and specific areas to improve.

---

## 🔥 Future Roadmap
- [ ] Multimodal analysis (Video feedback)
- [ ] Whisper API integration for improved transcription accuracy.
- [ ] Coding sandbox integration for live technical challenges.
- [ ] Multi-language support.

---

**Built with ❤️ for better career preparation.**
