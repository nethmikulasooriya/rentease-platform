import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../services/api';

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCheckoutRedirect = searchParams.get('redirect') === 'checkout';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(form);
      localStorage.setItem('rentease_token', res.data.token);
      localStorage.setItem('rentease_userId', res.data.userId);
      localStorage.setItem('rentease_role', 'CUSTOMER');
      localStorage.setItem('rentease_name', res.data.name);

      if (isCheckoutRedirect) {
        navigate('/checkout');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '24px', fontWeight: '800' }}>Customer Sign In</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>Welcome back to RentEase</p>
        
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
              placeholder="name@example.com"
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Don't have an account? <Link to={`/customer/register${isCheckoutRedirect ? '?redirect=checkout' : ''}`} style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
