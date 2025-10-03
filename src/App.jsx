import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Homepage from './components/Homepage';
import bulletJournalService from './services/bulletJournal';

const App = () => {
  const AppContent = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [items, setItems] = useState([]);

    useEffect(() => {
      loadItems();
    }, []);

    useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const loadItems = async () => {
      try {
        const data = await bulletJournalService.getItems();
        const itemsWithDates = data.map(item => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Failed to load items:', error);
        alert('Failed to load items from Airtable. Check console and server.');
      }
    };

    return (
      <div className="app">
        <div className="container">
          <Header currentTime={currentTime} />

          <Routes>
            <Route 
              path="/" 
              element={<Homepage items={items} setItems={setItems} filter="all" loadItems={loadItems} />} 
            />
            <Route 
              path="/tasks" 
              element={<Homepage items={items} setItems={setItems} filter="task" loadItems={loadItems} />} 
            />
            <Route 
              path="/thoughts" 
              element={<Homepage items={items} setItems={setItems} filter="thought" loadItems={loadItems} />} 
            />
          </Routes>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;