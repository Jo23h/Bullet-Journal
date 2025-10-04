import {useState} from 'react';

function ItemEntry({item, showTime, onToggleTask}) {
  const formatTime = (date) => {

    // checks if date is already a Date object. 
    // If yes, use it. If no (it's a string), convert it to a Date object.
    const dateObject = date instanceof Date ? date : new Date(date);
    return dateObject.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: false});
  };
  
  const getSymbol = (item) => item.type === 'task' ? (item.completed ? '✗' : '•') : '—';

  return (
    <div className="item-entry">
      <div className="item-time-column">

        {/* only the first item in each time group shows the timestamp
        avoid multiple items within the same minute having the same timestamps*/}
        {showTime && <span className="item-time">{formatTime(item.createdAt)}</span>}
      </div>
      <div 
        // click handler only works for tasks - toggles completion
        className={`item-content ${item.type === 'task' ? 'clickable' : ''}`}
        onClick={() => item.type === 'task' && onToggleTask(item.id)}
      >
        {/* green symbol cross */}
        <span className={`item-symbol ${item.completed ? 'completed' : ''}`}>
          {getSymbol(item)}
        </span>
        {/* strikethrough */}
        <span className={`item-text ${item.completed ? 'completed' : ''}`}>
          {item.text}
        </span>
      </div>
    </div>
  );
}

export default ItemEntry;