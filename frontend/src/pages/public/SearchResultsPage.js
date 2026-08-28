import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../../components/vehicle/FilterSidebar';
import VehicleCard from '../../components/vehicle/VehicleCard';
import { catalogApi } from '../../services/api';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchVehicles = () => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    catalogApi.searchVehicles({ ...params, ...filters })
      .then(res => setVehicles(res.data.items || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehicles();
  }, [searchParams]); // eslint-disable-line

  return (
    <div className="container" style={{ padding: '32px 16px', display: 'flex', gap: '32px' }}>
      <div style={{ width: '300px', flexShrink: 0 }}>
        <FilterSidebar filters={filters} setFilters={setFilters} onApply={fetchVehicles} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-4">
          <h2>{vehicles.length} vehicles found</h2>
          <select style={{ width: '200px' }}>
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}><div className="spinner"></div></div>
        ) : vehicles.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
            <h3>No vehicles found</h3>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid-2">
            {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
