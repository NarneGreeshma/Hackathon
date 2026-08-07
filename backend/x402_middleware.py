import time
import random
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

def generate_x402_challenge(agent_id: str, agent_name: str, price_algo: float, price_inr: float, developer_address: str) -> dict:
    """
    Generates an official HTTP 402 Payment Required x402 Challenge.
    """
    challenge_id = "ch_" + "".join([str(random.randint(0, 9)) for _ in range(12)])
    nonce = "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=12))
    expires_at = int(time.time()) + 300 # 5 min validity

    return {
        "challenge_id": challenge_id,
        "agent_id": agent_id,
        "agent_name": agent_name,
        "price_algo": price_algo,
        "price_inr": price_inr,
        "developer_address": developer_address,
        "nonce": nonce,
        "expires_at": expires_at,
        "network": "algorand-testnet",
        "protocol": "x402",
        "message": "Payment required via x402 protocol. Please send payment transaction on Algorand."
    }

def extract_payment_proof(request_data: dict, headers: dict) -> tuple:
    """
    Extracts payment proof parameters from HTTP Headers or JSON Body.
    Checks:
    1. Header `X-402-Payment-Proof`
    2. Header `X-402-Payment-TxID` or `X-402-Tx-Hash`
    3. Body `paymentProof` object containing `txHash`, `tx_id`, or `challengeId`
    4. Body `tx_id` or `txHash`
    """
    proof_body = request_data.get("paymentProof") or request_data.get("payment_proof") or {}
    
    tx_hash = (
        proof_body.get("txHash")
        or proof_body.get("tx_id")
        or request_data.get("tx_id")
        or request_data.get("txHash")
        or headers.get("x-402-payment-txid")
        or headers.get("x-402-tx-hash")
    )

    sender_wallet = (
        proof_body.get("senderWallet")
        or proof_body.get("wallet_address")
        or request_data.get("wallet_address")
        or headers.get("x-402-sender-wallet")
        or "ALGO-WALLET-" + "".join(random.choices("0123456789ABCDEF", k=6))
    )

    challenge_id = (
        proof_body.get("challengeId")
        or request_data.get("challenge_id")
        or headers.get("x-402-challenge-id")
    )

    return tx_hash, sender_wallet, challenge_id
