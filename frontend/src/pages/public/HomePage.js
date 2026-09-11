import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '../../services/api';
import VehicleCard from '../../components/vehicle/VehicleCard';
import { MapPin, Calendar, Search, Car, CarFront, Users, ShieldCheck, Sparkles, Bike } from 'lucide-react';

const SRI_LANKA_CITIES = [
  { name: 'Colombo', sub: 'Western Province' },
  { name: 'BIA Airport, Katunayake', sub: 'International Airport' },
  { name: 'Negombo', sub: 'Western Province' },
  { name: 'Kandy', sub: 'Central Province' },
  { name: 'Galle', sub: 'Southern Province' },
  { name: 'Ella', sub: 'Uva Province' },
  { name: 'Nuwara Eliya', sub: 'Central Province' },
  { name: 'Trincomalee', sub: 'Eastern Province' },
  { name: 'Jaffna', sub: 'Northern Province' },
  { name: 'Matara', sub: 'Southern Province' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [driveMode, setDriveMode] = useState('self');
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const locationRef = useRef(null);

  const filteredCities = SRI_LANKA_CITIES.filter(c =>
    location.length > 0 && c.name.toLowerCase().includes(location.toLowerCase())
  );

  const categories = [
    { id: 'All', label: 'All Vehicles', icon: <Car size={24} /> },
    { id: 'TUK_TUK', label: 'Tuk-Tuk', icon: <Users size={24} /> },
    { id: 'SCOOTER', label: 'Scooter', icon: <Bike size={24} /> },
    { id: 'HATCHBACK', label: 'Economy', icon: <CarFront size={24} /> },
    { id: 'SEDAN', label: 'Sedan', icon: <Car size={24} /> },
    { id: 'SUV', label: 'SUV', icon: <ShieldCheck size={24} /> },
    { id: 'VAN', label: 'Van', icon: <Users size={24} /> },
    { id: 'LUXURY', label: 'Luxury', icon: <Sparkles size={24} /> },
  ];

  useEffect(() => {
    setLoading(true);
    // 100% Real Database Fetching from Catalog Service
    catalogApi.search({})
      .then(res => {
        let list = [];
        if (res.data && Array.isArray(res.data.content)) {
          list = res.data.content;
        } else if (Array.isArray(res.data)) {
          list = res.data;
        }
        setVehicles(list);
      })
      .catch(err => {
        console.error('Failed to load database vehicles:', err);
        setVehicles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('city', location.trim());
    if (pickupDate) params.set('startDate', pickupDate);
    if (returnDate) params.set('endDate', returnDate);
    if (driveMode === 'driver') params.set('withDriver', 'true');
    navigate(`/vehicles?${params.toString()}`);
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (catId !== 'All') {
      navigate(`/vehicles?category=${catId}`);
    }
  };

  const displayedVehicles = activeCategory === 'All'
    ? vehicles
    : vehicles.filter(v => (v.category || '').toUpperCase() === activeCategory.toUpperCase());

  const groupedVehicles = {
    'Popular Cars & Sedans': vehicles.filter(v => ['HATCHBACK', 'SEDAN'].includes((v.category || '').toUpperCase())),
    'SUVs & Off-Road': vehicles.filter(v => (v.category || '').toUpperCase() === 'SUV'),
    'Bikes & Scooters': vehicles.filter(v => (v.category || '').toUpperCase() === 'SCOOTER'),
    'Passenger Vans & Buses': vehicles.filter(v => (v.category || '').toUpperCase() === 'VAN'),
    'Tuk-Tuks & Three-Wheelers': vehicles.filter(v => (v.category || '').toUpperCase() === 'TUK_TUK'),
    'Luxury & VIP Vehicles': vehicles.filter(v => (v.category || '').toUpperCase() === 'LUXURY'),
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <form className="search-card" onSubmit={handleSearch}>
            
            {/* Drive Mode Tabs */}
            <div className="search-tabs">
              <button 
                type="button" 
                className={`search-tab${driveMode === 'self' ? ' active' : ''}`} 
                onClick={() => setDriveMode('self')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Car size={16} /> Self-Drive
              </button>
              <button 
                type="button" 
                className={`search-tab${driveMode === 'driver' ? ' active' : ''}`} 
                onClick={() => setDriveMode('driver')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Users size={16} /> With Driver (Chauffeur)
              </button>
            </div>

            {/* Location Autocomplete */}
            <div className="search-field-wrap" ref={locationRef}>
              <span className="search-field-icon"><MapPin size={16} /></span>
              <input
                className="search-field with-icon"
                type="text"
                placeholder="Colombo, BIA, Negombo, Kandy, Galle..."
                value={location}
                onChange={e => { setLocation(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              {showSuggestions && filteredCities.length > 0 && (
                <div className="city-suggestions">
                  {filteredCities.map(city => (
                    <div 
                      key={city.name} 
                      className="city-suggestion-item" 
                      onMouseDown={() => { setLocation(city.name); setShowSuggestions(false); }}
                    >
                      <MapPin size={14} className="city-icon" />
                      <span>{city.name} <span className="city-icon">· {city.sub}</span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="search-row">
              <div className="search-field-wrap" style={{ marginBottom: 0 }}>
                <span className="search-field-icon"><Calendar size={16} /></span>
                <input 
                  className="search-field with-icon" 
                  type="date" 
                  value={pickupDate} 
                  onChange={e => setPickupDate(e.target.value)} 
                  style={{ colorScheme: 'light' }} 
                />
              </div>
              <div className="search-field-wrap" style={{ marginBottom: 0 }}>
                <span className="search-field-icon"><Calendar size={16} /></span>
                <input 
                  className="search-field with-icon" 
                  type="date" 
                  value={returnDate} 
                  onChange={e => setReturnDate(e.target.value)} 
                  style={{ colorScheme: 'light' }} 
                />
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Search size={18} /> Find Vehicles
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <div className="category-bar">
        <div className="category-bar-inner">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* VEHICLE LISTINGS GRID */}
      <div className="main-content">
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : vehicles.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '40px auto', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#94A3B8' }}><Car size={48} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No Live Vehicles in Database</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Sign in as a Vehicle Owner or use your Owner Dashboard to list the first vehicles in Sri Lanka!
            </p>
            <button 
              onClick={() => navigate('/owner/register')} 
              className="btn-primary" 
              style={{ display: 'inline-block', width: 'auto', padding: '12px 28px' }}
            >
              List Your Vehicle &amp; Earn
            </button>
          </div>
        ) : activeCategory !== 'All' ? (
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {categories.find(c => c.id === activeCategory)?.icon} {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <span style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>{displayedVehicles.length} vehicles</span>
            </div>
            {displayedVehicles.length === 0 ? (
              <div className="empty-state">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#94A3B8' }}><Search size={48} /></div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No vehicles found in this category</h3>
                <p>Try exploring other categories or view all vehicles.</p>
              </div>
            ) : (
              <div className="vehicle-grid">
                {displayedVehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>
        ) : (
          Object.entries(groupedVehicles).map(([title, list]) =>
            list.length > 0 ? (
              <div className="category-section" key={title}>
                <div className="section-header">
                  <h2 className="section-title">{title}</h2>
                  <span onClick={() => navigate('/vehicles')} style={{ cursor: 'pointer' }} className="section-link">See all →</span>
                </div>
                <div className="vehicle-grid">
                  {list.map(v => <VehicleCard key={v.id} vehicle={v} />)}
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </>
  );
}
