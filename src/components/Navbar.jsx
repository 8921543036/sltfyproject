import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
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
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
                {/* Left Section: Logo */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#000' }}>Slotify</h2>
                    </Link>
                </div>

                {/* Center Section: Main Nav Links */}
                <div style={{
                    flex: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    <Link to="/" className="nav-link">Home</Link>
                    <a
                        href="#services"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            if (window.location.pathname !== '/') {
                                navigate('/');
                                setTimeout(() => {
                                    const element = document.getElementById('services');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, 100);
                            } else {
                                const element = document.getElementById('services');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }
                        }}
                    >
                        Services
                    </a>
                    <Link to="/venues" className="nav-link">Venues</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>

                {/* Right Section: Actions */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '20px',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
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
