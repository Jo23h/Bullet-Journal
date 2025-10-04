import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Axios is a JavaScript library for making HTTP requests. 
// It's an alternative to the browser's built-in fetch() API, but with a simpler syntax and extra features
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// By default, browsers block requests between different origins (different ports count as different origins). 
// React app (frontend) on port 5173 can't talk to Express (backend) server on port 3000.
// What app.use(cors()) does: Tells the Express server: "Allow requests from other origins (like port 5173)"
app.use(cors());
app.use(express.json());

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, VITE_GEMINI_API_KEY } = process.env;
const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/BulletJournal`;

// Airtable needs to know you're authorized to access the data. You prove this by including your API key in the request headers
const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// When React app calls bulletJournalService.getItems(), it hits this endpoint
app.get('/api/items', async (req, res) => {
  try {
    // Uses axios to make an HTTP GET request to Airtable
    // Sends authorization headers with my API key
    // await waits for Airtable to respond
    const response = await axios.get(airtableUrl, {headers: airtableHeaders});
    const items = response.data.records.map(r => ({id: r.id, ...r.fields}));
    res.json(items);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch items'});
  }
});

// Create item
app.post('/api/items', async (req, res) => {
  try {
    // airtableUrl - Where to send the request; endpoint
    // {fields: req.body} takes data came from React app (req.body) and wrap it into Airtable's req fields object
    const response = await axios.post(airtableUrl, {fields: req.body}, {headers: airtableHeaders});

    // Sets HTTP status code to 201 ("Created")
    // { id: response.data.id, ...response.data.fields } creates a new object combining Airtable's response
    // response.data.id: Airtable's unique ID
    // ... takes all properties from inside fields and spreads them into the parent object:
    res.status(201).json({id: response.data.id, ...response.data.fields});
  } catch (error) {
    res.status(500).json({error: 'Failed to create item'});
  }
});

// Update item
app.patch('/api/items/:id', async (req, res) => {
  try {
    // Express extracts item ID from the URL and makes it available as req.params.id.
    const response = await axios.patch(`${airtableUrl}/${req.params.id}`, {fields: req.body}, {headers: airtableHeaders});

    // Sends a JSON response back (from Airtable) to React app
    // Combines the ID with all the field data
    res.json({ id: response.data.id, ...response.data.fields});
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item'});
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await axios.delete(`${airtableUrl}/${req.params.id}`, { headers: airtableHeaders });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: 'Failed to delete item'});
  }
});

// Gemini chat
app.post('/api/chat', async (req, res) => {
  try {
    const {message} = req.body;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${VITE_GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{text: message}]
        }]
      },
      {headers: {'Content-Type': 'application/json'}}
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