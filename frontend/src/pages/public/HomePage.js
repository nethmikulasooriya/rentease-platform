import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SRI_LANKA_CITIES = [
  { name: 'Colombo', icon: '🏙️', sub: 'Western Province' },
  { name: 'BIA Airport, Katunayake', icon: '✈️', sub: 'International Airport' },
  { name: 'Negombo', icon: '🌊', sub: 'Western Province' },
  { name: 'Kandy', icon: '🏔️', sub: 'Central Province' },
  { name: 'Galle', icon: '🏖️', sub: 'Southern Province' },
  { name: 'Ella', icon: '🌿', sub: 'Uva Province' },
  { name: 'Nuwara Eliya', icon: '🍵', sub: 'Central Province' },
  { name: 'Trincomalee', icon: '🐋', sub: 'Eastern Province' },
  { name: 'Jaffna', icon: '🏛️', sub: 'Northern Province' },
  { name: 'Batticaloa', icon: '🌴', sub: 'Eastern Province' },
  { name: 'Matara', icon: '🌊', sub: 'Southern Province' },
  { name: 'Anuradhapura', icon: '🏯', sub: 'North Central Province' },
  { name: 'Sigiriya', icon: '🦁', sub: 'Central Province' },
  { name: 'Dambulla', icon: '🪨', sub: 'Central Province' },
  { name: 'Hikkaduwa', icon: '🤿', sub: 'Southern Province' },
  { name: 'Mirissa', icon: '🐬', sub: 'Southern Province' },
  { name: 'Unawatuna', icon: '🏄', sub: 'Southern Province' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [driveMode, setDriveMode] = useState('self');
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const locationRef = useRef(null);

  const filteredCities = SRI_LANKA_CITIES.filter(c =>
    location.length > 0 && c.name.toLowerCase().includes(location.toLowerCase())
  );

  const categories = [
    { id: 'All', label: 'All Vehicles', icon: '🚗' },
    { id: 'TUK_TUK', label: 'Tuk-Tuk', icon: '🛺' },
    { id: 'SCOOTER', label: 'Scooter', icon: '🛵' },
    { id: 'HATCHBACK', label: 'Economy Car', icon: '🚙' },
    { id: 'SEDAN', label: 'Sedan', icon: '🚘' },
    { id: 'SUV', label: 'SUV', icon: '🚐' },
    { id: 'VAN', label: 'Passenger Van', icon: '🚌' },
    { id: 'LUXURY', label: 'Luxury', icon: '✨' },
  ];

  const mockVehicles = [
    { id: 1, brand: 'Toyota', model: 'Aqua', year: 2022, category: 'HATCHBACK', city: 'Colombo', district: 'Colombo', dailyRateLKR: 7500, baseKmPerDay: 100, extraRatePerKm: 45, avgRating: 4.8, totalReviews: 42, primaryImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80', transmission: 'AUTO', fuel: 'PETROL', seats: 5, hasAC: true, status: 'ACTIVE' },
    { id: 2, brand: 'Honda', model: 'Vezel', year: 2021, category: 'SUV', city: 'Kandy', district: 'Kandy', dailyRateLKR: 9500, baseKmPerDay: 100, extraRatePerKm: 55, avgRating: 4.9, totalReviews: 28, primaryImageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80', transmission: 'AUTO', fuel: 'PETROL', seats: 5, hasAC: true, status: 'ACTIVE' },
    { id: 3, brand: 'Toyota', model: 'HiAce', year: 2020, category: 'VAN', city: 'Negombo', district: 'Gampaha', dailyRateLKR: 14000, baseKmPerDay: 150, extraRatePerKm: 60, avgRating: 4.7, totalReviews: 19, primaryImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', transmission: 'MANUAL', fuel: 'DIESEL', seats: 14, hasAC: true, status: 'ACTIVE' },
    { id: 4, brand: 'Bajaj', model: 'Three-Wheeler', year: 2023, category: 'TUK_TUK', city: 'Galle', district: 'Galle', dailyRateLKR: 2500, baseKmPerDay: 80, extraRatePerKm: 25, avgRating: 4.6, totalReviews: 63, primaryImageUrl: 'https://images.unsplash.com/photo-1597075095900-d4c01b3e51da?w=400&q=80', transmission: 'MANUAL', fuel: 'PETROL', seats: 3, hasAC: false, status: 'ACTIVE' },
    { id: 5, brand: 'BMW', model: '5 Series', year: 2022, category: 'LUXURY', city: 'Colombo', district: 'Colombo', dailyRateLKR: 25000, baseKmPerDay: 100, extraRatePerKm: 150, avgRating: 5.0, totalReviews: 11, primaryImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80', transmission: 'AUTO', fuel: 'PETROL', seats: 5, hasAC: true, status: 'ACTIVE' },
    { id: 6, brand: 'Honda', model: 'Dio', year: 2023, category: 'SCOOTER', city: 'Ella', district: 'Badulla', dailyRateLKR: 2000, baseKmPerDay: 60, extraRatePerKm: 20, avgRating: 4.5, totalReviews: 34, primaryImageUrl: 'https://images.unsplash.com/photo-1568772585407-9f787b01d8fa?w=400&q=80', transmission: 'AUTO', fuel: 'PETROL', seats: 2, hasAC: false, status: 'ACTIVE' },
    { id: 7, brand: 'Suzuki', model: 'Wagon R', year: 2021, category: 'HATCHBACK', city: 'Matara', district: 'Matara', dailyRateLKR: 5500, baseKmPerDay: 100, extraRatePerKm: 40, avgRating: 4.7, totalReviews: 55, primaryImageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80', transmission: 'AUTO', fuel: 'PETROL', seats: 5, hasAC: true, status: 'ACTIVE' },
    { id: 8, brand: 'Mitsubishi', model: 'Montero', year: 2020, category: 'SUV', city: 'Trincomalee', district: 'Trincomalee', dailyRateLKR: 12000, baseKmPerDay: 100, extraRatePerKm: 70, avgRating: 4.8, totalReviews: 22, primaryImageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80', transmission: 'AUTO', fuel: 'DIESEL', seats: 7, hasAC: true, status: 'ACTIVE' },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
    }, 600);
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
    if (location) params.set('city', location);
    if (pickupDate) params.set('startDate', pickupDate);
    if (returnDate) params.set('endDate', returnDate);
    if (vehicleType) params.set('category', vehicleType);
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
    : vehicles.filter(v => v.category === activeCategory);

  const groupedVehicles = {
    'Top Cars for Rent': vehicles.filter(v => ['HATCHBACK', 'SEDAN'].includes(v.category)),
    'Premium SUVs': vehicles.filter(v => v.category === 'SUV'),
    'Bikes & Scooters': vehicles.filter(v => v.category === 'SCOOTER'),
    'Spacious Vans': vehicles.filter(v => v.category === 'VAN'),
    'Tuk-Tuks': vehicles.filter(v => v.category === 'TUK_TUK'),
    'Luxury Rides': vehicles.filter(v => v.category === 'LUXURY'),
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <form className="search-card" onSubmit={handleSearch}>
            {/* Drive Mode Tabs */}
            <div className="search-tabs">
              <button type="button" className={`search-tab${driveMode === 'self' ? ' active' : ''}`} onClick={() => setDriveMode('self')}>
                🚗 Self-Drive
              </button>
              <button type="button" className={`search-tab${driveMode === 'driver' ? ' active' : ''}`} onClick={() => setDriveMode('driver')}>
                👨‍✈️ With Driver (Chauffeur)
              </button>
            </div>

            {/* Location */}
            <div className="search-field-wrap" ref={locationRef}>
              <span className="search-field-icon">📍</span>
              <input
                className="search-field with-icon"
                type="text"
                placeholder="Colombo, BIA, Negombo..."
                value={location}
                onChange={e => { setLocation(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              {showSuggestions && filteredCities.length > 0 && (
                <div className="city-suggestions">
                  {filteredCities.map(city => (
                    <div key={city.name} className="city-suggestion-item" onMouseDown={() => { setLocation(city.name); setShowSuggestions(false); }}>
                      <span>{city.icon}</span>
                      <span>{city.name} <span className="city-icon">· {city.sub}</span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="search-row">
              <div className="search-field-wrap" style={{ marginBottom: 0 }}>
                <span className="search-field-icon">📅</span>
                <input className="search-field with-icon" type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} style={{ colorScheme: 'light' }} />
              </div>
              <div className="search-field-wrap" style={{ marginBottom: 0 }}>
                <span className="search-field-icon">📅</span>
                <input className="search-field with-icon" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} style={{ colorScheme: 'light' }} />
              </div>
            </div>

            {/* Vehicle Type + Button */}
            <div className="search-bottom-row">
              <select className="vehicle-type-select" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                <option value="">Sedans, SUVs, Tuk-Tuks, scooters...</option>
                <option value="TUK_TUK">Tuk-Tuk</option>
                <option value="SCOOTER">Scooter</option>
                <option value="HATCHBACK">Economy Car</option>
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="VAN">Passenger Van</option>
                <option value="LUXURY">Luxury</option>
              </select>
              <button type="submit" className="btn-find">
                🔍 Find Vehicles
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

      {/* VEHICLE LISTINGS */}
      <div className="main-content">
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : activeCategory !== 'All' ? (
          /* Filtered view */
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">
                {categories.find(c => c.id === activeCategory)?.icon} {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>{displayedVehicles.length} vehicles</span>
            </div>
            {displayedVehicles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No vehicles in this category yet</h3>
                <p>Check back soon — owners are adding vehicles daily!</p>
              </div>
            ) : (
              <div className="vehicle-grid">
                {displayedVehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>
        ) : (
          /* All vehicles — grouped by category */
          Object.entries(groupedVehicles).map(([title, list]) =>
            list.length > 0 ? (
              <div className="category-section" key={title}>
                <div className="section-header">
                  <h2 className="section-title">{title}</h2>
                  <a href="/vehicles" className="section-link">See all →</a>
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

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  return (
    <div className="vehicle-card" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
      {vehicle.primaryImageUrl ? (
        <img className="vehicle-card-img" src={vehicle.primaryImageUrl} alt={`${vehicle.brand} ${vehicle.model}`} />
      ) : (
        <div className="vehicle-card-img-placeholder">🚗</div>
      )}
      <div className="vehicle-card-body">
        <div className="verified-badge">✅ Verified Host</div>
        <div className="vehicle-card-name">{vehicle.brand} {vehicle.model} {vehicle.year}</div>
        <div className="vehicle-card-location">📍 {vehicle.city} · {vehicle.driveMode || 'Self Drive'}</div>
        <div className="vehicle-card-rating">
          <span className="star">⭐</span> {vehicle.avgRating > 0 ? vehicle.avgRating.toFixed(1) : 'New'} · {vehicle.totalReviews} reviews
        </div>
        <div className="vehicle-card-price">
          LKR {vehicle.dailyRateLKR?.toLocaleString()} <span>/ day</span>
        </div>
        <div className="vehicle-card-specs">
          <span className="spec-badge">💺 {vehicle.seats} seats</span>
          <span className="spec-badge">⚙️ {vehicle.transmission}</span>
          <span className="spec-badge">{vehicle.hasAC ? '❄️ A/C' : '🌬️ No A/C'}</span>
        </div>
      </div>
    </div>
  );
}
