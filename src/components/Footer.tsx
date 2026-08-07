import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800/80 bg-[#030712] py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800/60">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30">
                <Cpu className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">AgentHub AI</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The decentralized infrastructure for the AI Agent economy. Powered by x402 payment protocol, Algorand blockchain consensus, and Google Gemini AI.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Algorand Testnet
              </span>
              <span>•</span>
              <span className="text-blue-400">x402 Spec v1.0</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/marketplace" className="hover:text-blue-400 transition-colors">Marketplace</Link></li>
              <li><Link to="/developer" className="hover:text-blue-400 transition-colors">Publish Agent</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Developer Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors font-semibold text-blue-400">Account Login / Auth</Link></li>
              <li><a href="/#architecture" className="hover:text-blue-400 transition-colors">x402 Protocol Spec</a></li>
            </ul>
          </div>


          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Algorand Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://testnet.algoexplorer.io" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">AlgoExplorer <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://perawallet.app" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">Pera Wallet <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://developer.algorand.org" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">Algorand Developer Docs <ExternalLink className="h-3 w-3" /></a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Hackathon Tech</h4>
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Network Latency:</span>
                <span className="text-emerald-400">340ms</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Block Time:</span>
                <span className="text-blue-400">2.8s</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Gemini API:</span>
                <span className="text-indigo-400">3.6 Flash</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} AgentHub AI. Built for National AI + Blockchain Hackathon.</p>
          <p className="font-mono text-[11px]">Decentralized AI Agent Marketplace • x402 Micropayments</p>
        </div>
      </div>
    </footer>
  );
};
