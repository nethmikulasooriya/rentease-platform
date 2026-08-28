import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';

const AdminDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    userApi.getPendingDocuments().then(res => setDocuments(res.data.items || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="mb-4">Pending Documents</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>User Name</th><th>Document Type</th><th>File URL</th><th>Upload Date</th><th>Actions</th></tr></thead>
          <tbody>
            {documents.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No pending documents</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDocumentsPage;
