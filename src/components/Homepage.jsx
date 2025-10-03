import { useState, useEffect } from 'react';
import InputForm from './Form';
import ItemList from './ItemList';
import bulletJournalService from '../services/bulletJournal';

const Homepage = ({ items, setItems, filter}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addItem = async (text, type) => {
    if (!text.trim()) return;

    try {
      const newItem = await bulletJournalService.createItem({
        text: text,
        type: type,
        completed: false,
        createdAt: new Date().toISOString()
      });

      setItems([...items, newItem]);
      setNewItemText('');
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item. Check console for details.');
    }
  };

  const toggleTask = async (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.type !== 'task') return;

    try {
      const updated = await bulletJournalService.updateItem(itemId, {
        completed: !item.completed
      });

      setItems(items.map(i => i.id === itemId ? updated : i));
    } catch (error) {
      console.error('Failed to toggle task:', error);
      alert('Failed to update task. Check console for details.');
    }
  };

  return (
    <div className="main-content">
      <InputForm
        currentTime={currentTime}
        newItemText={newItemText}
        setNewItemText={setNewItemText}
        onAddItem={addItem}
      />
      <ItemList
        items={items}
        filter={filter}
        onToggleTask={toggleTask}
      />
    </div>
  );
};

export default Homepage;