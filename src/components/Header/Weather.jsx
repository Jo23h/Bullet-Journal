import { useState, useEffect } from 'react';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    if (isDay) {
      setWeatherData({
        img: 'https://pages.git.generalassemb.ly/modular-curriculum-all-courses/react-components-lab/assets/day.svg',
        imgAlt: 'sun icon',
        time: 'Day'
      });
    } else {
      setWeatherData({
        img: 'https://pages.git.generalassemb.ly/modular-curriculum-all-courses/react-components-lab/assets/night.svg',
        imgAlt: 'moon icon',
        time: 'Night'
      });
    }
  }, []);

  if (!weatherData) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0px' }}>
      <img 
        src={weatherData.img} 
        alt={weatherData.imgAlt}
      />
      <span style={{ fontSize: '14px', color: '#6b7280' }}>
        {weatherData.time}
      </span>
    </div>
  );
}

export default Weather;