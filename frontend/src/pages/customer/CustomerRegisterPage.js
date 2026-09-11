import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../services/api';

const CustomerRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCheckoutRedirect = searchParams.get('redirect') === 'checkout';

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const patterns = {
    name: /^[a-zA-Z\s.-]{2,100}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(?:0|94|\+94)?7[0-9]{8}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const validateField = (field, value) => {
    let err = '';
    const trimmed = (value || '').trim();

    if (field === 'name') {
      if (!trimmed) err = 'Full name is required';
      else if (trimmed.length < 2) err = 'Name must be at least 2 characters';
      else if (!patterns.name.test(trimmed)) err = 'Only letters, spaces, dots, and hyphens allowed';
    } else if (field === 'email') {
      if (!trimmed) err = 'Email address is required';
      else if (!patterns.email.test(trimmed)) err = 'Invalid email address format';
    } else if (field === 'phone') {
      if (!trimmed) err = 'Phone number is required';
      else if (!patterns.phone.test(trimmed)) err = 'Must be a valid Sri Lankan number (e.g. 07XXXXXXXX)';
    } else if (field === 'password') {
      if (!value) err = 'Password is required';
      else if (value.length < 8) err = 'Password must be at least 8 characters';
      else if (!patterns.password.test(value)) {
        err = 'Must include uppercase, lowercase, number & special symbol (@$!%*?&)';
      }
    }
    return err;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    const err = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) return;

    setLoading(true);
    try {
      const res = await authApi.register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      });
      localStorage.setItem('rentease_token', res.data.token);
      localStorage.setItem('rentease_userId', res.data.userId);
      localStorage.setItem('rentease_role', 'CUSTOMER');
      localStorage.setItem('rentease_name', res.data.name);

      // Preserve Context: If coming from booking, go straight to checkout!
      if (isCheckoutRedirect) {
        navigate('/checkout');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK') {
        setServerError('Cannot connect to server. Please ensure backend services are running.');
      } else {
        setServerError('Registration failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        
        {isCheckoutRedirect && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', color: '#1E40AF' }}>
            🎉 <strong>Almost there!</strong> Create a quick account to confirm your vehicle reservation.
          </div>
        )}

        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '24px', fontWeight: '800' }}>
          {isCheckoutRedirect ? 'Quick Sign Up' : 'Register as Customer'}
        </h2>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>
          Book your ride anywhere across Sri Lanka
        </p>
        
        {serverError && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '20px', fontWeight: '500', border: '1px solid #FCA5A5' }}>
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Full Name</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="e.g. Nethmi Kulasooriya" 
              value={form.name} 
              onChange={e => handleChange('name', e.target.value)} 
              style={errors.name ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
            />
            {errors.name && <small style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</small>}
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Email Address</label>
            <input 
              className="form-input" 
              type="email" 
              placeholder="name@example.com" 
              value={form.email} 
              onChange={e => handleChange('email', e.target.value)} 
              style={errors.email ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
            />
            {errors.email && <small style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</small>}
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={e => handleChange('password', e.target.value)} 
              style={errors.password ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
            />
            {errors.password && <small style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</small>}
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Phone Number</label>
            <input 
              className="form-input" 
              type="tel" 
              placeholder="07XXXXXXXX" 
              value={form.phone} 
              onChange={e => handleChange('phone', e.target.value)} 
              style={errors.phone ? { borderColor: '#EF4444', background: '#FEF2F2' } : {}}
            />
            {errors.phone && <small style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone}</small>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Setting up account...' : (isCheckoutRedirect ? 'Continue to Checkout →' : 'Register')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Already have an account? <Link to={`/customer/login${isCheckoutRedirect ? '?redirect=checkout' : ''}`} style={{ color: 'var(--primary)', fontWeight: '600' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegisterPage;
