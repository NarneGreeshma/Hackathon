import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Agent } from '../types';
import { getAgents } from '../services/api';
import { AgentPlayground } from '../components/agent/AgentPlayground';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Star, ShieldCheck, Cpu, ArrowLeft, ExternalLink, Code2, Copy, Check, Terminal, FileText, ScanText, Languages, BookOpenCheck } from 'lucide-react';

export const AgentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'playground' | 'api' | 'algorand' | 'reviews'>('playground');
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAgent() {
      const all = await getAgents();
      const found = all.find((a) => a.id === id) || all[0];
      setAgent(found);
      setLoading(false);
    }
    fetchAgent();
  }, [id]);

  if (loading || !agent) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-gray-400">
        Loading agent details from Algorand ledger...
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="h-8 w-8 text-blue-400" />;
      case 'ScanText': return <ScanText className="h-8 w-8 text-indigo-400" />;
      case 'Code2': return <Code2 className="h-8 w-8 text-cyan-400" />;
      case 'Languages': return <Languages className="h-8 w-8 text-emerald-400" />;
      case 'BookOpenCheck': return <BookOpenCheck className="h-8 w-8 text-purple-400" />;
      case 'ShieldCheck': return <ShieldCheck className="h-8 w-8 text-amber-400" />;
      default: return <Cpu className="h-8 w-8 text-blue-400" />;
    }
  };

  const curlSnippet = `curl -X POST "${window.location.origin}/api/agent/run" \\
  -H "Content-Type: application/json" \\
  -H "X-402-Payment-Proof: {\\"txHash\\": \\"ALGO-TX-7F2A9C...\\", \\"senderWallet\\": \\"ALGO-USER-88C3...\\"}" \\
  -d '{
    "agentId": "${agent.id}",
    "input": "Your input prompt payload here"
  }'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
      </Link>

      {/* Agent Header Banner */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/30 shadow-lg">
              {getIcon(agent.logo)}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{agent.name}</h1>
                <Badge variant="blue">{agent.category}</Badge>
                <Badge variant="emerald" icon={<ShieldCheck className="h-3 w-3" />}>
                  App #{agent.appId}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                {agent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {agent.rating} ({agent.reviewCount} reviews)
                </span>
                <span>•</span>
                <span>Developer: <strong className="text-gray-200">{agent.developer}</strong></span>
                <span>•</span>
                <span className="text-blue-400">{agent.developerAddress.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-5 min-w-[200px] text-right space-y-1 font-mono">
            <span className="text-xs text-gray-400 block">Price per request</span>
            <span className="text-3xl font-extrabold text-emerald-400 block">₹{agent.priceInr ? agent.priceInr.toLocaleString('en-IN') : Math.round(agent.priceAlgo * 100000).toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-400/90 block pt-1 font-semibold">Paid securely via Algorand Blockchain</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'playground'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          Execution Playground
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'api'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          API & cURL Specs
        </button>

        <button
          onClick={() => setActiveTab('algorand')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'algorand'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          Algorand Ledger Contract
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'playground' && <AgentPlayground agent={agent} />}

      {activeTab === 'api' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                x402 API Integration Code Snippet
              </h3>
              <p className="text-xs text-gray-400 font-mono">Send requests programmatically using standard HTTP clients</p>
            </div>

            <button
              onClick={handleCopyCurl}
              className="flex items-center gap-1.5 text-xs text-gray-300 font-mono bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 hover:text-white"
            >
              {copiedCurl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedCurl ? 'Copied' : 'Copy cURL'}
            </button>
          </div>

          <pre className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed">
            {curlSnippet}
          </pre>
        </Card>
      )}

      {activeTab === 'algorand' && (
        <Card className="space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Algorand Smart Contract Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-gray-950 p-4 border border-gray-800 space-y-2">
              <span className="text-gray-400 block text-[11px]">Algorand App ID:</span>
              <span className="text-emerald-400 font-bold text-sm">#{agent.appId}</span>
            </div>
            <div className="rounded-xl bg-gray-950 p-4 border border-gray-800 space-y-2">
              <span className="text-gray-400 block text-[11px]">Developer Payout Wallet:</span>
              <span className="text-blue-400 font-bold text-xs truncate block">{agent.developerAddress}</span>
            </div>
            <div className="rounded-xl bg-gray-950 p-4 border border-gray-800 space-y-2">
              <span className="text-gray-400 block text-[11px]">Reputation Stake Score:</span>
              <span className="text-amber-400 font-bold text-sm">{agent.reputationScore} / 100</span>
            </div>
            <div className="rounded-xl bg-gray-950 p-4 border border-gray-800 space-y-2">
              <span className="text-gray-400 block text-[11px]">Network Consensus:</span>
              <span className="text-white font-bold text-sm">Algorand Testnet v1.0</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
