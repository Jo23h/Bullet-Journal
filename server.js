import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get credentials
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const VITE_GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

console.log('=== Server Config ===');
console.log('PORT:', PORT);
console.log('Base ID:', AIRTABLE_BASE_ID);
console.log('Has API Key:', !!AIRTABLE_API_KEY);
console.log('Key starts with:', AIRTABLE_API_KEY ? AIRTABLE_API_KEY.substring(0, 10) + '...' : 'MISSING');
console.log('Has Gemini Key:', !!VITE_GEMINI_API_KEY);
console.log('====================');

const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/BulletJournal`;
const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

console.log('Airtable URL:', airtableUrl);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    hasApiKey: !!AIRTABLE_API_KEY,
    hasBase: !!AIRTABLE_BASE_ID
  });
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    console.log('\n>>> Fetching from Airtable...');
    console.log('URL:', airtableUrl);
    console.log('Auth header:', airtableHeaders.Authorization.substring(0, 20) + '...');
    
    const response = await axios.get(airtableUrl, { headers: airtableHeaders });
    
    console.log('✅ Success! Records:', response.data.records.length);
    const items = response.data.records.map(r => ({ id: r.id, ...r.fields }));
    res.json(items);
  } catch (error) {
    console.error('❌ ERROR:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    res.status(500).json({ 
      error: 'Failed to fetch items',
      details: error.response?.data || error.message,
      url: airtableUrl 
    });
  }
});

// Alternative native https endpoint
app.get('/fetch-airtable', (req, res) => {
  const options = {
    hostname: 'api.airtable.com',
    path: `/v0/${AIRTABLE_BASE_ID}/BulletJournal`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  console.log('\n>>> Native HTTPS Request');
  console.log('Path:', options.path);

  const request = https.request(options, (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      console.log('Response status:', response.statusCode);
      console.log('Response:', data.substring(0, 200));
      
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          return res.status(400).json(parsed);
        }
        const items = parsed.records.map(r => ({ id: r.id, ...r.fields }));
        res.json(items);
      } catch (error) {
        console.error('Parse error:', error);
        res.status(500).json({ error: 'Failed to parse response', raw: data });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Request failed', details: error.message });
  });

  request.end();
});

// Create item
app.post('/api/items', async (req, res) => {
  try {
    const response = await axios.post(airtableUrl, {
      fields: req.body
    }, { headers: airtableHeaders });
    
    res.status(201).json({ id: response.data.id, ...response.data.fields });
  } catch (error) {
    console.error('Error creating item:', error.response?.data || error.message);
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
    console.error('Error updating item:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await axios.delete(`${airtableUrl}/${req.params.id}`, { headers: airtableHeaders });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Gemini chat endpoint
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
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:3000`);
  console.log('Try: http://localhost:3000/test\n');
});