function Form({currentTime, newItemText, setNewItemText, onAddItem}) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {

      // trim whitespace 
      const text = newItemText.trim();
      if (!text) return;
      
      // default to task if prefix is wrong
      let itemType = 'task'
      let content = text;
      
      if (text.startsWith('/ta ')) {
        content = text.slice(4);
      } else if (text.startsWith('/th ')) {
        itemType = 'thought';  
        content = text.slice(4);
      }
      
      // after stripping /ta  or /th if anything remains, calls the onAddItem function
      if (content.trim()) {
        onAddItem(content.trim(), itemType);
      }
      setNewItemText('');
    }
  };

  return (
    <div className="form-container">
      <div className="form-instructions">
        Start with <span className="form-command">/ta</span> for tasks or{' '}
        <span className="form-command">/th</span> for thoughts, then press Enter
      </div>
      
      <div className="form-input-row">
        <span className="form-time">{formatTime(currentTime)}</span>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="/ta Buy groceries or /th Feeling stressed"
          className="form-input"
        />
      </div>
    </div>
  );
}

export default Form;