import React from 'react';
import { Link } from 'react-router-dom';

import { CarFront } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2 style={{ color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CarFront size={24} color="#fff" /> RentEase
            </h2>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Sri Lanka's premier vehicle rental marketplace.</p>
          </div>
          <div>
            <h3>Company</h3>
            <Link to="/">About Us</Link>
            <Link to="/">Careers</Link>
            <Link to="/">Blog</Link>
          </div>
          <div>
            <h3>Support</h3>
            <Link to="/">Help Center</Link>
            <Link to="/">Contact Us</Link>
            <Link to="/">Safety Guidelines</Link>
          </div>
          <div>
            <h3>For Hosts</h3>
            <Link to="/owner/register">List Your Vehicle</Link>
            <Link to="/">Host Resources</Link>
            <Link to="/">Earnings Calculator</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          © 2024 RentEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
