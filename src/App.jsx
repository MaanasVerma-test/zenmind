import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from 'sonner';

// Pages
import Home from './pages/Home';
import Meditation from './pages/Meditation';
import Community from './pages/Community';
import Therapists from './pages/Therapists';
import TherapistDetails from './pages/TherapistDetails';
import Talk from './pages/Talk';
import About from './pages/About';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/community" element={<Community />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/therapists/:id" element={<TherapistDetails />} />
        <Route path="/talk" element={<Talk />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'var(--surface-container-highest)',
          color: 'var(--on-surface)',
          border: '1px solid var(--outline-variant)'
        }
      }} />
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navigation />
          <main style={{ flex: 1 }}>
            <AnimatedRoutes />
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
