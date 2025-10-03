import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, VITE_GEMINI_API_KEY } = process.env;
const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/BulletJournal`;
const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const response = await axios.get(airtableUrl, { headers: airtableHeaders });
    const items = response.data.records.map(r => ({ id: r.id, ...r.fields }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create item
app.post('/api/items', async (req, res) => {
  try {
    const response = await axios.post(airtableUrl, {
      fields: req.body
    }, { headers: airtableHeaders });
    res.status(201).json({ id: response.data.id, ...response.data.fields });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item
app.patch('/api/items/:id', async (req, res) => {
  try {
    const response = await axios.patch(`${airtableUrl}/${req.params.id}`, {
      fields: req.body
    }, { headers: airtableHeaders });
    res.json({ id: response.data.id, ...response.data.fields });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await axios.delete(`${airtableUrl}/${req.params.id}`, { headers: airtableHeaders });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Gemini chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${VITE_GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: message }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});