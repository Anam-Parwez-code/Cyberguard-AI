import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{ 
      backgroundColor: '#0d1117', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      color: 'white' 
    }}>
      <h1 style={{ color: '#58a6ff' }}>🛡️ CyberGuard AI System Check</h1>
      <p>Agar aapko ye dikh raha hai, toh React sahi chal raha hai!</p>
      <button 
        onClick={() => window.location.reload()} 
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}
      >
        Refresh Dashboard
      </button>
    </div>
  );
}

export default App;
