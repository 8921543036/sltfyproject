import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Users, Info, ShieldCheck, MapPin, Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';
import Navbar from '../components/Navbar';

const BookVenue = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
        const dateStr = selectedDate.toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('booking_date', dateStr)
            .eq('venue_name', 'SEMINAR HALL');

        if (!error) setBookings(data || []);
        setLoading(false);
    };

    const handleBooking = (slot, durationType) => {
        if (!user) {
            alert('Please login to book a venue');
            return;
        }

        const dateStr = selectedDate.toISOString().split('T')[0];
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
                venueName: 'SEMINAR HALL',
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
        capacity: '500 Persons',
        facilities: ['Projector & Screen', 'Central AC', 'Surround Sound System', 'Stage Lighting'],
        rules: ['No food inside', 'Pre-approval required', 'Technical staff must be present'],
        description: 'The Seminar Hall is equipped with state-of-the-art audio-visual technology, making it ideal for academic presentations, workshops, and high-profile meetings.'
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingTop: '100px' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '280px', height: '180px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Seminar Hall" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>SEMINAR HALL</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '20px' }}>Official Booking Dashboard</p>
                        <button
                            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                            style={{
                                padding: '12px 24px', backgroundColor: '#000', color: '#fff',
                                border: 'none', borderRadius: '12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600',
                                transition: 'transform 0.2s'
                            }}
                        >
                            View Details {isDetailsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                    {isDetailsExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginBottom: '40px' }}
                        >
                            <div style={{ padding: '30px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0f172a' }}><Users size={18} /> Capacity</h4>
                                        <p style={{ color: '#64748b' }}>{venueDetails.capacity}</p>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0f172a' }}><ShieldCheck size={18} /> Facilities</h4>
                                        <ul style={{ paddingLeft: '20px', color: '#64748b' }}>
                                            {venueDetails.facilities.map(f => <li key={f}>{f}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0f172a' }}><Info size={18} /> Rules</h4>
                                        <ul style={{ paddingLeft: '20px', color: '#64748b' }}>
                                            {venueDetails.rules.map(r => <li key={r}>{r}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0f172a' }}><MapPin size={18} /> Description</h4>
                                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{venueDetails.description}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Date Selection Section */}
                <div style={{ marginBottom: '50px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ padding: '20px 30px', backgroundColor: '#e2e8f0', borderRadius: '24px', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{selectedDate.toLocaleString('default', { month: 'short' })}</p>
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
                                            padding: '20px',
                                            backgroundColor: isSelected ? '#000' : 'transparent',
                                            color: isSelected ? '#fff' : '#000',
                                            borderRadius: '24px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            minWidth: '80px',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}
                                    >
                                        <p style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{date.getDate()}</p>
                                        <p style={{ fontSize: '0.8rem', opacity: isSelected ? 0.8 : 0.6, margin: '4px 0 0' }}>{date.toLocaleString('default', { weekday: 'short' })}</p>
                                        {isSelected && (
                                            <p style={{ fontSize: '1.5rem', fontWeight: '300', margin: '8px 0 0', opacity: 0.9 }}>
                                                {date.toLocaleString('default', { weekday: 'long' }).toLowerCase() === 'tuesday' ? 'tuesday' : date.toLocaleString('default', { weekday: 'long' }).toLowerCase()}
                                            </p>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status Legend */}
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Pending</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Accepted</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Rejected</span>
                        </div>
                    </div>

                    {/* Selected Summary */}
                    {selectedSlot && (
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#000', backgroundColor: '#f1f5f9', display: 'inline-block', padding: '8px 20px', borderRadius: '20px' }}>
                                Selected Time: {selectedSlot}
                            </p>
                        </div>
                    )}

                    {/* Booking Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {Object.entries(timeSlots).map(([title, slots]) => (
                            <div key={title}>
                                <h3 style={{ fontSize: '0.95rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>{title}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                    {slots.filter(slot => getSlotStatus(slot) !== 'accepted').map(slot => {
                                        const status = getSlotStatus(slot);
                                        const color = getStatusColor(status);
                                        const isSelected = selectedSlot === slot;

                                        return (
                                            <motion.div
                                                key={slot}
                                                whileHover={status === 'available' ? { y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
                                                onClick={() => {
                                                    if (status === 'accepted') return;
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
                                                    fontSize: '0.75rem',
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookVenue;
