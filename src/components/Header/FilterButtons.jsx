import { Link, useLocation } from 'react-router-dom';

function FilterButtons() {

  // useLocation() provides an object with info about the current URL
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="filter-container">
      <Link 
        to="/" 
        className={`filter-btn ${isActive('/') ? 'active' : ''}`}
      >
        All Items
      </Link>
      <Link 
        to="/tasks" 
        className={`filter-btn ${isActive('/tasks') ? 'active' : ''}`}
      >
        • Tasks Only
      </Link>
      <Link 
        to="/thoughts" 
        className={`filter-btn ${isActive('/thoughts') ? 'active' : ''}`}
      >
        — Thoughts Only
      </Link>
    </div>
  );
}

export default FilterButtons;