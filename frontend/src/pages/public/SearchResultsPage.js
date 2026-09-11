import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { catalogApi } from '../../services/api';
import VehicleCard from '../../components/vehicle/VehicleCard';
import { MapPin, Calendar, Search, Filter, X } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    transmission: searchParams.get('transmission') || '',
    category: searchParams.get('category') || '',
    hasAC: searchParams.get('hasAC') || ''
  });

  const city = searchParams.get('city') || '';
  const category = searchParams.get('category') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const fetchVehiclesFromBackend = () => {
    setLoading(true);
    
    // Construct exact query payload for backend Spring Boot JPA Specification
    const queryPayload = {};
    if (city) queryPayload.city = city;
    const cat = searchParams.get('category');
    if (cat) queryPayload.category = cat;
    const min = searchParams.get('minRate');
    if (min) queryPayload.minRate = parseFloat(min);
    const max = searchParams.get('maxRate');
    if (max) queryPayload.maxRate = parseFloat(max);
    const trans = searchParams.get('transmission');
    if (trans) queryPayload.transmission = trans;
    const ac = searchParams.get('hasAC');
    if (ac === 'true') queryPayload.hasAC = true;
    if (startDate) queryPayload.startDate = startDate;
    if (endDate) queryPayload.endDate = endDate;

    catalogApi.search(queryPayload)
      .then(res => {
        // Read Spring Data JPA Page object: res.data.content
        if (res.data && Array.isArray(res.data.content)) {
          setVehicles(res.data.content);
          setTotalElements(res.data.totalElements !== undefined ? res.data.totalElements : res.data.content.length);
        } else if (Array.isArray(res.data)) {
          setVehicles(res.data);
          setTotalElements(res.data.length);
        } else {
          setVehicles([]);
          setTotalElements(0);
        }
      })
      .catch(err => {
        console.error('Catalog Service Error:', err);
        setVehicles([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehiclesFromBackend();
    setTempFilters({
      minRate: searchParams.get('minRate') || '',
      maxRate: searchParams.get('maxRate') || '',
      transmission: searchParams.get('transmission') || '',
      category: searchParams.get('category') || '',
      hasAC: searchParams.get('hasAC') || ''
    });
  }, [searchParams]);

  const applyFilters = () => {
    const updated = new URLSearchParams(searchParams);
    Object.keys(tempFilters).forEach(key => {
      const val = tempFilters[key];
      if (val) {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const updated = new URLSearchParams(searchParams);
    ['minRate', 'maxRate', 'transmission', 'category', 'hasAC'].forEach(k => updated.delete(k));
    setSearchParams(updated);
    setShowFilters(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1240px', margin: '0 auto', paddingTop: '80px' }}>
      
      {/* Top Search Filter Header */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '16px 24px', borderRadius: '14px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={18} color="#64748b" /> {city ? <span style={{ textTransform: 'capitalize' }}>{city}</span> : 'All Locations'} 
            {startDate && <><Calendar size={18} color="#64748b" style={{ marginLeft: '12px' }} /> {startDate} to {endDate || 'Return'}</>}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E2E8F0', color: '#334155' }}
          >
            <Filter size={14} /> Filters
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E2E8F0', color: '#334155' }}
          >
            <Search size={14} /> Modify Search
          </button>
        </div>
      </div>

      {showFilters && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px', borderRadius: '14px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Category</label>
            <select className="form-input" value={tempFilters.category} onChange={e => setTempFilters({...tempFilters, category: e.target.value})}>
              <option value="">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Max Price (LKR)</label>
            <input type="number" className="form-input" placeholder="e.g. 15000" value={tempFilters.maxRate} onChange={e => setTempFilters({...tempFilters, maxRate: e.target.value})} />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Transmission</label>
            <select className="form-input" value={tempFilters.transmission} onChange={e => setTempFilters({...tempFilters, transmission: e.target.value})}>
              <option value="">Any</option>
              <option value="Auto">Auto</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>A/C Preference</label>
            <select className="form-input" value={tempFilters.hasAC} onChange={e => setTempFilters({...tempFilters, hasAC: e.target.value})}>
              <option value="">Any</option>
              <option value="true">A/C Required</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={clearFilters} className="btn-secondary" style={{ padding: '11px 20px', border: '1px solid #E2E8F0', color: '#64748B' }}>Clear</button>
            <button onClick={applyFilters} className="btn-primary" style={{ padding: '11px 24px', width: 'auto' }}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Real Database Results Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, textTransform: 'capitalize' }}>
            {category ? `${category} Vehicles` : (city ? `Vehicles in ${city}` : 'Available Vehicles')}
          </h1>
          <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>
            Showing {vehicles.length} of {totalElements}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '16px', color: '#6B7280' }}>Fetching vehicles from database...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#94A3B8' }}><Search size={48} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              {city ? `No vehicles found in "${city}"` : 'No vehicles match your filter criteria'}
            </h3>
            <p style={{ color: '#6B7280', maxWidth: '440px', margin: '0 auto 20px', fontSize: '14px', lineHeight: '1.5' }}>
              There are currently no active vehicles registered in the database matching these specific filters. Try searching for a different city or resetting your filters.
            </p>
            <button 
              onClick={() => setSearchParams({})} 
              className="btn-primary" 
              style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SearchResultsPage;
