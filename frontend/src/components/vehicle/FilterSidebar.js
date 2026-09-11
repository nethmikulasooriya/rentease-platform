import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'TUK_TUK', label: '🛺 Tuk-Tuk' },
  { id: 'SCOOTER', label: '🛵 Scooter' },
  { id: 'HATCHBACK', label: '🚙 Economy / Hatchback' },
  { id: 'SEDAN', label: '🚘 Sedan' },
  { id: 'SUV', label: '🚐 SUV' },
  { id: 'VAN', label: '🚌 Passenger Van' },
  { id: 'LUXURY', label: '✨ Luxury' }
];

const FilterSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [minRate, setMinRate] = useState(currentFilters.minRate || currentFilters.minPrice || '');
  const [maxRate, setMaxRate] = useState(currentFilters.maxRate || currentFilters.maxPrice || '');

  // Keep local inputs in sync when URL query params change externally
  useEffect(() => {
    setMinRate(currentFilters.minRate || currentFilters.minPrice || '');
    setMaxRate(currentFilters.maxRate || currentFilters.maxPrice || '');
  }, [currentFilters.minRate, currentFilters.minPrice, currentFilters.maxRate, currentFilters.maxPrice]);

  const handlePriceApply = (e) => {
    if (e) e.preventDefault();
    onFilterChange({
      minRate: minRate.trim(),
      maxRate: maxRate.trim()
    });
  };

  const handleToggle = (key, value) => {
    // If already active, toggle off (clear)
    const currentValue = currentFilters[key];
    const newValue = currentValue === value ? '' : value;
    onFilterChange({ [key]: newValue });
  };

  const handleClear = () => {
    setMinRate('');
    setMaxRate('');
    onFilterChange({
      minRate: '',
      maxRate: '',
      category: '',
      transmission: '',
      fuel: '',
      hasAC: ''
    });
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Filter Vehicles</h3>
        <button 
          type="button" 
          onClick={handleClear}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
        >
          Reset All
        </button>
      </div>
      
      {/* Price Range */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Price Range (LKR / Day)</label>
        <form onSubmit={handlePriceApply} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input 
              className="form-input" 
              type="number" 
              placeholder="Min LKR" 
              value={minRate} 
              onChange={e => setMinRate(e.target.value)} 
              onBlur={() => handlePriceApply()}
              style={{ padding: '8px 10px', fontSize: '13px' }}
            />
            <input 
              className="form-input" 
              type="number" 
              placeholder="Max LKR" 
              value={maxRate} 
              onChange={e => setMaxRate(e.target.value)} 
              onBlur={() => handlePriceApply()}
              style={{ padding: '8px 10px', fontSize: '13px' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
          >
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* Category Selection */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Vehicle Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map(cat => {
            const isSelected = (currentFilters.category || '').toUpperCase() === cat.id;
            return (
              <div 
                key={cat.id}
                onClick={() => handleToggle('category', cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isSelected ? '#EFF6FF' : 'transparent',
                  border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={() => {}} // handled by parent div
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--primary)' : '#374151' }}>
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transmission */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Transmission</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'AUTO', label: 'Automatic' },
            { id: 'MANUAL', label: 'Manual' }
          ].map(trans => {
            const isSelected = (currentFilters.transmission || '').toUpperCase() === trans.id;
            return (
              <button
                key={trans.id}
                type="button"
                onClick={() => handleToggle('transmission', trans.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid #D1D5DB',
                  background: isSelected ? '#EFF6FF' : '#fff',
                  color: isSelected ? 'var(--primary)' : '#374151',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {trans.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Fuel Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {['PETROL', 'DIESEL', 'HYBRID', 'EV'].map(fuel => {
            const isSelected = (currentFilters.fuel || '').toUpperCase() === fuel;
            return (
              <button
                key={fuel}
                type="button"
                onClick={() => handleToggle('fuel', fuel)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid #E5E7EB',
                  background: isSelected ? '#EFF6FF' : '#fff',
                  color: isSelected ? 'var(--primary)' : '#4B5563',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {fuel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Air Conditioning */}
      <div className="form-group" style={{ marginBottom: '8px' }}>
        <label 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '13px', 
            cursor: 'pointer', 
            color: '#111827', 
            fontWeight: '600',
            padding: '8px',
            borderRadius: '8px',
            background: currentFilters.hasAC === 'true' ? '#EFF6FF' : '#F9FAFB'
          }}
        >
          <input 
            type="checkbox" 
            checked={currentFilters.hasAC === 'true' || currentFilters.hasAC === true} 
            onChange={e => onFilterChange({ hasAC: e.target.checked ? 'true' : '' })} 
            style={{ cursor: 'pointer' }}
          />
          ❄️ Air Conditioned (A/C)
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
