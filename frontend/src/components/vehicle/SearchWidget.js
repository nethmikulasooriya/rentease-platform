import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchWidget = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('self');
  const [search, setSearch] = useState({ location: '', pickupDate: '', returnDate: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(search);
    params.append('driver', tab === 'driver' ? 'true' : 'false');
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
      <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        <button 
          onClick={() => setTab('self')}
          style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: tab === 'self' ? 'bold' : 'normal', color: tab === 'self' ? 'var(--primary)' : '#4B5563', cursor: 'pointer', paddingBottom: '4px', borderBottom: tab === 'self' ? '2px solid var(--primary)' : 'none' }}>
          🚗 Self Drive
        </button>
        <button 
          onClick={() => setTab('driver')}
          style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: tab === 'driver' ? 'bold' : 'normal', color: tab === 'driver' ? 'var(--primary)' : '#4B5563', cursor: 'pointer', paddingBottom: '4px', borderBottom: tab === 'driver' ? '2px solid var(--primary)' : 'none' }}>
          👨‍✈️ With Driver
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid-3 items-center">
        <div className="form-group" style={{ margin: 0 }}>
          <label>Location</label>
          <input type="text" placeholder="City or district..." value={search.location} onChange={e => setSearch({...search, location: e.target.value})} required />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Pick-up Date</label>
          <input type="date" value={search.pickupDate} onChange={e => setSearch({...search, pickupDate: e.target.value})} required />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Return Date</label>
          <input type="date" value={search.returnDate} onChange={e => setSearch({...search, returnDate: e.target.value})} required />
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '18px', padding: '16px' }}>Search Vehicles</button>
        </div>
      </form>
    </div>
  );
};

export default SearchWidget;
