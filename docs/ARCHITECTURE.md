# DevBrief AI Architecture

This document outlines the high-level architecture of DevBrief AI.

## System Overview

```mermaid
graph TD
    User([User]) --> AuthGuard[AuthGuard]
    AuthGuard --> |Unauthenticated| LandingPage[Landing Page]
    AuthGuard --> |Authenticated| App[Main App]
    
    App --> Sidebar[Sidebar Session History]
    App --> ChatArea[Chat Interface]
    
    ChatArea --> ContextInput[Code Context Input]
    ChatArea --> MessageList[Message List]
    
    MessageList --> StreamingText[Streaming Text Component]
    
    %% Services
    ChatArea --> GeminiService[Gemini Service]
    App --> DbService[Firestore DB Service]
    AuthGuard --> AuthService[Firebase Auth Service]
    
    %% External
    GeminiService -.-> |API Call| Gemini[Google Gemini 2.0]
    DbService -.-> |Read/Write| Firestore[(Cloud Firestore)]
    AuthService -.-> |Google Sign-In| FirebaseAuth[Firebase Auth]
```

## Component Table

| Component | Responsibility |
| :--- | :--- |
| `AuthGuard` | Wraps authenticated routes; redirects unauthenticated users to `/`. |
| `ChatInterface` | Manages the active session state, input parsing, and orchestrates Gemini API calls. |
| `Sidebar` | Displays previous sessions fetched via `dbService`. |
| `StreamingText` | Pure presentational component that sanitizes markdown and applies syntax highlighting as text streams in. |
| `Button`, `Input` | Reusable, accessible UI primitives. |

## Core Services
All services strictly return `ApiResponse<T>` to enforce consistent error handling and type narrowing at boundaries.
- `authService.ts`
- `dbService.ts`
- `geminiService.ts`
- `analyticsService.ts`
