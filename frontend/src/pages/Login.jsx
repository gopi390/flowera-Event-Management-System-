import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loginAs, setLoginAs] = useState('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, loginAs);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h2 style={{ marginBottom: 24 }}>Log in to Flovera</h2>

        <div className="role-toggle">
          <button type="button" className={loginAs === 'CUSTOMER' ? 'active' : ''} onClick={() => setLoginAs('CUSTOMER')}>
            Customer
          </button>
          <button type="button" className={loginAs === 'ADMIN' ? 'active' : ''} onClick={() => setLoginAs('ADMIN')}>
            Admin
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={loginAs === 'ADMIN' ? 'admin123@flovera.com' : 'you@example.com'}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in…' : `Log in as ${loginAs === 'ADMIN' ? 'Admin' : 'Customer'}`}
          </button>
        </form>

        {loginAs === 'CUSTOMER' && (
          <p style={{ textAlign: 'center', marginTop: 20 }}>
            New to Flovera? <Link to="/register" style={{ color: 'var(--berry)', fontWeight: 600 }}>Create an account</Link>
          </p>
        )}
      </div>
    </div>
  );
}
