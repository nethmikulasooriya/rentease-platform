import React, { useState, useEffect } from 'react';
import { paymentApi, bookingApi } from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalVehicles: 0, totalCustomers: 0, activeBookings: 0, platformRevenue: 0 });
  
  useEffect(() => {
    paymentApi.getDashboard().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="grid-4 mb-8">
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Total Vehicles</h3><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalVehicles || 0}</div></div>
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Total Customers</h3><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalCustomers || 0}</div></div>
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Active Bookings</h3><div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.activeBookings || 0}</div></div>
        <div className="card"><h3 style={{ color: '#6B7280', fontSize: '14px' }}>Platform Revenue</h3><div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>LKR {stats.platformRevenue || 0}</div></div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
