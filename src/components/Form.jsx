

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
    <div style={{
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '12px'
      }}>
        Start with <span style={{
          fontFamily: 'monospace',
          backgroundColor: '#f3f4f6',
          padding: '2px 4px',
          borderRadius: '4px'
        }}>/ta</span> for tasks or{' '}
        <span style={{
          fontFamily: 'monospace',
          backgroundColor: '#f3f4f6',
          padding: '2px 4px',
          borderRadius: '4px'
        }}>/th</span> for thoughts, then press Enter
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#9ca3af',
          fontFamily: 'monospace',
          width: '48px',
          flexShrink: 0
        }}>
          {formatTime(currentTime)}
        </span>
        <input
          type="text"
          value={newItemText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="/ta Buy groceries or /th Feeling stressed"
          style={{
            flex: 1,
            padding: '4px 8px',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
};

export default Form