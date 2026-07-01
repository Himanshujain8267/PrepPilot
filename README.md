# PrepPilot

PrepPilot is an AI-powered interview practice platform with a React + Vite frontend and an Express + MongoDB backend. It enables users to sign in with Google, upload a resume for AI analysis, generate role-based interview questions, practice answers with a voice-enabled interviewer, and receive scored feedback plus downloadable PDF reports.

## Key Features

- Google authentication with secure HTTP-only cookies
- Resume upload and AI-powered resume extraction
- Role, experience, and interview mode selection (Technical / HR)
- AI-generated interview questions with difficulty progression
- Voice-enabled interview flow using browser speech synthesis and recognition
- Answer submission with AI evaluation and feedback
- Interview history tracking and report generation
- Downloadable PDF performance reports
- Redux state management for current user data

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Redux Toolkit
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: Google OAuth + JWT stored in cookies
- AI Services: OpenRouter API (`openai/gpt-4o-mini`)
- Resume analysis: `pdfjs-dist`
- PDF report generation: `jspdf`, `jspdf-autotable`

## Repository Structure

```
client/
  package.json
  public/
  src/
    App.jsx
    main.jsx
    pages/
    components/
    redux/
    utils/firebase.js
server/
  package.json
  index.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd PrepPilot
```

### 2. Environment Variables

Create separate `.env` files for the client and server as needed.

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

> Note: `client/src/utils/firebase.js` currently loads only the Firebase API key from environment variables. If you add additional Firebase configuration values, also set them in the Vite env file.

### 3. Install dependencies

From the project root, install dependencies separately for both client and server.

```bash
cd client
npm install

cd ../server
npm install
```

### 4. Run the app locally

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd ../client
npm run dev
```

Open the client in your browser using the Vite development URL (usually `http://localhost:5173`). The server runs on `http://localhost:8000`.

## Client Notes

- Frontend entry: `client/src/main.jsx`
- App routes defined in `client/src/App.jsx`
- Authentication handled in `client/src/pages/Auth.jsx`
- Resume upload and interview generation are implemented in `client/src/components/Step1SetUp.jsx`
- Live interview flow and speech support are in `client/src/components/Step2Interview.jsx`
- Report generation and PDF download are in `client/src/components/Step3Report.jsx`
- Interview history list is shown in `client/src/pages/InterviewHistory.jsx`
- Redux state is configured in `client/src/redux/store.js` with `client/src/redux/userSlice.js`
- Firebase Google sign-in config lives in `client/src/utils/firebase.js`

## Server Notes

- Server entry: `server/index.js`
- MongoDB connection in `server/config/connectDb.js`
- JWT token generation in `server/config/token.js`
- Auth routes in `server/routes/auth.routes.js`
- User and interview routes in `server/routes/user.route.js` and `server/routes/interview.route.js`
- Middleware `server/middlewares/isAuth.js` protects authenticated routes using cookie JWT verification
- Resume parsing and AI interaction are implemented in `server/controllers/interview.controller.js`
- `server/services/openRouter.service.js` sends prompts to OpenRouter AI

## API Endpoints

### Authentication

- `POST /api/auth/google` — create or authenticate a Google user and set the JWT cookie
- `GET /api/auth/logout` — clear the JWT cookie and log out

### User

- `GET /api/user/current-user` — return the logged-in user details

### Interview

- `POST /api/interview/resume` — upload a PDF resume and extract structured data
- `POST /api/interview/generate-questions` — generate AI interview questions and create a new interview session
- `POST /api/interview/submit-answer` — submit an answer for the current question and receive AI feedback
- `POST /api/interview/finish` — finish the interview and calculate final scores
- `GET /api/interview/get-interview` — fetch the current user’s interview history
- `GET /api/interview/report/:id` — fetch the report for a specific interview

## Important Implementation Details

- The backend uses `openrouter.ai` for AI prompt completion.
- Resume analysis extracts text from PDF pages via `pdfjs-dist` and sends a structured extraction prompt.
- Interview questions are generated in a strict 5-question format with progressive difficulty.
- Answer feedback includes AI scores for confidence, communication, correctness, and a final average score.
- Interview reports can be downloaded as PDF through the frontend.

## Recommended Improvements

- Enable secure cookies (`secure: true`) and HTTPS in production
- Add stronger error handling and form validation on the frontend
- Add `.env.example` files for client and server
- Add a production deployment guide and build commands
- Add tests for backend routes and frontend components

## License

This project currently has no license configured. Add a `LICENSE` file if you want to make the project open source.
