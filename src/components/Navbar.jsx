import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import AuthModal from './AuthModal';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowDropdown(false);
    };

    return (
        <>
            <nav className="glass" style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '1000px',
                height: '70px',
                borderRadius: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 30px',
                zIndex: 1000,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#000' }}>Slotify</h2>
                </Link>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/book" className="nav-link">Book Venue</Link>
                    <Link to="/admin" className="nav-link">Admin</Link>
                    <Search size={20} style={{ cursor: 'pointer', color: '#666' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                        {user && (
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                                {user.email}
                            </span>
                        )}
                        <div
                            onClick={() => user ? setShowDropdown(!showDropdown) : setIsAuthModalOpen(true)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '20px',
                                backgroundColor: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                overflow: 'hidden'
                            }}
                        >
                            {user ? (user.email[0].toUpperCase()) : <User size={20} />}
                        </div>

                        <AnimatePresence>
                            {showDropdown && user && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute',
                                        top: '55px',
                                        right: 0,
                                        width: '240px',
                                        backgroundColor: '#fff',
                                        borderRadius: '16px',
                                        padding: '15px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        border: '1px solid #eee',
                                        zIndex: 1001
                                    }}
                                >
                                    <div style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #eee' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>Signed in as</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#000', wordBreak: 'break-all' }}>{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setShowDropdown(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: '#f8fafc',
                                            color: '#0f172a',
                                            borderRadius: '12px',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            border: 'none',
                                            cursor: 'pointer',
                                            marginBottom: '8px',
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <User size={16} /> My Bookings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            width: '100%',
                                            padding: '10px',
                                            backgroundColor: '#fff5f5',
                                            color: '#ff4444',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            transition: 'background-color 0.2s',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <style>{`
                    .nav-link {
                        text-decoration: none;
                        color: #444;
                        font-weight: 500;
                        font-size: 0.95rem;
                        transition: color 0.2s;
                    }
                    .nav-link:hover {
                        color: #000;
                    }
                `}</style>
            </nav>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Navbar;
