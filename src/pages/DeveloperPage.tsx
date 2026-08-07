import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishAgent } from '../services/api';
import { generateAlgorandWalletAddress, registerAgentOnAlgorand } from '../services/algorand';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useWallet } from '../context/WalletContext';
import { Code2, Cpu, Coins, ShieldCheck, Sparkles, Loader2, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';

export const DeveloperPage: React.FC = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<'NLP & Content' | 'Vision & OCR' | 'Code & Dev' | 'Translation' | 'Productivity'>('Code & Dev');
  const [priceAlgo, setPriceAlgo] = useState<number>(0.005);
  const [developer, setDeveloper] = useState<string>('My Algorand Studio');
  const [developerAddress, setDeveloperAddress] = useState<string>(wallet.address);
  const [logo, setLogo] = useState<string>('Code2');
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('AI, Algorand, Web3');

  const [loading, setLoading] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerateWallet = () => {
    const newAddr = generateAlgorandWalletAddress();
    setDeveloperAddress(newAddr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !developerAddress.trim()) {
      setErrorMsg('Please fill in all required agent fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Step 1: Register Agent on Algorand Smart Contract Layer
      const algoReg = await registerAgentOnAlgorand({
        name,
        developerWallet: developerAddress,
        priceAlgo,
      });

      // Step 2: Publish to Marketplace Database
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      const published = await publishAgent({
        name,
        description,
        category,
        priceAlgo: Number(priceAlgo),
        priceInr: Math.round(Number(priceAlgo) * 100000),
        developer,
        developerAddress,
        logo,
        tags,
        endpoint: '/api/agent/run',
        systemPrompt: systemPrompt || `You are ${name}. Perform requested analysis efficiently.`,
      });

      setSuccessInfo({
        agent: published,
        appId: algoReg.appId,
        txHash: algoReg.txHash,
      });

      setTimeout(() => {
        navigate(`/agent/${published.id}`);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish agent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="blue" icon={<Code2 className="h-3.5 w-3.5" />}>
            Developer Portal
          </Badge>
          <Badge variant="emerald" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
            Algorand Smart Contract Registration
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Publish an AI Agent on AgentHub
        </h1>
        <p className="text-sm text-gray-400">
          Deploy your prompt, fine-tuned AI model, or custom API endpoint. Set your INR price per request and earn instant x402 micropayments.
        </p>
      </div>

      {/* Success Notification */}
      {successInfo && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 space-y-2 text-emerald-300 font-mono text-xs shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Agent Registered Successfully on Algorand Ledger!
          </div>
          <p>Algorand App ID: <strong className="text-emerald-400">#{successInfo.appId}</strong></p>
          <p>Registration TX Hash: <span className="text-blue-400">{successInfo.txHash}</span></p>
          <p className="pt-2 text-gray-400">Redirecting to live agent page...</p>
        </div>
      )}

      {/* Form */}
      <Card className="p-6 sm:p-8 space-y-6" hoverable={false}>
        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
          {/* Agent Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-bold block">
                Agent Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PyTeal Code Auditor"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-bold block">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white focus:border-blue-500/50 focus:outline-none cursor-pointer"
              >
                <option value="Code & Dev">Code & Dev</option>
                <option value="NLP & Content">NLP & Content</option>
                <option value="Vision & OCR">Vision & OCR</option>
                <option value="Translation">Translation</option>
                <option value="Productivity">Productivity</option>
              </select>
            </div>
          </div>

          {/* Icon & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-bold block">
                Agent Logo Icon <span className="text-red-400">*</span>
              </label>
              <select
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white focus:border-blue-500/50 focus:outline-none cursor-pointer"
              >
                <option value="Code2">Code2 (Developer)</option>
                <option value="FileText">FileText (Documents)</option>
                <option value="ScanText">ScanText (OCR & Vision)</option>
                <option value="Languages">Languages (Polyglot)</option>
                <option value="BookOpenCheck">BookOpenCheck (Summarizer)</option>
                <option value="ShieldCheck">ShieldCheck (Auditor)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-bold block">
                Price per Request (INR ₹) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={priceAlgo ? Math.round(priceAlgo * 100000) : 500}
                  onChange={(e) => setPriceAlgo(parseFloat(e.target.value) / 100000)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white focus:border-blue-500/50 focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold font-mono">
                  ₹{Math.round((priceAlgo || 0) * 100000).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Developer Wallet Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold block">
                Algorand Payout Developer Wallet Address <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateWallet}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Wand2 className="h-3 w-3" /> Auto-Generate Address
              </button>
            </div>
            <input
              type="text"
              required
              value={developerAddress}
              onChange={(e) => setDeveloperAddress(e.target.value)}
              placeholder="ALGO-DEV-..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white font-mono placeholder-gray-600 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold block">
              Short Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your AI agent accomplishes..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          {/* System Prompt / Gemini Instructions */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold block">
              System Prompt Instructions (AI Runner)
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system prompt instructions for Google Gemini model runner..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold block">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Audit, PyTeal, Smart Contract"
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Broadcasting Registration to Algorand Testnet...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Publish AI Agent & Register Smart Contract</span>
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
};
