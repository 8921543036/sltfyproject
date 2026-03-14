import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle2, XCircle, Clock4, LogOut, LayoutGrid, Package, CheckCircle } from 'lucide-react';
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

    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'accepted').length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfcfd', paddingTop: '120px', paddingBottom: '80px' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
                {/* Modern Profile Dashboard Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'relative',
                        padding: '40px',
                        backgroundColor: '#fff',
                        borderRadius: '35px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                        border: '1px solid #f1f5f9',
                        marginBottom: '40px',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Accent */}
                    <div style={{
                        position: 'absolute', top: '-100px', right: '-100px', 
                        width: '300px', height: '300px', borderRadius: '150px',
                        background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '32px',
                                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '2.5rem', fontWeight: '800',
                                boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                            }}>
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px', letterSpacing: '-1.5px' }}>
                                    My Dashboard
                                </h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
                                    <User size={16} /> {user?.email}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '14px 28px', backgroundColor: '#fff', color: '#ef4444',
                                border: '1.5px solid #fee2e2', borderRadius: '18px',
                                fontWeight: '700', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                                fontSize: '0.95rem'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fff1f1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <LogOut size={20} /> Logout Account
                        </button>
                    </div>

                    {/* Quick Stats Banner */}
                    <div style={{ 
                        marginTop: '40px', display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '20px', position: 'relative', zIndex: 1 
                    }}>
                        <div style={statCardStyle}>
                            <Package size={22} color="#64748b" />
                            <div>
                                <p style={statLabelStyle}>Total Requests</p>
                                <h3 style={statValueStyle}>{bookings.length}</h3>
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <Clock4 size={22} color="#f59e0b" />
                            <div>
                                <p style={statLabelStyle}>Pending Events</p>
                                <h3 style={statValueStyle}>{pendingCount}</h3>
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <CheckCircle size={22} color="#10b981" />
                            <div>
                                <p style={statLabelStyle}>Approved Events</p>
                                <h3 style={statValueStyle}>{confirmedCount}</h3>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <LayoutGrid size={24} color="#0f172a" />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
                            Track Your Bookings
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '120px 0' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                style={{ display: 'inline-block', marginBottom: '15px' }}
                            >
                                <Clock size={40} color="#e2e8f0" />
                            </motion.div>
                            <p style={{ color: '#94a3b8', fontWeight: '500' }}>Reviewing your activities...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center', padding: '100px 40px',
                                backgroundColor: '#fff', borderRadius: '40px',
                                border: '2px dashed #f1f5f9', display: 'flex',
                                flexDirection: 'column', alignItems: 'center'
                            }}
                        >
                            <div style={{ 
                                width: '100px', height: '100px', backgroundColor: '#f8fafc', 
                                borderRadius: '35px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', marginBottom: '30px' 
                            }}>
                                <Package size={40} color="#cbd5e1" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>No Activity Recorded</h3>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '35px', maxWidth: '400px', lineHeight: '1.6' }}>
                                Start your journey by exploring the available campus venues and book your first event today.
                            </p>
                            <button
                                onClick={() => navigate('/book')}
                                style={{
                                    padding: '18px 40px', backgroundColor: '#000', color: '#fff',
                                    borderRadius: '22px', fontWeight: '800', border: 'none',
                                    cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.2s',
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Get Started
                            </button>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <AnimatePresence>
                                {bookings.map((booking, index) => {
                                    const statusInfo = getStatusInfo(booking.status);
                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08, ease: "easeOut" }}
                                            style={{
                                                padding: '32px', backgroundColor: '#fff',
                                                borderRadius: '35px', border: '1px solid #f1f5f9',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
                                                display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', flexWrap: 'wrap', gap: '24px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        >
                                            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {booking.poster_url ? (
                                                    <div style={{ 
                                                        width: '100px', height: '100px', borderRadius: '24px', 
                                                        overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' 
                                                    }}>
                                                        <img src={booking.poster_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        width: '100px', height: '100px', borderRadius: '24px',
                                                        backgroundColor: '#f8fafc', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: '#cbd5e1'
                                                    }}>
                                                        <Calendar size={32} />
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                                                        {booking.event_name || 'General Booking'}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                                        <div style={badgeStyleText}>
                                                            <Calendar size={14} />
                                                            {new Date(booking.booking_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                        <div style={badgeStyleText}>
                                                            <Clock size={14} />
                                                            {booking.start_time} - {booking.end_time}
                                                        </div>
                                                        <div style={{ ...badgeStyleText, backgroundColor: '#f8fafc', color: '#0f172a', padding: '6px 12px', borderRadius: '10px' }}>
                                                            <MapPin size={14} />
                                                            {booking.venue_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '14px 24px', borderRadius: '20px',
                                                backgroundColor: `${statusInfo.color}08`,
                                                color: statusInfo.color, border: `1px solid ${statusInfo.color}20`,
                                                display: 'flex', alignItems: 'center',
                                                gap: '10px', fontWeight: '800', fontSize: '0.9rem',
                                                textTransform: 'uppercase', letterSpacing: '0.5px'
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

const statCardStyle = {
    display: 'flex', alignItems: 'center', gap: '16px', padding: '24px',
    backgroundColor: '#fff', borderRadius: '24px', border: '1.5px solid #f8fafc',
    boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
};

const statLabelStyle = { color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' };
const statValueStyle = { fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 0' };

const badgeStyleText = { 
    display: 'flex', alignItems: 'center', gap: '8px', 
    color: '#64748b', fontSize: '0.95rem', fontWeight: '600' 
};

export default Profile;

