import { useState, useEffect } from 'react';
import Header from './components/header/header'

const TodoistApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Update time every second
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
    if(!text.trim()) return;
    
    const newItem = {
      id: Date.now(),
      text: text,
      type: type,
      completed: false,
      createdAt: new Date()
    };

    setItems([...items, newItem]);
  };


  return (
    <>
      <Header 
      currentTime = {currentTime}
      formatCurrentTime = {formatCurrentTime}
      formatTime = {formatTime}
      />
     
    </>
  );
};

export default TodoistApp;
