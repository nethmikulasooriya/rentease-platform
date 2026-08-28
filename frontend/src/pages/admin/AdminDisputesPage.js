import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/api';

const AdminDisputesPage = () => {
  const [disputes, setDisputes] = useState([]);
  
  useEffect(() => {
    bookingApi.getDisputes().then(res => setDisputes(res.data.items || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="mb-4">Disputes</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Booking ID</th><th>Raised By</th><th>Reason</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {disputes.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No open disputes</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDisputesPage;
