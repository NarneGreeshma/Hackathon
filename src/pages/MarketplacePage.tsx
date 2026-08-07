import React, { useState, useEffect } from 'react';
import { Agent, X402Challenge } from '../types';
import { getAgents, runAgent } from '../services/api';
import { AgentCard } from '../components/marketplace/AgentCard';
import { CategoryFilter } from '../components/marketplace/CategoryFilter';
import { SearchBar } from '../components/marketplace/SearchBar';
import { X402PaymentModal } from '../components/payment/X402PaymentModal';
import { Badge } from '../components/ui/Badge';
import { Store, Loader2, Cpu, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('trending');

  // Quick Trial Modal State
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [pendingChallenge, setPendingChallenge] = useState<X402Challenge | null>(null);

  const categories = ['All', 'NLP & Content', 'Vision & OCR', 'Code & Dev', 'Translation', 'Productivity'];

  useEffect(() => {
    async function loadAgents() {
      const data = await getAgents();
      setAgents(data);
      setLoading(false);
    }
    loadAgents();
  }, []);

  const handleUseAgentClick = async (agent: Agent) => {
    setSelectedAgent(agent);
    try {
      const res = await runAgent(agent.id, 'Marketplace trial run');
      if (res.statusCode === 402 && res.x402) {
        setPendingChallenge(res.x402);
        setShowPaymentModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter & Sort Logic
  const filteredAgents = agents
    .filter((agent) => {
      const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'top-rated') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.priceAlgo - b.priceAlgo;
      if (sortBy === 'price-high') return b.priceAlgo - a.priceAlgo;
      if (sortBy === 'newest') return b.appId - a.appId;
      return b.reviewCount - a.reviewCount; // trending default
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="blue" icon={<Store className="h-3.5 w-3.5" />}>
            AI Agent Registry
          </Badge>
          <Badge variant="emerald" icon={<Sparkles className="h-3.5 w-3.5" />}>
            x402 Protocol Enabled
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Decentralized AI Marketplace
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Discover, audit, and invoke specialized AI models verified on the Algorand ledger. Pay seamlessly per API request via x402 headers.
        </p>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="space-y-4 pt-2">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400 font-mono">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span>Fetching Algorand AI Agent Registry...</span>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-gray-800 bg-gray-900/40 p-8 space-y-3 font-mono">
          <Cpu className="h-10 w-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Agents Match Your Search</h3>
          <p className="text-xs text-gray-400">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onUseAgent={handleUseAgentClick} />
          ))}
        </div>
      )}

      {/* x402 Payment Modal */}
      <X402PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        challenge={pendingChallenge}
        agentName={selectedAgent?.name || 'AI Agent'}
        onPaymentSuccess={(proof) => {
          if (selectedAgent) {
            navigate(`/agent/${selectedAgent.id}`);
          }
        }}
      />
    </div>
  );
};
