import React, { useState } from 'react';
import { AlgorandTransaction } from '../../types';
import { Badge } from '../ui/Badge';
import { ExternalLink, CheckCircle2, ShieldCheck, Search, Filter } from 'lucide-react';

interface TransactionTableProps {
  transactions: AlgorandTransaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<string>('');

  const filteredTxs = transactions.filter(
    (tx) =>
      tx.txHash.toLowerCase().includes(filter.toLowerCase()) ||
      tx.agentName.toLowerCase().includes(filter.toLowerCase()) ||
      tx.payerAddress.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Algorand x402 Settlement Ledger
          </h3>
          <p className="text-xs text-gray-400 font-mono">Real-time cryptographic proof audit log</p>
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search TX hash, agent, payer..."
            className="w-full rounded-xl border border-gray-800 bg-gray-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:border-blue-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[11px] font-mono text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-3">Transaction ID</th>
              <th className="py-3 px-3">Agent</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Block Round</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-mono text-xs">
            {filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-xs">
                  No matching Algorand transactions found.
                </td>
              </tr>
            ) : (
              filteredTxs.map((tx) => (
                <tr key={tx.txHash} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <a
                      href={`https://testnet.algoexplorer.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 group"
                    >
                      <span>{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="py-3.5 px-3 text-white font-medium">{tx.agentName}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-400">₹{Math.round(tx.amountAlgo * 100000).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-gray-300">#{tx.blockRound}</td>
                  <td className="py-3.5 px-3">
                    <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="h-3 w-3" />}>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-right text-gray-400 text-[11px]">{tx.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
