import {useState, useEffect} from 'react'

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '3px' }}>
        {formatDate(currentTime)}
      </div>
      <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'monospace' }}>
        Current time: {formatTime(currentTime)}
      </div>
    </div>
  );
}

export default TimeDisplay