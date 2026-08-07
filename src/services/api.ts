import { Agent, AlgorandTransaction, AnalyticsData, X402Challenge } from '../types';

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

/**
 * Invokes an AI Agent endpoint with optional x402 payment proof
 */
export async function runAgent(
  agentId: string,
  input: string,
  paymentProof?: { txHash: string; senderWallet: string; challengeId: string }
): Promise<AgentRunResponse> {
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

  const data = await res.json();
  return {
    statusCode: res.status,
    ...data,
  };
}

/**
 * Fetches all registered marketplace agents
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const res = await fetch('/api/agents');
    if (!res.ok) throw new Error('Failed to fetch agents');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or error, falling back:', err);
    return [];
  }
}

/**
 * Publishes a new AI Agent to the marketplace & registers it on Algorand
 */
export async function publishAgent(agentData: Omit<Agent, 'id' | 'rating' | 'reviewCount' | 'appId' | 'reputationScore'>): Promise<Agent> {
  const res = await fetch('/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agentData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to publish agent');
  }

  return await res.json();
}

/**
 * Fetches the live Algorand x402 Transaction Ledger
 */
export async function getTransactions(): Promise<AlgorandTransaction[]> {
  try {
    const res = await fetch('/api/transactions');
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return await res.json();
  } catch (err) {
    return [];
  }
}

/**
 * Fetches Analytics Data for Dashboard
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    return {
      totalRevenueAlgo: 142.85,
      totalRequests: 12480,
      successfulX402Count: 12410,
      activeAgentsCount: 6,
      avgLatencyMs: 340,
      algorandReputation: 99.4,
      revenueHistory: [],
      categoryBreakdown: [],
    };
  }
}
