import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/api';

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ownerId = localStorage.getItem('rentease_userId');
    if (!ownerId) {
      setLoading(false);
      return;
    }
    bookingApi.getByOwner(ownerId)
      .then(res => {
        const list = res.data?.content || res.data?.items || (Array.isArray(res.data) ? res.data : []);
        setBookings(list);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="mb-4">My Bookings</h2>
      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <table className="table">
            <thead><tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.vehicleName}</td>
                  <td>{b.startDate} to {b.endDate}</td>
                  <td>LKR {b.estimatedCostLKR}</td>
                  <td><span className="badge-active">{b.status}</span></td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No bookings found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnerBookingsPage;
