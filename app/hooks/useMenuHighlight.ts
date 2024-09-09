import { useState, useEffect } from 'react';

const UPDATE_HOUR = 14; // 2 PM

const useMenuHighlight = () => {
  const [highlightText, setHighlightText] = useState('');

  useEffect(() => {
    const updateHighlight = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
      const isBeforeUpdateHour = now.getHours() < UPDATE_HOUR;

      setHighlightText(isBeforeUpdateHour ? `${currentDay} mittag` : `${currentDay} abend`);
    };

    const scheduleNextUpdate = () => {
      const now = new Date();
      const nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), UPDATE_HOUR, 0, 0);
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

      // Ensure nextUpdate is in the future
      if (now.getTime() >= nextUpdate.getTime()) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
      }

      const timeUntilNextUpdate = Math.min(nextUpdate.getTime() - now.getTime(), nextMidnight.getTime() - now.getTime());

      return setTimeout(() => {
        updateHighlight();
        scheduleNextUpdate();
      }, timeUntilNextUpdate);
    };

    updateHighlight();
    const timerId = scheduleNextUpdate();

    return () => clearTimeout(timerId);
  }, []);

  return highlightText;
};

export default useMenuHighlight;