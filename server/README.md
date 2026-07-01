# Authentication API Documentation

## Overview
This document describes the authentication routes for the PrepPilot application. The API uses Google OAuth-based authentication with JWT tokens stored in secure HTTP-only cookies for session management.

---

## Base URL
```
http://localhost:8000/api/auth
```

---

## Authentication Flow

### How It Works:
1. **User logs in with Google** → Google credentials sent to backend
2. **User lookup/creation** → Check if user exists, if not create new user
3. **JWT token generated** → Token created based on user ID with 7-day expiration
4. **Token stored in cookie** → Secure HTTP-only cookie set in browser
5. **User data returned** → Client receives user information
6. **Automatic authentication** → Cookie automatically sent with subsequent requests

### Cookie Security Options:
- **httpOnly**: `true` - Prevents XSS attacks by blocking JavaScript access
- **secure**: `false` - For localhost development (should be `true` in production with HTTPS)
- **sameSite**: `strict` - Prevents CSRF attacks
- **maxAge**: 7 days - Cookie automatically expires after 7 days

---

## Endpoints

### 1. Google Authentication
**POST** `/google`

#### Description
Authenticates user via Google OAuth. Creates new user if they don't exist in the database.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | Yes | User's full name from Google account |
| `email` | String | Yes | User's email from Google account |

#### Response - Success (200)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-06-18T10:30:00.000Z",
  "updatedAt": "2024-06-18T10:30:00.000Z"
}
```

**Cookie Set:**
```
Set-Cookie: token=<JWT_TOKEN>; HttpOnly; SameSite=Strict; Max-Age=604800
```

#### Response - Error (500)
```json
{
  "message": "Google auth error [error details]"
}
```

#### Example cURL
```bash
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important: Include cookies
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com'
  })
});

const user = await response.json();
console.log(user);
```

---

### 2. Logout
**GET** `/logout`

#### Description
Logs out the user by clearing the authentication cookie. The token is added to a blacklist to prevent reuse.

#### Request Headers
```
Cookie: token=<JWT_TOKEN>
```

#### Request Parameters
None

#### Response - Success (200)
```json
{
  "message": "LogOut Successfully"
}
```

#### Response - Error (500)
```json
{
  "message": "Logout error [error details]"
}
```

#### Example cURL
```bash
curl -X GET http://localhost:8000/api/auth/logout \
  -H "Cookie: token=<JWT_TOKEN>"
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/auth/logout', {
  method: 'GET',
  credentials: 'include' // Important: Include cookies
});

const result = await response.json();
console.log(result);
```

---

## Token & Cookie Information

### JWT Token
- **Type**: JSON Web Token (JWT)
- **Payload**: User ID (`userId`)
- **Expiration**: 7 days
- **Storage**: HTTP-only cookie (automatic with requests)
- **Secret**: Stored in `process.env.JWT_SECRET`

### Token Structure
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MTg2NzQ2MDAsImV4cCI6MTcxOTI3OTQwMH0.
signature
```

---

## Security Features

### 1. Token Blacklisting
When a user logs out, their token is added to a blacklist:
- Prevents token reuse after logout
- Old tokens cannot authenticate new requests
- **Note**: In production, use Redis or Database for persistence across server restarts

### 2. Cookie Security
- **httpOnly**: Prevents malicious JavaScript from accessing the token
- **sameSite=strict**: Only sends cookie to your domain, preventing CSRF attacks
- **secure flag**: Should be `true` in production (currently `false` for localhost HTTP)

### 3. Authentication Middleware
Protected routes use `isAuth` middleware which:
- Checks if token exists in cookies
- Verifies token is not blacklisted
- Validates token signature using JWT_SECRET
- Extracts user ID for subsequent operations

---

## Environment Variables

Required environment variables:
```
JWT_SECRET=your_secret_key_here
MONGODB_URI=your_mongodb_connection_string
```

---

## Error Handling

### Common Errors

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Google auth error | 500 | Server error during authentication | Check server logs, verify DB connection |
| Logout error | 500 | Server error during logout | Check server logs |
| Token revoked | 401 | Token is blacklisted (already logged out) | User needs to login again |
| Invalid token | 400 | Token signature invalid or expired | User needs to login again |
| No token | 400 | User doesn't have a token (not logged in) | User needs to login |

---

## Usage Example - Complete Flow

### 1. Login (Google Auth)
```javascript
// Step 1: Send user data from Google to backend
const loginResponse = await fetch('http://localhost:8000/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});

const user = await loginResponse.json();
console.log('User logged in:', user);
// Token automatically stored in cookie
```

### 2. Access Protected Route
```javascript
// Step 2: Access protected route (token sent automatically in cookie)
const protectedResponse = await fetch('http://localhost:8000/api/user/current-user', {
  method: 'GET',
  credentials: 'include' // Include cookies
});

const currentUser = await protectedResponse.json();
console.log('Current user:', currentUser);
```

### 3. Logout
```javascript
// Step 3: Logout
const logoutResponse = await fetch('http://localhost:8000/api/auth/logout', {
  method: 'GET',
  credentials: 'include'
});

const result = await logoutResponse.json();
console.log(result.message); // "LogOut Successfully"
// Token removed from cookies and blacklisted
```

---

## Production Checklist

- [ ] Set `secure: true` in cookie options (requires HTTPS)
- [ ] Use environment-specific JWT_SECRET
- [ ] Implement Redis for token blacklist persistence
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Add CORS configuration for frontend domain
- [ ] Enable HTTPS/SSL
- [ ] Implement refresh token mechanism for better security
- [ ] Add logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)

---

## Testing

### Test with Postman or Insomnia

**1. Post Google Auth Request**
```
POST http://localhost:8000/api/auth/google
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com"
}
```

**2. Get Logout Request**
```
GET http://localhost:8000/api/auth/logout
```

---

## Troubleshooting

### Token Not Being Sent
- Ensure `credentials: 'include'` is set in fetch requests
- Check browser cookie settings in DevTools (Application > Cookies)

### CORS Issues
- Configure CORS middleware in main server file
- Ensure frontend domain is whitelisted

### Token Expired
- Token expires after 7 days
- User must login again to get a new token
- Consider implementing refresh tokens

### Database Connection Errors
- Verify MongoDB connection string in `.env`
- Check database is running and accessible

---

## Related Routes
- `GET /api/user/current-user` - Get current authenticated user (requires token)
- `POST /api/auth/google` - Google authentication
- `GET /api/auth/logout` - Logout and blacklist token

---

## Support
For issues or questions, please contact the development team or check the server logs for detailed error messages.

---

# User API Documentation

## Overview
The User API provides endpoints to retrieve current user information and manage user profiles.

## Base URL
```
http://localhost:8000/api/user
```

---

## Endpoints

### 1. Get Current User
**GET** `/current-user`

#### Description
Retrieves the profile information of the currently authenticated user.

#### Authentication
**Required**: `isAuth` middleware - Token must be present in cookies

#### Request Headers
```
Cookie: token=<JWT_TOKEN>
```

#### Response - Success (200)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "credits": 500,
  "createdAt": "2024-06-18T10:30:00.000Z",
  "updatedAt": "2024-06-18T10:30:00.000Z"
}
```

#### Response - Error (404)
```json
{
  "message": "user does not found"
}
```

#### Response - Error (500)
```json
{
  "message": "failed to get currentUser [error details]"
}
```

#### Example cURL
```bash
curl -X GET http://localhost:8000/api/user/current-user \
  -H "Cookie: token=<JWT_TOKEN>"
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/user/current-user', {
  method: 'GET',
  credentials: 'include' // Include cookies with token
});

if (response.ok) {
  const user = await response.json();
  console.log('Current user:', user);
  console.log('Credits available:', user.credits);
} else {
  console.error('Failed to fetch user');
}
```

---

# Interview API Documentation

## Overview
The Interview API handles AI-powered interview generation, resume analysis, question generation, answer evaluation, and report generation. The system uses AI to evaluate candidate responses and provide detailed feedback.

## Base URL
```
http://localhost:8000/api/interview
```

---

## Key Concepts

### Credits System
- Each interview question generation costs **50 credits**
- Users must have minimum 50 credits to start an interview
- Credits are deducted when questions are generated

### Scoring System
Each answer is scored on three metrics (0-10):
1. **Confidence** - Clarity and confidence in delivery
2. **Communication** - Language clarity and structure
3. **Correctness** - Accuracy and relevance of content

**Final Score** = Average of the three metrics

### Interview Status
- `pending` - Interview created, questions generated
- `in_progress` - Interview is being conducted
- `completed` - All answers submitted and scored

---

## Endpoints

### 1. Analyze Resume
**POST** `/analyze-resume`

#### Description
Uploads and analyzes a PDF resume to extract role, experience, projects, and skills.

#### Authentication
**Optional** - Works with or without authentication

#### Request Headers
```
Content-Type: multipart/form-data
```

#### Request Body (Form-Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File (PDF) | Yes | Resume PDF file |

#### Response - Success (200)
```json
{
  "role": "Frontend Developer",
  "experience": "3-5 years",
  "projects": ["Project 1", "Project 2", "Project 3"],
  "skills": ["React", "JavaScript", "Node.js", "CSS"],
  "resumeText": "[extracted text from PDF]"
}
```

#### Response - Error (400)
```json
{
  "message": "Resume required"
}
```

#### Response - Error (500)
```json
{
  "message": "[error details]"
}
```

#### Example JavaScript (Fetch)
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]); // PDF file from input

const response = await fetch('http://localhost:8000/api/interview/analyze-resume', {
  method: 'POST',
  body: formData
  // Don't set Content-Type header, browser will set it automatically
});

if (response.ok) {
  const data = await response.json();
  console.log('Role:', data.role);
  console.log('Experience:', data.experience);
  console.log('Skills:', data.skills);
  console.log('Projects:', data.projects);
}
```

---

### 2. Generate Interview Questions
**POST** `/generate-question`

#### Description
Generates 5 interview questions based on role, experience, and skills. Deducts 50 credits from user account.

#### Authentication
**Required**: `isAuth` middleware - User must be logged in

#### Request Headers
```
Content-Type: application/json
Cookie: token=<JWT_TOKEN>
```

#### Request Body
```json
{
  "role": "Frontend Developer",
  "experience": "3-5 years",
  "mode": "technical",
  "projects": ["React App", "E-commerce Platform"],
  "skills": ["React", "JavaScript", "CSS"],
  "resumeText": "[text extracted from resume analysis or manual entry]"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role` | String | Yes | Job role/position being interviewed for |
| `experience` | String | Yes | Years of experience (e.g., "1-3", "3-5", "5+") |
| `mode` | String | Yes | Interview mode: `technical`, `behavioral`, or `mixed` |
| `projects` | Array | No | List of candidate's projects |
| `skills` | Array | No | List of candidate's technical skills |
| `resumeText` | String | No | Text content from resume |

#### Response - Success (200)
```json
{
  "interviewId": "507f1f77bcf86cd799439011",
  "creditsLeft": 450,
  "userName": "John Doe",
  "questions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "question": "Tell us about your experience with React and how you've used it in your projects?",
      "difficulty": "easy",
      "timeLimit": 75,
      "answer": "",
      "score": 0,
      "feedback": ""
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "question": "What challenges did you face in your most recent project?",
      "difficulty": "easy",
      "timeLimit": 75,
      "answer": "",
      "score": 0,
      "feedback": ""
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "question": "How do you handle state management in complex React applications?",
      "difficulty": "medium",
      "timeLimit": 90,
      "answer": "",
      "score": 0,
      "feedback": ""
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "question": "Describe your approach to optimizing component performance?",
      "difficulty": "medium",
      "timeLimit": 90,
      "answer": "",
      "score": 0,
      "feedback": ""
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "question": "What emerging technologies are you currently learning and why?",
      "difficulty": "hard",
      "timeLimit": 120,
      "answer": "",
      "score": 0,
      "feedback": ""
    }
  ]
}
```

#### Response - Error (400)
```json
{
  "message": "Role, Experience and Mode are required."
}
```

#### Response - Error (400 - Insufficient Credits)
```json
{
  "message": "Not enough credits. Minimum 50 required."
}
```

#### Response - Error (500)
```json
{
  "message": "failed to create interview [error details]"
}
```

#### Time Limits by Difficulty
| Difficulty | Time Limit (seconds) |
|------------|-----|
| easy | 75 |
| medium | 90 |
| hard | 120 |

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/interview/generate-question', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    role: 'Frontend Developer',
    experience: '3-5 years',
    mode: 'technical',
    projects: ['React App', 'E-commerce'],
    skills: ['React', 'JavaScript', 'CSS'],
    resumeText: 'Extracted resume text here...'
  })
});

if (response.ok) {
  const data = await response.json();
  console.log('Interview ID:', data.interviewId);
  console.log('Questions:', data.questions);
  console.log('Credits left:', data.creditsLeft);
  
  // Start timer based on question.timeLimit
  // Display questions to user
}
```

---

### 3. Submit Answer
**POST** `/submit-answer`

#### Description
Submits an answer to a specific question and receives AI-generated feedback.

#### Authentication
**Required**: `isAuth` middleware

#### Request Headers
```
Content-Type: application/json
Cookie: token=<JWT_TOKEN>
```

#### Request Body
```json
{
  "interviewId": "507f1f77bcf86cd799439011",
  "questionIndex": 0,
  "answer": "I have extensive experience with React...",
  "timeTaken": 65
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `interviewId` | String | Yes | ID from generate-question response |
| `questionIndex` | Number | Yes | Index of question (0-4) |
| `answer` | String | Yes | Candidate's answer text |
| `timeTaken` | Number | Yes | Time taken to answer in seconds |

#### Response - Success (200)
```json
{
  "feedback": "Good response with clear examples. Consider elaborating on real-world applications."
}
```

#### Response - No Answer (200)
```json
{
  "feedback": "You did not submit an answer."
}
```

#### Response - Time Exceeded (200)
```json
{
  "feedback": "Time limit exceeded. Answer not evaluated."
}
```

#### Response - Error (500)
```json
{
  "message": "failed to submit answer [error details]"
}
```

#### Scoring Breakdown (Stored in Interview)
```json
{
  "confidence": 8,
  "communication": 7,
  "correctness": 8,
  "finalScore": 7.67,
  "feedback": "Your response demonstrates good understanding..."
}
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/interview/submit-answer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    interviewId: interviewId,
    questionIndex: currentQuestionIndex,
    answer: userAnswer,
    timeTaken: elapsedSeconds
  })
});

if (response.ok) {
  const data = await response.json();
  console.log('Feedback:', data.feedback);
  // Move to next question
}
```

---

### 4. Finish Interview
**POST** `/finish`

#### Description
Marks interview as completed and generates final report with overall scores and question-wise performance.

#### Authentication
**Required**: `isAuth` middleware

#### Request Headers
```
Content-Type: application/json
Cookie: token=<JWT_TOKEN>
```

#### Request Body
```json
{
  "interviewId": "507f1f77bcf86cd799439011"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `interviewId` | String | Yes | ID from generate-question response |

#### Response - Success (200)
```json
{
  "finalScore": 7.5,
  "confidence": 7.8,
  "communication": 7.4,
  "correctness": 7.3,
  "questionWiseScore": [
    {
      "question": "Tell us about your experience with React...",
      "score": 8,
      "feedback": "Excellent answer with specific examples.",
      "confidence": 8,
      "communication": 8,
      "correctness": 8
    },
    {
      "question": "What challenges did you face...",
      "score": 7,
      "feedback": "Good response but could be more detailed.",
      "confidence": 7,
      "communication": 6,
      "correctness": 8
    }
    // ... more questions
  ]
}
```

#### Response - Error (400)
```json
{
  "message": "failed to find Interview"
}
```

#### Response - Error (500)
```json
{
  "message": "failed to finish Interview [error details]"
}
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/interview/finish', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    interviewId: interviewId
  })
});

if (response.ok) {
  const report = await response.json();
  console.log('Final Score:', report.finalScore);
  console.log('Overall Performance:');
  console.log('- Confidence:', report.confidence);
  console.log('- Communication:', report.communication);
  console.log('- Correctness:', report.correctness);
  // Display detailed report to user
}
```

---

### 5. Get My Interviews
**GET** `/my-interviews`

#### Description
Retrieves list of all interviews conducted by the current user, sorted by most recent first.

#### Authentication
**Required**: `isAuth` middleware

#### Request Headers
```
Cookie: token=<JWT_TOKEN>
```

#### Query Parameters
None

#### Response - Success (200)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "role": "Frontend Developer",
    "experience": "3-5 years",
    "mode": "technical",
    "finalScore": 7.5,
    "status": "completed",
    "createdAt": "2024-06-18T14:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "role": "Backend Developer",
    "experience": "5+ years",
    "mode": "mixed",
    "finalScore": 8.2,
    "status": "completed",
    "createdAt": "2024-06-17T10:15:00.000Z"
  }
]
```

#### Response - Empty List (200)
```json
[]
```

#### Response - Error (500)
```json
{
  "message": "failed to find currentUser Interview [error details]"
}
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/interview/my-interviews', {
  method: 'GET',
  credentials: 'include'
});

if (response.ok) {
  const interviews = await response.json();
  console.log(`You have ${interviews.length} interviews`);
  
  interviews.forEach(interview => {
    console.log(`${interview.role} - Score: ${interview.finalScore} - ${interview.status}`);
  });
}
```

---

### 6. Get Interview Report
**GET** `/report/:id`

#### Description
Retrieves detailed report for a specific completed interview with question-wise analysis.

#### Authentication
**Required**: `isAuth` middleware

#### Request Headers
```
Cookie: token=<JWT_TOKEN>
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Interview ID |

#### Response - Success (200)
```json
{
  "finalScore": 7.5,
  "confidence": 7.8,
  "communication": 7.4,
  "correctness": 7.3,
  "questionWiseScore": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "question": "Tell us about your experience with React...",
      "answer": "I have 3 years of experience with React...",
      "difficulty": "easy",
      "timeLimit": 75,
      "score": 8,
      "feedback": "Excellent answer with specific examples.",
      "confidence": 8,
      "communication": 8,
      "correctness": 8
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "question": "What challenges did you face...",
      "answer": "One significant challenge was handling complex state...",
      "difficulty": "easy",
      "timeLimit": 75,
      "score": 7,
      "feedback": "Good response but could be more detailed.",
      "confidence": 7,
      "communication": 6,
      "correctness": 8
    }
    // ... more questions
  ]
}
```

#### Response - Error (404)
```json
{
  "message": "Interview not found"
}
```

#### Response - Error (500)
```json
{
  "message": "failed to find currentUser Interview report [error details]"
}
```

#### Example JavaScript (Fetch)
```javascript
const interviewId = '507f1f77bcf86cd799439011';

const response = await fetch(`http://localhost:8000/api/interview/report/${interviewId}`, {
  method: 'GET',
  credentials: 'include'
});

if (response.ok) {
  const report = await response.json();
  console.log('Overall Score:', report.finalScore);
  
  report.questionWiseScore.forEach((q, index) => {
    console.log(`Q${index + 1}: ${q.question}`);
    console.log(`Score: ${q.score}/10 - ${q.feedback}`);
    console.log(`Breakdown: Confidence ${q.confidence} | Communication ${q.communication} | Correctness ${q.correctness}`);
  });
}
```

---

## Complete Interview Flow Example

```javascript
// Step 1: Analyze Resume
const resumeFile = document.getElementById('resumeInput').files[0];
const formData = new FormData();
formData.append('file', resumeFile);

const resumeResponse = await fetch('http://localhost:8000/api/interview/analyze-resume', {
  method: 'POST',
  body: formData
});
const resumeData = await resumeResponse.json();

// Step 2: Generate Questions
const questionsResponse = await fetch('http://localhost:8000/api/interview/generate-question', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    role: resumeData.role,
    experience: resumeData.experience,
    mode: 'technical',
    projects: resumeData.projects,
    skills: resumeData.skills,
    resumeText: resumeData.resumeText
  })
});
const interviewData = await questionsResponse.json();
const interviewId = interviewData.interviewId;

// Step 3: Display Questions and Collect Answers
for (let i = 0; i < interviewData.questions.length; i++) {
  const question = interviewData.questions[i];
  const answer = getUserAnswer(); // Get answer from user
  const timeTaken = getTimeTaken(); // Get time user spent
  
  const answerResponse = await fetch('http://localhost:8000/api/interview/submit-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      interviewId: interviewId,
      questionIndex: i,
      answer: answer,
      timeTaken: timeTaken
    })
  });
  const feedbackData = await answerResponse.json();
  console.log('Feedback:', feedbackData.feedback);
}

// Step 4: Finish Interview and Get Report
const finishResponse = await fetch('http://localhost:8000/api/interview/finish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    interviewId: interviewId
  })
});
const report = await finishResponse.json();

console.log('Final Report:');
console.log('Score:', report.finalScore);
console.log('Confidence:', report.confidence);
console.log('Communication:', report.communication);
console.log('Correctness:', report.correctness);
```

---

## Error Handling

### Common Interview Errors

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Resume required | 400 | No PDF file uploaded | Upload a valid PDF resume |
| Not enough credits | 400 | User has < 50 credits | User needs to purchase more credits |
| User not found | 404 | Authentication failed | User needs to login again |
| Interview not found | 404 | Invalid interview ID | Use valid interview ID from generation |
| AI returned empty response | 500 | AI service error | Retry or check AI service |
| Failed to create interview | 500 | Database error | Check server logs and DB connection |

---

## Interview Scoring Guide

### Score Interpretation

| Score | Rating | Interpretation |
|-------|--------|-----------------|
| 9-10 | Excellent | Outstanding answer, clear, detailed, well-structured |
| 7-8 | Good | Strong answer with good explanation, minor gaps |
| 5-6 | Average | Adequate answer but lacks detail or clarity |
| 3-4 | Below Average | Weak answer with significant gaps |
| 0-2 | Poor | No meaningful answer or completely incorrect |

### Individual Metrics

**Confidence (0-10)**
- How sure and assertive is the candidate?
- Does the answer sound well-prepared?

**Communication (0-10)**
- Is the language clear and easy to understand?
- Is the answer well-structured and logical?

**Correctness (0-10)**
- Is the answer accurate and relevant?
- Does it demonstrate real knowledge?

---

## Production Considerations

- [ ] Implement payment/credit system
- [ ] Add rate limiting to interview endpoints
- [ ] Cache AI responses to reduce costs
- [ ] Implement interview history pagination
- [ ] Add video recording for interviews (optional)
- [ ] Implement email notifications for interview completion
- [ ] Add export to PDF functionality
- [ ] Monitor AI API costs and usage
- [ ] Set up error tracking and alerts

---

## Related Routes
- `GET /api/user/current-user` - Get current authenticated user (requires token)
- `POST /api/auth/google` - Google authentication
- `GET /api/auth/logout` - Logout and blacklist token

---

## Support
For issues or questions, please contact the development team or check the server logs for detailed error messages.
