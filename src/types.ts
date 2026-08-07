export interface Agent {
  id: string;
  name: string;
  description: string;
  category: 'NLP & Content' | 'Vision & OCR' | 'Code & Dev' | 'Translation' | 'Productivity' | 'Analytics';
  priceAlgo: number; // e.g. 0.005
  priceInr: number;  // e.g. 1.25
  rating: number;    // e.g. 4.9
  reviewCount: number;
  developer: string; // e.g. "0xAlgoDev...8A"
  developerAddress: string;
  logo: string;      // Icon name or SVG/URL
  tags: string[];
  endpoint: string;  // e.g. "/api/agent/run"
  appId: number;     // Algorand Smart Contract App ID
  reputationScore: number;
  featured?: boolean;
  systemPrompt?: string;
  createdRound?: number;
}

export interface X402Challenge {
  agentId: string;
  agentName: string;
  priceAlgo: number;
  priceInr: number;
  developerAddress: string;
  challengeId: string;
  nonce: string;
  expiresAt: number;
  timestamp: string;
}

export interface AlgorandTransaction {
  txHash: string;
  agentId: string;
  agentName: string;
  payerAddress: string;
  receiverAddress: string;
  amountAlgo: number;
  blockRound: number;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  x402Header: string;
  timestamp: string;
  gasFeeAlgo: number;
}

export interface AnalyticsData {
  totalRevenueAlgo: number;
  totalRequests: number;
  successfulX402Count: number;
  activeAgentsCount: number;
  avgLatencyMs: number;
  algorandReputation: number;
  revenueHistory: { date: string; revenueAlgo: number; requests: number }[];
  categoryBreakdown: { name: string; value: number }[];
}

export interface UserWallet {
  address: string;
  balanceAlgo: number;
  connected: boolean;
  network: 'Algorand Mainnet' | 'Algorand Testnet';
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'developer' | 'buyer' | 'node_operator';
  avatarUrl?: string;
  isAuthenticated: boolean;
  loginMethod: 'wallet' | 'email' | 'google' | 'github';
  joinedAt?: string;
}

