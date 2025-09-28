function FilterButtons({ filter, setFilter }) {
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
      <button
        onClick={() => setFilter('all')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: filter === 'all' ? '#2563eb' : 'transparent',
          color: filter === 'all' ? 'white' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          if (filter !== 'all') e.target.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (filter !== 'all') e.target.style.backgroundColor = 'transparent';
        }}
      >
        All Items
      </button>
      <button
        onClick={() => setFilter('task')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: filter === 'task' ? '#2563eb' : 'transparent',
          color: filter === 'task' ? 'white' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          if (filter !== 'task') e.target.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (filter !== 'task') e.target.style.backgroundColor = 'transparent';
        }}
      >
        • Tasks Only
      </button>
      <button
        onClick={() => setFilter('thought')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: filter === 'thought' ? '#2563eb' : 'transparent',
          color: filter === 'thought' ? 'white' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          if (filter !== 'thought') e.target.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (filter !== 'thought') e.target.style.backgroundColor = 'transparent';
        }}
      >
        — Thoughts Only
      </button>
    </div>
  );
  
}

export default FilterButtons