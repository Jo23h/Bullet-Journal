import { Link, useLocation } from 'react-router-dom';

function FilterButtons() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const btnStyle = (path) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    backgroundColor: isActive(path) ? '#2563eb' : 'transparent',
    color: isActive(path) ? 'white' : '#4b5563'
  });

  const handleHover = (e, path, isEnter) => {
    if (!isActive(path)) {
      e.target.style.backgroundColor = isEnter ? '#f3f4f6' : 'transparent';
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e5e7eb'
    }}>
      <Link to="/" style={btnStyle('/')}
        onMouseEnter={(e) => handleHover(e, '/', true)}
        onMouseLeave={(e) => handleHover(e, '/', false)}>
        All Items
      </Link>
      <Link to="/tasks" style={btnStyle('/tasks')}
        onMouseEnter={(e) => handleHover(e, '/tasks', true)}
        onMouseLeave={(e) => handleHover(e, '/tasks', false)}>
        • Tasks Only
      </Link>
      <Link to="/thoughts" style={btnStyle('/thoughts')}
        onMouseEnter={(e) => handleHover(e, '/thoughts', true)}
        onMouseLeave={(e) => handleHover(e, '/thoughts', false)}>
        — Thoughts Only
      </Link>
    </div>
  );
}

export default FilterButtons;