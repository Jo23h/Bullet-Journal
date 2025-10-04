import {useState, useEffect} from 'react';
import InputForm from './Form';
import ItemList from './ItemList';
import bulletJournalService from '../services/bulletJournal';

const Homepage = ({items, setItems, filter}) => {
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
        text,
        type,
        completed: false,
        createdAt: new Date().toISOString()
      });

      setItems([...items, newItem]);
      setNewItemText('');
    } catch (err) {
      console.error('Failed to add item:', err);
      alert('Failed to add item. Check console for details.');
    }
  };

  const toggleTask = async (itemId) => {
    // finds the specific item you clicked by matching the ID
    const item = items.find(i => i.id === itemId);
    if (item.type !== 'task') return;

    try {
      const updated = await bulletJournalService.updateItem(itemId, {

        // if completed: false, sends {completed: true}. vice versa
        completed: !item.completed
      });

      // if the item ID matches, replace it with the updated status of completion from the server
      // if no match, retain original state of completition 
      setItems(items.map(i => i.id === itemId ? updated : i));
    } catch (err) {
      console.error('Failed to toggle task:', err);
      alert('Failed to update task');
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
      <ItemList items={items} filter={filter} onToggleTask={toggleTask} />
    </div>
  );
};

export default Homepage;