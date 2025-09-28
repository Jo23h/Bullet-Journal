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
    <div className="time-container">
      <div className="date-display" style={{
        fontSize: '14px',
        color: '#4b5563',
        marginBottom: '4px',
        margin: '0 0 4px 0'
      }}>
        {formatDate(currentTime)}
      </div>
      <div className="time-display" style={{
        fontSize: '12px',
        color: '#6b7280',
        fontFamily: 'monospace',
        margin: '0'
      }}>
        Current time: {formatTime(currentTime)}
      </div>
    </div>
  );
}

export default TimeDisplay