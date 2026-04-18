import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { PublicDashboard } from './pages/PublicDashboard';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { MyComplaints } from './pages/MyComplaints';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { HotspotDashboard } from './pages/HotspotDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { LocalComplaintsProvider } from './context/LocalComplaintsContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminDashboard } from './components/local/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <LocalComplaintsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/public-dashboard" element={<PublicDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complaints" element={<MyComplaints />} />
                <Route path="/submit" element={<SubmitComplaint />} />
                <Route path="/hotspot-dashboard" element={<HotspotDashboard />} />
              </Route>
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LocalComplaintsProvider>
    </AuthProvider>
  );
}

export default App;
