import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { supabase } from './supabase/supabaseClient';
import Splash from './components/Splash';
import Home from './pages/Home';
import BookVenue from './pages/BookVenue';
import CreateEvent from './pages/CreateEvent';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Venues from './pages/Venues';
import AdminLogin from './pages/AdminLogin';
import './index.css';

function App() {
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('bookings').select('count', { count: 'exact', head: true });
        if (error && error.message !== 'Unexpected token S in JSON at position 0') {
          // Ignore common "no table" error during initial setup, but catch real network/auth issues
          if (error.code === 'PGRST301' || error.status === 401) {
            setConnectionError("Invalid Supabase Anon Key. Please check your .env file.");
          } else if (error.message.includes('fetch')) {
            setConnectionError("Failed to fetch. Please check your internet connection or Supabase URL.");
          }
        }
      } catch (err) {
        setConnectionError("Could not connect to Supabase. Check your .env configuration.");
      }
    };

    checkConnection();
  }, []);

  return (
    <Router>
      {connectionError && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, backgroundColor: '#fee2e2', color: '#b91c1c',
          padding: '12px 24px', borderRadius: '12px', border: '1px solid #fecaca',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: '600' }}>{connectionError}</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookVenue />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
