import sqlite3
import json
import time
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "agenthub.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        wallet_address TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # 2. Agents table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price_algo REAL NOT NULL,
        price_inr REAL NOT NULL,
        rating REAL NOT NULL,
        review_count INTEGER NOT NULL,
        developer TEXT NOT NULL,
        developer_address TEXT NOT NULL,
        logo TEXT NOT NULL,
        tags TEXT NOT NULL,
        app_id INTEGER NOT NULL,
        reputation_score INTEGER NOT NULL,
        featured INTEGER NOT NULL,
        system_prompt TEXT NOT NULL,
        created_round INTEGER NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 3. x402 challenges table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS challenges (
        challenge_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        price_algo REAL NOT NULL,
        price_inr REAL NOT NULL,
        developer_address TEXT NOT NULL,
        nonce TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # 4. Transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        tx_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        wallet_address TEXT NOT NULL,
        developer_address TEXT NOT NULL,
        amount_algo REAL NOT NULL,
        block_round INTEGER NOT NULL,
        payment_status TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        prompt TEXT,
        ai_response TEXT,
        gas_fee_algo REAL NOT NULL,
        created_at INTEGER NOT NULL
    )
    """)

    conn.commit()

    # Seed initial agents if empty
    cursor.execute("SELECT COUNT(*) FROM agents")
    if cursor.fetchone()[0] == 0:
        seed_initial_data(conn)

    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()
    initial_agents = [
        {
            "id": "algo-resume-screener",
            "name": "AlgoTalent Resume Screener",
            "description": "Upload or paste a resume to receive instant candidate grading, skill breakdown, gap analysis, and ATS optimization suggestions.",
            "category": "NLP & Content",
            "price_algo": 0.005,
            "price_inr": 499.0,
            "rating": 4.9,
            "review_count": 328,
            "developer": "AlgoTalent Core",
            "developer_address": "K3N2X8P9Q4M1V7T5L0W6R2Y8J4B9H1C5F0D3A7S2",
            "logo": "FileText",
            "tags": json.dumps(["HRTech", "ATS", "Resume", "Talent"]),
            "app_id": 89201452,
            "reputation_score": 98,
            "featured": 1,
            "system_prompt": "You are AlgoTalent Resume Screener. Grade the candidate, extract skills, list gaps, and suggest ATS improvements.",
            "created_round": 42105120
        },
        {
            "id": "vision-ocr-extractor",
            "name": "VisionLab Document OCR",
            "description": "Extract structured text, receipts, table data, and key-value fields from images and documents with ultra-high precision.",
            "category": "Vision & OCR",
            "price_algo": 0.008,
            "price_inr": 799.0,
            "rating": 4.8,
            "review_count": 215,
            "developer": "VisionLab Algorand",
            "developer_address": "R7Y2W8M1V5T9P4Q0L6K2J8H4B9C1F0D3A7S2X5N9",
            "logo": "ScanLine",
            "tags": json.dumps(["OCR", "Vision", "Invoice", "Data Extraction"]),
            "app_id": 89201880,
            "reputation_score": 96,
            "featured": 1,
            "system_prompt": "You are VisionLab Document OCR. Extract key tables, structured fields, invoice data, and text clearly.",
            "created_round": 42106000
        },
        {
            "id": "code-auditor-pro",
            "name": "DevX Smart Auditor",
            "description": "Static security audit, performance optimization hints, refactoring suggestions, and bug detection for TypeScript, Rust, Python, and PyTeal.",
            "category": "Code & Dev",
            "price_algo": 0.01,
            "price_inr": 1200.0,
            "rating": 4.95,
            "review_count": 540,
            "developer": "DevX Algorand Guild",
            "developer_address": "D9X2A8M1V7T5L0W6R2Y8J4B9H1C5F0D3A7S2P4Q0",
            "logo": "Code2",
            "tags": json.dumps(["Security", "Audit", "PyTeal", "TypeScript"]),
            "app_id": 89202110,
            "reputation_score": 100,
            "featured": 1,
            "system_prompt": "You are DevX Smart Auditor. Analyze code for security vulnerabilities, logic bugs, efficiency issues, and best practices.",
            "created_round": 42107200
        },
        {
            "id": "lingua-translate-ai",
            "name": "LinguaNet Multi-Translate",
            "description": "Nuanced multi-language contextual translation maintaining technical terminology, tone, and domain accuracy across 50+ languages.",
            "category": "Translation",
            "price_algo": 0.003,
            "price_inr": 250.0,
            "rating": 4.75,
            "review_count": 189,
            "developer": "LinguaNet Protocol",
            "developer_address": "L4W6R2Y8J4B9H1C5F0D3A7S2P4Q0M1V7T5K3N2X8",
            "logo": "Languages",
            "tags": json.dumps(["Translation", "Multi-lingual", "Localization"]),
            "app_id": 89203001,
            "reputation_score": 94,
            "featured": 0,
            "system_prompt": "You are LinguaNet Multi-Translate. Translate text accurately while preserving domain-specific jargon and nuance.",
            "created_round": 42108100
        },
        {
            "id": "repo-doc-summarizer",
            "name": "GitHub Repo Digest",
            "description": "Transform complex GitHub repositories and open-source documentation into concise executive summaries, installation guides, and API specs.",
            "category": "Productivity",
            "price_algo": 0.004,
            "price_inr": 399.0,
            "rating": 4.88,
            "review_count": 412,
            "developer": "OpenSource Foundation",
            "developer_address": "G8H1C5F0D3A7S2P4Q0M1V7T5K3N2X8R2Y8J4B9W6",
            "logo": "BookOpen",
            "tags": json.dumps(["Docs", "GitHub", "Summarizer", "Developer Tools"]),
            "app_id": 89204550,
            "reputation_score": 97,
            "featured": 0,
            "system_prompt": "You are GitHub Repo Digest. Summarize repositories, architecture, setup steps, and key API interfaces.",
            "created_round": 42108900
        },
        {
            "id": "teal-smart-contract-security",
            "name": "TEAL & PyTeal Guard",
            "description": "Audit Algorand Smart Contracts (PyTeal / TEAL / Algorand Python) for security flaws, state storage optimization, and fee efficiency.",
            "category": "Code & Dev",
            "price_algo": 0.015,
            "price_inr": 2000.0,
            "rating": 4.98,
            "review_count": 164,
            "developer": "Borderless Security",
            "developer_address": "B9H1C5F0D3A7S2P4Q0M1V7T5K3N2X8R2Y8J4W6G8",
            "logo": "ShieldCheck",
            "tags": json.dumps(["Algorand", "PyTeal", "Smart Contracts", "TEAL"]),
            "app_id": 89205000,
            "reputation_score": 99,
            "featured": 1,
            "system_prompt": "You are TEAL & PyTeal Guard. Expert security auditing for Algorand smart contracts written in PyTeal or TEAL.",
            "created_round": 42109500
        }
    ]

    for a in initial_agents:
        cursor.execute("""
        INSERT INTO agents (id, name, description, category, price_algo, price_inr, rating, review_count, developer, developer_address, logo, tags, app_id, reputation_score, featured, system_prompt, created_round, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, (
            a["id"], a["name"], a["description"], a["category"], a["price_algo"], a["price_inr"],
            a["rating"], a["review_count"], a["developer"], a["developer_address"], a["logo"],
            a["tags"], a["app_id"], a["reputation_score"], a["featured"], a["system_prompt"],
            a["created_round"]
        ))

    # Seed mock transactions
    initial_txs = [
        ("ALGO-TX-89F12A09C13E87A", "code-auditor-pro", "DevX Smart Auditor", "W7M1V5T9P4Q0L6K2J8H4B9C1F0D3A7S2X5N9R7Y2", "D9X2A8M1V7T5L0W6R2Y8J4B9H1C5F0D3A7S2P4Q0", 0.01, 42109850, "CONFIRMED", "2 mins ago", "Audit TEAL state proof code", "No vulnerabilities found.", 0.001, int(time.time()) - 120),
        ("ALGO-TX-77A912B34C890FE", "algo-resume-screener", "AlgoTalent Resume Screener", "L0W6R2Y8J4B9H1C5F0D3A7S2P4Q0M1V7T5K3N2X8", "K3N2X8P9Q4M1V7T5L0W6R2Y8J4B9H1C5F0D3A7S2", 0.005, 42109842, "CONFIRMED", "8 mins ago", "Senior React Developer Resume", "Candidate score: 92/100", 0.001, int(time.time()) - 480),
        ("ALGO-TX-55C103D88E711AA", "vision-ocr-extractor", "VisionLab Document OCR", "P4Q0M1V7T5K3N2X8R2Y8J4B9H1C5F0D3A7S2L0W6", "R7Y2W8M1V5T9P4Q0L6K2J8H4B9C1F0D3A7S2X5N9", 0.008, 42109820, "CONFIRMED", "18 mins ago", "Invoice #9821 OCR", "Extracted Total: $1,250.00", 0.001, int(time.time()) - 1080),
    ]

    for tx in initial_txs:
        cursor.execute("""
        INSERT INTO transactions (tx_id, agent_id, agent_name, wallet_address, developer_address, amount_algo, block_round, payment_status, timestamp, prompt, ai_response, gas_fee_algo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, tx)

    conn.commit()

# --- USER HELPER FUNCTIONS ---

def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO users (id, email, hashed_password, wallet_address, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    """, (
        user_data["id"],
        user_data["email"],
        user_data["hashed_password"],
        user_data.get("wallet_address", "")
    ))
    conn.commit()
    conn.close()
    return get_user_by_email(user_data["email"])

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# --- AGENT HELPER FUNCTIONS ---

def get_all_agents() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM agents ORDER BY featured DESC, rating DESC")
    rows = cursor.fetchall()
    conn.close()

    agents = []
    for r in rows:
        d = dict(r)
        d["tags"] = json.loads(d["tags"]) if isinstance(d["tags"], str) else d["tags"]
        d["priceAlgo"] = d.pop("price_algo")
        d["priceInr"] = d.pop("price_inr")
        d["reviewCount"] = d.pop("review_count")
        d["developerAddress"] = d.pop("developer_address")
        d["appId"] = d.pop("app_id")
        d["reputationScore"] = d.pop("reputation_score")
        d["systemPrompt"] = d.pop("system_prompt")
        d["createdRound"] = d.pop("created_round")
        d["featured"] = bool(d["featured"])
        agents.append(d)
    return agents

def get_agent_by_id(agent_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None
    d = dict(row)
    d["tags"] = json.loads(d["tags"]) if isinstance(d["tags"], str) else d["tags"]
    d["priceAlgo"] = d.pop("price_algo")
    d["priceInr"] = d.pop("price_inr")
    d["reviewCount"] = d.pop("review_count")
    d["developerAddress"] = d.pop("developer_address")
    d["appId"] = d.pop("app_id")
    d["reputationScore"] = d.pop("reputation_score")
    d["systemPrompt"] = d.pop("system_prompt")
    d["createdRound"] = d.pop("created_round")
    d["featured"] = bool(d["featured"])
    return d

def create_agent(agent_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    agent_id = agent_data.get("id") or agent_data["name"].lower().replace(" ", "-")
    price_algo = float(agent_data.get("priceAlgo", 0.005))
    price_inr = float(agent_data.get("priceInr") or round(price_algo * 250, 2))
    tags_json = json.dumps(agent_data.get("tags", ["AI", "Algorand"]))
    app_id = int(time.time() % 100000000)

    cursor.execute("""
    INSERT INTO agents (id, name, description, category, price_algo, price_inr, rating, review_count, developer, developer_address, logo, tags, app_id, reputation_score, featured, system_prompt, created_round, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, ?, ?, ?, 100, 0, ?, 42109850, datetime('now'))
    """, (
        agent_id,
        agent_data["name"],
        agent_data["description"],
        agent_data.get("category", "Productivity"),
        price_algo,
        price_inr,
        agent_data.get("developer", "Anonymous Dev"),
        agent_data.get("developerAddress", "0xAlgorandAddress"),
        agent_data.get("logo", "Cpu"),
        tags_json,
        app_id,
        agent_data.get("systemPrompt", "You are an AI assistant.")
    ))

    conn.commit()
    conn.close()
    return get_agent_by_id(agent_id)

def update_agent(agent_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    fields = []
    values = []

    field_map = {
        "name": "name",
        "description": "description",
        "category": "category",
        "priceAlgo": "price_algo",
        "priceInr": "price_inr",
        "developer": "developer",
        "developerAddress": "developer_address",
        "logo": "logo",
        "systemPrompt": "system_prompt"
    }

    for key, val in updates.items():
        if key == "tags" and isinstance(val, list):
            fields.append("tags = ?")
            values.append(json.dumps(val))
        elif key in field_map:
            fields.append(f"{field_map[key]} = ?")
            values.append(val)

    if not fields:
        conn.close()
        return get_agent_by_id(agent_id)

    values.append(agent_id)
    query = f"UPDATE agents SET {', '.join(fields)} WHERE id = ?"
    cursor.execute(query, values)
    conn.commit()
    conn.close()
    return get_agent_by_id(agent_id)

def delete_agent(agent_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM agents WHERE id = ?", (agent_id,))
    rows = cursor.rowcount
    conn.commit()
    conn.close()
    return rows > 0

def create_challenge(challenge_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO challenges (challenge_id, agent_id, price_algo, price_inr, developer_address, nonce, expires_at, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (
        challenge_data["challenge_id"],
        challenge_data["agent_id"],
        challenge_data["price_algo"],
        challenge_data["price_inr"],
        challenge_data["developer_address"],
        challenge_data["nonce"],
        challenge_data["expires_at"],
        challenge_data.get("status", "PENDING")
    ))
    conn.commit()
    conn.close()
    return challenge_data

def get_challenge(challenge_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM challenges WHERE challenge_id = ?", (challenge_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def record_transaction(tx_data: Dict[str, Any]):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO transactions (tx_id, agent_id, agent_name, wallet_address, developer_address, amount_algo, block_round, payment_status, timestamp, prompt, ai_response, gas_fee_algo, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tx_data["tx_id"],
        tx_data["agent_id"],
        tx_data.get("agent_name", "AI Agent"),
        tx_data["wallet_address"],
        tx_data.get("developer_address", "Escrow"),
        tx_data["amount_algo"],
        tx_data.get("block_round", 42109850),
        tx_data.get("payment_status", "CONFIRMED"),
        tx_data.get("timestamp", "Just now"),
        tx_data.get("prompt", ""),
        tx_data.get("ai_response", ""),
        tx_data.get("gas_fee_algo", 0.001),
        int(time.time())
    ))
    conn.commit()
    conn.close()

def get_all_transactions() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    txs = []
    for r in rows:
        d = dict(r)
        txs.append({
            "txHash": d["tx_id"],
            "agentId": d["agent_id"],
            "agentName": d["agent_name"],
            "payerAddress": d["wallet_address"],
            "receiverAddress": d["developer_address"],
            "amountAlgo": d["amount_algo"],
            "blockRound": d["block_round"],
            "status": d["payment_status"],
            "timestamp": d["timestamp"],
            "gasFeeAlgo": d["gas_fee_algo"],
            "prompt": d["prompt"],
            "aiResponse": d["ai_response"]
        })
    return txs

def get_dashboard_metrics() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(amount_algo), COUNT(*) FROM transactions WHERE payment_status = 'CONFIRMED'")
    row = cursor.fetchone()
    total_rev_algo = row[0] or 142.85
    total_successful_tx = row[1] or 12410

    cursor.execute("SELECT COUNT(*) FROM agents")
    agent_count = cursor.fetchone()[0]

    conn.close()

    return {
        "totalRevenueAlgo": round(total_rev_algo, 2),
        "totalRevenueInr": round(total_rev_algo * 250, 2),
        "totalRequests": total_successful_tx + 70,
        "successfulX402Count": total_successful_tx,
        "activeAgentsCount": agent_count,
        "avgLatencyMs": 310,
        "algorandReputation": 99.8,
        "revenueHistory": [
            {"date": "Mon", "revenueAlgo": 18.4, "requests": 1420},
            {"date": "Tue", "revenueAlgo": 22.1, "requests": 1890},
            {"date": "Wed", "revenueAlgo": 19.8, "requests": 1650},
            {"date": "Thu", "revenueAlgo": 26.5, "requests": 2100},
            {"date": "Fri", "revenueAlgo": 31.2, "requests": 2840},
            {"date": "Sat", "revenueAlgo": 24.8, "requests": 2190},
            {"date": "Sun", "revenueAlgo": 28.5, "requests": 2400}
        ],
        "categoryBreakdown": [
            {"name": "Code & Dev", "value": 42},
            {"name": "NLP & Content", "value": 28},
            {"name": "Vision & OCR", "value": 15},
            {"name": "Productivity", "value": 10},
            {"name": "Translation", "value": 5}
        ]
    }
