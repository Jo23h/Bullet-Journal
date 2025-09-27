import { useState, useEffect } from 'react';
import Header from './components/header/header'
import Input from './components/input/input'
import ItemEntry from './components/input/itemEntry'
import ItemList from './components/list/itemList'

const TodoistApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatCurrentTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const addItem = (text, type) => {
    console.log('addItem called with:', text, type); // Debug log
    if (!text.trim()) {
      console.log('Empty text, returning'); // Debug log
      return;
    }

    try {
      const newItem = {
        id: Date.now(),
        text: text,
        type: type,
        completed: false,
        createdAt: new Date()
      };

      setItems(prevItems => {
        console.log('Adding new item:', newItem); // Debug log
        return [...prevItems, newItem];
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const toggleTask = (itemId) => {
    setItems(items.map(item =>
      item.id === itemId && item.type === 'task'
        ? { ...item, completed: !item.completed }
        : item
    ));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Header 
          currentTime={currentTime}
          formatCurrentTime={formatCurrentTime}
          formatTime={formatTime}
        />

        <div className="bg-white rounded-lg shadow-sm p-4">
          <Input 
            currentTime={currentTime}
            addItem={addItem}
            formatTime={formatTime}
          />

          <ItemList 
            items={items}
            toggleTask={toggleTask}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
    </>
  );
};


export default TodoistApp;
