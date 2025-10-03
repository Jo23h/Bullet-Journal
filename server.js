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
  console.log('Headers:', req.headers);
  next();
});

// Configure CORS to allow all origins
app.use(cors({
  origin: true, // This allows all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Add explicit headers as backup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Todos';

console.log('=== Server Configuration ===');
console.log('PORT:', PORT);
console.log('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID);
console.log('AIRTABLE_TABLE_NAME:', AIRTABLE_TABLE_NAME);
console.log('API_KEY exists:', !!AIRTABLE_API_KEY);
console.log('===========================');

const airtableBaseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Proxy server is working!', cors: 'enabled' });
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  console.log('GET /api/todos - Fetching todos from Airtable');
  try {
    console.log('Making request to:', airtableBaseUrl);
    const response = await axios.get(airtableBaseUrl, {
      headers: airtableHeaders
    });
    
    console.log(`Received ${response.data.records.length} records from Airtable`);
    
    const todos = response.data.records.map(record => ({
      id: record.id,
      ...record.fields
    }));
    
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error.response?.data || error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch todos',
      details: error.response?.data || error.message 
    });
  }
});

// Get single todo
app.get('/api/todos/:id', async (req, res) => {
  console.log(`GET /api/todos/${req.params.id}`);
  try {
    const response = await axios.get(`${airtableBaseUrl}/${req.params.id}`, {
      headers: airtableHeaders
    });
    
    const todo = {
      id: response.data.id,
      ...response.data.fields
    };
    
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create new todo
app.post('/api/todos', async (req, res) => {
  console.log('POST /api/todos - Creating todo:', req.body);
  try {
    const response = await axios.post(airtableBaseUrl, {
      fields: {
        title: req.body.title,
        completed: req.body.completed || false,
        description: req.body.description || ''
      }
    }, {
      headers: airtableHeaders
    });
    
    console.log('Todo created successfully:', response.data.id);
    
    const newTodo = {
      id: response.data.id,
      ...response.data.fields
    };
    
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
  console.log(`PUT /api/todos/${req.params.id} - Updating todo:`, req.body);
  try {
    const updateFields = {};
    if (req.body.title !== undefined) updateFields.title = req.body.title;
    if (req.body.completed !== undefined) updateFields.completed = req.body.completed;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    
    const response = await axios.patch(`${airtableBaseUrl}/${req.params.id}`, {
      fields: updateFields
    }, {
      headers: airtableHeaders
    });
    
    console.log('Todo updated successfully');
    
    const updatedTodo = {
      id: response.data.id,
      ...response.data.fields
    };
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  console.log(`DELETE /api/todos/${req.params.id}`);
  try {
    await axios.delete(`${airtableBaseUrl}/${req.params.id}`, {
      headers: airtableHeaders
    });
    
    console.log('Todo deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

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
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
