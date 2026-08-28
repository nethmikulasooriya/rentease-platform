import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/api';
import { Link } from 'react-router-dom';

const CustomerDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getByCustomer()
      .then(res => setBookings(res.data.items || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REQUESTED': return <span className="badge-pending">REQUESTED</span>;
      case 'APPROVED': return <span className="badge-active" style={{ background: '#dbeafe', color: '#1d4ed8' }}>APPROVED</span>;
      case 'ACTIVE': return <span className="badge-verified">ACTIVE</span>;
      case 'COMPLETED': return <span className="badge-active" style={{ background: '#f3f4f6', color: '#4b5563' }}>COMPLETED</span>;
      case 'CANCELLED': return <span className="badge-pending" style={{ background: '#fee2e2', color: '#b91c1c' }}>CANCELLED</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Trips</h2>
      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <table className="table">
            <thead><tr><th>Vehicle</th><th>Dates</th><th>Total Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.vehicleName}</td>
                  <td>{b.startDate} to {b.endDate}</td>
                  <td>LKR {b.totalAmount}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    <Link to={`/customer/bookings/${b.id}`}><button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>View Details</button></Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No trips found. Start exploring!</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
