import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNodeStatus, triggerHandshake, getHandshakeLogs } from '../services/api';
import NodeDashboard from '../components/NodeDashboard';
import HandshakeLogs from '../components/HandshakeLogs';
import TopologyMap from '../components/TopologyMap';
import HealthScore from '../components/HealthScore';
import ThreatBanner from '../components/ThreatBanner';
import AttackSimulator from '../components/AttackSimulator';
import AIRecommendation from '../components/AIRecommendation';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await triggerHandshake();
        const data = await getNodeStatus();
        setNodes(data);
        const logData = await getHandshakeLogs();
        setLogs(logData);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };
    initialize();
  }, []);

  const handleHandshakeComplete = async () => {
    setRefreshTrigger(prev => prev + 1);
    try {
      const data = await getNodeStatus();
      setNodes(data);
      const logData = await getHandshakeLogs();
      setLogs(logData);
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zetaAuth');
    navigate('/');
  };

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'nodes', label: 'Nodes' },
    { id: 'logs', label: 'Logs' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'ai', label: 'AI Advisor' },
  ];

  const trusted = nodes.filter(n => n.status === 'TRUSTED').length;
  const quarantined = nodes.filter(n => n.status === 'QUARANTINED').length;
  const healthScore = nodes.length > 0 ? Math.round((trusted / nodes.length) * 100) : 0;

  return (
    <div className="dashboard-page">

      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-zeTA">ZeTA</span> Cipher
        </div>
        <div className="navbar-actions">
          {autoRefresh && (
            <div className="live-indicator">
              <span className="live-dot"></span>
              Live
            </div>
          )}
          <button className="icon-btn" title="Notifications">🔔</button>
          <span className="nav-username">👤 {localStorage.getItem('zetaUser') || 'Admin'}</span>
          <div className="ring-bg">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <g className="ring-rotate">
            <circle cx="250" cy="80" r="18" fill="none" stroke="#f0c419" strokeWidth="1" opacity="0.15"/>
            <circle cx="420" cy="190" r="18" fill="none" stroke="#f0c419" strokeWidth="1" opacity="0.15"/>
            <circle cx="350" cy="390" r="18" fill="none" stroke="#f0c419" strokeWidth="1" opacity="0.15"/>
            <circle cx="150" cy="390" r="18" fill="none" stroke="#f0c419" strokeWidth="1" opacity="0.15"/>
            <circle cx="80" cy="190" r="18" fill="none" stroke="#f0c419" strokeWidth="1" opacity="0.15"/>
            <line x1="250" y1="80" x2="420" y2="190" stroke="#f0c419" strokeWidth="0.8" opacity="0.08"/>
            <line x1="420" y1="190" x2="350" y2="390" stroke="#f0c419" strokeWidth="0.8" opacity="0.08"/>
            <line x1="350" y1="390" x2="150" y2="390" stroke="#f0c419" strokeWidth="0.8" opacity="0.08"/>
            <line x1="150" y1="390" x2="80" y2="190" stroke="#f0c419" strokeWidth="0.8" opacity="0.08"/>
            <line x1="80" y1="190" x2="250" y2="80" stroke="#f0c419" strokeWidth="0.8" opacity="0.08"/>
          </g>
        </svg>
      </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Navigation Links */}
      <div className="nav-links">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <div className={`page-content ${activePage !== 'dashboard' ? 'scrollable' : ''}`}>

        {/* Dashboard Page */}
        {activePage === 'dashboard' && (
          <div className="dashboard-home">
            <div className="topology-section">
              <TopologyMap nodes={nodes} />
            </div>
           <div className="widgets-row">
              <div className="widget" style={{ borderTop: '2px solid #28a745' }}>
                <p className="widget-label">Network Health</p>
                <p className="widget-value" style={{ color: healthScore === 100 ? '#28a745' : healthScore >= 60 ? '#f0c419' : '#d9534f' }}>
                  {healthScore}%
                </p>
              </div>
              <div className="widget" style={{ borderTop: '2px solid #28a745' }}>
                <p className="widget-label">Active Nodes</p>
                <p className="widget-value green">{trusted}</p>
              </div>
              <div className="widget" style={{ borderTop: '2px solid #d9534f' }}>
                <p className="widget-label">Quarantined</p>
                <p className="widget-value red">{quarantined}</p>
              </div>
              <div className="widget" style={{ borderTop: '2px solid #f0c419' }}>
                <p className="widget-label">Total Devices</p>
                <p className="widget-value yellow">{nodes.length}</p>
              </div>
              <div className="widget" style={{ borderTop: `2px solid ${quarantined > 0 ? '#d9534f' : '#28a745'}` }}>
                <p className="widget-label">Security Status</p>
                <p className="widget-value" style={{ color: quarantined > 0 ? '#d9534f' : '#28a745', fontSize: '0.9rem' }}>
                  {quarantined > 0 ? '⚠ THREAT' : '✓ SECURE'}
                </p>
              </div>
            </div>
            {quarantined > 0 && <ThreatBanner nodes={nodes} />}
          </div>
        )}

        {activePage === 'nodes' && (
          <NodeDashboard
            onHandshakeComplete={handleHandshakeComplete}
            onNodesUpdate={setNodes}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
          />
        )}

        {activePage === 'logs' && (
          <HandshakeLogs refreshTrigger={refreshTrigger} />
        )}

        {activePage === 'simulator' && (
          <AttackSimulator onSimulationComplete={handleHandshakeComplete} />
        )}

        {activePage === 'ai' && (
          <AIRecommendation nodes={nodes} logs={logs} />
        )}

      </div>
    </div>
  );
}

export default DashboardPage;