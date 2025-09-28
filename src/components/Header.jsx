

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
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">Daily Log</h1>
        <p className="header-date">{formatCurrentTime(currentTime)}</p>
        <p className="header-time">
          Current time: {formatTime(currentTime)}
        </p>
      </div>

      <div className="filter-controls">
        <button
          onClick={() => setFilter('all')}
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter('task')}
          className={`filter-button ${filter === 'task' ? 'active' : ''}`}
        >
          • Tasks Only
        </button>
        <button
          onClick={() => setFilter('thought')}
          className={`filter-button ${filter === 'thought' ? 'active' : ''}`}
        >
          — Thoughts Only
        </button>
      </div>
    </div>
  );
};

export default header