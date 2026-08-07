import React from 'react';
import { AnalyticsData } from '../../types';
import { Card } from '../ui/Card';
import { Coins, Zap, CheckCircle2, Cpu, Clock, ShieldCheck, TrendingUp } from 'lucide-react';

interface MetricsGridProps {
  analytics: AnalyticsData;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ analytics }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `₹${Math.round(analytics.totalRevenueAlgo * 100000).toLocaleString('en-IN')}`,
      subtext: 'Paid securely via Algorand Blockchain',
      change: '+18.4% this week',
      icon: Coins,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Total Requests',
      value: analytics.totalRequests.toLocaleString(),
      subtext: '402 Micropayment Triggers',
      change: '+24% response rate',
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'x402 Verified Payments',
      value: analytics.successfulX402Count.toLocaleString(),
      subtext: '100% Algorand Consensus',
      change: 'Instant Settlement',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Active AI Agents',
      value: `${analytics.activeAgentsCount}`,
      subtext: 'Registered ASAs on Testnet',
      change: '6 Live Endpoints',
      icon: Cpu,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Avg Execution Latency',
      value: `${analytics.avgLatencyMs} ms`,
      subtext: 'Gemini + Algorand Node',
      change: '340ms ultra-fast',
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Algorand Reputation Score',
      value: `${analytics.algorandReputation}%`,
      subtext: 'Cryptographic Stake Rating',
      change: 'Verified Tier 1 Dev',
      icon: ShieldCheck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card key={m.title} className="p-5" hoverable={false}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">{m.title}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${m.bgColor} ${m.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="text-xl font-extrabold text-white font-mono tracking-tight mb-1">
              {m.value}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-gray-800/80">
              <span className="text-gray-400">{m.subtext}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <TrendingUp className="h-3 w-3" /> {m.change}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
