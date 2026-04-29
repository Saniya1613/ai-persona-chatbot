const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prompts = require('./prompts');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat API Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, persona, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!persona || !prompts[persona]) {
      return res.status(400).json({ error: 'Valid persona is required (anshuman, abhimanyu, kshitij)' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: prompts[persona].systemPrompt 
    });

    // Format history for Gemini API
    let formattedHistory = [];
    if (history && Array.isArray(history)) {
      // Keep last 6 messages to provide context without exceeding limits
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
         if (msg.role === 'bot') {
            formattedHistory.push({ role: 'model', parts: [{ text: msg.content }] });
         } else if (msg.role === 'user') {
            formattedHistory.push({ role: 'user', parts: [{ text: msg.content }] });
         }
      }
    }

    // Gemini requires the history to start with a 'user' role
    while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift();
    }

    // Fallback if no API key is provided
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      console.log('No valid API key found. Sending simulated response.');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({
        response: `<chain_of_thought>\n- No API key detected.\n- Need to provide a simulated response so the user can test the UI.\n</chain_of_thought>\nThis is a simulated response because the **API Key is missing**. \n\nTo make this chatbot fully functional, please add your real API key to the \`.env\` file in the \`/server\` directory and **restart the backend server**. How do you like the new purple-themed UI?`,
        persona: persona
      });
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage(message);
    const responseContent = result.response.text();

    // Send back the response
    res.json({
      response: responseContent,
      persona: persona
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Provide user-friendly error message
    if (error.message && error.message.includes('API key not valid')) {
      return res.status(401).json({ error: 'Invalid or missing Gemini API key. Please check your .env file.' });
    }
    
    res.status(500).json({ error: 'An error occurred while communicating with the AI. Please try again later.' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
