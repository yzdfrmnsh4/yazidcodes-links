import { useState, useEffect } from 'react';
import { SystemLocation } from '../types';

export function useRealtime() {
  const [time, setTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<SystemLocation>({
    city: 'Jakarta',
    country: 'ID',
    loading: true,
  });

  useEffect(() => {
    // Tick every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchLocation() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Response error');
        const data = await response.json();
        if (active && data.city && data.country_code) {
          setLocation({
            city: data.city,
            country: data.country_code,
            loading: false,
          });
        }
      } catch (e) {
        // Fallback to Bandung, ID
        if (active) {
          setLocation({
            city: 'Bandung',
            country: 'ID',
            loading: false,
          });
        }
      }
    }

    fetchLocation();

    return () => {
      active = false;
    };
  }, []);

  return { time, location };
}
