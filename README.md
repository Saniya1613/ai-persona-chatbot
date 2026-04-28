# Persona-Based AI Chatbot

A full-stack web application featuring three distinct AI personas (Anshuman Singh, Abhimanyu Saxena, Kshitij Mishra) built using React, Tailwind CSS, Express, and the Google Gemini API.

## Features

- **Multi-Persona Chat**: Switch seamlessly between three unique personas with distinct communication styles and areas of expertise.
- **System Prompt Engineering**: Advanced prompt design utilizing `<chain_of_thought>` reasoning for high-quality, persona-accurate responses.
- **Modern UI/UX**: Clean, responsive interface built with Tailwind CSS, featuring suggestion chips, typing indicators, and message history.
- **Scalable Architecture**: Decoupled React frontend and Node.js/Express backend.

## Project Structure

- `/client`: Vite + React frontend application.
- `/server`: Node.js + Express backend server.
- `/prompts` (in `/server/prompts.js`): System prompts powering the personas.
- `/docs`: Detailed documentation regarding prompt design and project reflection.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Google Gemini API Key

### Backend Setup
1. Navigate to the server directory: \`cd server\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file based on \`.env.example\` and add your Gemini API Key:
   \`\`\`env
   GEMINI_API_KEY=your_actual_key_here
   PORT=5001
   \`\`\`
4. Start the development server: \`npm run dev\` (Runs on http://localhost:5001)

### Frontend Setup
1. Open a new terminal and navigate to the client directory: \`cd client\`
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`
4. Open your browser to the local URL provided by Vite (usually http://localhost:5173).

## Deployment Instructions

### Deploying the Backend (e.g., to Render/Railway)
1. Push the repository to GitHub.
2. Create a new Web Service on Render/Railway and connect the repository.
3. Set the Root Directory to \`server\`.
4. Build Command: \`npm install\`
5. Start Command: \`npm start\`
6. Add the \`GEMINI_API_KEY\` to the environment variables in the deployment dashboard.
7. Copy the deployed backend URL.

### Deploying the Frontend (e.g., to Vercel/Netlify)
1. Create a new project on Vercel/Netlify and connect the repository.
2. Set the Root Directory to \`client\`.
3. Add an environment variable: \`VITE_API_URL=https://your-deployed-backend-url.com/api/chat\`
4. Deploy the application.

## Screenshots
*(Add placeholders or actual screenshots of the UI here)*
