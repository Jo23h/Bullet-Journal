import ItemEntry from "./ItemEntry";

function ItemList({ items, filter, onToggleTask }) {
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatTime = (date) => {
    // date instanceof Date - condition that checks if date is a date object
    const dateObj = date instanceof Date ? date : new Date(date);

    // if date is already a date object, use it. if it's a string, convert it to date
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  if (filteredItems.length === 0) {
    return (
      <div className="empty-state">
        {/* if viewing "All Items" (filter === 'all'): shows "Start logging your day..." */}
        {filter === 'all' 
          ? 'Start logging your day...' 
          // if viewing task/thought, shows "No tasks/thoughts yet"
          : `No ${filter}s yet...`
        }
      </div>
    );
  }

  return (
    <div className="item-list">
      {filteredItems.map((item, index) => {
        // index === 0 - show time for the first item
        const showTime = index === 0 || 
        
          // show time if it's different from the previous item's time
          // index-1 look backwards to see if previous item time is the same
          formatTime(item.createdAt) !== formatTime(filteredItems[index - 1].createdAt);
        
        return (
          <ItemEntry
            key={item.id}
            item={item}
            showTime={showTime}
            onToggleTask={onToggleTask}
          />
        );
      })}
    </div>
  );
}

export default ItemList;