import './HealthScore.css';

function HealthScore({ nodes }) {
  if (!nodes || nodes.length === 0) return null;

  const trusted = nodes.filter(n => n.status === 'TRUSTED').length;
  const total = nodes.length;
  const score = Math.round((trusted / total) * 100);

  const getScoreColor = () => {
    if (score === 100) return '#28a745';
    if (score >= 60) return '#f0c419';
    return '#d9534f';
  };

  const getScoreLabel = () => {
    if (score === 100) return 'All Systems Secure';
    if (score >= 60) return 'Partial Threat Detected';
    return 'Critical Threat Level';
  };

  return (
    <div className="health-score">
      <div className="score-left">
        <p className="score-label">Network Health</p>
        <p className="score-sublabel">{getScoreLabel()}</p>
      </div>
      <div className="score-right">
        <div className="score-circle" style={{ borderColor: getScoreColor() }}>
          <span className="score-number" style={{ color: getScoreColor() }}>
            {score}%
          </span>
        </div>
      </div>
      <div className="score-bar-container">
        <div
          className="score-bar"
          style={{
            width: `${score}%`,
            backgroundColor: getScoreColor()
          }}
        />
      </div>
    </div>
  );
}

export default HealthScore;