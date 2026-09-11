import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Star, ShieldCheck, Users, Settings2, Snowflake } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const dailyRate = vehicle.dailyRateLKR || vehicle.dailyRate || 0;

  return (
    <div 
      className="vehicle-card" 
      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
      style={{ cursor: 'pointer', border: '1px solid rgba(226,232,240,0.8)', boxShadow: 'none' }}
    >
      <div style={{ height: '170px', background: '#F3F4F6', overflow: 'hidden' }}>
        {vehicle.primaryImageUrl ? (
          <img 
            src={vehicle.primaryImageUrl} 
            alt={`${vehicle.brand} ${vehicle.model}`} 
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Photo';
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>
            <Car size={40} />
          </div>
        )}
      </div>

      <div className="vehicle-card-body">
        <div className="verified-badge" style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} /> Verified Host
        </div>
        <div className="vehicle-card-name" style={{ textTransform: 'capitalize' }} title={`${vehicle.brand} ${vehicle.model}`}>
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </div>
        <div className="vehicle-card-location" style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} /> {vehicle.city || 'Colombo'}, {vehicle.district || 'Western'}
        </div>
        
        <div className="vehicle-card-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={14} fill="#F59E0B" color="#F59E0B" /> 
          {vehicle.avgRating > 0 ? Number(vehicle.avgRating).toFixed(1) : 'New'} 
          <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>
            ({vehicle.totalReviews || 0})
          </span>
        </div>

        <div className="vehicle-card-price tabular-nums" style={{ fontSize: '18px' }}>
          LKR {dailyRate.toLocaleString()} <span style={{ fontSize: '13px', color: '#6B7280' }}>/ day</span>
        </div>

        <div className="vehicle-card-specs" style={{ color: '#9CA3AF' }}>
          <span className="spec-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> {vehicle.seats || 5} Seats
          </span>
          <span className="spec-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Settings2 size={12} /> <span style={{ textTransform: 'capitalize' }}>{vehicle.transmission?.toLowerCase() || 'auto'}</span>
          </span>
          <span className="spec-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Snowflake size={12} /> {vehicle.hasAC !== false ? 'A/C' : 'Non-A/C'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;