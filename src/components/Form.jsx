

function Form({ currentTime, newItemText, setNewItemText, onAddItem }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleInputChange = (e) => {
    setNewItemText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const text = newItemText.trim();
      
      if (!text) return;
      
      let itemType = 'task';
      let content = text;
      
      if (text.startsWith('/ta ')) {
        itemType = 'task';
        content = text.slice(4);
      } else if (text.startsWith('/th ')) {
        itemType = 'thought';  
        content = text.slice(4);
      }
      
      if (content.trim()) {
        onAddItem(content.trim(), itemType);
      }
      setNewItemText('');
    }
  };

  return (
    <div className="input-form">
      <div className="input-instructions">
        Start with <span className="command">/ta</span> for tasks or{' '}
        <span className="command">/th</span> for thoughts, then press Enter
      </div>
      
      <div className="input-container">
        <span className="time-display">
          {formatTime(currentTime)}
        </span>
        <input
          type="text"
          value={newItemText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="/ta Buy groceries or /th Feeling stressed"
          className="main-input"
        />
      </div>
    </div>
  );
};

// Item Entry Component
const ItemEntry = ({ item, showTime, onToggleTask }) => {
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

export default Form