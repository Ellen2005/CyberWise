# CyberWise - Your Personal Cybersecurity Companion

CyberWise is a high-performance web application built to be your all-in-one guide to digital safety. It combines AI-powered tools, interactive simulators, and a rich library of educational content.

## 🚀 Technical Stack (The "Square 1" Explanation)

CyberWise is built on a modern, reactive stack designed for speed, security, and scalability:

*   **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router). Uses **Server Actions** instead of traditional REST API endpoints for secure, server-side logic.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for type-safe, robust code.
*   **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) for layout and [ShadCN UI](https://ui.shadcn.com/) for beautiful, accessible components.
*   **Backend as a Service**: [Firebase](https://firebase.google.com/).
    *   **Authentication**: Secure login via Google and Email/Password.
    *   **Firestore**: NoSQL Real-time database for user profiles and saved content.
*   **Generative AI**: [Google AI & Genkit](https://ai.google.dev/genkit).
    *   Utilizes **Gemini 2.5 Flash** for lightning-fast security analysis and content generation.

## 🧠 Application Architecture

### 1. Data Model (Firestore)
The database structure is defined in `docs/backend.json`:
*   `/users/{userId}`: Stores `UserProfile` (name, email, earned badges).
*   `/users/{userId}/savedArticles/{articleId}`: Stores a user's library of saved guides.

### 2. AI Flows (`src/ai/flows/`)
CyberWise doesn't just "chat"; it uses structured AI Flows:
*   **Troubleshooter**: Analyzes user-described problems and returns device-specific instructions.
*   **News Generator**: Aggregates and summarizes fictionalized current events in cybersecurity.
*   **Legit Scanner**: Dissects text/URLs to find phishing "red flags."

### 3. Interactive Learning
*   **Phishing Simulator**: A gamified engine (`src/lib/phishing-emails.ts`) that tests your ability to spot malicious communication.
*   **Security Score**: A client-side checklist (`src/components/security-score-checklist.tsx`) that calculates your personal safety rating.

## 🛠️ Deployment Instructions

### 1. Deploy to Vercel (Recommended)
1.  **Push your code to GitHub.**
2.  **Import to Vercel**: Connect your GitHub and select the repository.
3.  **Project Settings**:
    *   **Framework Preset**: Next.js (detected automatically).
    *   **Node.js Version**: 20.x or higher.
4.  **Environment Variables**: Add `GEMINI_API_KEY` with your Google AI API key.
5.  **Firebase Configuration**: 
    *   Go to [Firebase Console](https://console.firebase.google.com/) > Auth > Settings > Authorized Domains.
    *   Add your Vercel URL (e.g., `your-app.vercel.app`).

### 2. Deploy to Railway or Render
1.  Connect your GitHub to the platform.
2.  **Environment Variables**: Add `GEMINI_API_KEY`.
3.  **Build Command**: `npm run build`.
4.  **Start Command**: `npm start`.

## 💻 Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Up Environment Variables:**
    Create a `.env` file in the root and add:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) to view the app.

---
*Built with ❤️ for digital safety.*