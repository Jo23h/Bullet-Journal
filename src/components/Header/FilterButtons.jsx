// FilterButtons.jsx
import { Link, useLocation } from 'react-router-dom';

function FilterButtons({ filter, setFilter }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e5e7eb'
    }}>
      <Link
        to="/"
        onClick={() => setFilter('all')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textDecoration: 'none',
          backgroundColor: isActive('/') ? '#2563eb' : 'transparent',
          color: isActive('/') ? 'white' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/')) e.target.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (!isActive('/')) e.target.style.backgroundColor = 'transparent';
        }}
      >
        All Items
      </Link>
      <Link
        to="/tasks"
        onClick={() => setFilter('task')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textDecoration: 'none',
          backgroundColor: isActive('/tasks') ? '#2563eb' : 'transparent',
          color: isActive('/tasks') ? 'white' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/tasks')) e.target.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (!isActive('/tasks')) e.target.style.backgroundColor = 'transparent';
        }}
      >
        • Tasks Only
      </Link>
      <Link
        to="/thoughts"
        onClick={() => setFilter('thought')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textDecoration: 'none',
          backgroundColor: isActive('/thoughts') ? '#2563eb' : 'transparent',
          color: isActive('/thoughts') ? 'white' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/thoughts')) e.target.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (!isActive('/thoughts')) e.target.style.backgroundColor = 'transparent';
        }}
      >
        — Thoughts Only
      </Link>
    </div>
  );
}

export default FilterButtons;