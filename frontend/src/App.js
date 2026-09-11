import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public
import HomePage from './pages/public/HomePage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import VehicleDetailPage from './pages/public/VehicleDetailPage';

// Owner
import OwnerRegisterPage from './pages/owner/OwnerRegisterPage';
import OwnerLoginPage from './pages/owner/OwnerLoginPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerVehiclesPage from './pages/owner/OwnerVehiclesPage';
import AddVehiclePage from './pages/owner/AddVehiclePage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';

// Customer
import CustomerRegisterPage from './pages/customer/CustomerRegisterPage';
import CustomerLoginPage from './pages/customer/CustomerLoginPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import BookingDetailPage from './pages/customer/BookingDetailPage';
import CheckoutPage from './pages/customer/CheckoutPage';

// Admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDocumentsPage from './pages/admin/AdminDocumentsPage';
import AdminDisputesPage from './pages/admin/AdminDisputesPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

const PublicLayout = () => (
  <>
    <Navbar />
    <div style={{ minHeight: 'calc(100vh - 300px)' }}>
      <Outlet />
    </div>
    <Footer />
  </>
);

const DashboardLayout = ({ title, links }) => (
  <>
    <Navbar />
    <div className="dashboard-layout">
      <div className="sidebar">
        <h3>{title}</h3>
        {links.map(link => (
          <a key={link.path} href={link.path}>{link.label}</a>
        ))}
      </div>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  </>
);

const ownerLinks = [
  { path: '/owner/dashboard', label: 'Dashboard' },
  { path: '/owner/vehicles', label: 'My Vehicles' },
  { path: '/owner/bookings', label: 'Bookings' }
];

const customerLinks = [
  { path: '/customer/dashboard', label: 'My Trips' }
];

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/documents', label: 'Pending Documents' },
  { path: '/admin/disputes', label: 'Disputes' },
  { path: '/admin/payouts', label: 'Payouts' },
  { path: '/admin/users', label: 'Users' }
];

const ProtectedRoute = ({ role, children }) => {
  const currentRole = localStorage.getItem('rentease_role');
  if (currentRole !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<SearchResultsPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/owner/register" element={<OwnerRegisterPage />} />
          <Route path="/owner/login" element={<OwnerLoginPage />} />
          <Route path="/customer/register" element={<CustomerRegisterPage />} />
          <Route path="/customer/login" element={<CustomerLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        <Route element={<ProtectedRoute role="OWNER"><DashboardLayout title="Owner Panel" links={ownerLinks}/></ProtectedRoute>}>
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/vehicles" element={<OwnerVehiclesPage />} />
          <Route path="/owner/vehicles/new" element={<AddVehiclePage />} />
          <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
        </Route>

        <Route element={<ProtectedRoute role="CUSTOMER"><DashboardLayout title="Customer Panel" links={customerLinks}/></ProtectedRoute>}>
          <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/customer/bookings/:id" element={<BookingDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute role="ADMIN"><DashboardLayout title="Admin Panel" links={adminLinks}/></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/documents" element={<AdminDocumentsPage />} />
          <Route path="/admin/disputes" element={<AdminDisputesPage />} />
          <Route path="/admin/payouts" element={<AdminPayoutsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
