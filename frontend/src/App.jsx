import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { isAuthenticated } from './services/auth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateUrl from './pages/CreateUrl';
import Analytics from './pages/Analytics';
import './index.css';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Component to handle short URL redirects
function ShortUrlRedirect() {
  const { shortUrl } = useParams();

  useEffect(() => {
    // Redirect to backend redirect endpoint
    window.location.href = `http://localhost:8080/${shortUrl}`;
  }, [shortUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      {isAuthenticated() && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateUrl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:shortUrl"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        {/* Catch-all route for short URL redirects */}
        <Route path="/:shortUrl" element={<ShortUrlRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
