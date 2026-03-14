import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Users, Info, ShieldCheck, MapPin, Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';
import Navbar from '../components/Navbar';
import { venues } from '../data/venues';

const BookVenue = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Get passed venue data or use a default
    const [currentVenue, setCurrentVenue] = useState(() => {
        if (location.state?.venue) return location.state.venue;

        // Try to find if venueName was passed in state
        if (location.state?.venueName) {
            const found = venues.find(v => v.name.toUpperCase() === location.state.venueName.toUpperCase());
            if (found) return found;
        }

        return venues[0]; // Default to first venue (Seminar Hall)
    });

    const getLocalIsoDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get current week dates
    const getWeekDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getWeekDays();

    useEffect(() => {
        // Get user session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        fetchBookings();
    }, [selectedDate]);

    const fetchBookings = async () => {
        setLoading(true);
        const dateStr = getLocalIsoDate(selectedDate);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('booking_date', dateStr)
            .eq('venue_name', currentVenue.name.toUpperCase());

        if (!error) setBookings(data || []);
        setLoading(false);
    };

    const handleBooking = (slot, durationType) => {
        if (!user) {
            alert('Please login to book a venue');
            return;
        }

        const dateStr = getLocalIsoDate(selectedDate);
        const formattedDate = selectedDate.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });

        navigate('/create-event', {
            state: {
                slot,
                dateStr,
                formattedDate,
                venueName: currentVenue.name.toUpperCase(),
                durationType
            }
        });
    };

    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const normalized = timeStr.trim().replace(':', '.'); // handle potential input variations
        let [hours, minutes] = normalized.split('.').map(Number);
        // Simple heuristic: 9, 10, 11 are AM; 12, 1, 2, 3 are PM (in college context)
        if (hours < 9) hours += 12;
        return hours * 60 + (minutes || 0);
    };

    const isOverlapping = (start1, end1, start2, end2) => {
        return Math.max(start1, start2) < Math.min(end1, end2);
    };

    const getSlotStatus = (timeRange) => {
        const [startStr, endStr] = timeRange.split(' – ');
        const slotStart = timeToMinutes(startStr);
        const slotEnd = timeToMinutes(endStr);

        // Check for accepted overlaps first
        const acceptedOverlap = bookings.find(b => {
            if (b.status !== 'accepted') return false;
            const bStart = timeToMinutes(b.start_time);
            const bEnd = timeToMinutes(b.end_time);
            return isOverlapping(slotStart, slotEnd, bStart, bEnd);
        });
        if (acceptedOverlap) return 'accepted';

        // Check for pending overlaps
        const pendingOverlap = bookings.find(b => {
            if (b.status !== 'pending') return false;
            const bStart = timeToMinutes(b.start_time);
            const bEnd = timeToMinutes(b.end_time);
            return isOverlapping(slotStart, slotEnd, bStart, bEnd);
        });
        if (pendingOverlap) return 'pending';

        return 'available';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#fbbf24'; // Yellow
            case 'accepted': return '#10b981'; // Green
            case 'rejected': return '#ef4444'; // Red
            default: return '#f3f4f6'; // Light Grey
        }
    };

    const timeSlots = {
        '1 Hour Slots': ['9:30 – 10:30', '10:30 – 11:30', '11:30 – 12:30', '1:30 – 2:30', '2:30 – 3:30'],
        '2 Hour Slots': ['9:30 – 11:30', '11:30 – 1:30', '1:30 – 3:30'],
        'Half Day Slots': ['9:30 – 12:30', '12:30 – 3:30'],
        'Full Day Slot': ['9:30 – 3:30']
    };

    const venueDetails = {
        capacity: currentVenue.capacity || '500 Persons',
        facilities: currentVenue.facilities || ['Projector & Screen', 'Central AC', 'Surround Sound System', 'Stage Lighting'],
        rules: currentVenue.rules || ['No food inside', 'Pre-approval required', 'Technical staff must be present'],
        description: currentVenue.description || 'The venue is equipped with state-of-the-art facilities, making it ideal for academic presentations, workshops, and high-profile meetings.'
    };

    // Modal Component
    const VenueDetailsModal = ({ isOpen, onClose, details, venueName }) => (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '32px',
                            padding: '40px',
                            maxWidth: '600px',
                            width: '100%',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                                width: '40px', height: '40px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}
                        >
                            <XCircle size={24} color="#64748b" />
                        </button>

                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '25px', letterSpacing: '-0.5px' }}>
                            {venueName} Details
                        </h2>

                        <div style={{ display: 'grid', gap: '25px' }}>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f172a', fontSize: '1rem' }}>
                                    <Users size={18} /> Capacity
                                </h4>
                                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{details.capacity}</p>
                            </div>

                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f172a', fontSize: '1rem' }}>
                                    <ShieldCheck size={18} /> Facilities
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {details.facilities.map(f => (
                                        <span key={f} style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>{f}</span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0f172a', fontSize: '1rem' }}>
                                    <Info size={18} /> Rules & Regulations
                                </h4>
                                <ul style={{ paddingLeft: '20px', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {details.rules.map(r => <li key={r}>{r}</li>)}
                                </ul>
                            </div>

                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f172a', fontSize: '1rem' }}>
                                    <MapPin size={18} /> About Venue
                                </h4>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>{details.description}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingTop: '100px' }}>
            <Navbar />
            <VenueDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                details={venueDetails}
                venueName={currentVenue.name.toUpperCase()}
            />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '150px', height: '180px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <img src={currentVenue.image} alt={currentVenue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>{currentVenue.name.toUpperCase()}</h1>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>Official Booking Dashboard</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                padding: '12px 24px', backgroundColor: '#000', color: '#fff',
                                border: 'none', borderRadius: '12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600',
                                transition: 'transform 0.2s'
                            }}
                        >
                            View Details <Info size={18} />
                        </button>
                    </div>
                </div>

                {/* Date Selection Section */}
                <div style={{ marginBottom: '50px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ padding: '30px 20px', backgroundColor: '#e2e8f0', borderRadius: '32px', textAlign: 'center', minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>{selectedDate.toLocaleString('default', { month: 'short' })}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {weekDays.map((date, i) => {
                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedDate(date)}
                                        style={{
                                            padding: '15px 10px',
                                            backgroundColor: isSelected ? '#000' : 'transparent',
                                            color: isSelected ? '#fff' : '#000',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            minWidth: '60px',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}
                                    >
                                        <p style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{date.getDate()}</p>
                                        <p style={{ fontSize: '0.85rem', opacity: isSelected ? 0.9 : 0.6, margin: '4px 0 0' }}>{date.toLocaleString('default', { weekday: 'short' })}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>



                    {/* Selected Summary */}
                    {selectedSlot && (
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#000', backgroundColor: '#f1f5f9', display: 'inline-block', padding: '8px 20px', borderRadius: '20px' }}>
                                Selected Time: {selectedSlot}
                            </p>
                        </div>
                    )}

                    {/* Booking Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {Object.entries(timeSlots).map(([title, slots]) => {
                            const availableSlots = slots.filter(slot => getSlotStatus(slot) !== 'accepted');
                            if (availableSlots.length === 0) return null;

                            return (
                                <div key={title}>
                                    <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>{title}</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                        {availableSlots.map(slot => {
                                            const status = getSlotStatus(slot);
                                            const color = getStatusColor(status);
                                            const isSelected = selectedSlot === slot;

                                            return (
                                                <motion.div
                                                    key={slot}
                                                    whileHover={status === 'available' ? { y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
                                                    onClick={() => {
                                                        if (status !== 'available') return;
                                                        handleBooking(slot, title.split(' ')[0]);
                                                    }}
                                                    style={{
                                                        padding: '24px',
                                                        backgroundColor: isSelected ? '#000' : '#fff',
                                                        color: isSelected ? '#fff' : '#000',
                                                        borderRadius: '20px',
                                                        border: `2px solid ${isSelected ? '#000' : '#f1f5f9'}`,
                                                        cursor: status === 'available' ? 'pointer' : 'not-allowed',
                                                        position: 'relative',
                                                        textAlign: 'center',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    <p style={{ fontWeight: '700', marginBottom: '4px' }}>{slot}</p>
                                                    {status !== 'available' && (
                                                        <div style={{
                                                            position: 'absolute', top: '10px', right: '10px',
                                                            width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color
                                                        }}></div>
                                                    )}
                                                    <p style={{
                                                        fontSize: '0.65rem',
                                                        textTransform: 'uppercase',
                                                        fontWeight: '800',
                                                        color: isSelected ? '#fff' : (status === 'available' ? '#94a3b8' : color),
                                                        opacity: isSelected ? 0.8 : 1
                                                    }}>
                                                        {status === 'available' ? 'AVAILABLE' : status.toUpperCase()}
                                                    </p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookVenue;