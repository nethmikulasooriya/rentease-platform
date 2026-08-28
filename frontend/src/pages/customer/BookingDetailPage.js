import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingApi } from '../../services/api';

const BookingDetailPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getById(id)
      .then(res => setBooking(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner"></div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div>
      <h2 className="mb-4">Booking Details #{booking.id.substring(0, 8)}</h2>
      <div className="grid-2">
        <div className="card">
          <h3 className="mb-4">Trip Information</h3>
          <p><strong>Vehicle:</strong> {booking.vehicleName}</p>
          <p><strong>Status:</strong> <span className="badge-active">{booking.status}</span></p>
          <p><strong>Pick-up:</strong> {booking.startDate}</p>
          <p><strong>Return:</strong> {booking.endDate}</p>
        </div>
        <div className="card">
          <h3 className="mb-4">Cost Breakdown</h3>
          <div className="flex justify-between mb-2"><span>Rental Rate</span><span>LKR {booking.totalAmount}</span></div>
          {booking.status === 'ACTIVE' && (
            <button className="btn-primary mt-4" style={{ width: '100%' }}>Return Vehicle</button>
          )}
          {booking.status === 'COMPLETED' && (
            <button className="btn-secondary mt-4" style={{ width: '100%' }}>Leave Review</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
