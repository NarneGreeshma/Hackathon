import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Agent, X402Challenge } from '../types';
import { getAgents, runAgent } from '../services/api';
import { AgentCard } from '../components/marketplace/AgentCard';
import { X402PaymentModal } from '../components/payment/X402PaymentModal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Cpu, ShieldCheck, Zap, ArrowRight, Layers, Terminal, Sparkles, CheckCircle2, Lock, Coins, Code2, Globe } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Quick Trial Modal State
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [pendingChallenge, setPendingChallenge] = useState<X402Challenge | null>(null);

  useEffect(() => {
    async function loadData() {
      const allAgents = await getAgents();
      setFeaturedAgents(allAgents.slice(0, 6));
      setLoading(false);
    }
    loadData();
  }, []);

  const handleUseAgentClick = async (agent: Agent) => {
    setSelectedAgent(agent);
    try {
      const res = await runAgent(agent.id, 'Sample landing page trial run');
      if (res.statusCode === 402 && res.x402) {
        setPendingChallenge(res.x402);
        setShowPaymentModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20">
        {/* Glow Background Gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & Hero CTA */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-mono text-blue-400 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Next-Gen Decentralized AI Infrastructure</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
              >
                AgentHub <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-200"
              >
                The Infrastructure for the AI Agent Economy
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl"
              >
                Discover, trust and securely use AI agents through x402 payments and Algorand verification.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/marketplace"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all duration-200"
                >
                  <Cpu className="h-4 w-4" />
                  Explore Agents
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/developer"
                  className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/80 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-700 hover:text-white backdrop-blur-md transition-colors"
                >
                  <Code2 className="h-4 w-4 text-blue-400" />
                  Become a Developer
                </Link>
              </motion.div>

              {/* Protocol Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Algorand Consensus Proofs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>x402 Micropayment Headers</span>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Interactive AI + Algorand Node Canvas Visualizer */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-3xl border border-gray-800 bg-gradient-to-b from-gray-900/90 to-gray-950/90 p-6 shadow-2xl backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="emerald" icon={<ShieldCheck className="h-3 w-3" />}>
                    Live Testnet
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-800/80 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">x402 Execution Terminal</h4>
                      <p className="text-[10px] text-gray-400 font-mono">Algorand Block Round #42109825</p>
                    </div>
                  </div>

                  {/* Visual Stream Cards */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-amber-300 space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>HTTP 402 PAYMENT REQUIRED</span>
                        <span className="text-amber-400">₹499</span>
                      </div>
                      <p className="text-[10px] text-amber-400/80 truncate">Header: X-402-Challenge-ID: ch_98410293108</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-blue-400 rotate-90 my-0.5 animate-bounce" />
                    </div>

                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-blue-300 space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>ALGORAND consensus</span>
                        <span className="text-emerald-400">0.001 Fee</span>
                      </div>
                      <p className="text-[10px] text-blue-400/80 truncate">Tx: ALGO-TX-7F2A9C41E8D03B5A9F1E</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-emerald-400 rotate-90 my-0.5 animate-bounce" />
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-300 space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>HTTP 200 OK AI RESPONSE</span>
                        <span className="text-emerald-400">Gemini 3.6 Flash</span>
                      </div>
                      <p className="text-[10px] text-emerald-400/80">Result: "Code Review complete. 0 vulnerabilities found."</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM METRICS COUNTER BAR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md font-mono text-center">
          <div className="space-y-1 border-r border-gray-800/80 last:border-0 pr-2">
            <div className="text-2xl font-extrabold text-white">12,480+</div>
            <div className="text-xs text-gray-400">x402 Micropayments</div>
          </div>
          <div className="space-y-1 border-r border-gray-800/80 last:border-0 pr-2">
            <div className="text-2xl font-extrabold text-emerald-400">₹35,712</div>
            <div className="text-xs text-gray-400">Developer Revenue (INR)</div>
          </div>
          <div className="space-y-1 border-r border-gray-800/80 last:border-0 pr-2">
            <div className="text-2xl font-extrabold text-blue-400">2.8 sec</div>
            <div className="text-xs text-gray-400">Algorand Settlement</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-indigo-400">100%</div>
            <div className="text-xs text-gray-400">Cryptographic Proof</div>
          </div>
        </div>
      </section>

      {/* FEATURED AI AGENTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge variant="blue" icon={<Sparkles className="h-3 w-3" />}>
              Curated Marketplace
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Featured AI Agents
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Verified decentralized models ready for instant micropayment execution.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
          >
            View All Marketplace Agents <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onUseAgent={handleUseAgentClick} />
          ))}
        </div>
      </section>

      {/* HOW X402 + ALGORAND WORKS ARCHITECTURE SECTION */}
      <section id="architecture" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="amber" icon={<Lock className="h-3 w-3" />}>
            x402 Protocol Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trustless Execution via HTTP 402 + Algorand
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            How AgentHub AI secures micro-transactions without traditional credit card fees or centralized API keys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="space-y-3" hoverable={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white font-mono">1. Unauthenticated Request</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Client sends request to AI Agent endpoint. Server returns <code className="text-amber-400 font-mono">HTTP 402 Payment Required</code>.
            </p>
          </Card>

          <Card className="space-y-3" hoverable={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white font-mono">2. x402 Micropayment</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              User signs payment transaction (e.g. ₹499) via wallet to the developer address.
            </p>
          </Card>

          <Card className="space-y-3" hoverable={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white font-mono">3. Algorand Consensus</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Transaction is confirmed on Algorand in &lt;3s. Cryptographic header proof is attached.
            </p>
          </Card>

          <Card className="space-y-3" hoverable={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-white font-mono">4. AI Agent Execution</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Server verifies proof and returns <code className="text-emerald-400 font-mono">HTTP 200 OK</code> with Gemini AI output.
            </p>
          </Card>
        </div>
      </section>

      {/* DEVELOPER CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-indigo-950/60 to-gray-950 p-8 lg:p-12 text-center space-y-6 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-mono text-blue-300">
            <Coins className="h-3.5 w-3.5" />
            Monetize Your AI Prompts & Models
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
            Ready to Monetize Your AI Agent on Algorand?
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Publish your prompt, code, or model API endpoint in seconds. Get paid instantly in INR every time a user or API invokes your agent through x402.
          </p>

          <div className="pt-2">
            <Link
              to="/developer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-2xl shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-400 transition-all duration-200"
            >
              Publish Your AI Agent Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Trial Payment Modal */}
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
