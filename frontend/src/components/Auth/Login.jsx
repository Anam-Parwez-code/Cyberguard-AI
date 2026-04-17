import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Yahan hum abhi ke liye "Demo Login" kar rahe hain
    // Real project mein yahan axios.post('/api/auth/login') aayega
    if (email && password) {
      console.log("Login Attempt Successful");
      
      const userData = { email, role: 'Admin', token: 'fake-jwt-token-123' };
      
      // AuthContext ko update kar rahe hain
      login(userData); 
      
      // Dashboard par bhej rahe hain
      navigate('/dashboard'); 
    } else {
      alert("Please enter credentials!");
    }
  };

  return (
    <div style={{ backgroundColor: '#0d1117', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <form onSubmit={handleSubmit} style={{ background: '#161b22', padding: '40px', borderRadius: '8px', border: '1px solid #30363d', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#58a6ff', marginBottom: '30px' }}>
          <Shield style={{ marginRight: '10px' }} /> CyberGuard AI
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label><Mail size={16} /> Email</label>
          <input 
            type="email" 
            placeholder="admin@cyberguard.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#0d1117', border: '1px solid #30363d', color: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label><Lock size={16} /> Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#0d1117', border: '1px solid #30363d', color: 'white' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#238636', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ACCESS SYSTEM
        </button>
      </form>
    </div>
  );
};

export default Login;