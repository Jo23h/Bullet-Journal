function input({currentTime, newItem, setNewItem, addItem, formatTime}) {

    const itemTypes = {
    task: { symbol: '•', label: 'Task' },
    thought: { symbol: '—', label: 'Thought' }
    };

    const handleInput = (event) => {
        setNewItem(event.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const text = newItem.trim();
            if (!text) return;
            
            const commandMap = {
                '/ta ': 'task',
                '/th ': 'thought'
            };
    
            const command = text.substring(0, 4);
            const itemType = commandMap[command] || 'task';
            const content = commandMap[command] ? text.slice(4) : text;
    
            if (content.trim()) {
                addItem(content.trim(), itemType);
            }

            setNewItem('');
        }
    };

  return (
    <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 font-mono w-12">
          {formatTime(currentTime)}
        </span>
        <input
          type="text"
          value={newItem}
          onChange={handleInput}
          onKeyDown={handleKeyPress}
          placeholder="/ta Buy groceries or /th Feeling stressed"
          className="flex-1 px-2 py-1 border-none focus:outline-none text-sm bg-transparent"
        />
      </div>
  )
}

export default input