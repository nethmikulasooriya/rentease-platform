import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../services/api';

const AdminPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  
  useEffect(() => {
    paymentApi.getPendingPayouts().then(res => setPayouts(res.data.items || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="mb-4">Pending Payouts</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Owner ID</th><th>Booking ID</th><th>Gross</th><th>Commission</th><th>Net</th><th>Actions</th></tr></thead>
          <tbody>
            {payouts.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No pending payouts</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayoutsPage;
