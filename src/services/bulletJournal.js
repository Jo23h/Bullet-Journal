// utility function to call proxy server 
// bulletJournal.js
// Frontend service to interact with backend API

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class BulletJournalService {
  // Get all items (tasks and thoughts)
  async getAllItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  // Get single item by ID
  async getItemById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  // Create new item (task or thought)
  async createItem(itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: itemData.text,
          completed: itemData.completed || false,
          description: itemData.type || 'task',
          createdAt: itemData.createdAt || new Date().toISOString()
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  // Update item
  async updateItem(id, itemData) {
    try {
      const updatePayload = {};
      
      if (itemData.text !== undefined) updatePayload.title = itemData.text;
      if (itemData.completed !== undefined) updatePayload.completed = itemData.completed;
      if (itemData.type !== undefined) updatePayload.description = itemData.type;
      
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Delete item
  async deleteItem(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // Send chat message to Gemini AI
  async sendChatMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      const data = await response.json();
      
      // Extract text from Gemini API response structure
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  // Test connection to backend
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
      if (!response.ok) {
        throw new Error('Failed to connect to backend');
      }
      return await response.json();
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  }
}

export default new BulletJournalService();