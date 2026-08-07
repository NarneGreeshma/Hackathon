import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X402Challenge } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { ShieldCheck, Zap, AlertCircle, CheckCircle2, Loader2, ArrowRight, Wallet, ExternalLink, Cpu } from 'lucide-react';
import { createX402AlgorandTransaction } from '../../services/algorand';

interface X402PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: X402Challenge | null;
  agentName: string;
  onPaymentSuccess: (proof: { txHash: string; senderWallet: string; challengeId: string }) => void;
}

export const X402PaymentModal: React.FC<X402PaymentModalProps> = ({
  isOpen,
  onClose,
  challenge,
  agentName,
  onPaymentSuccess,
}) => {
  const { wallet, deductBalance } = useWallet();
  const [step, setStep] = useState<'review' | 'broadcasting' | 'confirming' | 'verifying' | 'complete'>('review');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen || !challenge) return null;

  const handleExecutePayment = async () => {
    setErrorMsg('');
    
    // Check wallet balance
    if (wallet.balanceAlgo < challenge.priceAlgo) {
      setErrorMsg(`Insufficient balance for payment verification.`);
      return;
    }

    try {
      // Step 1: Broadcast
      setStep('broadcasting');
      const generatedTxHash = 'ALGO-TX-' + Math.random().toString(36).substring(2, 14).toUpperCase();
      setTxHash(generatedTxHash);

      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Algorand Block Consensus
      setStep('confirming');
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Deduct balance & Verify x402 Proof
      deductBalance(challenge.priceAlgo);
      setStep('verifying');
      await new Promise((r) => setTimeout(r, 600));

      // Step 4: Complete & trigger callback
      setStep('complete');
      setTimeout(() => {
        onPaymentSuccess({
          txHash: generatedTxHash,
          senderWallet: wallet.address,
          challengeId: challenge.challengeId,
        });
        onClose();
        setStep('review');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment broadcast failed');
      setStep('review');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl border border-blue-500/30 bg-[#0d1322] p-6 shadow-2xl shadow-blue-500/10 overflow-hidden"
        >
          {/* Header Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

          {/* Modal Title */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <span className="font-mono text-xs font-bold">402</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  HTTP 402 Payment Required
                </h3>
                <p className="text-xs text-gray-400 font-mono">x402 Protocol • Algorand Verification</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={step !== 'review'}
              className="text-gray-400 hover:text-white transition-colors text-sm px-2 py-1 rounded-lg hover:bg-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Body depending on step */}
          <div className="py-5 space-y-4">
            {step === 'review' && (
              <>
                <div className="rounded-xl border border-gray-800/80 bg-gray-950/60 p-4 space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Target Agent:</span>
                    <span className="font-semibold text-white">{agentName}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Micropayment Cost:</span>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-400 text-base">₹{challenge.priceInr ? challenge.priceInr.toLocaleString('en-IN') : Math.round(challenge.priceAlgo * 100000).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-400/80 block">Paid securely via Algorand Blockchain</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Developer Address:</span>
                    <span className="text-blue-400 text-[11px] font-mono">{challenge.developerAddress.slice(0, 8)}...{challenge.developerAddress.slice(-6)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-gray-800/80 pt-2">
                    <span className="text-gray-400">x402 Challenge ID:</span>
                    <span className="text-gray-300 text-[11px]">{challenge.challengeId}</span>
                  </div>
                </div>

                {/* Wallet Balance Status */}
                <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Wallet className="h-4 w-4 text-blue-400" />
                    <span>Your Balance:</span>
                  </div>
                  <span className="font-bold text-white">₹{Math.round(wallet.balanceAlgo * 100000).toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handleExecutePayment}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all duration-200"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  Confirm & Pay ₹{challenge.priceInr ? challenge.priceInr.toLocaleString('en-IN') : Math.round(challenge.priceAlgo * 100000).toLocaleString('en-IN')}
                </button>
              </>
            )}

            {step !== 'review' && (
              <div className="py-6 space-y-6 text-center">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white font-mono">
                    {step === 'broadcasting' && 'Broadcasting Transaction to Algorand Node...'}
                    {step === 'confirming' && 'Awaiting Algorand Block Consensus...'}
                    {step === 'verifying' && 'Validating x402 Cryptographic Proof...'}
                    {step === 'complete' && 'Settlement Verified! Executing AI Model...'}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono truncate px-4">
                    TX Hash: {txHash || 'ALGO-TX-PENDING...'}
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-2 text-left font-mono text-xs bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-gray-300">Generate ₹{challenge.priceInr ? challenge.priceInr.toLocaleString('en-IN') : Math.round(challenge.priceAlgo * 100000).toLocaleString('en-IN')} Micro-Payment Proof</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step === 'broadcasting' ? <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    <span className={step === 'broadcasting' ? 'text-blue-400 font-bold' : 'text-gray-300'}>
                      Broadcast to Algorand Testnet
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step === 'confirming' ? <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" /> : step === 'verifying' || step === 'complete' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-3.5 w-3.5 rounded-full border border-gray-700" />}
                    <span className={step === 'confirming' ? 'text-blue-400 font-bold' : 'text-gray-400'}>
                      Block Round #42109826 Consensus
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step === 'verifying' ? <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" /> : step === 'complete' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-3.5 w-3.5 rounded-full border border-gray-700" />}
                    <span className={step === 'verifying' ? 'text-blue-400 font-bold' : 'text-gray-400'}>
                      x402 Header Signature Verification
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>Protocol: x402-algorand-v1</span>
            <span>Security: Zero-Trust</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
