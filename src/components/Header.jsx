

function header({ currentTime, filter, setFilter }) {
  const formatCurrentTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '16px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#1f2937',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Daily Log
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#4b5563',
          marginBottom: '4px',
          margin: '0 0 4px 0'
        }}>
          {formatCurrentTime(currentTime)}
        </p>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          fontFamily: 'monospace',
          margin: '0'
        }}>
          Current time: {formatTime(currentTime)}
        </p>
      </div>

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
    </div>
  );
};

export default header