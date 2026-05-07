# DevBrief AI

> An intelligent developer tool powered by Gemini 2.0 Flash to instantly analyze codebases, generate PR summaries, and flag issues.

## 🚀 Overview

DevBrief AI allows developers to paste GitHub repository URLs or raw code snippets and query the codebase using natural language. The application streams responses from Gemini 2.0 Flash and saves all session histories securely per-user in Cloud Firestore.

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Authentication:** Firebase Auth (Google Sign-In)
- **Database:** Cloud Firestore
- **AI Engine:** Google Gemini 2.0 Flash
- **Analytics:** Google Analytics 4
- **Testing:** Vitest, Playwright

## ⚡ Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your Firebase/Gemini keys
4. Start development server: `npm run dev`

## 🛡️ Security

We implement strict security practices:
- Strict Content Security Policies (CSP) via Firebase Hosting
- Default deny-all Firestore rules with authenticated owner validations
- DOMPurify sanitization for all markdown rendered from AI responses

## 🧪 Testing

Run unit tests with coverage:
```bash
npm run test:coverage
```
