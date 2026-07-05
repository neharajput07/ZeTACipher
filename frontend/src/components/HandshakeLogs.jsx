import { useState, useEffect } from 'react';
import { getHandshakeLogs } from '../services/api';
import './HandshakeLogs.css';

function HandshakeLogs({ refreshTrigger }) {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const data = await getHandshakeLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="logs-container">
      <h2>Handshake Logs</h2>
      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Initiator</th>
              <th>Responder</th>
              <th>Result</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.initiatorNodeId}</td>
                <td>{log.responderNodeId}</td>
                <td>
                  <span className={`result-badge ${log.result.toLowerCase()}`}>
                    {log.result}
                  </span>
                </td>
                <td>{formatTime(log.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HandshakeLogs;