import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';

const OwnerLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authApi.login(form);
      if (res.data.role !== 'OWNER') throw new Error('Not an owner account');
      localStorage.setItem('rentease_token', res.data.token);
      localStorage.setItem('rentease_userId', res.data.userId);
      localStorage.setItem('rentease_role', 'OWNER');
      localStorage.setItem('rentease_name', res.data.name);
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '24px', fontWeight: '800' }}>Owner Login</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>Welcome back to the Partner Portal</p>
        
        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '20px', border: '1px solid #FCA5A5' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Email Address</label>
            <input 
              className="form-input" 
              type="email" 
              required 
              placeholder="owner@rentease.com"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              required 
              placeholder="••••••••"
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Don't have an account? <Link to="/owner/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
