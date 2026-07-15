# PrepPilot

PrepPilot is an AI-powered interview preparation platform built as a full-stack project. It includes a React + Vite frontend and an Express + MongoDB backend. Users sign in with Google, optionally upload a resume for AI analysis, generate interview questions tailored to their role and experience, answer those questions with voice-enabled interaction, and receive AI-scored feedback plus downloadable PDF reports.

## What this project does

- Authenticates users through Google sign-in on the frontend
- Stores session tokens in HTTP-only cookies for authenticated API access
- Extracts structured resume data from uploaded PDF files
- Generates 5 AI-driven interview questions with progressive difficulty
- Runs a timed, voice-enabled interview experience in the browser
- Evaluates candidate answers with AI scoring and human-like feedback
- Tracks past interviews and displays history
- Generates downloadable PDF interview reports

## Key Features

- Google sign-in using Firebase Authentication
- JWT-based session management via HTTP-only cookies
- Resume upload and AI resume parsing with `pdfjs-dist`
- Interview modes: `Technical` and `HR`
- AI question generation using OpenRouter (`openai/gpt-4o-mini`)
- Voice support via browser speech synthesis and WebKit speech recognition
- Answer submission with AI evaluation of confidence, communication, and correctness
- Interview history and report retrieval
- PDF report download using `jspdf` and `jspdf-autotable`

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Redux Toolkit
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: Firebase Google login + JWT cookies
- AI Service: OpenRouter API
- File Uploads: Multer
- Resume parsing: `pdfjs-dist`
- PDF export: `jspdf`, `jspdf-autotable`

## Repository Structure

```
client/
  package.json
  public/
  src/
    App.jsx
    main.jsx
    pages/
      Auth.jsx
      Home.jsx
      InterviewHistory.jsx
      InterviewPage.jsx
      InterviewReport.jsx
      Pricing.jsx
    components/
      AuthModel.jsx
      Footer.jsx
      Navbar.jsx
      Step1SetUp.jsx
      Step2Interview.jsx
      Step3Report.jsx
      Timer.jsx
    redux/
      store.js
      userSlice.js
    utils/
      firebase.js
server/
  package.json
  index.js
  config/
    connectDb.js
    token.js
  controllers/
    auth.controller.js
    interview.controller.js
    user.controller.js
  middlewares/
    isAuth.js
    multer.js
  models/
    interview.model.js
    user.model.js
  routes/
    auth.routes.js
    interview.route.js
    user.route.js
  services/
    openRouter.service.js
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd PrepPilot
```

### 2. Create environment variables

#### Server `.env`

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### Client `.env` (Vite)

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
```

> Note: `client/src/utils/firebase.js` currently hardcodes additional Firebase configuration values such as `authDomain`, `projectId`, and `appId`. Only `VITE_FIREBASE_APIKEY` is loaded from environment variables in the current implementation.

### 3. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 4. Run locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd ../client
npm run dev
```

Then open the Vite URL in your browser (usually `http://localhost:5173`). The backend server listens on `http://localhost:8000`.

## Client Application Overview

- `client/src/main.jsx` — application bootstrap and router/provider setup
- `client/src/App.jsx` — route definitions and current-user fetch
- `client/src/pages/Auth.jsx` — Google sign-in page and Firebase login flow
- `client/src/components/Step1SetUp.jsx` — interview setup, resume upload, and question generation
- `client/src/components/Step2Interview.jsx` — voice interview experience, speech synthesis, speech recognition, answer submission
- `client/src/components/Step3Report.jsx` — interview report display and PDF export
- `client/src/pages/InterviewHistory.jsx` — list of past interviews
- `client/src/redux/store.js` and `client/src/redux/userSlice.js` — Redux store for user data
- `client/src/utils/firebase.js` — Firebase config and Google provider setup

## Backend Application Overview

- `server/index.js` — Express app, middleware, CORS, route registration
- `server/config/connectDb.js` — MongoDB connection using `process.env.MONGODB_URL`
- `server/config/token.js` — JWT token generation using `process.env.JWT_SECRET`
- `server/middlewares/isAuth.js` — JWT cookie authentication middleware
- `server/middlewares/multer.js` — file upload handling and storage for resume PDFs
- `server/controllers/auth.controller.js` — Google auth persistence and logout
- `server/controllers/user.controller.js` — current user retrieval
- `server/controllers/interview.controller.js` — resume analysis, question generation, answer evaluation, interview finish, history, report
- `server/services/openRouter.service.js` — AI completion requests to OpenRouter

## API Endpoints

### Authentication

- `POST /api/auth/google`
  - Accepts `{ name, email }`
  - Creates or returns an existing user
  - Issues a JWT in an HTTP-only cookie
- `GET /api/auth/logout`
  - Clears the authentication cookie

### User

- `GET /api/user/current-user`
  - Protected by `isAuth`
  - Returns current user profile data

### Interview

- `POST /api/interview/resume`
  - Protected by `isAuth`
  - Uploads a PDF resume using `multipart/form-data`
  - Extracts resume text and returns structured fields: role, experience, projects, skills
- `POST /api/interview/generate-questions`
  - Protected by `isAuth`
  - Accepts interview metadata plus resume-derived data
  - Generates 5 AI interview questions and deducts credits
- `POST /api/interview/submit-answer`
  - Protected by `isAuth`
  - Accepts `{ interviewId, questionIndex, answer, timeTaken }`
  - Calls AI to score the answer and returns feedback
- `POST /api/interview/finish`
  - Protected by `isAuth`
  - Computes final score averages and marks interview complete
- `GET /api/interview/get-interview`
  - Protected by `isAuth`
  - Returns the current user’s interview history
- `GET /api/interview/report/:id`
  - Protected by `isAuth`
  - Returns detailed report data for a completed interview

## Important Implementation Details

- Resume analysis uses `pdfjs-dist` to parse PDF text and then calls OpenRouter AI to extract role, experience, projects, and skills.
- Interview questions are generated in a strict format with 5 questions, increasing difficulty from easy to hard.
- Answer evaluation prompts the AI to return JSON with confidence, communication, correctness, finalScore, and human feedback.
- Interview report generation on the frontend includes charts and PDF export with `jspdf`
- The client implements voice-enabled interaction via browser speech synthesis and `webkitSpeechRecognition`.
- Uploaded resumes are temporarily stored in `server/public` and removed after processing.

## Known Limitations and Notes

- Cookie `secure` is currently set to `false` for local development; enable `true` in production with HTTPS.
- Speech recognition is implemented only for browsers supporting `webkitSpeechRecognition`.
- No frontend validation or tests are currently provided beyond the existing UI checks.
- There is no license configured in this repository.

## Recommended Improvements

- Add `.env.example` files for both `client` and `server`
- Improve error handling and user feedback for API failures
- Add backend and frontend automated tests
- Use a persistent token blacklist or refresh-token mechanism for logout security
- Add deployment instructions for production hosting

## License

This project currently has no license configured. Add a `LICENSE` file to make the project open source.
