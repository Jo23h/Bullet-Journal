const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class BulletJournalService {
  async getItems() {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  }

  async createItem(itemData) {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  }

  async updateItem(id, itemData) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  }

  async deleteItem(id) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete item');
  }

  async sendChatMessage(message) {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to send chat message');
    const data = await response.json();
    return data.reply;
  }
}

export default new BulletJournalService();