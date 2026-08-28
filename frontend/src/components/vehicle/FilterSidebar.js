import React from 'react';

const FilterSidebar = ({ filters, setFilters, onApply }) => {
  return (
    <div className="card">
      <h3 className="mb-4">Filters</h3>
      
      <div className="form-group">
        <label>Price Range (LKR)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
          <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
        </div>
      </div>

      <div className="form-group">
        <label>Category</label>
        {['Tuk-Tuk', 'Scooter', 'Hatchback', 'Sedan', 'SUV', 'Van', 'Luxury'].map(cat => (
          <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', margin: '8px 0' }}>
            <input type="checkbox" checked={filters.category?.includes(cat)} onChange={(e) => {
              const cats = filters.category || [];
              if (e.target.checked) setFilters({...filters, category: [...cats, cat]});
              else setFilters({...filters, category: cats.filter(c => c !== cat)});
            }} /> {cat}
          </label>
        ))}
      </div>

      <div className="form-group">
        <label>Transmission</label>
        {['Automatic', 'Manual'].map(type => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', margin: '8px 0' }}>
            <input type="radio" name="transmission" checked={filters.transmission === type} onChange={() => setFilters({...filters, transmission: type})} /> {type}
          </label>
        ))}
      </div>

      <div className="form-group">
        <label>Fuel Type</label>
        {['Petrol', 'Diesel', 'Hybrid', 'EV'].map(type => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', margin: '8px 0' }}>
            <input type="checkbox" checked={filters.fuel?.includes(type)} onChange={(e) => {
              const fuels = filters.fuel || [];
              if (e.target.checked) setFilters({...filters, fuel: [...fuels, type]});
              else setFilters({...filters, fuel: fuels.filter(f => f !== type)});
            }} /> {type}
          </label>
        ))}
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={filters.hasAC || false} onChange={e => setFilters({...filters, hasAC: e.target.checked})} />
          Air Conditioning
        </label>
      </div>

      <button className="btn-primary" style={{ width: '100%', marginBottom: '16px' }} onClick={onApply}>Apply Filters</button>
      <button className="btn-secondary" style={{ width: '100%', border: 'none' }} onClick={() => { setFilters({}); onApply(); }}>Clear Filters</button>
    </div>
  );
};

export default FilterSidebar;
