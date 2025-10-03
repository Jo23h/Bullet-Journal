// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.get('origin') || 'no origin'}`);
  next();
});

// Configure CORS to allow frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'BulletJournal';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('=== Server Configuration ===');
console.log('PORT:', PORT);
console.log('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID);
console.log('AIRTABLE_TABLE_NAME:', AIRTABLE_TABLE_NAME);
console.log('AIRTABLE_API_KEY exists:', !!AIRTABLE_API_KEY);
console.log('GEMINI_API_KEY exists:', !!GEMINI_API_KEY);
console.log('===========================');

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('ERROR: Missing required environment variables!');
  console.error('Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your .env file');
  process.exit(1);
}

const airtableBaseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    message: 'Proxy server is working!', 
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// Get all items
app.get('/api/todos', async (req, res) => {
  console.log('GET /api/todos - Fetching items from Airtable');
  try {
    console.log('Making request to:', airtableBaseUrl);
    const response = await axios.get(airtableBaseUrl, {
      headers: airtableHeaders
    });
    
    console.log(`Received ${response.data.records?.length || 0} records from Airtable`);
    
    // Transform Airtable records to match your frontend format
    const items = response.data.records.map(record => ({
      id: record.id,
      text: record.fields.title || record.fields.text || '',
      type: record.fields.description || record.fields.type || 'task',
      completed: record.fields.completed || false,
      createdAt: record.fields.createdAt || record.createdTime || new Date().toISOString()
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch items',
      details: error.response?.data || error.message 
    });
  }
});

// Get single item
app.get('/api/todos/:id', async (req, res) => {
  console.log(`GET /api/todos/${req.params.id}`);
  try {
    const response = await axios.get(`${airtableBaseUrl}/${req.params.id}`, {
      headers: airtableHeaders
    });
    
    const item = {
      id: response.data.id,
      text: response.data.fields.title || response.data.fields.text || '',
      type: response.data.fields.description || response.data.fields.type || 'task',
      completed: response.data.fields.completed || false,
      createdAt: response.data.fields.createdAt || response.data.createdTime
    };
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error.response?.data || error.message);
    res.status(404).json({ error: 'Item not found' });
  }
});

// Create new item
app.post('/api/todos', async (req, res) => {
  console.log('POST /api/todos - Creating item:', req.body);
  try {
    // Map frontend fields to Airtable fields
    const response = await axios.post(airtableBaseUrl, {
      fields: {
        title: req.body.title || req.body.text || '',
        completed: req.body.completed || false,
        description: req.body.description || req.body.type || 'task',
        createdAt: req.body.createdAt || new Date().toISOString()
      }
    }, {
      headers: airtableHeaders
    });
    
    console.log('Item created successfully:', response.data.id);
    
    const newItem = {
      id: response.data.id,
      text: response.data.fields.title,
      type: response.data.fields.description,
      completed: response.data.fields.completed,
      createdAt: response.data.fields.createdAt
    };
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create item',
      details: error.response?.data || error.message 
    });
  }
});

// Update item
app.put('/api/todos/:id', async (req, res) => {
  console.log(`PUT /api/todos/${req.params.id} - Updating item:`, req.body);
  try {
    const updateFields = {};
    
    // Map frontend fields to Airtable fields
    if (req.body.title !== undefined) updateFields.title = req.body.title;
    if (req.body.text !== undefined) updateFields.title = req.body.text;
    if (req.body.completed !== undefined) updateFields.completed = req.body.completed;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    if (req.body.type !== undefined) updateFields.description = req.body.type;
    
    const response = await axios.patch(`${airtableBaseUrl}/${req.params.id}`, {
      fields: updateFields
    }, {
      headers: airtableHeaders
    });
    
    console.log('Item updated successfully');
    
    const updatedItem = {
      id: response.data.id,
      text: response.data.fields.title,
      type: response.data.fields.description,
      completed: response.data.fields.completed,
      createdAt: response.data.fields.createdAt
    };
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to update item',
      details: error.response?.data || error.message 
    });
  }
});

// Delete item
app.delete('/api/todos/:id', async (req, res) => {
  console.log(`DELETE /api/todos/${req.params.id}`);
  try {
    await axios.delete(`${airtableBaseUrl}/${req.params.id}`, {
      headers: airtableHeaders
    });
    
    console.log('Item deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to delete item',
      details: error.response?.data || error.message 
    });
  }
});

// Gemini AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('POST /api/chat - Chat message:', req.body.message?.substring(0, 50));
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: message }] 
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error('Gemini API request failed');
    }
    
    const data = await response.json();
    console.log('Gemini response received');
    res.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      'GET /api/test',
      'GET /api/todos',
      'GET /api/todos/:id',
      'POST /api/todos',
      'PUT /api/todos/:id',
      'DELETE /api/todos/:id',
      'POST /api/chat'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

try {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📋 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`📝 API endpoints: http://localhost:${PORT}/api/todos`);
    console.log(`🤖 Chat endpoint: http://localhost:${PORT}/api/chat\n`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}