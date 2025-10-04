const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class BulletJournalService {
  async getItems() {
    const res = await fetch(`${API_URL}/items`);
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json();
  }

  async createItem(itemData) {
    const res = await fetch(`${API_URL}/items`, {
      method: 'POST',
      // react app tells server it is sending json data
      headers: {'Content-Type': 'application/json'},
      // converts the JavaScript object to a JSON string
      body: JSON.stringify(itemData)
    });
    if (!res.ok) throw new Error('Failed to create item');

    // sends data to Express server → Server saves to Airtable → Server returns the new item with ID →
    return res.json();
  }

  async updateItem(id, itemData) {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(itemData)
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
  }

  async deleteItem(id) {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE'});
    if (!res.ok) throw new Error('Failed to delete item');
  }

  async sendChatMessage(message) {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message})
    });
    if (!res.ok) throw new Error('Failed to send chat message');
    const data = await res.json();
    return data.reply;
  }
}

export default new BulletJournalService();