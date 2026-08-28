import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/api';

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getByOwner()
      .then(res => setBookings(res.data.items || []))
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
                  <td>#{b.id.substring(0,6)}</td>
                  <td>{b.customerName}</td>
                  <td>{b.vehicleName}</td>
                  <td>{b.startDate} to {b.endDate}</td>
                  <td>LKR {b.totalAmount}</td>
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
