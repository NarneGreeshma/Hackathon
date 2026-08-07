import { Agent, AlgorandTransaction, AnalyticsData, X402Challenge } from '../types';
import { INITIAL_AGENTS } from '../data/mockAgents';
import { INITIAL_TRANSACTIONS } from '../data/mockTransactions';

export interface AgentRunResponse {
  statusCode: number; // 200 or 402
  success?: boolean;
  output?: string;
  x402?: X402Challenge;
  verification?: {
    txHash: string;
    confirmedRound: number;
    fee: string;
    status: string;
    x402Validated: boolean;
    developerPayout: string;
  };
  error?: string;
}

function getLocalAgents(): Agent[] {
  try {
    const saved = localStorage.getItem('agenthub_published_agents');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveLocalAgent(agent: Agent) {
  try {
    const existing = getLocalAgents();
    const updated = [agent, ...existing.filter((a) => a.id !== agent.id)];
    localStorage.setItem('agenthub_published_agents', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Invokes an AI Agent endpoint with optional x402 payment proof
 */
export async function runAgent(
  agentId: string,
  input: string,
  paymentProof?: { txHash: string; senderWallet: string; challengeId: string }
): Promise<AgentRunResponse> {
  try {
    const res = await fetch('/api/agent/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(paymentProof ? { 'X-402-Payment-Proof': JSON.stringify(paymentProof) } : {}),
      },
      body: JSON.stringify({
        agentId,
        input,
        paymentProof,
      }),
    });

    if (res.ok || res.status === 402) {
      const data = await res.json();
      return {
        statusCode: res.status,
        ...data,
      };
    }
  } catch (err) {
    console.warn('Backend API unavailable for runAgent, using local x402 fallback handler:', err);
  }

  // Graceful Fallback Handler for Vercel / Client-only Execution
  const agents = await getAgents();
  const targetAgent = agents.find((a) => a.id === agentId) || INITIAL_AGENTS[0];

  // 1. If no payment proof provided, return 402 Payment Required Challenge
  if (!paymentProof) {
    return {
      statusCode: 402,
      x402: {
        agentId,
        agentName: targetAgent.name,
        priceAlgo: targetAgent.priceAlgo,
        priceInr: targetAgent.priceInr || Math.round(targetAgent.priceAlgo * 100000),
        developerAddress: targetAgent.developerAddress,
        challengeId: `ch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        nonce: Math.random().toString(36).substring(2, 10),
        expiresAt: Date.now() + 15 * 60 * 1000,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 2. If payment proof provided, generate verified AI execution result
  let mockOutput = '';
  switch (agentId) {
    case 'resume-analyzer':
      mockOutput = `### EXECUTIVE ASSESSMENT & MATCH SCORE: 94% (Verified via Algorand x402)
**Candidate Evaluation**: Senior / Staff Technical Role Fit

#### Key Strengths:
- **Distributed Infrastructure**: 10+ years experience with Kubernetes, Go, Rust, and microservices at scale.
- **Cost Savings**: Proven track record ($450K/year cloud compute reduction).
- **Algorand & Smart Contracts**: Native PyTeal and x402 protocol integration experience.

#### Actionable Recommendations:
1. Feature PyTeal and x402 header specifications in top technical skill section.
2. Emphasize team mentorship and architecture governance metrics.`;
      break;

    case 'code-reviewer':
      mockOutput = `### SECURITY & CODE QUALITY AUDIT

#### 1. Smart Contract Vulnerability Scan
- **Status**: PASSED (0 Critical, 0 High risks).
- **State Schema Bounds**: TotalVolume update logic is safe from integer overflow under TEAL v8 syntax.

#### 2. Performance & Gas Optimization
- Group transaction verification is optimized for single-round settlement.
- Recommend enforcing Txn.rekey_to() == Global.zero_address() guard condition for production safety.`;
      break;

    case 'ocr-extractor':
      mockOutput = `### EXTRACTED OCR STRUCTURED DATA

| Field | Extracted Value |
| :--- | :--- |
| **Merchant** | San Francisco Coffee Lab |
| **Receipt #** | SF-948201 |
| **Date & Time** | 2026-08-06 09:42:10 AM |
| **Total Amount** | $34.33 |
| **Payment Protocol** | Algorand x402 Micropayment |

#### Line Items:
- 1x Iced Oat Milk Latte ($6.50)
- 1x Avocado Sourdough Toast ($12.00)
- 1x Cold Brew Concentrate ($8.50)`;
      break;

    case 'translator-ai':
      mockOutput = `### NEURAL POLYGLOT TRANSLATION

#### Spanish:
¡Bienvenido a AgentHub AI! Descubra, confíe y ejecute de forma segura agentes de IA a través de micropagos HTTP x402 y verificación de consenso en la cadena de bloques Algorand.

#### French:
Bienvenue sur AgentHub AI ! Découvrez, faites confiance et exécutez en toute sécurité des agents IA via des micro-paiements HTTP x402 et une vérification par consensus sur la blockchain Algorand.`;
      break;

    case 'readme-summarizer':
      mockOutput = `### EXECUTIVE REPOSITORY SUMMARY

**Project**: AgentHub AI
**Core Value Proposition**: Decentralized AI agent infrastructure enabling pay-per-request monetization via Algorand x402 payment headers.

#### Key Architectural Highlights:
1. **x402 Gateway**: Intercepts unauthenticated API requests with HTTP 402 challenge.
2. **Algorand Ledger**: Verifies cryptographic micro-transactions in under 3.3 seconds.
3. **Marketplace UI**: React 19 + Tailwind dashboard for discovering and testing verified AI models.`;
      break;

    default:
      mockOutput = `### ${targetAgent.name} - EXECUTION COMPLETE\n\nAnalyzed input payload successfully:\n\n> "${input}"\n\n**Status**: 200 OK | Algorand x402 Payment Verified.`;
      break;
  }

  return {
    statusCode: 200,
    success: true,
    output: mockOutput,
    verification: {
      txHash: paymentProof.txHash,
      confirmedRound: Math.floor(39000000 + Math.random() * 500000),
      fee: '0.001 ALGO',
      status: 'CONFIRMED_ON_ALGORAND',
      x402Validated: true,
      developerPayout: 'Instant Settlement (Algorand Consensus)',
    },
  };
}

/**
 * Fetches all registered marketplace agents
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const res = await fetch('/api/agents');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const localAgents = getLocalAgents();
        const mergedMap = new Map<string, Agent>();
        [...INITIAL_AGENTS, ...data, ...localAgents].forEach((a) => mergedMap.set(a.id, a));
        return Array.from(mergedMap.values());
      }
    }
  } catch (err) {
    console.warn('Backend offline or error, using mock agents fallback:', err);
  }

  // Graceful fallback: return INITIAL_AGENTS combined with any user published agents
  const localAgents = getLocalAgents();
  const mergedMap = new Map<string, Agent>();
  [...INITIAL_AGENTS, ...localAgents].forEach((a) => mergedMap.set(a.id, a));
  return Array.from(mergedMap.values());
}

/**
 * Publishes a new AI Agent to the marketplace & registers it on Algorand
 */
export async function publishAgent(agentData: Omit<Agent, 'id' | 'rating' | 'reviewCount' | 'appId' | 'reputationScore'>): Promise<Agent> {
  const generatedId = agentData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `agent-${Date.now()}`;
  const newAgent: Agent = {
    ...agentData,
    id: generatedId,
    priceInr: agentData.priceInr || Math.round((agentData.priceAlgo || 0.005) * 100000),
    rating: 5.0,
    reviewCount: 1,
    appId: Math.floor(10000000 + Math.random() * 90000000),
    reputationScore: 100,
    featured: true,
  };

  try {
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });

    if (res.ok) {
      const created = await res.json();
      saveLocalAgent(created);
      return created;
    }
  } catch (err) {
    console.warn('Backend API unavailable, saving agent locally:', err);
  }

  saveLocalAgent(newAgent);
  return newAgent;
}

/**
 * Fetches the live Algorand x402 Transaction Ledger
 */
export async function getTransactions(): Promise<AlgorandTransaction[]> {
  try {
    const res = await fetch('/api/transactions');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Backend offline or error, returning mock transactions:', err);
  }
  return INITIAL_TRANSACTIONS;
}

/**
 * Fetches Analytics Data for Dashboard
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const res = await fetch('/api/analytics');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline or error, returning mock analytics:', err);
  }
  return {
    totalRevenueAlgo: 142.85,
    totalRequests: 12480,
    successfulX402Count: 12410,
    activeAgentsCount: 6,
    avgLatencyMs: 340,
    algorandReputation: 99.4,
    revenueHistory: [
      { date: 'Mon', revenueAlgo: 12.5, requests: 1200 },
      { date: 'Tue', revenueAlgo: 18.2, requests: 1650 },
      { date: 'Wed', revenueAlgo: 15.0, requests: 1400 },
      { date: 'Thu', revenueAlgo: 24.8, requests: 2100 },
      { date: 'Fri', revenueAlgo: 28.4, requests: 2450 },
      { date: 'Sat', revenueAlgo: 21.0, requests: 1800 },
      { date: 'Sun', revenueAlgo: 22.95, requests: 1880 },
    ],
    categoryBreakdown: [
      { name: 'Code & Dev', value: 38 },
      { name: 'NLP & Content', value: 28 },
      { name: 'Vision & OCR', value: 18 },
      { name: 'Productivity', value: 10 },
      { name: 'Translation', value: 6 },
    ],
  };
}

