import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserWallet, UserProfile } from '../types';

interface WalletContextType {
  wallet: UserWallet;
  userProfile: UserProfile | null;
  connectWallet: (type?: 'pera' | 'algosigner' | 'web' | 'defly') => void;
  disconnectWallet: () => void;
  loginWithEmail: (email: string, name?: string, role?: 'developer' | 'buyer' | 'node_operator') => void;
  loginWithSocial: (provider: 'google' | 'github') => void;
  loginDemoPersona: (role: 'developer' | 'buyer' | 'node_operator') => void;
  logoutUser: () => void;
  deductBalance: (amountAlgo: number) => boolean;
  addBalance: (amountAlgo: number) => void;
}

const DEFAULT_WALLET: UserWallet = {
  address: 'ALGO-7F9X2K4M1N8P3Q5R7S9T0U2V4',
  balanceAlgo: 12.55,
  connected: true,
  network: 'Algorand Testnet',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@agenthub.ai',
  role: 'developer',
  isAuthenticated: true,
  loginMethod: 'wallet',
  joinedAt: '2025-11-10',
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem('agenthub_algo_wallet');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_WALLET;
      }
    }
    return DEFAULT_WALLET;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agenthub_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('agenthub_algo_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('agenthub_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('agenthub_user_profile');
    }
  }, [userProfile]);

  const generateAlgoAddress = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let addr = 'ALGO-';
    for (let i = 0; i < 24; i++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return addr;
  };

  const connectWallet = (type: 'pera' | 'algosigner' | 'web' | 'defly' = 'web') => {
    const addr = generateAlgoAddress();
    setWallet({
      address: addr,
      balanceAlgo: 25.0,
      connected: true,
      network: 'Algorand Testnet',
    });

    setUserProfile((prev) => ({
      name: prev?.name || `Algorand Holder (${addr.slice(0, 6)})`,
      email: prev?.email || `wallet-${addr.slice(5, 11).toLowerCase()}@agenthub.algo`,
      role: prev?.role || 'developer',
      isAuthenticated: true,
      loginMethod: 'wallet',
      joinedAt: prev?.joinedAt || new Date().toISOString().split('T')[0],
    }));
  };

  const disconnectWallet = () => {
    setWallet((prev) => ({ ...prev, connected: false }));
  };

  const loginWithEmail = (email: string, name?: string, role: 'developer' | 'buyer' | 'node_operator' = 'developer') => {
    const defaultName = name || email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase());
    const addr = wallet.connected ? wallet.address : generateAlgoAddress();

    if (!wallet.connected) {
      setWallet({
        address: addr,
        balanceAlgo: 18.5,
        connected: true,
        network: 'Algorand Testnet',
      });
    }

    setUserProfile({
      name: defaultName,
      email: email,
      role: role,
      isAuthenticated: true,
      loginMethod: 'email',
      joinedAt: new Date().toISOString().split('T')[0],
    });
  };

  const loginWithSocial = (provider: 'google' | 'github') => {
    const addr = wallet.connected ? wallet.address : generateAlgoAddress();
    if (!wallet.connected) {
      setWallet({
        address: addr,
        balanceAlgo: 30.0,
        connected: true,
        network: 'Algorand Testnet',
      });
    }

    const mockEmail = provider === 'github' ? 'dev.agenthub@github.com' : 'user.agenthub@gmail.com';
    const mockName = provider === 'github' ? 'GitHub AI Developer' : 'Google Cloud Engineer';

    setUserProfile({
      name: mockName,
      email: mockEmail,
      role: 'developer',
      isAuthenticated: true,
      loginMethod: provider,
      joinedAt: new Date().toISOString().split('T')[0],
    });
  };

  const loginDemoPersona = (role: 'developer' | 'buyer' | 'node_operator') => {
    let mockEmail = 'dev.demo@agenthub.ai';
    let mockName = 'Elena Rostova (Lead AI Dev)';
    let algoBal = 45.0;

    if (role === 'buyer') {
      mockEmail = 'buyer.demo@agenthub.ai';
      mockName = 'Marcus Sterling (AI Enterprise Buyer)';
      algoBal = 12.5;
    } else if (role === 'node_operator') {
      mockEmail = 'node.validator@algorand.org';
      mockName = 'Algorand Node Validator #402';
      algoBal = 150.0;
    }

    const addr = generateAlgoAddress();

    setWallet({
      address: addr,
      balanceAlgo: algoBal,
      connected: true,
      network: 'Algorand Testnet',
    });

    setUserProfile({
      name: mockName,
      email: mockEmail,
      role: role,
      isAuthenticated: true,
      loginMethod: 'email',
      joinedAt: '2025-01-15',
    });
  };

  const logoutUser = () => {
    setUserProfile(null);
    setWallet((prev) => ({ ...prev, connected: false }));
    localStorage.removeItem('agenthub_user_profile');
    localStorage.removeItem('agenthub_algo_wallet');
  };

  const deductBalance = (amountAlgo: number): boolean => {
    if (wallet.balanceAlgo < amountAlgo) return false;
    setWallet((prev) => ({
      ...prev,
      balanceAlgo: parseFloat((prev.balanceAlgo - amountAlgo).toFixed(4)),
    }));
    return true;
  };

  const addBalance = (amountAlgo: number) => {
    setWallet((prev) => ({
      ...prev,
      balanceAlgo: parseFloat((prev.balanceAlgo + amountAlgo).toFixed(4)),
    }));
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        userProfile,
        connectWallet,
        disconnectWallet,
        loginWithEmail,
        loginWithSocial,
        loginDemoPersona,
        logoutUser,
        deductBalance,
        addBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};

