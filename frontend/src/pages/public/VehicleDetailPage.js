import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catalogApi, bookingApi } from '../../services/api';
import { differenceInDays } from 'date-fns';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [booking, setBooking] = useState({ startDate: '', endDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      catalogApi.getVehicle(id).then(res => setVehicle(res.data)).catch(() => {}),
      catalogApi.getSimilar(id).then(res => setSimilar(res.data.items || [])).catch(() => {})
    ]).finally(() => setLoading(false));
  }, [id]);

  const days = (booking.startDate && booking.endDate) 
    ? Math.max(1, differenceInDays(new Date(booking.endDate), new Date(booking.startDate))) 
    : 0;
  
  const subtotal = vehicle ? days * vehicle.dailyRate : 0;
  const deposit = subtotal * 0.3;
  const total = subtotal + deposit;

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('rentease_token');
    const role = localStorage.getItem('rentease_role');
    if (!token || role !== 'CUSTOMER') {
      navigate('/customer/login');
      return;
    }
    try {
      await bookingApi.create({ vehicleId: id, ...booking });
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="spinner"></div></div>;
  if (!vehicle) return <div className="container" style={{ padding: '64px' }}><h3>Vehicle not found</h3></div>;

  return (
    <div>
      <div style={{ width: '100%', height: '400px', background: '#e5e7eb' }}>
        <img src={vehicle.primaryImageUrl || 'https://via.placeholder.com/1200x400'} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="container" style={{ padding: '32px 16px', display: 'flex', gap: '32px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '8px' }}>{vehicle.brand} {vehicle.model} ({vehicle.year})</h1>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', color: '#4B5563' }}>
            <span>⭐ {vehicle.rating || 0}</span>
            <span>📍 {vehicle.city}, {vehicle.district}</span>
          </div>
          
          <div className="card mb-8">
            <h3 className="mb-4">Specifications</h3>
            <div className="grid-3">
              <div><strong>Category:</strong> {vehicle.category}</div>
              <div><strong>Seats:</strong> {vehicle.seats}</div>
              <div><strong>Transmission:</strong> {vehicle.transmission}</div>
              <div><strong>Fuel:</strong> {vehicle.fuel}</div>
              <div><strong>AC:</strong> {vehicle.hasAC ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="card mb-8">
            <h3 className="mb-4">Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{vehicle.description}</p>
          </div>
        </div>

        <div style={{ width: '350px', flexShrink: 0 }}>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '16px' }}>LKR {vehicle.dailyRate} <span style={{ fontSize: '16px', color: '#6B7280', fontWeight: 'normal' }}>/ day</span></h2>
            
            {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Pick-up Date</label>
                <input type="date" required value={booking.startDate} onChange={e => setBooking({...booking, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Return Date</label>
                <input type="date" required value={booking.endDate} onChange={e => setBooking({...booking, endDate: e.target.value})} />
              </div>

              {days > 0 && (
                <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div className="flex justify-between mb-2">
                    <span>LKR {vehicle.dailyRate} x {days} days</span>
                    <span>LKR {subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Refundable Deposit (30%)</span>
                    <span>LKR {deposit}</span>
                  </div>
                  <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #d1d5db' }} />
                  <div className="flex justify-between font-bold" style={{ fontWeight: 'bold' }}>
                    <span>Total Estimate</span>
                    <span>LKR {total}</span>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>Request Booking</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
