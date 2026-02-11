# AI Insurance Agent

A full-stack AI-powered insurance advisor with a ChatGPT-like interface. Ask questions about insurance and get expert answers powered by Google Gemini.

## Features

- ChatGPT-style chat interface
- Insurance-focused AI responses
- Suggested questions for quick start
- Persistent Q&A history
- Loading states and error handling
- Dark theme UI

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Google Gemini API
- **Storage:** JSON file

## Setup

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Configure Environment

```bash
cd server
cp ../.env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Open the App

Visit http://localhost:5173 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Send a question, receive AI answer |
| GET | /api/history | Get all previous Q&A |

## Project Structure

```
ai-insurance-agent/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SuggestedQuestions.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ChatHistory.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── data/
│   │   └── history.json
│   ├── routes/
│   │   └── chat.js
│   ├── services/
│   │   └── gemini.js
│   ├── index.js
│   └── package.json
├── .env.example
└── README.md
```
