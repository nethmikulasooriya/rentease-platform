import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [guideOpen, setGuideOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const guideRef = useRef(null);
  const userRef = useRef(null);

  const token = localStorage.getItem('rentease_token');
  const role = localStorage.getItem('rentease_role');
  const name = localStorage.getItem('rentease_name');

  useEffect(() => {
    const handler = (e) => {
      if (guideRef.current && !guideRef.current.contains(e.target)) setGuideOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rentease_token');
    localStorage.removeItem('rentease_userId');
    localStorage.removeItem('rentease_role');
    localStorage.removeItem('rentease_name');
    navigate('/');
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (role === 'OWNER') return '/owner/dashboard';
    if (role === 'CUSTOMER') return '/customer/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      {/* LEFT — Brand */}
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">🚗</div>
        RentEase
      </Link>

      {/* CENTER — Navigation */}
      <div className="navbar-center">
        <Link to="/vehicles" className="nav-link">Vehicles</Link>

        <div className="nav-dropdown" ref={guideRef}>
          <button className="nav-link" onClick={() => setGuideOpen(!guideOpen)}>
            Guide ▾
          </button>
          {guideOpen && (
            <div className="nav-dropdown-menu">
              <Link to="/guide/rent" className="nav-dropdown-item" onClick={() => setGuideOpen(false)}>
                🚗 How to Rent
                <small>For customers renting a vehicle</small>
              </Link>
              <Link to="/guide/earn" className="nav-dropdown-item" onClick={() => setGuideOpen(false)}>
                💰 How to Earn
                <small>For vehicle hosts & owners</small>
              </Link>
            </div>
          )}
        </div>

        <Link to="/about" className="nav-link">About Us</Link>
      </div>

      {/* RIGHT — Actions */}
      <div className="navbar-right">
        {token ? (
          <>
            {/* Logged in */}
            <div className="nav-dropdown" ref={userRef}>
              <button className="nav-link" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                👤 {name || 'Account'} ▾
              </button>
              {userMenuOpen && (
                <div className="nav-dropdown-menu" style={{ right: 0, left: 'auto' }}>
                  <Link to={getDashboardLink()} className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    📊 Dashboard
                  </Link>
                  {role === 'OWNER' && (
                    <Link to="/owner/vehicles" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      🚗 My Vehicles
                    </Link>
                  )}
                  {role === 'CUSTOMER' && (
                    <Link to="/customer/dashboard" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      📋 My Trips
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid #e5e7eb', margin: '6px 0' }} />
                  <button className="nav-dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }} onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/owner/register" className="btn-rent-earn">Rent &amp; Earn</Link>
            <div className="nav-dropdown" ref={userRef} style={{ position: 'relative' }}>
              <button className="btn-sign-in" onClick={() => setUserMenuOpen(!userMenuOpen)}>Sign In</button>
              {userMenuOpen && (
                <div className="nav-dropdown-menu" style={{ right: 0, left: 'auto' }}>
                  <Link to="/owner/login" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    🏠 Sign in as Owner
                    <small>Manage your vehicles &amp; earnings</small>
                  </Link>
                  <Link to="/customer/login" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    🧑 Sign in as Customer
                    <small>Browse &amp; book vehicles</small>
                  </Link>
                  <Link to="/admin/login" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    🛡️ Admin Portal
                    <small>Platform management</small>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
