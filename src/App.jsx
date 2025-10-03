import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Homepage from './components/Homepage';
import bulletJournalService from './services/bulletJournal';

const App = () => {
  const AppContent = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      loadItems();
    }, []);

    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await bulletJournalService.getItems();
        const itemsWithDates = data.map(item => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Failed to load items:', error);
        alert('Failed to load items from Airtable. Check console and server.');
      } finally {
        setLoading(false);
      }
    };

    const getCurrentFilter = () => {
      if (location.pathname === '/tasks') return 'task';
      if (location.pathname === '/thoughts') return 'thought';
      return 'all';
    };

    const filter = getCurrentFilter();

    useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const handleFilterChange = (newFilter) => {
      if (newFilter === 'all') navigate('/');
      else if (newFilter === 'task') navigate('/tasks');
      else if (newFilter === 'thought') navigate('/thoughts');
    };

    if (loading) {
      return (
        <div className="app">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading your bullet journal...
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="container">
          <Header 
            currentTime={currentTime}
            filter={filter}
            setFilter={handleFilterChange}
          />

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