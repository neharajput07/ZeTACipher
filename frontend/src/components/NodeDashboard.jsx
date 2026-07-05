import { useState, useEffect } from 'react';
import { getNodeStatus, triggerHandshake, corruptNode, restoreNode } from '../services/api';
import { getDeviceName, getDeviceIcon } from '../utils/deviceNames';
import './NodeDashboard.css';

function NodeDashboard({ onHandshakeComplete, onNodesUpdate, autoRefresh, setAutoRefresh }) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchStatus = async () => {
    try {
      const data = await getNodeStatus();
      setNodes(data);
      if (onNodesUpdate) onNodesUpdate(data);
    } catch (error) {
      console.error('Failed to fetch node status:', error);
    }
  };

  const handleHandshake = async () => {
    setLoading(true);
    try {
     const data = await triggerHandshake();
      setNodes(data);
      if (onNodesUpdate) onNodesUpdate(data);
      if (onHandshakeComplete) {
        onHandshakeComplete();
      }
    } catch (error) {
      console.error('Handshake failed:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleCorrupt = async (nodeId) => {
    setActionLoading(nodeId + '_corrupt');
    try {
      await corruptNode(nodeId);
      const data = await getNodeStatus();
      setNodes(data);
      if (onNodesUpdate) onNodesUpdate(data);
    } catch (error) {
      console.error('Corrupt failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

 const handleRestore = async (nodeId) => {
    setActionLoading(nodeId + '_restore');
    try {
      await restoreNode(nodeId);
      const data = await getNodeStatus();
      setNodes(data);
      if (onNodesUpdate) onNodesUpdate(data);
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setActionLoading(null);
    }
  };
  

useEffect(() => {
  let interval = null;
  if (autoRefresh) {
    interval = setInterval(() => {
      handleHandshake();
    }, 5000); // every 5 seconds
  }
  return () => {
    if (interval) clearInterval(interval);
  };
}, [autoRefresh]);

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Mesh Network Status</h2>
        <div className="header-buttons">
          
          <button
            className={`auto-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(prev => !prev)}
          >
            {autoRefresh ? '⏹ Stop Auto-Monitor' : '▶ Start Auto-Monitor'}
          </button>
        </div>
      </div>

      <div className="node-grid">
        {nodes.map((node) => (
          <div key={node.nodeId} className={`node-card ${node.status.toLowerCase()}`}>
            <div className="node-icon">{getDeviceIcon(node.nodeId)}</div>
            <h3>{node.nodeId}</h3>
            <p className="device-name">{getDeviceName(node.nodeId)}</p>
            <p>Port: {node.port}</p>
            <span className="status-badge">{node.status}</span>
            <div className="node-actions">
              <button
                className="corrupt-btn"
                onClick={() => handleCorrupt(node.nodeId)}
                disabled={actionLoading !== null}
              >
                {actionLoading === node.nodeId + '_corrupt' ? '...' : '⚠ Corrupt'}
              </button>
              <button
                className="restore-btn"
                onClick={() => handleRestore(node.nodeId)}
                disabled={actionLoading !== null}
              >
                {actionLoading === node.nodeId + '_restore' ? '...' : '✓ Restore'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NodeDashboard;