
// const express = require('express');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const app = express();
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.post('/api/generate', async (req, res) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(req.body.prompt);
//     const response = await result.response;
    
//     res.json({ text: response.text() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});
