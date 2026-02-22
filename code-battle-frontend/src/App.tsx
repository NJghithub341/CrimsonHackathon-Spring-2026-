import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Learn } from './pages/Learn';
import { Battle } from './pages/Battle';
import { Matchmaking } from './pages/Matchmaking';
import { Profile } from './pages/Profile';

// Layout for authenticated/app pages — includes Navbar and container
const AppLayout = () => (
  <>
    <Navbar />
    <main className="container mx-auto px-4 py-8">
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth pages — full-bleed, no Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App pages — Navbar + container layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/battle/:battleId" element={<Battle />} />
            <Route path="/matchmaking" element={<Matchmaking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
