import React, { useEffect } from 'react';
import LandingPage from './features/landing/LandingPage';

function App() {
  // Check system preference on load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <LandingPage />
  );
}

export default App;
