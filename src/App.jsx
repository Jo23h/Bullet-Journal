import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Homepage from './components/Homepage';
import bulletJournalService from './services/bulletJournal';

const App = () => {
  const AppContent = () => {
    // useState(new Date()) sets the initial value when the component first mounts. Without it, currentTime would be undefined
    // Header component receives currentTime immediately
    const [currentTime, setCurrentTime] = useState(new Date());
    const [items, setItems] = useState([]);

    useEffect(() => {
      const loadItems = async () => {
        try {
          // Calls bulletJournalService.getItems() to fetch data from Airtable
          const data = await bulletJournalService.getItems();
          const itemsWithDates = data.map(item => ({

            // Converts Airtable's ISO 8601 formatted string in createdAt into Date object 
            // JavaScript needs Date objects to work with time/date formatting
            ...item, createdAt: new Date(item.createdAt)
          }));

          // Updates the items state with the fetched data
          setItems(itemsWithDates);
        } catch (error) {
          console.error('Failed to load items:', error);
          alert('Failed to load items from Airtable');
        }
      };
      
      // Executes on initial render
      loadItems();
    }, []);

    useEffect(() => {

      // setInterval runs a function repeatedly. Every second, it calls setCurrentTime(new Date())
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);

      // Stops the interval when the component unmounts - good practice
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="app">
        <div className="container">
          <Header currentTime={currentTime} />

          <Routes>
            <Route 
              path="/" 
              element={<Homepage items={items} setItems={setItems} filter="all" />} 
            />
            <Route 
              path="/tasks" 
              element={<Homepage items={items} setItems={setItems} filter="task" />} 
            />
            <Route 
              path="/thoughts" 
              element={<Homepage items={items} setItems={setItems} filter="thought" />} 
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