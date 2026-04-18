import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [threatData, setThreatData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [auditCount, setAuditCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Marhaba! Phase 4 Advanced Monitoring Active.', ar: 'مرحباً! مراقبة المرحلة الرابعة المتقدمة نشطة.' }
  ]);
  const chatEndRef = useRef(null);

  const [iotDevices, setIotDevices] = useState([
    { id: "IOT-RX-01", name: "Riyadh Hub", risk: "Low" },
    { id: "IOT-DXB-02", name: "Dubai Gateway", risk: "Low" },
    { id: "IOT-NEOM-03", name: "NEOM Sensor", risk: "Low" }
  ]);

  // Phase 4: Device Discovery Simulation
  const discoverNewDevice = () => {
    const regions = ["Riyadh", "Dubai", "NEOM", "Jeddah"];
    const types = ["Smart Grid", "CCTV Node", "Water Sensor"];
    const newDevice = {
      id: `IOT-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: `${regions[Math.floor(Math.random() * 4)]} ${types[Math.floor(Math.random() * 3)]}`,
      risk: Math.random() > 0.8 ? "Medium" : "Low"
    };
    setIotDevices(prev => [newDevice, ...prev].slice(0, 8));
  };

  const downloadAuditLog = async () => {
    const adminKey = prompt("Enter Admin Secret Key:");
    if (!adminKey) return;
    try {
      const res = await axios.get(`/api/export-audit?api_key=${adminKey}`);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `Advanced_Audit_Log.json`);
      downloadAnchorNode.click();
    } catch (err) { alert("❌ Unauthorized Access!"); }
  };

  const fetchStatus = async () => {
    try {
      const resCount = await axios.get('/api/audit-status');
      setAuditCount(resCount.data.total_logs);
      
      // Phase 4: Advanced Traffic Simulation (SQL & DDoS)
      const rand = Math.random();
      let payload = "normal";
      let packet = 200;
      let requests = 100;

      if (rand > 0.8) { payload = "UNION SELECT * FROM users--"; } // SQLi
      else if (rand > 0.6) { packet = 950; requests = 600; } // DDoS

      const resAnalyze = await axios.post('/api/analyze-traffic', {
        ip_source: rand > 0.6 ? "CRITICAL_IP_TARGET" : `192.168.1.${Math.floor(Math.random()*255)}`,
        packet_size: packet,
        request_count: requests,
        payload: payload
      });

      setThreatData(resAnalyze.data);
      setLoading(false);

      if (resAnalyze.data.is_anomaly) {
        setAlerts(prev => [{ id: Date.now(), ...resAnalyze.data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
      }
    } catch (err) { console.error("Connection Lost"); }
  };

  useEffect(() => {
    const tTimer = setInterval(fetchStatus, 5000);
    const dTimer = setInterval(discoverNewDevice, 8000);
    return () => { clearInterval(tTimer); clearInterval(dTimer); };
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput("");
    try {
      const res = await axios.post('/api/chat', { message: msg });
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply_en, ar: res.data.reply_ar }]);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  return (
    <div style={{ backgroundColor: '#010409', color: '#c9d1d9', minHeight: '100vh', padding: '25px', fontFamily: 'Segoe UI' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d', paddingBottom: '15px', alignItems: 'center' }}>
        <h2 style={{ color: '#58a6ff', margin: 0 }}>🛡️ CyberGuard AI | Phase 4</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', background: '#161b22', padding: '5px 12px', borderRadius: '15px', border: '1px solid #30363d' }}>📜 {auditCount} Logs Secured</span>
          <button onClick={downloadAuditLog} style={{ background: '#238636', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Export Audit</button>
        </div>
      </div>

      {/* IoT Devices Heatmap Style */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '15px', padding: '20px 0' }}>
        {iotDevices.map(d => (
          <div key={d.id} style={{ minWidth: '160px', background: '#0d1117', border: '1px solid #30363d', padding: '12px', borderRadius: '8px', borderTop: `3px solid ${d.risk === 'Low' ? '#3fb950' : '#f85149'}` }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{d.name}</div>
            <div style={{ fontSize: '10px', color: '#8b949e' }}>STATUS: ACTIVE</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#161b22', border: '1px solid #30363d', padding: '20px', borderRadius: '10px', boxShadow: threatData?.threat_level === 'Critical' ? '0 0 15px #f8514933' : 'none' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#8b949e' }}>Heuristic Detection</h4>
          {!loading && (
            <div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: threatData.is_anomaly ? '#f85149' : '#3fb950' }}>
                {threatData.is_anomaly ? `🚨 ${threatData.threat_level}: ${threatData.analysis_report}` : '✅ SHIELD ACTIVE'}
              </div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>Node: {threatData.location}</div>
            </div>
          )}
        </div>
        
        <div style={{ background: '#161b22', border: '1px solid #30363d', padding: '20px', borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#8b949e' }}>Incident Response</h4>
          <div style={{ fontSize: '14px', color: '#c9d1d9' }}>
            <strong>Action:</strong> {threatData?.recommendation || 'Analyzing traffic flow...'}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{ marginTop: '25px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#161b22' }}>
            <tr>
              <th style={{padding:'12px'}}>Incident</th>
              <th style={{padding:'12px'}}>Severity</th>
              <th style={{padding:'12px'}}>Origin IP</th>
              <th style={{padding:'12px', textAlign:'right'}}>Arabic Insight</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #21262d' }}>
                <td style={{padding:'12px'}}>{a.analysis_report}</td>
                <td style={{padding:'12px', color: a.threat_level === 'Critical' ? '#f85149' : '#e3b341'}}>{a.threat_level}</td>
                <td style={{padding:'12px', color: '#58a6ff'}}>{a.ip_source}</td>
                <td style={{padding:'12px', direction:'rtl', color: '#8b949e'}}>{a.arabic_report}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Chatbot */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} style={{ width: '55px', height: '55px', borderRadius: '50%', background: '#58a6ff', border: 'none', fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>🤖</button>
        ) : (
          <div style={{ width: '320px', height: '420px', background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px', background: '#0d1117', display: 'flex', justifyContent: 'space-between', borderRadius: '12px 12px 0 0' }}>
              <strong>CyberGuard AI</strong>
              <button onClick={() => setIsChatOpen(false)} style={{color:'white', background:'none', border:'none', cursor:'pointer'}}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#1f6feb' : '#30363d', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', maxWidth: '85%' }}>
                  {m.text}
                  {m.ar && <div style={{ borderTop: '1px solid #ffffff22', marginTop: '5px', paddingTop: '5px', direction: 'rtl', fontSize: '11px', color: '#8b949e' }}>{m.ar}</div>}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: '12px' }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: 'white', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Ask intelligence..." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;