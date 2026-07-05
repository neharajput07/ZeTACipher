import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Detect. Verify. Isolate.';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240, 196, 25, 0.5)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(240, 196, 25, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="landing">
      <canvas id="particle-canvas" className="particle-canvas"></canvas>
      <div className="glow-orb"></div>

      <nav style={{ position: 'fixed', top: '20px', right: '32px', zIndex: 9999 }}>
        <button className="landing-nav-login" onClick={() => navigate('/login')}>
          Login →
        </button>
      </nav>

      <div className="landing-content">

        <div className="landing-badge">
          <span className="badge-dot"></span>
          Zero Trust Engine Active
        </div>

        <h1 className="landing-title">
          ZeTA <span>Cipher</span>
        </h1>

        <p className="landing-platform">
          Zero-Trust Security Platform for IoT Mesh Networks
        </p>

        <p className="landing-description">
          Secure every node with cryptographic authentication,
          continuous trust evaluation and autonomous threat isolation.
        </p>

        <p className="landing-tagline">
          <span className="typewriter">{displayText}<span className="cursor">|</span></span>
        </p>

        <div className="landing-divider"></div>

        <div className="landing-features">
          <div className="feature-check"><span className="check">✓</span> HMAC Authentication</div>
          <div className="feature-check"><span className="check">✓</span> Replay Attack Prevention</div>
          <div className="feature-check"><span className="check">✓</span> Live Mesh Simulation</div>
          <div className="feature-check"><span className="check">✓</span> AI Threat Advisor</div>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;