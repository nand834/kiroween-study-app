# 🎃 Grimoire AI — The Haunted Study Sanctum
### *Kiroween 2026 Hackathon & Costume Contest Entry*

> **"Summon Knowledge from the Shadows. Master Your Exams with Spookily Intelligent Flashcards & Quizzes."**

[![Kiroween 2026](https://img.shields.io/badge/Kiroween-2026_Hackathon-orange.svg?style=for-the-badge&logo=ghost)](https://kiro.dev)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge)](LICENSE)

---

## 🔮 Overview

**Grimoire AI** is an award-winning, atmospheric AI-powered study application developed for the **Kiroween 2026 Costume Contest & Hackathon**. 

It transforms lecture PDFs, study scrolls, and syllabi into interactive 3D arcane flashcards and adaptive exam-style trials. When students struggle with challenging concepts, Grimoire AI's **Adaptive Weak-Topic Engine** automatically identifies *Cursed Topics* (<50% accuracy) and dynamically prioritizes them in future quiz trials until they are fully *Purified* (>80% accuracy).

---

## 🎨 Visual Identity: *Haunted Library meets Premium AI SaaS*

Designed at the intersection of **Dark Academia, Mystical SaaS, and Halloween Elegance**, Grimoire AI avoids cheap clip art in favor of a bespoke, immersive study sanctum:

* **Midnight Palette:**
  * **Obsidian Sanctum (`#05030a`, `#0a0714`):** Deep, distraction-free nocturnal canvas.
  * **Arcane Violet (`#8b5cf6`, `#a855f7`):** Glowing runic borders, tabs, and focus rings.
  * **Jack-o'-Lantern Flame (`#f97316`, `#ea580c`):** Vibrant warning embers and high-priority accents.
  * **Spectral Emerald (`#10b981`, `#34d399`):** Purified mastery badges and correct answers.
  * **Ghost Lavender (`#ede9fe`, `#c4b5fd`):** Crisp gothic typography and glowing subtitles.
* **Atmospheric Canvas & Particle Physics:** 60 FPS HTML5 canvas with floating spectral embers, subtle moonlight vignettes, and ambient fog drifts.
* **Pure Web Audio Synthesizer:** Zero external audio dependencies! Uses native browser `AudioContext` to synthesize:
  * 📜 *Paper swoosh* for 3D card flips.
  * 🪄 *Crystal chime arpeggios* on purified answers.
  * 💀 *Dissonant gothic gong* on cursed mistakes.
  * 📻 *Binaural haunted library drone* for deep focus (toggleable).
* **Cinzel & Inter Typography:** Medieval serif headings paired with clean, modern sans-serif body copy and monospace rune metadata.

---

## ✨ Features & Architecture

```
                      ┌────────────────────────────────────────┐
                      │       GRIMOIRE AI STUDY SANCTUM        │
                      └───────────────────┬────────────────────┘
                                          │
            ┌─────────────────────────────┼────────────────────────────┐
            ▼                             ▼                            ▼
  📜 LECTURE SCROLLS            🎴 TOMES OF MEMORY            ⚔️ SPECTRAL TRIAL
  • PDF/TXT/MD Parsing          • 3D Card Physics             • Adaptive MCQ Engine
  • Instant Text Inscription    • Space / Arrow Navigation    • Real-Time Feedback
  • Pre-bound Grimoires (3)     • Whisper TTS Voice           • Arcane Streak Combos
            │                             │                            │
            └─────────────────────────────┼────────────────────────────┘
                                          ▼
                         🔮 THE HALL OF MASTERY & CURSES
                         • Cursed Topics (<50%): Urgent Review
                         • Haunted Topics (50-79%): Moderate Practice
                         • Purified Topics (>=80%): Mastered
                         • Targeted "Purge Cursed Topics" Spellcraft
```

### 1. 📜 Lecture Scrolls & Runic Extraction
* **Multi-Format Ingestion:** Drag-and-drop lecture PDFs, `.txt`, or `.md` files.
* **Direct Scroll Inscription:** Paste raw textbook notes, slides, or transcripts.
* **Pre-Bound Grimoires (Instant Try):**
  * *CS 666:* Distributed Systems Necromancy & Byzantine Horrors (Raft, CAP theorem, deadlocks).
  * *BIO 404:* Neurobiology of Vampirism & Cognitive Nightmares (Circadian SCN, synaptic influx, hepcidin).
  * *ALGO 301:* Graph Traversal through the Haunted Labyrinth (A* admissibility, Kruskal MST, NP-completeness).
* **Ritual Loading Ceremony:** Multi-stage animated spellcasting sequence with animated glyphs.

### 2. 🎴 Arcane Flashcards ("Tomes of Memory")
* **3D Perspective Flip:** Smooth CSS 3D matrix card flip with keyboard shortcuts (`Space` to flip, `←` / `→` to navigate).
* **Confidence Rating:**
  * 💀 **"Still Cursed" [1]:** Marks card for review, emits gothic gong, registers weak topic.
  * 🪄 **"Purified!" [2]:** Marks card as mastered, emits crystal chime.
* **Rune Filter:** Filter deck by *All Runes*, *Cursed Only*, or *Starred Only*.
* **Whisper of the Ghost (TTS):** Browser-native speech synthesis reads cards aloud in an eerie pitch.
* **Deck Shuffler & Progress Meter.**

### 3. ⚔️ The Spectral Trial (Adaptive MCQ Quiz)
* **Adaptive Ordering:** Questions matching student weak points automatically bubble to the top of the trial.
* **Streak & Combo Multipliers:** Visual and acoustic feedback on correct answer streaks (`3x Arcane Combo!`).
* **Grimoire Wisdom Drawer:** In-depth explanation of *why* the correct answer is true.
* **Completion Ceremony:** Confetti burst, score badges (*Arch-Mage*, *Spectral Scholar*, *Cursed Wanderer*), and detailed topic breakdown.

### 4. 🔮 Curse Analytics & Weak-Topic Tracking
* **Live Status Categorization:**
  * 💀 **Cursed Topics:** Accuracy $< 50\%$
  * 👻 **Haunted Topics:** Accuracy between $50\% - 79\%$
  * ✨ **Purified Topics:** Accuracy $\ge 80\%$
* **Grave Exam Readiness Score:** Weighted mathematical metric calculating overall syllabus preparedness.
* **Targeted Spellcraft:** One-click button to launch a focused review deck containing *only* cursed topics.

### 5. 🛠️ Study Utilities
* **Deck Exporter:** Export study decks in **Markdown**, **JSON**, or **Anki Flashcard (.txt)** format.
* **Interactive Shortcuts Codex (`?`):** Popover cheatsheet detailing all keyboard triggers.

---

## ⌨️ Arcane Keyboard Shortcuts

| Shortcut | Action | Sanctum Mode |
|---|---|---|
| <kbd>Space</kbd> | Flip Flashcard / Submit Answer | Flashcards / Quiz |
| <kbd>←</kbd> / <kbd>→</kbd> | Previous / Next Flashcard | Flashcards |
| <kbd>1</kbd> | Mark as "Still Cursed" (or Select Option A) | Flashcards / Quiz |
| <kbd>2</kbd> | Mark as "Purified" (or Select Option B) | Flashcards / Quiz |
| <kbd>3</kbd> / <kbd>4</kbd> | Select Quiz Option C / D | Quiz |
| <kbd>Enter</kbd> | Cast Answer / Advance to next question | Quiz |
| <kbd>?</kbd> | Toggle Keyboard Shortcuts Codex | Global |
| <kbd>Esc</kbd> | Close dialogs / Dismiss modals | Global |

---

## 📁 Repository Structure

```
kiroween-study-app/
├── frontend/                     # 🔮 The Haunted Web Sanctum (Vite + React + TS)
│   ├── index.html                # App shell with Cinzel & Inter typography
│   ├── package.json              # Frontend dependencies and build scripts
│   ├── tailwind.config.js        # Halloween & gothic design system tokens
│   ├── vite.config.ts            # Vite bundler configuration
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # App state & view orchestrator
│       ├── types.ts              # TypeScript interfaces (StudyItem, DocInfo, etc.)
│       ├── index.css             # Tailwind, 3D card transforms & glass styles
│       ├── components/
│       │   ├── BackgroundCanvas.tsx # 60fps dynamic spectral particle canvas
│       │   ├── Navbar.tsx        # Atmospheric header, audio & status controls
│       │   ├── UploadSanctum.tsx # PDF / text uploader & pre-bound courses
│       │   ├── FlashcardSanctum.tsx # 3D flip card study chamber
│       │   ├── QuizSanctum.tsx   # Adaptive MCQ trial engine
│       │   ├── TopicAnalytics.tsx# Cursed vs Purified topic dashboard
│       │   ├── KeyboardHelpModal.tsx # Shortcuts cheatsheet modal
│       │   └── ExportModal.tsx   # Markdown / JSON / Anki exporter
│       ├── services/
│       │   └── api.ts            # API client with fallback offline engine
│       ├── data/
│       │   └── sampleNotes.ts    # Curated syllabus manuscripts & trials
│       └── utils/
│           └── soundEffects.ts   # Web Audio API pure synthesizer
├── backend/                      # 🐍 API and LLM question generation (FastAPI)
├── ml/                           # 🧠 PDF extraction and adaptive ML logic
├── .kiro/                        # ⚡ Kiro specs, steering and hooks
└── README.md                     # 📖 Project Documentation
```

---

## 🧠 Dual-Mode AI Architecture: Live Backend vs. Arcane Offline Engine

To facilitate independent frontend and backend development—and to ensure the application is immediately testable and gradeable for the hackathon without requiring an active backend or paid LLM API keys—Grimoire AI incorporates an intelligent **Dual-Mode Architecture**:

```
                       ┌───────────────────────────────┐
                       │   Grimoire AI (Frontend App)  │
                       └───────────────┬───────────────┘
                                       │
                         Auto-checks /health (Port 8000)
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
         [If Backend is Available]            [If Backend is Offline]
         🟢 Live LLM Backend Mode             🟣 Arcane Offline Engine
         • Real FastAPI endpoint calls        • In-browser heuristic question synthesizer
         • Python / ML PDF text extraction    • 3 rich pre-bound academic course Grimoires
         • Remote LLM question generation     • Client-side adaptive weighting in localStorage
         • Server-side mastery persistence    • Zero setup or external API keys needed
```

### 1. How the App Responds Without a Live Backend:
* **Auto-Discovery:** When loaded, the frontend pings `http://localhost:8000/health`. If unreachable, the header badge displays `Arcane Engine` (otherwise `API Live`).
* **Pre-Bound Grimoires:** Features 3 fully-developed academic syllabi (*CS 666 Distributed Systems*, *BIO 404 Vampiric Neurobiology*, *ALGO 301 Spectral Labyrinth*) containing realistic multiple-choice questions, detailed explanations, and topic metadata.
* **Client-Side Question Synthesizer:** When custom lecture notes or text files are uploaded/pasted, the client-side parser extracts key concepts, formulates question prompts, and generates plausible multiple-choice options with explanatory rationale.
* **Client-Side Adaptive Difficulty Algorithm:** Tracks answer accuracy per topic in `localStorage`. Weak topics (<50% accuracy) are tagged as `Cursed` and dynamically sorted to appear first in subsequent quiz trials.

### 2. Seamless Backend Integration:
As soon as the backend team launches the FastAPI server on port 8000 implementing `/upload`, `/generate`, and `/answer`, Grimoire AI will automatically detect it and seamlessly switch to streaming responses from the real LLM models—requiring **zero frontend code adjustments**.

---

## 🔌 API Specification

Grimoire AI communicates with the backend via RESTful endpoints. When the backend is offline, the frontend seamlessly engages its **Arcane Offline Engine** with local intelligent generation and localStorage persistence.

### 1. `POST /upload`
Uploads a lecture PDF or manuscript.
* **Request:** Multipart `file` (PDF/TXT/MD).
* **Response:**
  ```json
  {
    "docId": "doc-1732357200"
  }
  ```

### 2. `POST /generate`
Generates flashcards or multiple-choice questions for the document.
* **Request:**
  ```json
  {
    "docId": "doc-1732357200",
    "mode": "quiz"
  }
  ```
* **Response:**
  ```json
  [
    {
      "topic": "Raft Consensus",
      "question": "What happens when a follower stops hearing heartbeats from the reigning leader?",
      "options": [
        "It converts to Candidate state, increments its term, and solicits votes.",
        "It immediately shuts down to prevent split-brain anomalies.",
        "It commits all uncommitted log entries locally.",
        "It forwards client requests to the backup leader."
      ],
      "answer": "It converts to Candidate state, increments its term, and solicits votes.",
      "explanation": "When election timeout elapses, a follower suspects leader failure, increments the term, and starts election."
    }
  ]
  ```

### 3. `POST /answer`
Records a student's answer and updates weak-topic tracking.
* **Request:**
  ```json
  {
    "docId": "doc-1732357200",
    "topic": "Raft Consensus",
    "correct": false
  }
  ```
* **Response:**
  ```json
  {
    "topic": "Raft Consensus",
    "attempts": 4,
    "correct": 1,
    "wrong": 3,
    "accuracy": 25,
    "status": "cursed"
  }
  ```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **npm:** v9.0.0 or higher

### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
5. To produce an optimized production build:
   ```bash
   npm run build
   ```

---

## 👥 Team Workflow

1. **Never push directly to `main`**.
2. Create your own feature branch (e.g., `frontend-upload`, `frontend-quiz`, `backend-api`).
3. Commit small and often with descriptive messages.
4. Open a Pull Request for review. The repository owner (**Nandini**) reviews and merges.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Built with 🧡 for the **Kiroween 2026 Hackathon**.
