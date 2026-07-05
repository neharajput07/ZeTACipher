import { getDeviceName } from '../utils/deviceNames';
import './TopologyMap.css';

const NODE_POSITIONS = [
  { id: 'N1', x: 250, y: 80 },
  { id: 'N2', x: 420, y: 200 },
  { id: 'N3', x: 350, y: 380 },
  { id: 'N4', x: 150, y: 380 },
  { id: 'N5', x: 80, y: 200 },
];

const getColor = (status) => {
  if (status === 'TRUSTED') return '#28a745';
  if (status === 'QUARANTINED') return '#d9534f';
  return '#555';
};

function TopologyMap({ nodes }) {
  const getStatus = (nodeId) => {
    const node = nodes.find((n) => n.nodeId === nodeId);
    return node ? node.status : 'UNKNOWN';
  };

  return (
    <div className="topology-container">
      <h2>Ring Topology</h2>
      <div className="topology-wrapper">
        <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg">
          {/* Draw ring connections */}
          {NODE_POSITIONS.map((pos, i) => {
            const next = NODE_POSITIONS[(i + 1) % NODE_POSITIONS.length];
            return (
              <line
                key={`line-${i}`}
                x1={pos.x}
                y1={pos.y}
                x2={next.x}
                y2={next.y}
                stroke="#333"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
            );
          })}

          {/* Draw nodes */}
          {NODE_POSITIONS.map((pos) => {
            const status = getStatus(pos.id);
            const color = getColor(status);
            return (
              <g key={pos.id}>
                {/* Glow effect */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="48"
                  fill={color}
                  opacity="0.15"
                />
                {/* Main circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="38"
                  fill="#1a1a1a"
                  stroke={color}
                  strokeWidth="2.5"
                />
                {/* Node ID */}
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  fill={color}
                  fontSize="16"
                  fontWeight="bold"
                >
                  {pos.id}
                </text>
                {/* Device Name */}
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  fill="#f5f5f5"
                  fontSize="9"
                >
                  {getDeviceName(pos.id)}
                </text>
                {/* Status */}
                <text
                  x={pos.x}
                  y={pos.y + 20}
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="8"
                >
                  {status}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default TopologyMap;