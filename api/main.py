from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from deep_translator import GoogleTranslator
import time
import random

app = FastAPI(title="CyberGuard AI | Phase 4 - Advanced Threat Hunting")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phase 4 Memory
full_audit_log = []
latest_alerts = []
ADMIN_SECRET_KEY = "Vision2030_Secure"

class TrafficData(BaseModel):
    ip_source: str
    packet_size: int
    request_count: int
    payload: str = ""

class ChatRequest(BaseModel):
    message: str

def get_arabic_insight(english_text):
    try:
        # JAIS-style Simulation
        return GoogleTranslator(source='en', target='ar').translate(english_text)
    except:
        return "تحذير أمني نشط"

@app.post("/analyze-traffic")
async def analyze(data: TrafficData):
    is_anomaly = False
    threat_type = "Normal Traffic"
    recommendation = "Monitoring"
    severity = "Low"
    
    # --- PHASE 4: MULTI-LAYER DETECTION LOGIC ---

    # 1. SQL Injection (Pattern-based)
    sql_keywords = ["SELECT", "DROP", "UNION", "OR '1'='1'"]
    if any(k in data.payload.upper() for k in sql_keywords):
        threat_type = "SQL Injection Attempt"
        is_anomaly = True
        recommendation = "Block IP & Sanitize Database Inputs"
        severity = "Critical"

    # 2. DDoS Attack (Heuristic-based: High Volume + Large Packets)
    # Phase 4 Upgrade: Detecting volumetric threats
    elif data.request_count > 500 and data.packet_size > 800:
        threat_type = "DDoS Attack (Critical Volume)"
        is_anomaly = True
        recommendation = "Activate Traffic Scrubbing & WAF Rate Limiting"
        severity = "Critical"

    # 3. Brute Force (Behavior-based: High Frequency)
    elif data.request_count > 800:
        threat_type = "Brute Force Attack"
        is_anomaly = True
        recommendation = "Enable MFA & Account Lockout Policy"
        severity = "High"

    result = {
        "timestamp": time.ctime(),
        "is_anomaly": is_anomaly,
        "threat_level": severity,
        "analysis_report": threat_type,
        "arabic_report": get_arabic_insight(threat_type),
        "recommendation": recommendation,
        "ip_source": data.ip_source,
        "location": random.choice(["NEOM Node-1", "Riyadh DataCenter", "Dubai SmartHub", "Jeddah Port Gateway"])
    }

    if is_anomaly:
        # Update dashboard alerts (last 5)
        latest_alerts.insert(0, result)
        if len(latest_alerts) > 5: latest_alerts.pop()
        # Permanent session audit log
        full_audit_log.append(result)

    return result

@app.get("/audit-status")
async def audit_status():
    return {"total_logs": len(full_audit_log)}

@app.get("/export-audit")
async def export_audit(api_key: str = Query(None)):
    # Phase 3/4 Security: Admin Auth
    if api_key != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {
        "generated_at": time.ctime(),
        "total_incidents": len(full_audit_log),
        "region": "Vision 2030 Unified Grid",
        "audit_data": full_audit_log
    }

@app.post("/chat")
async def chat_with_ai(req: ChatRequest):
    msg = req.message.lower()
    
    # 1. Blocked Count (Dynamic)
    if any(word in msg for word in ["how many", "blocked", "count"]):
        res = f"Total {len(full_audit_log)} malicious attempts have been mitigated in this session."

    # 2. City Specific (Advanced Lookup)
    elif any(city in msg for city in ["dubai", "riyadh", "neom", "jeddah"]):
        target = "riyadh" if "riyadh" in msg else "dubai" if "dubai" in msg else "neom" if "neom" in msg else "jeddah"
        match = next((a for a in latest_alerts if target in a['location'].lower()), None)
        if match:
            res = f"Critical situation at {match['location']}. Last event: {match['analysis_report']} from {match['ip_source']}."
        else:
            res = f"The {target.capitalize()} sector is operating within normal parameters."

    # 3. System Status
    elif "status" in msg or "situation" in msg:
        res = f"System alert level: High. {len(latest_alerts)} recent threats active." if latest_alerts else "All Vision 2030 IoT nodes are secure."

    else:
        res = "Marhaba! I am CyberGuard AI. Ask about node status, blocked counts, or specific cities."

    return {"reply_en": res, "reply_ar": get_arabic_insight(res)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)