import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Cpu, Wallet, ShieldCheck, ChevronDown, LogOut, RefreshCw, LogIn, User, LayoutDashboard, Code2 } from 'lucide-react';
import { Badge } from './ui/Badge';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { wallet, userProfile, connectWallet, disconnectWallet, addBalance, logoutUser } = useWallet();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-[#030712]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#030712]">
              <Cpu className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AgentHub <span className="text-blue-500 font-extrabold">AI</span>
            </span>
            <span className="text-[10px] tracking-wider text-gray-400 uppercase font-mono">
              x402 + Algorand
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-gray-800/80 bg-gray-900/40 p-1.5 backdrop-blur-md">
          <Link
            to="/"
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              isActive('/')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              isActive('/marketplace')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Marketplace
          </Link>
          <Link
            to="/developer"
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              isActive('/developer')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Publish Agent
          </Link>
          <Link
            to="/dashboard"
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              isActive('/dashboard')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right Section: Network Badge & Login / Wallet Controls */}
        <div className="flex items-center gap-3">
          {/* x402 Badge */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            x402 Protocol
          </div>

          {/* Login Button when not authenticated */}
          {!userProfile?.isAuthenticated && (
            <Link
              to="/login"
              className={`flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-1.5 text-xs font-semibold text-gray-200 hover:border-blue-500/50 hover:text-white transition-all ${
                isActive('/login') ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''
              }`}
            >
              <LogIn className="h-3.5 w-3.5 text-blue-400" />
              <span>Login</span>
            </Link>
          )}

          {/* Wallet / User Profile Dropdown */}
          <div className="relative">
            {wallet.connected || userProfile?.isAuthenticated ? (
              <button
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="flex items-center gap-2.5 rounded-xl border border-gray-800 bg-gray-900/80 px-3 py-1.5 text-xs font-mono text-gray-200 hover:border-blue-500/50 transition-all duration-200 shadow-md"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold uppercase text-[10px]">
                  {userProfile?.name ? userProfile.name.charAt(0) : <Wallet className="h-3.5 w-3.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white truncate max-w-[100px]">
                    {userProfile?.name || `₹${Math.round(wallet.balanceAlgo * 100000).toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    {wallet.address.slice(0, 5)}...{wallet.address.slice(-4)}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
              </button>
            ) : (
              <button
                onClick={() => connectWallet('web')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
              >
                <Wallet className="h-3.5 w-3.5" />
                Connect Algorand
              </button>
            )}

            {/* Wallet / User Profile Dropdown Menu */}
            {showWalletDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-800 bg-gray-900 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="border-b border-gray-800 pb-2 mb-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">
                      {userProfile?.role ? `${userProfile.role} Profile` : 'Connected Account'}
                    </p>
                    {userProfile?.loginMethod && (
                      <span className="text-[9px] font-mono uppercase bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                        {userProfile.loginMethod}
                      </span>
                    )}
                  </div>
                  {userProfile?.email && (
                    <p className="text-xs font-mono text-white truncate font-semibold">
                      {userProfile.email}
                    </p>
                  )}
                  <p className="text-[11px] font-mono text-blue-400 truncate">{wallet.address}</p>
                  <div className="mt-2 flex items-center justify-between bg-gray-950/60 p-2 rounded-lg border border-gray-800/60">
                    <span className="text-xs text-gray-400 font-mono">Account Balance:</span>
                    <span className="text-xs font-bold font-mono text-emerald-400">₹{Math.round(wallet.balanceAlgo * 100000).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setShowWalletDropdown(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
                    Developer Dashboard
                  </Link>

                  <Link
                    to="/developer"
                    onClick={() => setShowWalletDropdown(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white transition-colors"
                  >
                    <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                    Publish New Agent
                  </Link>

                  <button
                    onClick={() => {
                      addBalance(10.0);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                    Add Test Funds (₹1,000,000)
                  </button>

                  <a
                    href="https://testnet.algoexplorer.io"
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    View AlgoExplorer
                  </a>

                  <button
                    onClick={() => {
                      logoutUser();
                      setShowWalletDropdown(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out / Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

