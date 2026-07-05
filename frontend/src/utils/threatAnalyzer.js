import { getDeviceName } from './deviceNames';

export const analyzeNetwork = (nodes, logs) => {
  const recommendations = [];
  const quarantined = nodes.filter(n => n.status === 'QUARANTINED');
  const trusted = nodes.filter(n => n.status === 'TRUSTED');
  const healthScore = nodes.length > 0 ? Math.round((trusted.length / nodes.length) * 100) : 0;

  // Rule 1: Critical - Multiple nodes quarantined
  if (quarantined.length >= 2) {
    recommendations.push({
      severity: 'CRITICAL',
      title: 'Coordinated Attack Pattern Detected',
      message: `${quarantined.length} devices quarantined simultaneously (${quarantined.map(n => getDeviceName(n.nodeId)).join(', ')}). This suggests a coordinated attack rather than isolated failure. Immediately isolate the affected network segment and audit all shared keys before restoration.`,
    });
  } else if (quarantined.length === 1) {
    const node = quarantined[0];
    recommendations.push({
      severity: 'HIGH',
      title: 'Device Isolation Required',
      message: `${getDeviceName(node.nodeId)} (${node.nodeId}) failed HMAC verification and has been quarantined. Before restoring, verify device firmware integrity and rotate the shared secret key to prevent reuse of compromised credentials.`,
    });
  }

  // Rule 2: Repeated failures on same node
  if (logs && logs.length > 0) {
    const recentLogs = logs.slice(0, 10);
    const failureCount = {};
    recentLogs.forEach(log => {
      if (log.result === 'QUARANTINED') {
        failureCount[log.responderNodeId] = (failureCount[log.responderNodeId] || 0) + 1;
      }
    });

    Object.entries(failureCount).forEach(([nodeId, count]) => {
      if (count >= 2) {
        recommendations.push({
          severity: 'HIGH',
          title: 'Persistent Verification Failure',
          message: `${getDeviceName(nodeId)} (${nodeId}) has failed verification ${count} times consecutively. This is not a random failure — investigate for persistent firmware tampering or man-in-the-middle interception on this node's communication channel.`,
        });
      }
    });
  }

  // Rule 3: Network health threshold
  if (healthScore < 60) {
    recommendations.push({
      severity: 'CRITICAL',
      title: 'Network Health Below Safe Threshold',
      message: `Network health at ${healthScore}% — below the 60% safety threshold. Mesh integrity is compromised. Suspend all device operations and conduct a full security audit before allowing any node restoration.`,
    });
  }

  // Rule 4: Always show security hardening recommendations
  if (healthScore === 100) {
    recommendations.push({
      severity: 'INFO',
      title: 'Network Operating Normally',
      message: 'All 5 nodes verified and trusted. Zero-Trust mesh functioning as expected with no active threats detected.',
    });
  }

  // Rule 5: Always visible hardening advice
  recommendations.push({
    severity: 'MEDIUM',
    title: 'Security Hardening Recommendation',
    message: 'Current architecture uses a shared secret key across all nodes. For stronger Zero-Trust enforcement, consider migrating to per-pair unique keys — this limits blast radius so a single compromised node cannot affect the entire mesh.',
  });

  recommendations.push({
    severity: 'MEDIUM',
    title: 'Operational Best Practice',
    message: 'Enable continuous Auto-Monitor mode during active network sessions. Manual handshake triggering introduces verification gaps — autonomous monitoring ensures no compromise window exceeds 5 seconds.',
  });

  recommendations.push({
    severity: 'INFO',
    title: 'Architecture Insight',
    message: 'Ring topology enforces neighbor-only verification — each node challenges only its direct successor. This bounds the verification scope and prevents single nodes from having full network visibility, aligning with Zero-Trust principles.',
  });

  return recommendations;
};