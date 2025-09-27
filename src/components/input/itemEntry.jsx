
function itemEntry({ item, showTime, onToggleTask }){

  const itemTypes = {
    task: { symbol: '•', label: 'Task' },
    thought: { symbol: '—', label: 'Thought' }
  }
    
  const getSymbol = (item) => {
    if (item.type === 'task') {
      return item.completed ? '✗' : '•';
    }
    return itemTypes[item.type].symbol
  }

  return (
    <div className="flex items-start">
      <div className="w-12 flex-shrink-0 text-right pr-2">
        {showTime && (
          <span className="text-xs text-gray-400 font-mono">
            {formatTime(item.createdAt)}
          </span>
        )}
      </div>
      <div 
        className={`flex items-start space-x-2 py-1 flex-1 ${
          item.type === 'task' ? 'cursor-pointer' : ''
        }`}
        onClick={() => item.type === 'task' && onToggleTask(item.id)}
      >
        <span className={`font-mono text-sm mt-0.5 ${
          item.completed ? 'text-green-600' : 'text-gray-700'
        }`}>
          {getSymbol(item)}
        </span>
        <span className={`text-sm leading-relaxed ${
          item.completed ? 'line-through text-gray-500' : 'text-gray-800'
        }`}>
          {item.text}
        </span>
      </div>
    </div>
  )
}

export default itemEntry