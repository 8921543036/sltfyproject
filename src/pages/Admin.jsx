import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Search, Filter, Calendar, MapPin, User, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('bookings');
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userEmails, setUserEmails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            if (localStorage.getItem('isAdmin') !== 'true') {
                navigate('/admin-login');
                return;
            }

            setIsAuthorized(true);
            fetchBookings();
            fetchMessages();
        };

        checkAuthAndFetchData();
    }, [navigate]);

    const fetchMessages = async () => {
        setLoadingMessages(true);
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setMessages(data || []);
        else console.error(error);
        setLoadingMessages(false);
    };

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setBookings(data || []);
        else console.error(error);
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } else {
            alert(error.message);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'all' || b.status === filter;
        const matchesSearch = (b.event_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (b.club_dept || '').toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'accepted': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    if (!isAuthorized) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '100px', paddingBottom: '60px' }}>
            <Navbar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ padding: '8px', backgroundColor: '#000', borderRadius: '12px' }}>
                                <LayoutDashboard size={24} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Admin Dashboard</h1>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage venue bookings, event requests, and user messages</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            onClick={() => {
                                localStorage.removeItem('isAdmin');
                                navigate('/admin-login');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                backgroundColor: '#fee2e2',
                                color: '#ef4444',
                                border: '1px solid #fecaca',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <LogOut size={18} /> Logout
                        </button>

                        {activeTab === 'bookings' && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['all', 'pending', 'accepted', 'rejected'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            backgroundColor: filter === f ? '#000' : '#fff',
                                            color: filter === f ? '#fff' : '#64748b',
                                            border: '1px solid',
                                            borderColor: filter === f ? '#000' : '#e2e8f0',
                                            fontWeight: '600',
                                            textTransform: 'capitalize',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        style={{
                            padding: '10px 20px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: activeTab === 'bookings' ? '700' : '500',
                            color: activeTab === 'bookings' ? '#000' : '#64748b',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        Bookings
                        {activeTab === 'bookings' && (
                            <div style={{ position: 'absolute', bottom: '-12px', left: 0, right: 0, height: '4px', backgroundColor: '#000', borderRadius: '4px' }} />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        style={{
                            padding: '10px 20px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: activeTab === 'messages' ? '700' : '500',
                            color: activeTab === 'messages' ? '#000' : '#64748b',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        Messages
                        {activeTab === 'messages' && (
                            <div style={{ position: 'absolute', bottom: '-12px', left: 0, right: 0, height: '4px', backgroundColor: '#000', borderRadius: '4px' }} />
                        )}
                    </button>
                </div>

                {activeTab === 'bookings' ? (
                    <>
                        <div style={{ marginBottom: '30px', position: 'relative' }}>
                            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search by event name or club..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '18px 24px 18px 56px',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#fff',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}
                            />
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <p style={{ color: '#64748b' }}>Loading bookings...</p>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: '#fff', borderRadius: '24px' }}>
                                <p style={{ color: '#64748b' }}>No bookings found matching your criteria.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                                <AnimatePresence>
                                    {filteredBookings.map((booking) => (
                                        <motion.div
                                            key={booking.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '24px',
                                                padding: '24px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '20px',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: getStatusColor(booking.status) }} />

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px', color: '#0f172a' }}>{booking.event_name || 'Unofficial Event'}</h3>
                                                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{booking.club_dept || 'Individual Booking'}</p>
                                                </div>
                                                <div style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '99px',
                                                    backgroundColor: `${getStatusColor(booking.status)}15`,
                                                    color: getStatusColor(booking.status),
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {booking.status}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <Calendar size={16} />
                                                    <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <Clock size={16} />
                                                    <span>{booking.start_time} - {booking.end_time}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <MapPin size={16} />
                                                    <span>{booking.venue_name}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <User size={16} />
                                                    <span>{booking.duration_type}</span>
                                                </div>
                                            </div>

                                            {booking.description && (
                                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {booking.description}
                                                </p>
                                            )}

                                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                                {booking.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, 'accepted')}
                                                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                        >
                                                            <CheckCircle2 size={18} /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, 'rejected')}
                                                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                        >
                                                            <XCircle size={18} /> Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'pending')}
                                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}
                                                    >
                                                        Reset to Pending
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {loadingMessages ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <p style={{ color: '#64748b' }}>Loading messages...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: '#fff', borderRadius: '24px' }}>
                                <p style={{ color: '#64748b' }}>No messages found.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '24px',
                                            padding: '24px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{msg.full_name}</h3>
                                                <a href={`mailto:${msg.email}`} style={{ color: '#3b82f6', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '600' }}>{msg.email}</a>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px' }}>
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {msg.subject && (
                                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.05rem', marginTop: '4px' }}>
                                                Subject: {msg.subject}
                                            </div>
                                        )}
                                        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', color: '#334155', fontSize: '1rem', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
                                            {msg.message}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;
