// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import InputForm from './components/Form';
import ItemList from './components/ItemList';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([
    {
      id: 1,
      text: "Procrastinate on Project 2",
      type: "task",
      completed: true,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      text: "Blue bottle is the best",
      type: "thought",
      completed: false,
      createdAt: new Date(Date.now() - 3000000)
    },
    {
      id: 3,
      text: "Start working on Project 2",
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
    <Router>
      <div className="app">
        <div className="container">
          <Header 
            currentTime={currentTime}
            filter={filter}
            setFilter={setFilter}
          />

          <Routes>
            {/* Home Route - All Items */}
            <Route 
              path="/" 
              element={
                <div className="main-content">
                  <InputForm
                    currentTime={currentTime}
                    newItemText={newItemText}
                    setNewItemText={setNewItemText}
                    onAddItem={addItem}
                  />
                  <ItemList
                    items={items}
                    filter="all"
                    onToggleTask={toggleTask}
                  />
                </div>
              } 
            />

            {/* Tasks Route - Tasks Only */}
            <Route 
              path="/tasks" 
              element={
                <div className="main-content">
                  <InputForm
                    currentTime={currentTime}
                    newItemText={newItemText}
                    setNewItemText={setNewItemText}
                    onAddItem={addItem}
                  />
                  <ItemList
                    items={items}
                    filter="task"
                    onToggleTask={toggleTask}
                  />
                </div>
              } 
            />

            {/* Thoughts Route - Thoughts Only */}
            <Route 
              path="/thoughts" 
              element={
                <div className="main-content">
                  <InputForm
                    currentTime={currentTime}
                    newItemText={newItemText}
                    setNewItemText={setNewItemText}
                    onAddItem={addItem}
                  />
                  <ItemList
                    items={items}
                    filter="thought"
                    onToggleTask={toggleTask}
                  />
                </div>
              } 
            />

            {/* Catch-all Route - Redirect any unknown paths to home */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>

        </div>
      </div>
    </Router>
  );
};

export default App;