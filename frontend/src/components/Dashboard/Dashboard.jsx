import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { fetchDashboardData } from '../../services/api';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import MetricsCard from './MetricsCard';
import DeviceMonitor from './DeviceMonitor';
import ThreatMap from './ThreatMap';
import AlertPanel from './AlertPanel';
import NetworkChart from './NetworkChart';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalDevices: 0,
    activeThreats: 0,
    blockedAttacks: 0,
    complianceScore: 0,
  });
  
  const [devices, setDevices] = useState([]);
  const [threats, setThreats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: wsData, connected } = useWebSocket(
    `ws://localhost:5000/ws/dashboard?token=${token}`,
    { onMessage: handleWebSocketMessage, reconnect: true }
  );

  function handleWebSocketMessage(message) {
    const { type, data } = message;
    switch (type) {
      case 'THREAT_DETECTED':
        setThreats(prev => [data, ...prev].slice(0, 10));
        setMetrics(prev => ({ ...prev, activeThreats: prev.activeThreats + 1 }));
        break;
      case 'DEVICE_UPDATE':
        setDevices(prev => prev.map(d => d.id === data.id ? { ...d, ...data } : d));
        break;
      case 'NETWORK_TRAFFIC':
        setNetworkData(prev => [...prev, data].slice(-60));
        break;
      case 'ATTACK_BLOCKED':
        setMetrics(prev => ({ ...prev, blockedAttacks: prev.blockedAttacks + 1 }));
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [token]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const data = await fetchDashboardData(token);
      setMetrics(data.metrics);
      setDevices(data.devices);
      setThreats(data.threats);
      setAlerts(data.alerts);
      setNetworkData(data.networkTraffic);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading CyberGuard Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar user={user} wsConnected={connected} />
        <div className="dashboard-content">
          
          <section className="metrics-section">
            <MetricsCard title="Total Devices" value={metrics.totalDevices.toLocaleString()} icon="🖥️" color="blue" />
            <MetricsCard title="Active Threats" value={metrics.activeThreats} icon="⚠️" color="red" />
            <MetricsCard title="Blocked Attacks" value={metrics.blockedAttacks.toLocaleString()} icon="🛡️" color="green" />
            <MetricsCard title="Compliance" value={`${metrics.complianceScore}%`} icon="✅" color="purple" />
          </section>

          <div className="dashboard-grid">
            <div className="dashboard-left">
              <div className="panel">
                <div className="panel-header">
                  <h2>🌍 Threat Map</h2>
                  <span className="badge">{threats.length} Active</span>
                </div>
                <ThreatMap threats={threats} />
              </div>
              
              <div className="panel">
                <div className="panel-header"><h2>🚨 Security Alerts</h2></div>
                <AlertPanel alerts={alerts} />
              </div>
            </div>

            <div className="dashboard-right">
              <div className="panel">
                <div className="panel-header"><h2>📡 Device Monitor</h2></div>
                <DeviceMonitor devices={devices} />
              </div>
            </div>
          </div>

          <section className="network-section">
            <div className="panel">
              <div className="panel-header"><h2>📊 Network Traffic</h2></div>
              <NetworkChart data={networkData} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;