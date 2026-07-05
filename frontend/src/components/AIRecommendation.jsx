import { useState, useEffect } from 'react';
import { analyzeNetwork } from '../utils/threatAnalyzer';
import './AIRecommendation.css';

const SEVERITY_CONFIG = {
  CRITICAL: { color: '#ff0000', icon: '🔴' },
  HIGH: { color: '#d9534f', icon: '🟠' },
  MEDIUM: { color: '#f0c419', icon: '🟡' },
  INFO: { color: '#28a745', icon: '🟢' },
};

function AIRecommendation({ nodes, logs }) {
  const [recommendations, setRecommendations] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setAnalyzing(true);
    const timer = setTimeout(() => {
      const result = analyzeNetwork(nodes, logs);
      setRecommendations(result);
      setAnalyzing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [nodes, logs]);

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div className="ai-title">
          <span className="ai-icon">🧠</span>
          <h2>AI Security Advisor</h2>
        </div>
        <p>Automated threat analysis based on network behavior patterns</p>
      </div>

      {analyzing ? (
        <div className="ai-analyzing">
          <span className="analyzing-dot"></span>
          Analyzing network state...
        </div>
      ) : (
        <div className="ai-recommendations">
          {recommendations.length === 0 ? (
            <div className="no-data">No network data available for analysis.</div>
          ) : (
            recommendations.map((rec, i) => {
              const config = SEVERITY_CONFIG[rec.severity];
              return (
                <div key={i} className="recommendation-card" style={{ borderLeftColor: config.color }}>
                  <div className="rec-header">
                    <span className="rec-icon">{config.icon}</span>
                    <span className="rec-severity" style={{ color: config.color }}>
                      {rec.severity}
                    </span>
                    <span className="rec-title">{rec.title}</span>
                  </div>
                  <p className="rec-message">{rec.message}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default AIRecommendation;