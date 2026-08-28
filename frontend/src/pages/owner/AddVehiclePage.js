import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '../../services/api';

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brand: '', model: '', year: new Date().getFullYear(), category: 'Sedan', description: '',
    seats: 4, transmission: 'Automatic', fuel: 'Petrol', hasAC: true,
    dailyRate: '', baseKmPerDay: 100, extraRatePerKm: 50,
    city: '', district: '', primaryImageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await catalogApi.createVehicle({ ...form, year: Number(form.year), seats: Number(form.seats), dailyRate: Number(form.dailyRate), baseKmPerDay: Number(form.baseKmPerDay), extraRatePerKm: Number(form.extraRatePerKm) });
      navigate('/owner/vehicles');
    } catch (err) {
      alert('Error adding vehicle: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="card">
        <h3 className="mb-4">Basic Info</h3>
        <div className="grid-3 mb-4">
          <div className="form-group"><label>Brand</label><input type="text" required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
          <div className="form-group"><label>Model</label><input type="text" required value={form.model} onChange={e => setForm({...form, model: e.target.value})} /></div>
          <div className="form-group"><label>Year</label><input type="number" required value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Van</option><option>Tuk-Tuk</option><option>Scooter</option><option>Luxury</option></select></div>
        </div>
        <div className="form-group mb-4"><label>Description</label><textarea rows="3" required value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>

        <h3 className="mb-4 mt-8">Specifications</h3>
        <div className="grid-4 mb-4">
          <div className="form-group"><label>Seats</label><input type="number" required value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} /></div>
          <div className="form-group"><label>Transmission</label><select value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})}><option>Automatic</option><option>Manual</option></select></div>
          <div className="form-group"><label>Fuel</label><select value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})}><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>EV</option></select></div>
          <div className="form-group"><label>Air Conditioning</label><select value={form.hasAC} onChange={e => setForm({...form, hasAC: e.target.value === 'true'})}><option value="true">Yes</option><option value="false">No</option></select></div>
        </div>

        <h3 className="mb-4 mt-8">Pricing (LKR)</h3>
        <div className="grid-3 mb-4">
          <div className="form-group"><label>Daily Rate</label><input type="number" required value={form.dailyRate} onChange={e => setForm({...form, dailyRate: e.target.value})} /></div>
          <div className="form-group"><label>Base Km / Day</label><input type="number" required value={form.baseKmPerDay} onChange={e => setForm({...form, baseKmPerDay: e.target.value})} /></div>
          <div className="form-group"><label>Extra Rate / Km</label><input type="number" required value={form.extraRatePerKm} onChange={e => setForm({...form, extraRatePerKm: e.target.value})} /></div>
        </div>

        <h3 className="mb-4 mt-8">Location & Media</h3>
        <div className="grid-3 mb-4">
          <div className="form-group"><label>City</label><input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
          <div className="form-group"><label>District</label><input type="text" required value={form.district} onChange={e => setForm({...form, district: e.target.value})} /></div>
          <div className="form-group"><label>Image URL</label><input type="url" required value={form.primaryImageUrl} onChange={e => setForm({...form, primaryImageUrl: e.target.value})} /></div>
        </div>

        <button type="submit" className="btn-primary mt-4" disabled={loading}>{loading ? 'Saving...' : 'Add Vehicle'}</button>
      </form>
    </div>
  );
};

export default AddVehiclePage;
