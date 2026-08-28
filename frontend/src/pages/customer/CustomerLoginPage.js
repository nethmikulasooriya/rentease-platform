import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authApi.login(form);
      if (res.data.role !== 'CUSTOMER') throw new Error('Not a customer account');
      localStorage.setItem('rentease_token', res.data.token);
      localStorage.setItem('rentease_userId', res.data.userId);
      localStorage.setItem('rentease_role', 'CUSTOMER');
      localStorage.setItem('rentease_name', res.data.name);
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', padding: '64px 16px' }}>
      <div className="card">
        <h2 className="mb-4" style={{ textAlign: 'center' }}>Customer Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>Password</label><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>Don't have an account? <Link to="/customer/register">Register</Link></p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
