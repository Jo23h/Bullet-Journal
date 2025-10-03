import { useState } from 'react';

function ItemEntry({ item, showTime, onToggleTask }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  const getSymbol = (item) => item.type === 'task' ? (item.completed ? '✗' : '•') : '—';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ width: '48px', flexShrink: 0, textAlign: 'right', paddingRight: '8px' }}>
        {showTime && <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>{formatTime(item.createdAt)}</span>}
      </div>
      <div 
        style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px', flex: 1, cursor: item.type === 'task' ? 'pointer' : 'default', backgroundColor: isHovered && item.type === 'task' ? '#f9fafb' : 'transparent', borderRadius: '4px', margin: '0 -4px', transition: 'background-color 0.2s' }}
        onClick={() => item.type === 'task' && onToggleTask(item.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', marginTop: '2px', color: item.completed ? '#059669' : '#374151' }}>
          {getSymbol(item)}
        </span>
        <span style={{ fontSize: '14px', lineHeight: 1.5, color: item.completed ? '#6b7280' : '#1f2937', textDecoration: item.completed ? 'line-through' : 'none' }}>
          {item.text}
        </span>
      </div>
    </div>
  );
}

export default ItemEntry;