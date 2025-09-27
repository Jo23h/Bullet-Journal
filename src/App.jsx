import { useState, useEffect } from 'react';
import Header from './components/header/header'
import Input from './components/input/input'
import ItemEntry from './components/input/itemEntry'

const TodoistApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

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
    if (!text.trim()) return;

    const newItem = {
      id: Date.now(),
      text: text,
      type: type,
      completed: false,
      createdAt: new Date()
    };

    setItems([...items, newItem]);
  };

  const itemsWithShowTime = items.map((item, index) => ({
    ...item,
    showTime: index === 0 || 
      formatTime(item.createdAt) !== formatTime(items[index - 1].createdAt)
  }))

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Header 
          currentTime = {currentTime}
          formatCurrentTime = {formatCurrentTime}
          formatTime = {formatTime}
          />

          <Input 
          currentTime={currentTime}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={addItem}
          formatTime = {formatTime}
          />

          <div className="bg-white rounded-lg shadow-sm p-4">
            {itemsWithShowTime.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Start logging your day...
              </div>
            ) : (
              <div className="space-y-0">
                {itemsWithShowTime.map((item) => (
                  <ItemEntry
                    key={item.id}
                    item={item}
                    showTime={item.showTime}
                    onToggleTask={toggleTask}
                    formatTime={formatTime}
                  />
                ))}
              </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoistApp;
