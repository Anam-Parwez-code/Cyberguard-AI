import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', color: 'white', background: '#0d1117', height: '100vh' }}>
      <h1>🛡️ CyberGuard AI Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #30363d', padding: '20px' }}>System Status: Online</div>
        <div style={{ border: '1px solid #30363d', padding: '20px' }}>Threats Detected: 0</div>
        <div style={{ border: '1px solid #30363d', padding: '20px' }}>Network Load: Low</div>
      </div>
    </div>
  );
};

export default Dashboard;
