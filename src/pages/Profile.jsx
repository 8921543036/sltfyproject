import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle2, XCircle, Clock4, LogOut } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                fetchUserBookings(session.user.id);
            } else {
                navigate('/');
            }
        };
        getSession();
    }, [navigate]);

    const fetchUserBookings = async (userId) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error) setBookings(data || []);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { color: '#f59e0b', icon: <Clock4 size={16} />, label: 'Pending Approval' };
            case 'accepted':
                return { color: '#10b981', icon: <CheckCircle2 size={16} />, label: 'Confirmed' };
            case 'rejected':
                return { color: '#ef4444', icon: <XCircle size={16} />, label: 'Rejected' };
            default:
                return { color: '#64748b', icon: <Clock4 size={16} />, label: status };
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingTop: '120px', paddingBottom: '60px' }}>
            <Navbar />

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px',
                        marginBottom: '60px',
                        padding: '40px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '32px',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '40px',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '2rem',
                            fontWeight: '800'
                        }}>
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>My Profile</h1>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '4px' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#fff',
                            color: '#ef4444',
                            border: '1px solid #fee2e2',
                            borderRadius: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </motion.div>

                {/* Bookings Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>My Event Bookings</h2>
                        <span style={{
                            padding: '6px 14px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '99px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: '#475569'
                        }}>
                            {bookings.length} Total
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <p style={{ color: '#64748b' }}>Fetching your events...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 40px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '32px',
                            border: '2px dashed #e2e8f0'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No bookings found</h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>You haven't requested any venue bookings yet.</p>
                            <button
                                onClick={() => navigate('/book')}
                                style={{
                                    padding: '14px 30px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderRadius: '14px',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Browse Venues
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <AnimatePresence>
                                {bookings.map((booking, index) => {
                                    const statusInfo = getStatusInfo(booking.status);
                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            style={{
                                                padding: '24px',
                                                backgroundColor: '#fff',
                                                borderRadius: '24px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '20px',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {booking.poster_url ? (
                                                    <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden' }}>
                                                        <img src={booking.poster_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#f1f5f9',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#94a3b8'
                                                    }}>
                                                        <Calendar size={24} />
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>{booking.event_name || 'Event Booking'}</h3>
                                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                                                            <Calendar size={14} />
                                                            {new Date(booking.booking_date).toLocaleDateString()}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                                                            <Clock size={14} />
                                                            {booking.start_time} - {booking.end_time}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                                                            <MapPin size={14} />
                                                            {booking.venue_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '10px 18px',
                                                borderRadius: '99px',
                                                backgroundColor: `${statusInfo.color}15`,
                                                color: statusInfo.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontWeight: '700',
                                                fontSize: '0.9rem'
                                            }}>
                                                {statusInfo.icon}
                                                {statusInfo.label}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
