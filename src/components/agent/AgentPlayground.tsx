import React, { useState } from 'react';
import { Agent, X402Challenge } from '../../types';
import { runAgent } from '../../services/api';
import { X402PaymentModal } from '../payment/X402PaymentModal';
import { Play, Loader2, ShieldCheck, CheckCircle2, Zap, Copy, Check, Terminal, ExternalLink, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AgentPlaygroundProps {
  agent: Agent;
}

export const AgentPlayground: React.FC<AgentPlaygroundProps> = ({ agent }) => {
  const getDefaultInput = (agentId: string) => {
    switch (agentId) {
      case 'resume-analyzer':
        return `ALEX RIVERA | Principal Software Engineer
Email: alex.rivera@example.com | San Francisco, CA

SUMMARY:
10+ years driving distributed cloud infrastructure, microservices architecture, and Web3 smart contract systems. Expert in TypeScript, Rust, Go, Python, and PyTeal.

EXPERIENCE:
Staff Engineer @ CloudScale Inc (2021 - Present)
- Architected multi-region Kubernetes clusters handling 50k req/sec with 99.99% uptime.
- Reduced cloud compute spending by $450K/year via custom spot-instance auto-scalers.

Senior Developer @ AlgoFi Protocol (2018 - 2021)
- Built high-frequency DEX orderbook engine in PyTeal and Go.
- Conducted zero-downtime smart contract migrations on Algorand Mainnet.

SKILLS:
Languages: TypeScript, Rust, Go, Python, PyTeal, SQL
Infrastructure: AWS, GCP, Kubernetes, Docker, Terraform
Blockchain: Algorand, x402 Protocol, Smart Contracts`;

      case 'code-reviewer':
        return `// PyTeal Algorand Smart Contract Snippet
from pyteal import *

def approval_program():
    on_creation = Seq([
        App.globalPut(Bytes("Creator"), Txn.sender()),
        App.globalPut(Bytes("TotalVolume"), Int(0)),
        Approve()
    ])

    handle_noop = Cond(
        [Txn.application_args[0] == Bytes("deposit"), Seq([
            App.globalPut(Bytes("TotalVolume"), App.globalGet(Bytes("TotalVolume")) + Btoi(Txn.application_args[1])),
            Approve()
        ])]
    )

    return Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )`;

      case 'translator-ai':
        return `Welcome to AgentHub AI! Discover, trust, and securely execute AI agents through x402 HTTP micropayments and Algorand blockchain consensus verification. Please translate this announcement into Spanish and French with technical precision.`;

      case 'readme-summarizer':
        return `# AgentHub AI - Decentralized AI Agent Infrastructure

AgentHub AI is an open-source decentralized marketplace enabling AI developers to publish micro-agents and consumers to execute them trustlessly using x402 HTTP payment headers settled on the Algorand Blockchain.

## Architecture
- Frontend: React 19, Vite, TailwindCSS, Framer Motion
- Backend: Express / FastAPI, Google Gemini 3.6 Flash
- Blockchain: Algorand Testnet / Mainnet (ASAs, Smart Contracts)
- Payments: x402 HTTP Micropayment Protocol

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\``;

      case 'ocr-extractor':
        return `[RECEIPT SCAN DOCUMENT DATA]
Merchant: San Francisco Coffee Lab
Date: 2026-08-06 09:42:10 AM
Receipt #: SF-948201

ITEMS:
1x Iced Oat Milk Latte - $6.50
1x Avocado Sourdough Toast - $12.00
1x Cold Brew Concentrate (16oz) - $8.50

Subtotal: $27.00
Tax (8.625%): $2.33
Tip: $5.00
TOTAL PAID: $34.33
Payment Method: Algorand Pera Wallet (ALGO Tx #8f321a)
Status: COMPLETED`;

      default:
        return `Analyze this prompt using ${agent.name}. Please provide a comprehensive analysis.`;
    }
  };

  const [input, setInput] = useState<string>(getDefaultInput(agent.id));
  const [loading, setLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // x402 Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [pendingChallenge, setPendingChallenge] = useState<X402Challenge | null>(null);

  const handleRunAgent = async (paymentProof?: { txHash: string; senderWallet: string; challengeId: string }) => {
    setLoading(true);
    if (!paymentProof) {
      setOutput('');
      setVerificationData(null);
    }

    try {
      const res = await runAgent(agent.id, input, paymentProof);

      if (res.statusCode === 402 && res.x402) {
        // Intercept 402 Payment Required & open x402 modal
        setPendingChallenge(res.x402);
        setShowPaymentModal(true);
        setLoading(false);
        return;
      }

      if (res.success) {
        setOutput(res.output || 'Execution successful.');
        setVerificationData(res.verification);
      } else {
        setOutput(`Error: ${res.error || 'Failed to execute agent.'}`);
      }
    } catch (err: any) {
      setOutput(`Execution error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Interactive Execution Playground
            </h3>
            <p className="text-xs text-gray-400 font-mono">Test {agent.name} with live x402 verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue" icon={<Zap className="h-3 w-3" />}>
            ₹{agent.priceInr ? agent.priceInr.toLocaleString('en-IN') : Math.round(agent.priceAlgo * 100000).toLocaleString('en-IN')} / run
          </Badge>
          <Badge variant="emerald" icon={<ShieldCheck className="h-3 w-3" />}>
            App #{agent.appId}
          </Badge>
        </div>
      </div>

      {/* Input Section */}
      <div className="py-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wider">
            Agent Input Payload
          </label>
          <button
            onClick={() => setInput(getDefaultInput(agent.id))}
            className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Reset Sample Input
          </button>
        </div>

        <textarea
          rows={7}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input parameters or text payload for the agent..."
          className="w-full rounded-xl border border-gray-800 bg-gray-950/80 p-4 text-xs font-mono text-gray-200 placeholder-gray-600 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/60 transition-all leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] font-mono text-gray-500">
            Protocol: <span className="text-gray-300">HTTP 402 + Algorand Testnet</span>
          </div>

          <button
            onClick={() => handleRunAgent()}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Executing via x402...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Run Agent (₹{agent.priceInr ? agent.priceInr.toLocaleString('en-IN') : Math.round(agent.priceAlgo * 100000).toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output & Algorand Ledger Result Display */}
      {output && (
        <div className="mt-6 pt-6 border-t border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Execution Output & Verification
              </h4>
            </div>

            <button
              onClick={handleCopyOutput}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono bg-gray-800/80 px-2.5 py-1 rounded-lg border border-gray-700/60 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Verification Ledger Card */}
          {verificationData && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2.5 text-xs font-mono shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-2.5">
                <span className="flex items-center gap-1.5 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Payment Verified on Algorand
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified by Algorand
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-200 pt-1">
                <div>Transaction ID: <span className="text-blue-400 font-bold block sm:inline">{verificationData.txHash}</span></div>
                <div>Confirmed Block Round: <span className="text-emerald-300 font-bold">#{verificationData.confirmedRound}</span></div>
                <div>Settlement: <span className="text-emerald-400 font-bold">Paid securely via Algorand Blockchain</span></div>
                <div>x402 Protocol: <span className="text-emerald-400 font-bold">Validated 200 OK</span></div>
              </div>
            </div>
          )}

          {/* Text Output */}
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {output}
          </div>
        </div>
      )}

      {/* x402 Modal Popup */}
      <X402PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        challenge={pendingChallenge}
        agentName={agent.name}
        onPaymentSuccess={(proof) => {
          handleRunAgent(proof);
        }}
      />
    </div>
  );
};
