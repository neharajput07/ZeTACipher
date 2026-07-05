import { useState } from 'react';
import { corruptNode, restoreNode, triggerHandshake } from '../services/api';
import { getDeviceName } from '../utils/deviceNames';
import './AttackSimulator.css';

const ATTACK_TYPES = [
  { id: 'packet_tampering', label: 'Packet Tampering', severity: 'HIGH', description: 'Corrupts HMAC signature during transmission' },
  { id: 'replay_attack', label: 'Replay Attack', severity: 'MEDIUM', description: 'Reuses captured authentication tokens' },
  { id: 'mitm', label: 'Man-in-the-Middle', severity: 'CRITICAL', description: 'Intercepts and alters handshake communication' },
  { id: 'random', label: 'Random Attack', severity: 'LOW', description: 'Unpredictable attack on random target' },
];

const NODES = ['N1', 'N2', 'N3', 'N4', 'N5'];

const SEVERITY_COLORS = {
  LOW: '#f0c419',
  MEDIUM: '#ff8c00',
  HIGH: '#d9534f',
  CRITICAL: '#ff0000',
};

function AttackSimulator({ onSimulationComplete }) {
  const [selectedAttack, setSelectedAttack] = useState(ATTACK_TYPES[0]);
  const [selectedNode, setSelectedNode] = useState('N1');
  const [running, setRunning] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const addEvent = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setTimeline(prev => [...prev, { message, type, time }]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runSimulation = async () => {
    setRunning(true);
    setTimeline([]);

    const targetNode = selectedAttack.id === 'random'
      ? NODES[Math.floor(Math.random() * NODES.length)]
      : selectedNode;

    const deviceName = getDeviceName(targetNode);

    // Phase 1 - Attack initiated
    addEvent(`🔴 ${selectedAttack.label} initiated on ${deviceName} (${targetNode})`, 'threat');
    await sleep(800);

    // Phase 2 - Corrupting node
    addEvent(`⚠ Injecting malicious payload into ${deviceName}...`, 'warning');
    await sleep(1000);
    await corruptNode(targetNode);
    addEvent(`💀 ${deviceName} key compromised — HMAC integrity broken`, 'threat');
    await sleep(800);

    // Phase 3 - Handshake fails
    addEvent(`🔐 Triggering verification handshake...`, 'info');
    await sleep(800);
    await triggerHandshake();
    addEvent(`❌ Handshake FAILED — ${deviceName} response does not match expected HMAC`, 'threat');
    await sleep(600);

    // Phase 4 - Quarantine
    addEvent(`🚨 THREAT DETECTED — Severity: ${selectedAttack.severity}`, 'critical');
    await sleep(600);
    addEvent(`🔒 ${deviceName} automatically QUARANTINED and isolated from mesh`, 'warning');
    await sleep(1000);

    // Phase 5 - Recovery
    addEvent(`🔧 Initiating automatic recovery protocol...`, 'info');
    await sleep(1200);
    await restoreNode(targetNode);
    addEvent(`✅ ${deviceName} key restored to verified state`, 'success');
    await sleep(800);

    // Phase 6 - Reintegration
    addEvent(`🔐 Running reintegration handshake...`, 'info');
    await sleep(800);
    await triggerHandshake();
    addEvent(`✅ ${deviceName} successfully reintegrated into mesh network`, 'success');
    await sleep(400);
    addEvent(`🟢 Network fully restored — All nodes TRUSTED`, 'success');

    if (onSimulationComplete) onSimulationComplete();
    setRunning(false);
  };

  return (
    <div className="attack-simulator">
      <div className="simulator-header">
        <h2>Attack Simulator</h2>
        <p>Simulate real-world attack scenarios and observe autonomous threat response</p>
      </div>

      <div className="simulator-controls">
        <div className="control-group">
          <label>Attack Type</label>
          <div className="attack-types">
            {ATTACK_TYPES.map(attack => (
              <div
                key={attack.id}
                className={`attack-card ${selectedAttack.id === attack.id ? 'selected' : ''}`}
                onClick={() => !running && setSelectedAttack(attack)}
              >
                <div className="attack-top">
                  <span className="attack-label">{attack.label}</span>
                  <span
                    className="severity-badge"
                    style={{ color: SEVERITY_COLORS[attack.severity], borderColor: SEVERITY_COLORS[attack.severity] }}
                  >
                    {attack.severity}
                  </span>
                </div>
                <p className="attack-desc">{attack.description}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedAttack.id !== 'random' && (
          <div className="control-group">
            <label>Target Node</label>
            <div className="node-selector">
              {NODES.map(node => (
                <button
                  key={node}
                  className={`node-btn ${selectedNode === node ? 'selected' : ''}`}
                  onClick={() => !running && setSelectedNode(node)}
                >
                  {node}
                  <span>{getDeviceName(node)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="launch-btn"
          onClick={runSimulation}
          disabled={running}
        >
          {running ? '⚡ Simulation Running...' : '🚀 Launch Attack Simulation'}
        </button>
      </div>

      {timeline.length > 0 && (
        <div className="incident-timeline">
          <h3>Incident Lifecycle</h3>
          <div className="timeline-events">
            {timeline.map((event, i) => (
              <div key={i} className={`timeline-event ${event.type}`}>
                <span className="event-time">{event.time}</span>
                <span className="event-message">{event.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttackSimulator;