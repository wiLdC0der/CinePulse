import { useState, useEffect } from 'react';

export const useThemeSync = () => {
  const [timePhase, setTimePhase] = useState('afternoon');

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      
      // Morning: 6 AM - 12 PM
      if (hour >= 6 && hour < 12) {
        setTimePhase('morning');
      } 
      // Afternoon: 12 PM - 6 PM
      else if (hour >= 12 && hour < 18) {
        setTimePhase('afternoon');
      } 
      // Evening: 6 PM - 10 PM
      else if (hour >= 18 && hour < 22) {
        setTimePhase('evening');
      } 
      // Night: 10 PM - 6 AM
      else {
        setTimePhase('night');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return timePhase;
};
