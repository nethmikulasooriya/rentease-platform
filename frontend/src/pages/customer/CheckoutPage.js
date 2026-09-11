import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingApi, userApi } from '../../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Self-drive KYC state
  const [kycType, setKycType] = useState('LOCAL'); // 'LOCAL' or 'FOREIGN'
  const [licenseNumber, setLicenseNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [docFileUrl, setDocFileUrl] = useState('');

  const customerName = localStorage.getItem('rentease_name') || 'Valued Customer';
  const userId = localStorage.getItem('rentease_userId');

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingBooking');
    if (!raw) {
      navigate('/vehicles');
      return;
    }
    try {
      setDraft(JSON.parse(raw));
    } catch {
      navigate('/vehicles');
    }
  }, [navigate]);

  if (!draft) return null;

  const isSelfDrive = draft.driveMode === 'SELF_DRIVE';

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. If Self-Drive, upload document / license details if provided
      if (isSelfDrive && (licenseNumber || passportNumber)) {
        try {
          await userApi.uploadDocument(userId, {
            type: kycType === 'LOCAL' ? 'LICENSE' : 'PASSPORT',
            fileUrl: docFileUrl || (licenseNumber ? `LICENSE-${licenseNumber}` : `PASSPORT-${passportNumber}`)
          });
        } catch (err) {
          console.warn('KYC save notice:', err);
        }
      }

      // 2. Create the Booking Request
      await bookingApi.create({
        customerId: userId,
        customerName: customerName,
        vehicleId: draft.vehicleId,
        vehicleName: draft.vehicleName,
        ownerId: draft.ownerId,
        startDate: draft.startDate,
        endDate: draft.endDate,
        totalDays: draft.totalDays,
        pickupLocation: draft.pickupLocation,
        dropoffLocation: draft.dropoffLocation,
        withDriver: !isSelfDrive,
        dailyRateLKR: draft.dailyRateLKR,
        baseKmPerDay: draft.baseKmPerDay,
        extraRatePerKm: draft.extraRatePerKm,
        estimatedCostLKR: draft.estimatedCostLKR,
        depositAmountLKR: draft.depositAmountLKR,
        status: 'REQUESTED'
      });

      // Clear pending session
      sessionStorage.removeItem('pendingBooking');
      setSuccess(true);
      setTimeout(() => navigate('/customer/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '80px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Review &amp; Confirm Booking</h1>
      <p style={{ color: '#6B7280', marginBottom: '32px' }}>Welcome, {customerName}! Review your reservation details below.</p>

      {success ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#166534', marginBottom: '8px' }}>Booking Request Sent Successfully!</h2>
          <p style={{ color: '#15803D', marginBottom: '20px' }}>
            The vehicle host has been notified. Redirecting you to your trips dashboard...
          </p>
          <Link to="/customer/dashboard" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }}>
            Go to My Trips Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Form & KYC */}
          <div>
            {error && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #FCA5A5' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Smart Gate 1: With Driver Note */}
            {!isSelfDrive && (
              <div className="card" style={{ marginBottom: '24px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E40AF', marginBottom: '6px' }}>
                  👨‍✈️ With Driver (Chauffeur Service) Selected
                </h3>
                <p style={{ fontSize: '13px', color: '#1E3A8A', lineHeight: '1.5' }}>
                  You do not need a driving license for this trip. An experienced English/Sinhala speaking chauffeur will be assigned with your vehicle.
                </p>
              </div>
            )}

            {/* Smart Gate 2: Self-Drive License Prompt */}
            {isSelfDrive && (
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '4px' }}>
                  🪪 Driver Verification (Self-Drive KYC)
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
                  To self-drive in Sri Lanka, vehicle owners require a verified driving permit.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setKycType('LOCAL')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      background: kycType === 'LOCAL' ? '#EFF6FF' : '#fff',
                      borderColor: kycType === 'LOCAL' ? 'var(--primary)' : '#D1D5DB',
                      color: kycType === 'LOCAL' ? 'var(--primary)' : '#374151',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    🇱🇰 Sri Lankan Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setKycType('FOREIGN')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      background: kycType === 'FOREIGN' ? '#EFF6FF' : '#fff',
                      borderColor: kycType === 'FOREIGN' ? 'var(--primary)' : '#D1D5DB',
                      color: kycType === 'FOREIGN' ? 'var(--primary)' : '#374151',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    ✈️ International Tourist (IDP)
                  </button>
                </div>

                {kycType === 'LOCAL' ? (
                  <div className="form-group">
                    <label className="form-label">Driving License Number</label>
                    <input 
                      className="form-input" 
                      type="text" 
                      placeholder="e.g. B1234567" 
                      value={licenseNumber} 
                      onChange={e => setLicenseNumber(e.target.value)} 
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Passport Number</label>
                      <input 
                        className="form-input" 
                        type="text" 
                        placeholder="e.g. N12345678" 
                        value={passportNumber} 
                        onChange={e => setPassportNumber(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">International Permit / Home License Image URL</label>
                      <input 
                        className="form-input" 
                        type="url" 
                        placeholder="https://example.com/license-photo.jpg" 
                        value={docFileUrl} 
                        onChange={e => setDocFileUrl(e.target.value)} 
                      />
                      <small style={{ color: '#9CA3AF', fontSize: '11px' }}>You can also present the physical permit at vehicle pickup</small>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Trip Details */}
            <div className="card">
              <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px' }}>Trip Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Pick-up Date</span>
                  <strong>📅 {draft.startDate}</strong>
                </div>
                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Return Date</span>
                  <strong>📅 {draft.endDate}</strong>
                </div>
                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Pick-up Location</span>
                  <strong>📍 {draft.pickupLocation}</strong>
                </div>
                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Rental Type</span>
                  <strong>{isSelfDrive ? '🚗 Self-Drive' : '👨‍✈️ With Driver'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Payment CTA */}
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px' }}>Price Breakdown</h3>
            
            <div style={{ marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{draft.vehicleName}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>LKR {draft.dailyRateLKR.toLocaleString()} × {draft.totalDays} days</div>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Vehicle Rental:</span>
                <span>LKR {(draft.dailyRateLKR * draft.totalDays).toLocaleString()}</span>
              </div>
              {!isSelfDrive && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                  <span>Chauffeur Fee:</span>
                  <span>LKR {(2500 * draft.totalDays).toLocaleString()}</span>
                </div>
              )}
              {isSelfDrive && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '500' }}>
                  <span>Security Deposit (Refundable):</span>
                  <span>LKR {draft.depositAmountLKR?.toLocaleString() || 0}</span>
                </div>
              )}
              <div style={{ borderTop: '1px dashed #D1D5DB', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', color: '#111827' }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--primary)' }}>
                  LKR {((draft.estimatedCostLKR || 0) + (draft.depositAmountLKR || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleConfirmReservation}
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : '💳 Confirm & Place Request'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '12px' }}>
              🔒 Simulated payment escrow · No immediate card charge until owner approves.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
