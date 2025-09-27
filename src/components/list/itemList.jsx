import ItemEntry from "../input/itemEntry";

function itemList({items, toggleTask, formatTime}) {
    
    if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Start logging your day...
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => {
        const showTime = index === 0 || 
          formatTime(item.createdAt) !== formatTime(items[index - 1].createdAt);
        
        return (
          <ItemEntry
            key={item.id}
            item={item}
            showTime={showTime}
            toggleTask={toggleTask}
            formatTime={formatTime}
          />
        );
      })}
    </div>
  )
}

export default itemList