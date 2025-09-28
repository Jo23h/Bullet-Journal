import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import InputForm from './components/Form'
import ItemList from './components/ItemList'

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([
    {
      id: 1,
      text: "Check emails and respond to urgent messages",
      type: "task",
      completed: true,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      text: "The morning coffee was perfect today - need to remember this blend",
      type: "thought",
      completed: false,
      createdAt: new Date(Date.now() - 3000000)
    },
    {
      id: 3,
      text: "Prepare presentation for tomorrow's meeting",
      type: "task",
      completed: false,
      createdAt: new Date(Date.now() - 2400000)
    }
  ]);
  const [newItemText, setNewItemText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const toggleTask = (itemId) => {
    setItems(items.map(item =>
      item.id === itemId && item.type === 'task'
        ? { ...item, completed: !item.completed }
        : item
    ));
  };

  return (
    <div className="app">
      <div className="container">
        <Header 
          currentTime={currentTime}
          filter={filter}
          setFilter={setFilter}
        />

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

      </div>
    </div>
  );
};

export default App
