import { getDeviceName } from '../utils/deviceNames';
import './ThreatBanner.css';

function ThreatBanner({ nodes }) {
  const quarantined = nodes.filter(n => n.status === 'QUARANTINED');

  if (quarantined.length === 0) return null;

  return (
    <div className="threat-banner">
      <span className="threat-icon">⚠</span>
      <div className="threat-text">
        <strong>THREAT DETECTED</strong>
        <span>
          {quarantined.map(n => `${getDeviceName(n.nodeId)} (${n.nodeId})`).join(', ')} 
          {' '}— Quarantined and isolated from mesh network
        </span>
      </div>
    </div>
  );
}

export default ThreatBanner;