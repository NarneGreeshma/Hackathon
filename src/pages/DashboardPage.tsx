import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { TransactionTable } from '../components/dashboard/TransactionTable';
import { getAnalytics, getTransactions, getAgents } from '../services/api';
import { AnalyticsData, AlgorandTransaction, Agent } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ShieldCheck, Cpu, Key, Globe, Zap, Settings, ArrowLeftRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [transactions, setTransactions] = useState<AlgorandTransaction[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    async function loadData() {
      const [aData, txData, agData] = await Promise.all([
        getAnalytics(),
        getTransactions(),
        getAgents(),
      ]);
      setAnalytics(aData);
      setTransactions(txData);
      setAgents(agData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-gray-400">
        Loading Developer Dashboard & Algorand Ledger...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
              Developer SaaS Hub
            </Badge>
            <Badge variant="emerald">Algorand Testnet Active</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Developer Analytics & Revenue Console
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8 overflow-hidden">
          {activeTab === 'overview' && (
            <>
              <MetricsGrid analytics={analytics} />
              <RevenueChart data={analytics.revenueHistory} />
              <TransactionTable transactions={transactions.slice(0, 5)} />
            </>
          )}

          {activeTab === 'transactions' && (
            <TransactionTable transactions={transactions} />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Pie Chart */}
                <Card className="p-6">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
                    Request Category Distribution
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0d1322',
                            borderColor: '#374151',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#fff',
                            fontFamily: 'monospace',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Status breakdown */}
                <Card className="p-6 space-y-4 font-mono text-xs">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    x402 Protocol HTTP Response Distribution
                  </h3>
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-300">
                        <span>HTTP 200 OK (Verified Execution)</span>
                        <span className="text-emerald-400 font-bold">99.4%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[99.4%]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-300">
                        <span>HTTP 402 Payment Required</span>
                        <span className="text-amber-400 font-bold">0.5%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                        <div className="h-full bg-amber-400 w-[0.5%]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-300">
                        <span>HTTP 400 Invalid Proof</span>
                        <span className="text-red-400 font-bold">0.1%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                        <div className="h-full bg-red-400 w-[0.1%]" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'my-agents' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                My Published AI Agents ({agents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="p-5 font-mono text-xs space-y-3" hoverable={false}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                      <Badge variant="emerald">ACTIVE</Badge>
                    </div>
                    <p className="text-gray-400 text-[11px] line-clamp-2">{agent.description}</p>
                    <div className="pt-2 border-t border-gray-800 flex justify-between text-gray-300">
                      <span>Price: <strong className="text-white">₹{agent.priceInr ? agent.priceInr.toLocaleString('en-IN') : Math.round(agent.priceAlgo * 100000).toLocaleString('en-IN')}</strong></span>
                      <span>App ID: <strong className="text-emerald-400">#{agent.appId}</strong></span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="space-y-6 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Algorand & x402 Protocol Configuration
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-gray-400 block">Algorand Node Endpoint</label>
                  <input
                    type="text"
                    defaultValue="https://testnet-api.algonode.cloud"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 block">Indexer API Endpoint</label>
                  <input
                    type="text"
                    defaultValue="https://testnet-idx.algonode.cloud"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 block">x402 Micropayment Header Name</label>
                  <input
                    type="text"
                    defaultValue="X-402-Payment-Proof"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
