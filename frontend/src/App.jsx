import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AlertDetails from './components/AlertDetails';
import Home from './components/Home';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [hasAnomaly, setHasAnomaly] = useState(false);

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#140800] text-white selection:bg-[#f97316]/30">
      <Navbar activePage={activePage} setActivePage={setActivePage} hasAnomaly={hasAnomaly} />
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              <Dashboard key="dashboard" setActivePage={setActivePage} hasAnomaly={hasAnomaly} setHasAnomaly={setHasAnomaly} />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="mt-auto py-6 border-t border-gray-800 text-center text-[#9CA3AF] text-sm">
         <p className="font-mono">{'</>'} LSTM-AE Melting Twin Backend Required</p>
         <p className="text-xs mt-2 opacity-50">© 2026 NEXUS-Foundry Digital Twin</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
