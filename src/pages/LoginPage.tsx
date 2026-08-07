import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Wallet,
  Mail,
  Lock,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  User,
  Github,
  CheckCircle2,
  Sparkles,
  Key,
  Globe,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    wallet,
    userProfile,
    connectWallet,
    loginWithEmail,
    loginWithSocial,
    loginDemoPersona,
    logoutUser,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'wallet' | 'email'>('wallet');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'developer' | 'buyer' | 'node_operator'>('developer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const redirectPath = (location.state as any)?.from || '/dashboard';

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setSuccessMessage('');

    setTimeout(() => {
      loginWithEmail(email, undefined, role);
      setIsSubmitting(false);
      setSuccessMessage('Successfully logged in!');
      setTimeout(() => {
        navigate(redirectPath);
      }, 800);
    }, 600);
  };

  const handleWalletConnect = (provider: 'pera' | 'algosigner' | 'web' | 'defly') => {
    setIsSubmitting(true);
    setTimeout(() => {
      connectWallet(provider);
      setIsSubmitting(false);
      setSuccessMessage('Algorand Wallet Connected!');
      setTimeout(() => {
        navigate(redirectPath);
      }, 800);
    }, 500);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithSocial(provider);
      setIsSubmitting(false);
      setSuccessMessage(`Authenticated via ${provider === 'github' ? 'GitHub' : 'Google'}!`);
      setTimeout(() => {
        navigate(redirectPath);
      }, 800);
    }, 600);
  };

  const handleDemoClick = (personaRole: 'developer' | 'buyer' | 'node_operator') => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginDemoPersona(personaRole);
      setIsSubmitting(false);
      setSuccessMessage(`Logged in as Demo ${personaRole.replace('_', ' ').toUpperCase()}`);
      setTimeout(() => {
        navigate(personaRole === 'buyer' ? '/marketplace' : '/dashboard');
      }, 600);
    }, 400);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-blue-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#030712]">
                <Cpu className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              AgentHub <span className="text-blue-500">AI</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 font-mono">
            Sign in to access AI Agents & x402 Algorand Micropayments
          </p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* ALREADY LOGGED IN STATE */}
        {userProfile?.isAuthenticated && (
          <Card className="p-6 space-y-4 border-blue-500/30 bg-gray-900/90 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold uppercase font-mono">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{userProfile.name}</h3>
                  <p className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]">
                    {userProfile.email}
                  </p>
                </div>
              </div>
              <Badge variant="emerald">Authenticated</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800/80">
                <span className="text-gray-400 text-[10px] block">Role</span>
                <span className="text-blue-400 font-bold capitalize">{userProfile.role}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800/80">
                <span className="text-gray-400 text-[10px] block">Account Balance</span>
                <span className="text-emerald-400 font-bold">₹{Math.round(wallet.balanceAlgo * 100000).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Go to Developer Dashboard
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => logoutUser()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-950 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out / Switch Account
              </button>
            </div>
          </Card>
        )}

        {/* NOT LOGGED IN FORM */}
        {!userProfile?.isAuthenticated && (
          <Card className="p-6 space-y-6 border-gray-800/80 bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            {/* Login Method Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-950 p-1 border border-gray-800/80 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 transition-all ${
                  activeTab === 'wallet'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Wallet className="h-3.5 w-3.5" />
                Web3 Wallet
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 transition-all ${
                  activeTab === 'email'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email / SSO
              </button>
            </div>

            {/* TAB 1: WEB3 WALLET LOGIN */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Connect your Algorand wallet to verify ownership, sign x402 micropayment proofs, and publish AI agents on Testnet.
                </p>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleWalletConnect('pera')}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/80 p-3.5 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold text-xs font-mono">
                        PERA
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          Pera Wallet
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Mobile & Web Extension
                        </div>
                      </div>
                    </div>
                    <Badge variant="emerald">Recommended</Badge>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleWalletConnect('algosigner')}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/80 p-3.5 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs font-mono">
                        ALGO
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          AlgoSigner / MyAlgo
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Algorand Browser Extension
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white" />
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleWalletConnect('defly')}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/80 p-3.5 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs font-mono">
                        DEFLY
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          Defly Wallet
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Algorand DeFi Wallet
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white" />
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleWalletConnect('web')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400 transition-all mt-3"
                  >
                    <Sparkles className="h-4 w-4" />
                    Auto-Generate Instant Algorand Testnet Account
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: EMAIL / SOCIAL LOGIN */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-300 block">Account Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  >
                    <option value="developer">AI Developer / Creator</option>
                    <option value="buyer">Enterprise AI Buyer / User</option>
                    <option value="node_operator">Algorand Validator Node</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-300 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@company.com"
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-xs text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-gray-300">Password</label>
                    <a href="#forgot" className="text-[11px] text-blue-400 hover:underline">
                      Magic Link?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-10 text-xs text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Verifying Credentials...'
                  ) : (
                    <>
                      Sign In with Email
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-mono">
                    <span className="bg-gray-900 px-2 text-gray-500">Or Continue With</span>
                  </div>
                </div>

                {/* Social SSO Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-950 p-2.5 text-xs text-gray-200 hover:border-gray-700 hover:bg-gray-800/60 transition-colors"
                  >
                    <Github className="h-4 w-4 text-white" />
                    GitHub
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-950 p-2.5 text-xs text-gray-200 hover:border-gray-700 hover:bg-gray-800/60 transition-colors"
                  >
                    <Globe className="h-4 w-4 text-blue-400" />
                    Google
                  </button>
                </div>
              </form>
            )}

            {/* QUICK DEMO PERSONAS */}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-gray-400">
                <span>Quick Demo Accounts</span>
                <span className="text-blue-400">1-Click Test</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => handleDemoClick('developer')}
                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-300 hover:bg-blue-500/20 transition-colors text-center"
                >
                  ⚡ Developer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoClick('buyer')}
                  className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-2 text-indigo-300 hover:bg-indigo-500/20 transition-colors text-center"
                >
                  🛒 AI Buyer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoClick('node_operator')}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-300 hover:bg-emerald-500/20 transition-colors text-center"
                >
                  🛡️ Validator
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Footer info */}
        <p className="text-center text-[11px] text-gray-500 font-mono">
          Secured by Algorand Cryptographic Consensus & x402 Micropayment Protocol.
        </p>
      </div>
    </div>
  );
};
