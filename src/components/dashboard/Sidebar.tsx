import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, PlusCircle, ArrowLeftRight, BarChart3, Settings, ShieldCheck, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions Ledger', icon: ArrowLeftRight },
    { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
    { id: 'my-agents', label: 'My Published Agents', icon: Cpu },
    { id: 'settings', label: 'Protocol Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 rounded-2xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-md h-fit">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-800/80 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white font-mono">Developer Console</h4>
          <span className="text-[10px] text-gray-400 font-mono">Algorand Node connected</span>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold font-mono transition-all duration-200 ${
                active
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-gray-800/80 space-y-2">
        <Link
          to="/developer"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 font-mono"
        >
          <PlusCircle className="h-4 w-4" />
          Publish New Agent
        </Link>

        <Link
          to="/marketplace"
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-800 bg-gray-950 py-2 text-xs font-medium text-gray-400 hover:text-white hover:border-gray-700 transition-colors font-mono"
        >
          <Store className="h-3.5 w-3.5" />
          Explore Marketplace
        </Link>
      </div>
    </aside>
  );
};
