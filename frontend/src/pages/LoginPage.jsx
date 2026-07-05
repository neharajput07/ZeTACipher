import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isSignup && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const res = await registerUser(username, password);
        if (res.status === 'success') {
          setSuccess('Account created! You can now log in.');
          setIsSignup(false);
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(res.message);
        }
      } else {
        const res = await loginUser(username, password);
        if (res.status === 'success') {
          localStorage.setItem('zetaAuth', 'true');
          localStorage.setItem('zetaUser', res.username);
          navigate('/dashboard');
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1>
            <span className="white">ZeTA </span>
            <span className="yellow">Cipher</span>
          </h1>
          <p>{isSignup ? 'CREATE ACCOUNT' : 'SECURE ACCESS PORTAL'}</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => !isSignup && e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Access Dashboard'}
          </button>

          <p className="toggle-auth">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <span onClick={() => { setIsSignup(!isSignup); setError(''); setSuccess(''); }}>
              {isSignup ? ' Login' : ' Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;