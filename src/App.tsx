import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AgentDetailsPage } from './pages/AgentDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/agent/:id" element={<AgentDetailsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </WalletProvider>
  );
}

