import React, { useState, useEffect } from 'react';
import { paymentApi, bookingApi } from '../../services/api';
import { Link } from 'react-router-dom';

const OwnerDashboardPage = () => {
  const [stats, setStats] = useState({ totalVehicles: 0, pendingRequests: 0, activeBookings: 0, totalEarnings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      paymentApi.getDashboard().then(res => setStats(res.data)).catch(() => {}),
      bookingApi.getByOwner().then(res => setRecentBookings(res.data.items?.slice(0, 5) || [])).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await bookingApi.approve(id);
      setRecentBookings(recentBookings.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b));
    } catch (err) { alert('Failed to approve'); }
  };

  const handleReject = async (id) => {
    try {
      await bookingApi.reject(id);
      setRecentBookings(recentBookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) { alert('Failed to reject'); }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <h2 className="mb-4">Owner Dashboard</h2>
      <div className="grid-4 mb-8">
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Total Vehicles</h3><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalVehicles}</div></div>
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Pending Requests</h3><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pendingRequests}</div></div>
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Active Bookings</h3><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.activeBookings}</div></div>
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Total Earnings (LKR)</h3><div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>{stats.totalEarnings}</div></div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3>Recent Booking Requests</h3>
          <Link to="/owner/bookings">View All</Link>
        </div>
        <table className="table">
          <thead><tr><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {recentBookings.map(b => (
              <tr key={b.id}>
                <td>{b.customerName}</td>
                <td>{b.vehicleName}</td>
                <td>{b.startDate} to {b.endDate}</td>
                <td>LKR {b.totalAmount}</td>
                <td><span className="badge-pending">{b.status}</span></td>
                <td>
                  {b.status === 'REQUESTED' && (
                    <div className="flex gap-2">
                      <button className="btn-success" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleApprove(b.id)}>Approve</button>
                      <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleReject(b.id)}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {recentBookings.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No recent requests</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
