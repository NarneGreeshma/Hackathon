import { AlgorandTransaction } from '../types';

export const INITIAL_TRANSACTIONS: AlgorandTransaction[] = [
  {
    txHash: 'ALGO-TX-7F2A9C41E8D03B5A9F1E',
    agentId: 'code-reviewer',
    agentName: 'Code Reviewer Pro',
    payerAddress: 'ALGO-USER-44B1K9L2M5N7',
    receiverAddress: 'ALGO-CODE-77Y4K2M8P1N3Q6',
    amountAlgo: 0.01,
    blockRound: 42109823,
    status: 'CONFIRMED',
    x402Header: 'x402-algo-proof-ch_98410293108',
    timestamp: '2 mins ago',
    gasFeeAlgo: 0.001
  },
  {
    txHash: 'ALGO-TX-3K9N1M8P4Q2R7S5T0U6V',
    agentId: 'resume-analyzer',
    agentName: 'Resume Analyzer AI',
    payerAddress: 'ALGO-USER-88C3P1Q9L4',
    receiverAddress: 'ALGO-DEV-98X2K4M1N8P3Q5R7S9T0',
    amountAlgo: 0.005,
    blockRound: 42109820,
    status: 'CONFIRMED',
    x402Header: 'x402-algo-proof-ch_77391024820',
    timestamp: '8 mins ago',
    gasFeeAlgo: 0.001
  },
  {
    txHash: 'ALGO-TX-9P4R2S7T0U6V3K9N1M8P',
    agentId: 'ocr-extractor',
    agentName: 'OCR Vision Extractor',
    payerAddress: 'ALGO-USER-11A9K8L3M2',
    receiverAddress: 'ALGO-VISION-33X1K9L2M5N7P9',
    amountAlgo: 0.008,
    blockRound: 42109812,
    status: 'CONFIRMED',
    x402Header: 'x402-algo-proof-ch_55481920311',
    timestamp: '15 mins ago',
    gasFeeAlgo: 0.001
  },
  {
    txHash: 'ALGO-TX-1M8P4Q2R7S5T0U6V3K9N',
    agentId: 'translator-ai',
    agentName: 'Polyglot Neural Translator',
    payerAddress: 'ALGO-USER-22Z9X3M1N4',
    receiverAddress: 'ALGO-LINGUA-55Z2X9M3N1P4',
    amountAlgo: 0.003,
    blockRound: 42109795,
    status: 'CONFIRMED',
    x402Header: 'x402-algo-proof-ch_11029384756',
    timestamp: '32 mins ago',
    gasFeeAlgo: 0.001
  },
  {
    txHash: 'ALGO-TX-8S5T0U6V3K9N1M8P4Q2R',
    agentId: 'readme-summarizer',
    agentName: 'README GitHub Summarizer',
    payerAddress: 'ALGO-USER-77M2N4P6Q8',
    receiverAddress: 'ALGO-GITHUB-11A9K8L3M2N5',
    amountAlgo: 0.004,
    blockRound: 42109760,
    status: 'CONFIRMED',
    x402Header: 'x402-algo-proof-ch_99812039485',
    timestamp: '1 hour ago',
    gasFeeAlgo: 0.001
  }
];
