# Kiroween Study App

A study app that turns lecture PDFs into flashcards and exam-style quizzes. It tracks which topics a student gets wrong and asks more questions on those weak topics. Built for Kiroween 2026 with Kiro.

## Features
- Upload a lecture PDF
- Generate flashcards or an MCQ quiz with short explanations
- Adaptive difficulty: weak topics appear more often

## Folder structure
- `frontend/` web pages: upload, flashcards, quiz
- `backend/` API and LLM question generation
- `ml/` PDF text extraction and adaptive logic
- `.kiro/` Kiro specs, steering and hooks (do not delete or gitignore)

## API (draft)
- `POST /upload`: takes a PDF, returns `{ "docId": "..." }`
- `POST /generate`: takes `{ "docId": "...", "mode": "quiz" | "flashcards" }`, returns a list of items:
  `{ "topic": "...", "question": "...", "options": ["..."], "answer": "...", "explanation": "..." }`
- `POST /answer`: takes `{ "docId": "...", "topic": "...", "correct": true | false }`, updates weak-topic tracking

Until the backend is ready, the frontend can use a fake JSON response in this format.

## Team workflow
1. Never push directly to `main`.
2. Create your own branch, for example `frontend-upload` or `backend-api`.
3. Commit small and often, with clear messages.
4. Open a pull request. The repo owner (Nandini) reviews and merges.

## Setup
Setup steps for each folder will be added here as we build.

## License
MIT
