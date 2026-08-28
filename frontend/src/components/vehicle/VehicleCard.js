import React from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'col' }}>
      <div style={{ height: '200px', width: '100%', position: 'relative' }}>
        <img 
          src={vehicle.primaryImageUrl || 'https://via.placeholder.com/400x200?text=Vehicle'} 
          alt={vehicle.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          {vehicle.category}
        </div>
      </div>
      <div className="p-4" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ fontSize: '18px', margin: 0 }}>{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
          {vehicle.isOwnerVerified && <span className="badge-verified">✓ Verified</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px', fontSize: '14px', color: '#4B5563' }}>
          ⭐ {vehicle.rating || 0} ({vehicle.reviewCount || 0} reviews)
        </div>
        <div className="flex justify-between items-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>
          <span>{vehicle.seats} Seats</span>
          <span>•</span>
          <span>{vehicle.transmission}</span>
          <span>•</span>
          <span>{vehicle.fuel}</span>
          <span>•</span>
          <span>{vehicle.hasAC ? 'AC' : 'Non-AC'}</span>
        </div>
        <div className="mt-auto">
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>
            LKR {vehicle.dailyRate}/day
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '16px' }}>
            Base {vehicle.baseKmPerDay}km • Extra LKR {vehicle.extraRatePerKm}/km
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
            View & Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;