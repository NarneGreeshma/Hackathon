from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UserRegisterSchema(BaseModel):
    email: str
    password: str
    wallet_address: Optional[str] = None

class UserLoginSchema(BaseModel):
    email: str
    password: str

class UserResponseSchema(BaseModel):
    id: str
    email: str
    wallet_address: Optional[str] = None

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

class AgentUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priceAlgo: Optional[float] = None
    priceInr: Optional[float] = None
    developer: Optional[str] = None
    developerAddress: Optional[str] = None
    logo: Optional[str] = None
    tags: Optional[List[str]] = None
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
