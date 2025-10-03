import ItemEntry from "./ItemEntry";

function ItemList({ items, filter, onToggleTask }) {
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatTime = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  if (filteredItems.length === 0) {
    return (
      <div className="empty-state">
        {filter === 'all' 
          ? 'Start logging your day...' 
          : `No ${filter}s yet...`
        }
      </div>
    );
  }

  return (
    <div className="item-list">
      {filteredItems.map((item, index) => {
        const showTime = index === 0 || 
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