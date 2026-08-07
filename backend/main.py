import os
import time
import json
import random
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.database import (
    init_db,
    get_all_agents,
    get_agent_by_id,
    create_agent,
    create_challenge,
    get_challenge,
    record_transaction,
    get_all_transactions,
    get_dashboard_metrics
)
from backend.algorand_utils import verify_algorand_transaction, fetch_transaction_details, create_transaction_params
from backend.x402_middleware import generate_x402_challenge, extract_payment_proof
from backend.ai_engine import execute_ai_agent

app = FastAPI(
    title="AgentHub AI Backend",
    description="Python FastAPI Backend for AgentHub AI with Algorand Blockchain & x402 Protocol Payments",
    version="1.0.0"
)

# Enable CORS for local Vite dev server and external requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    print("Database initialized successfully.")

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AgentHub AI Backend", "x402": "active"}

# --- PYDANTIC SCHEMAS ---

class AgentCreateSchema(BaseModel):
    name: str
    description: str
    category: Optional[str] = "Productivity"
    priceAlgo: Optional[float] = 0.005
    priceInr: Optional[float] = None
    developer: Optional[str] = "Anonymous Dev"
    developerAddress: str
    logo: Optional[str] = "Cpu"
    tags: Optional[List[str]] = ["AI", "Algorand"]
    systemPrompt: Optional[str] = None

class AgentRunSchema(BaseModel):
    agentId: Optional[str] = None
    input: Optional[str] = ""
    paymentProof: Optional[Dict[str, Any]] = None
    tx_id: Optional[str] = None
    wallet_address: Optional[str] = None

class VerifyPaymentSchema(BaseModel):
    challengeId: Optional[str] = None
    challenge_id: Optional[str] = None
    txHash: Optional[str] = None
    tx_id: Optional[str] = None
    senderWallet: Optional[str] = None
    wallet_address: Optional[str] = None
    agentId: Optional[str] = None
    agent_id: Optional[str] = None

# --- API ENDPOINTS ---

# 1. GET /api/agents - Get all marketplace agents
@app.get("/api/agents")
def list_agents():
    return get_all_agents()

# 2. GET /api/agents/{id} - Get single agent details
@app.get("/api/agents/{id}")
def get_agent(id: str):
    agent = get_agent_by_id(id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

# 3. POST /api/agents - Publish new custom agent
@app.post("/api/agents", status_code=201)
def publish_agent(agent_data: AgentCreateSchema):
    new_agent = create_agent(agent_data.dict())
    return new_agent

# Helper to process AI execution after payment verification
def process_agent_execution(agent: dict, user_input: str, tx_hash: str, wallet_address: str, challenge_id: str = None):
    # Verify Algorand payment transaction
    verification = verify_algorand_transaction(
        tx_id=tx_hash,
        expected_receiver=agent["developerAddress"],
        min_amount_algo=agent["priceAlgo"]
    )

    if not verification["verified"]:
        raise HTTPException(
            status_code=400,
            detail=f"Algorand transaction verification failed: {verification.get('error')}"
        )

    # Execute AI agent task
    ai_output = execute_ai_agent(
        agent_name=agent["name"],
        system_prompt=agent.get("systemPrompt", "You are an AI assistant."),
        user_input=user_input
    )

    current_round = verification.get("confirmed_round", 42109850)

    # Record transaction in SQLite database
    record_transaction({
        "tx_id": tx_hash,
        "agent_id": agent["id"],
        "agent_name": agent["name"],
        "wallet_address": wallet_address or verification.get("sender", "ALGO-WALLET-USER"),
        "developer_address": agent["developerAddress"],
        "amount_algo": agent["priceAlgo"],
        "block_round": current_round,
        "payment_status": "CONFIRMED",
        "timestamp": "Just now",
        "prompt": user_input,
        "ai_response": ai_output,
        "gas_fee_algo": verification.get("fee_algo", 0.001)
    })

    return {
        "statusCode": 200,
        "success": True,
        "output": ai_output,
        "verification": {
            "txHash": tx_hash,
            "confirmedRound": current_round,
            "fee": "0.001 ALGO",
            "status": "CONFIRMED_ON_ALGORAND",
            "x402Validated": True,
            "developerPayout": f"{agent['priceAlgo']} ALGO (~₹{agent['priceInr']})"
        }
    }

# 4. POST /api/agents/{id}/run - Run Agent protected by x402 Protocol
@app.post("/api/agents/{id}/run")

async def run_agent_by_id(id: str, request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    headers = {k.lower(): v for k, v in request.headers.items()}
    agent = get_agent_by_id(id)

    if not agent:
        # Fallback to first agent if ID mismatch
        agents = get_all_agents()
        agent = agents[0] if agents else None
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

    user_input = body.get("input", "")
    tx_hash, sender_wallet, challenge_id = extract_payment_proof(body, headers)

    # STEP 1: x402 PAYMENT CHECK
    # If no valid transaction proof is present, return HTTP 402 Payment Required
    if not tx_hash:
        challenge = generate_x402_challenge(
            agent_id=agent["id"],
            agent_name=agent["name"],
            price_algo=agent["priceAlgo"],
            price_inr=agent["priceInr"],
            developer_address=agent["developerAddress"]
        )
        create_challenge(challenge)

        return JSONResponse(
            status_code=402,
            content={
                "error": "Payment Required",
                "statusCode": 402,
                "x402": {
                    "agentId": agent["id"],
                    "agentName": agent["name"],
                    "priceAlgo": agent["priceAlgo"],
                    "priceInr": agent["priceInr"],
                    "developerAddress": agent["developerAddress"],
                    "challengeId": challenge["challenge_id"],
                    "nonce": challenge["nonce"],
                    "expiresAt": challenge["expires_at"],
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }
            }
        )

    # STEP 2: PAYMENT PRESENT -> VERIFY & EXECUTE AI
    result = process_agent_execution(
        agent=agent,
        user_input=user_input,
        tx_hash=tx_hash,
        wallet_address=sender_wallet,
        challenge_id=challenge_id
    )
    return result

# Legacy & Alias Routes for POST /api/agent/run and POST /agent/run
@app.post("/api/agent/run")
@app.post("/agent/run")
async def run_agent_generic(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    agent_id = body.get("agentId") or body.get("agent_id") or "algo-resume-screener"
    return await run_agent_by_id(agent_id, request)

# 5. POST /api/payments/verify - Verify Algorand transaction & x402 payment
@app.post("/api/payments/verify")
def verify_payment(payload: VerifyPaymentSchema):
    tx_hash = payload.txHash or payload.tx_id
    agent_id = payload.agentId or payload.agent_id
    sender = payload.senderWallet or payload.wallet_address or "ALGO-USER-WALLET"
    challenge_id = payload.challengeId or payload.challenge_id

    if not tx_hash:
        raise HTTPException(status_code=400, detail="Transaction ID (txHash) is required")

    agent = get_agent_by_id(agent_id) if agent_id else None
    expected_receiver = agent["developerAddress"] if agent else None
    min_amount = agent["priceAlgo"] if agent else 0.005

    verification = verify_algorand_transaction(
        tx_id=tx_hash,
        expected_receiver=expected_receiver,
        min_amount_algo=min_amount
    )

    if not verification["verified"]:
        return {
            "verified": False,
            "error": verification.get("error", "Transaction verification failed")
        }

    # Record verified transaction
    record_transaction({
        "tx_id": tx_hash,
        "agent_id": agent_id or "x402-payment",
        "agent_name": agent["name"] if agent else "x402 AI Payment",
        "wallet_address": sender,
        "developer_address": expected_receiver or "ALGO-ESCROW",
        "amount_algo": min_amount,
        "block_round": verification.get("confirmed_round", 42109850),
        "payment_status": "CONFIRMED",
        "timestamp": "Just now",
        "prompt": "x402 Pre-verified payment",
        "ai_response": "Verification OK",
        "gas_fee_algo": 0.001
    })

    return {
        "verified": True,
        "status": "CONFIRMED_ON_ALGORAND",
        "txHash": tx_hash,
        "confirmedRound": verification.get("confirmed_round", 42109850),
        "amountAlgo": min_amount,
        "x402ProofToken": f"x402-proof-{tx_hash}"
    }

# 6. GET /api/transactions - Algorand x402 Ledger
@app.get("/api/transactions")
def list_transactions():
    return get_all_transactions()

# 7. GET /api/dashboard & GET /api/analytics - Analytics and SaaS metrics
@app.get("/api/dashboard")
@app.get("/api/analytics")
def get_dashboard():
    return get_dashboard_metrics()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
