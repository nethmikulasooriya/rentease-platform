import React, { useState, useEffect } from 'react';
import { catalogApi } from '../../services/api';
import { Link } from 'react-router-dom';

const OwnerVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ownerId = localStorage.getItem('rentease_userId');
    if (!ownerId) {
      setLoading(false);
      return;
    }
    catalogApi.getOwnerVehicles(ownerId)
      .then(res => {
        const list = res.data?.content || res.data?.items || (Array.isArray(res.data) ? res.data : []);
        setVehicles(list);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>My Vehicles</h2>
        <Link to="/owner/vehicles/new"><button className="btn-primary">+ Add Vehicle</button></Link>
      </div>
      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <table className="table">
            <thead><tr><th>Photo</th><th>Name</th><th>Category</th><th>Rate/Day</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td><img src={v.primaryImageUrl || 'https://via.placeholder.com/50'} alt="vehicle" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                  <td>{v.brand} {v.model} ({v.year})</td>
                  <td>{v.category}</td>
                  <td>LKR {v.dailyRate}</td>
                  <td><span className="badge-active">{v.status || 'ACTIVE'}</span></td>
                  <td>
                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No vehicles found. Add one to get started!</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnerVehiclesPage;
