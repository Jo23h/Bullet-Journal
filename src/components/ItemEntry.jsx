import {useState} from 'react';

function ItemEntry({item, showTime, onToggleTask}) {
  const formatTime = (date) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    return dateObject.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: false});
  };
  
  const getSymbol = (item) => item.type === 'task' ? (item.completed ? '✗' : '•') : '—';

  return (
    <div className="item-entry">
      <div className="item-time-column">
        {showTime && <span className="item-time">{formatTime(item.createdAt)}</span>}
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
}

export default ItemEntry;