import React, { useState, useEffect } from 'react';
import Settings from './components/Settings';
import HUD from './components/HUD';

export default function App() {
  const [view, setView] = useState<'settings' | 'hud'>('settings');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#hud') {
        setView('hud');
      } else {
        setView('settings');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden select-none">
      {view === 'hud' ? <HUD /> : <Settings />}
    </div>
  );
}
