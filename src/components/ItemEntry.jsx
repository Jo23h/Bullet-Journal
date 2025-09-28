

function ItemEntry({ item, showTime, onToggleTask }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const getSymbol = (item) => {
    if (item.type === 'task') {
      return item.completed ? '✗' : '•';
    }
    return '—';
  };

  return (
    <div className="item-entry">
      <div className="time-column">
        {showTime && (
          <span className="item-time">
            {formatTime(item.createdAt)}
          </span>
        )}
      </div>
      <div 
        className={`item-content ${item.type === 'task' ? 'clickable' : ''}`}
        onClick={() => item.type === 'task' && onToggleTask(item.id)}
      >
        <span className={`item-symbol ${item.completed ? 'completed' : ''}`}>
          {getSymbol(item)}
        </span>
        <span className={`item-text ${item.completed ? 'completed' : ''}`}>
          {item.text}
        </span>
      </div>
    </div>
  );
};

export default ItemEntry