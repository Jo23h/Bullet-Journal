import { useState } from 'react';

function input({currentTime, addItem, formatTime}) {
    const [inputValue, setInputValue] = useState('');

    const itemTypes = {
        task: { symbol: '•', label: 'Task' },
        thought: { symbol: '—', label: 'Thought' }
    };

    const handleInput = (event) => {
        setInputValue(event.target.value);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const text = inputValue.trim();
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
                setInputValue('');
            }
        }
    };

    return (
        <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="text-xs text-gray-500 mb-3">
        Start with <span className="font-mono bg-gray-100 px-1 rounded">/ta</span> for tasks or <span className="font-mono bg-gray-100 px-1 rounded">/th</span> for thoughts, then press Enter
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 font-mono w-12">
          {formatTime(currentTime)}
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
          placeholder="/ta Buy groceries or /th Feeling stressed"
          className="flex-1 px-2 py-1 border-none focus:outline-none text-sm bg-transparent"
        />
      </div>
    </div>

    )
}

export default input