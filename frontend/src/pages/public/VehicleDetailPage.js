import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { catalogApi, bookingApi } from '../../services/api';
import { differenceInDays } from 'date-fns';
import { Star, MapPin, ShieldCheck, Snowflake, Wind, Car, Users, Zap, Lock, AlertTriangle } from 'lucide-react';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [booking, setBooking] = useState({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    driveMode: searchParams.get('withDriver') === 'true' ? 'WITH_DRIVER' : 'SELF_DRIVE',
    pickupLocation: searchParams.get('city') || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      catalogApi.getVehicle(id).then(res => setVehicle(res.data)).catch(() => {}),
      catalogApi.getSimilar(id).then(res => setSimilar(res.data.items || res.data || [])).catch(() => {})
    ]).finally(() => setLoading(false));
  }, [id]);

  const days = (booking.startDate && booking.endDate) 
    ? Math.max(1, differenceInDays(new Date(booking.endDate), new Date(booking.startDate))) 
    : 0;
  
  const dailyRate = vehicle ? (vehicle.dailyRateLKR || vehicle.dailyRate || 0) : 0;
  const driverFeePerDay = booking.driveMode === 'WITH_DRIVER' ? 2500 : 0;
  const subtotal = (dailyRate + driverFeePerDay) * days;
  const deposit = booking.driveMode === 'SELF_DRIVE' ? subtotal * 0.3 : 0; // No deposit for with-driver
  const total = subtotal + deposit;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!booking.startDate || !booking.endDate) {
      setError('Please select both pickup and return dates.');
      return;
    }

    const token = localStorage.getItem('rentease_token');
    const role = localStorage.getItem('rentease_role');

    const draft = {
      vehicleId: id,
      vehicleName: `${vehicle?.brand || ''} ${vehicle?.model || ''} (${vehicle?.year || ''})`,
      ownerId: vehicle?.ownerId,
      dailyRateLKR: dailyRate,
      baseKmPerDay: vehicle?.baseKmPerDay || 100,
      extraRatePerKm: vehicle?.extraRatePerKm || 45,
      driveMode: booking.driveMode,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalDays: days,
      pickupLocation: booking.pickupLocation || vehicle?.city || 'Colombo',
      dropoffLocation: booking.pickupLocation || vehicle?.city || 'Colombo',
      estimatedCostLKR: subtotal,
      depositAmountLKR: deposit,
      withDriver: booking.driveMode === 'WITH_DRIVER'
    };

    // Save intent to sessionStorage
    sessionStorage.setItem('pendingBooking', JSON.stringify(draft));

    // Interception Gate
    if (!token || role !== 'CUSTOMER') {
      navigate('/customer/register?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="spinner" style={{margin:'0 auto'}}></div></div>;
  if (!vehicle) return <div className="page-container"><h3>Vehicle not found</h3></div>;

  return (
    <div className="page-container" style={{ paddingTop: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
        
        {/* Left: Vehicle Details */}
        <div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', height: '420px', background: '#F3F4F6', marginBottom: '24px' }}>
            <img 
              src={vehicle.primaryImageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'} 
              alt={vehicle.model} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Photo';
              }}
            />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', textTransform: 'capitalize' }}>
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </h1>
          
          <div style={{ display: 'flex', gap: '20px', color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="#6B7280" /> {vehicle.avgRating > 0 ? vehicle.avgRating.toFixed(1) : 'New'} ({vehicle.totalReviews || 0} reviews)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}><MapPin size={14} /> {vehicle.city}, {vehicle.district}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Verified Vehicle Host</span>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Specifications &amp; Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div><strong style={{ color: '#4B5563' }}>Category:</strong> <div style={{ textTransform: 'capitalize' }}>{vehicle.category}</div></div>
              <div><strong style={{ color: '#4B5563' }}>Seats:</strong> <div>{vehicle.seats} Passengers</div></div>
              <div><strong style={{ color: '#4B5563' }}>Transmission:</strong> <div style={{ textTransform: 'capitalize' }}>{vehicle.transmission?.toLowerCase()}</div></div>
              <div><strong style={{ color: '#4B5563' }}>Fuel Type:</strong> <div style={{ textTransform: 'capitalize' }}>{vehicle.fuel?.toLowerCase()}</div></div>
              <div><strong style={{ color: '#4B5563' }}>Air Conditioning:</strong> <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{vehicle.hasAC ? <><Snowflake size={14}/> A/C Available</> : <><Wind size={14}/> Non-A/C</>}</div></div>
              <div><strong style={{ color: '#4B5563' }}>Base Mileage:</strong> <div>{vehicle.baseKmPerDay || 100} km / day</div></div>
            </div>
          </div>

          {vehicle.description && (
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Host Notes &amp; Description</h3>
              <p style={{ color: '#4B5563', lineHeight: '1.6' }}>{vehicle.description}</p>
            </div>
          )}
        </div>

        {/* Right: Booking Form Widget */}
        <div className="card" style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <span className="tabular-nums" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>
              LKR {dailyRate.toLocaleString()}
            </span>
            <span style={{ color: '#6B7280', fontSize: '14px' }}>/ day</span>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleBooking}>
            {/* Drive Mode Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '10px', marginBottom: '16px' }}>
              <button 
                type="button" 
                onClick={() => setBooking({ ...booking, driveMode: 'SELF_DRIVE' })}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: booking.driveMode === 'SELF_DRIVE' ? '#fff' : 'transparent',
                  color: booking.driveMode === 'SELF_DRIVE' ? '#111827' : '#6B7280',
                  boxShadow: booking.driveMode === 'SELF_DRIVE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Car size={14} /> Self-Drive
              </button>
              <button 
                type="button" 
                onClick={() => setBooking({ ...booking, driveMode: 'WITH_DRIVER' })}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: booking.driveMode === 'WITH_DRIVER' ? '#fff' : 'transparent',
                  color: booking.driveMode === 'WITH_DRIVER' ? '#111827' : '#6B7280',
                  boxShadow: booking.driveMode === 'WITH_DRIVER' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Users size={14} /> With Driver
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Pick-up Location</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="e.g. Colombo, BIA Airport, Galle"
                value={booking.pickupLocation} 
                onChange={e => setBooking({ ...booking, pickupLocation: e.target.value })} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Pick-up Date</label>
                <input 
                  className="form-input" 
                  type="date" 
                  required 
                  value={booking.startDate} 
                  onChange={e => setBooking({ ...booking, startDate: e.target.value })} 
                />
              </div>
              <div>
                <label className="form-label">Return Date</label>
                <input 
                  className="form-input" 
                  type="date" 
                  required 
                  value={booking.endDate} 
                  onChange={e => setBooking({ ...booking, endDate: e.target.value })} 
                />
              </div>
            </div>

            {/* Price Summary Breakdown */}
            {days > 0 && (
              <div className="tabular-nums" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#4B5563' }}>
                  <span>Rental ({days} {days === 1 ? 'day' : 'days'} × LKR {dailyRate.toLocaleString()})</span>
                  <span>LKR {(dailyRate * days).toLocaleString()}</span>
                </div>
                {booking.driveMode === 'WITH_DRIVER' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#4B5563' }}>
                    <span>Chauffeur Fee ({days} days)</span>
                    <span>LKR {(driverFeePerDay * days).toLocaleString()}</span>
                  </div>
                )}
                {booking.driveMode === 'SELF_DRIVE' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#059669', fontWeight: '500' }}>
                    <span>Refundable Deposit (30%)</span>
                    <span>LKR {deposit.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px dashed #cbd5e1', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px', color: '#111827' }}>
                  <span>Estimated Total</span>
                  <span>LKR {total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Zap size={18} /> Hire / Book Now
            </button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Lock size={12} /> Free cancellation up to 48 hours before pickup
          </p>
        </div>

      </div>
    </div>
  );
};

export default VehicleDetailPage;
