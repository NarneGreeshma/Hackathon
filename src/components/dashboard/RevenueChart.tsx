import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface RevenueChartProps {
  data: { date: string; revenueAlgo: number; requests: number }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    ...item,
    revenueInr: Math.round(item.revenueAlgo * 1000),
  }));

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Revenue & x402 Micropayment Volume
          </h3>
          <p className="text-xs text-gray-400 font-mono">Paid securely via Algorand Blockchain</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-gray-300">Revenue (₹)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            <span className="text-gray-300">Requests (x402)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={{ stroke: '#374151' }} />
            <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={{ stroke: '#374151' }} />
            <Tooltip
              formatter={(value: any, name: any) => [
                name === 'revenueInr' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
                name === 'revenueInr' ? 'Revenue (₹)' : 'Requests (x402)'
              ]}
              contentStyle={{
                backgroundColor: '#0d1322',
                borderColor: '#374151',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff',
                fontFamily: 'monospace',
              }}
            />
            <Area type="monotone" dataKey="revenueInr" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="requests" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
