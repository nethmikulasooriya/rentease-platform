import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    userApi.getAllUsers().then(res => setUsers(res.data.items || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
