import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import InputForm from './components/Form';
import ItemList from './components/ItemList';
import bulletJournalService from './services/bulletJournal';

// Main content component that will be used in routes
const MainView = ({ items, setItems, filter, loadItems }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

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

// App content with navigation
const AppContent = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Load items from Airtable on mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await bulletJournalService.getItems();
      // Convert createdAt strings back to Date objects
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

  // Determine current filter based on route
  const getCurrentFilter = () => {
    if (location.pathname === '/tasks') return 'task';
    if (location.pathname === '/thoughts') return 'thought';
    return 'all';
  };

  const filter = getCurrentFilter();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFilterChange = (newFilter) => {
    if (newFilter === 'all') {
      navigate('/');
    } else if (newFilter === 'task') {
      navigate('/tasks');
    } else if (newFilter === 'thought') {
      navigate('/thoughts');
    }
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
            element={
              <MainView 
                items={items}
                setItems={setItems}
                filter="all"
                loadItems={loadItems}
              />
            } 
          />

          <Route 
            path="/tasks" 
            element={
              <MainView 
                items={items}
                setItems={setItems}
                filter="task"
                loadItems={loadItems}
              />
            } 
          />

          <Route 
            path="/thoughts" 
            element={
              <MainView 
                items={items}
                setItems={setItems}
                filter="thought"
                loadItems={loadItems}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;