import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';
import Navbar from '../components/Navbar';

const CreateEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        slot = '10:30 – 11:30',
        dateStr = new Date().toISOString().split('T')[0],
        formattedDate = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
        venueName = 'SEMINAR HALL',
        durationType = '1 Hour'
    } = location.state || {};

    const [eventName, setEventName] = useState('');
    const [clubDept, setClubDept] = useState('');
    const [description, setDescription] = useState('');
    const [poster, setPoster] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('You must be logged in');

            let posterUrl = '';
            if (poster) {
                const fileExt = poster.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('posters')
                    .upload(fileName, poster);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('posters')
                    .getPublicUrl(fileName);
                posterUrl = publicUrl;
            }

            const { error } = await supabase
                .from('bookings')
                .insert([{
                    user_id: session.user.id,
                    venue_name: venueName,
                    booking_date: dateStr,
                    start_time: slot.split(' – ')[0],
                    end_time: slot.split(' – ')[1],
                    event_name: eventName,
                    club_dept: clubDept,
                    description: description,
                    poster_url: posterUrl,
                    duration_type: durationType,
                    status: 'pending'
                }]);

            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingTop: '120px', paddingBottom: '60px' }}>
            <Navbar />

            <AnimatePresence>
                {submitted && (
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
                                backgroundColor: '#fff',
                                borderRadius: '32px',
                                padding: '50px',
                                maxWidth: '500px',
                                width: '100%',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                textAlign: 'center',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => navigate('/book', { state: { venueName } })}
                                style={{
                                    position: 'absolute', top: '20px', right: '20px',
                                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                                    width: '40px', height: '40px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <X size={20} color="#64748b" />
                            </button>

                            <CheckCircle2 size={72} color="#10b981" style={{ marginBottom: '25px', display: 'inline-block' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '15px', letterSpacing: '-0.5px' }}>Booking Submitted!</h2>
                            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
                                Your request for the <strong>{venueName}</strong> has been received and is pending approval.
                            </p>
                            <button
                                onClick={() => navigate('/book', { state: { venueName } })}
                                style={{
                                    padding: '16px 32px', backgroundColor: '#000', color: '#fff',
                                    border: 'none', borderRadius: '50px', fontSize: '1rem',
                                    fontWeight: '700', cursor: 'pointer', width: '100%',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                Back to Dashboard
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 20px' }}>
                <button
                    onClick={() => navigate('/book', { state: { venueName } })}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', marginBottom: '30px', fontWeight: '500' }}
                >
                    <ArrowLeft size={18} /> Back to Slots
                </button>

                <div style={{ position: 'relative' }}>
                    {/* Status Badge */}
                    <div style={{
                        position: 'absolute', top: '-10px', right: 0,
                        backgroundColor: '#bef264', padding: '15px 30px', borderRadius: '16px',
                        textAlign: 'center', minWidth: '150px', border: '1px solid #a3e635',
                        boxShadow: '0 10px 20px rgba(190, 242, 100, 0.2)'
                    }}>
                        <p style={{ fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>{slot}</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: '800', margin: '4px 0 0', color: 'rgba(0,0,0,0.5)' }}>PENDING</p>
                    </div>

                    {/* Top Info */}
                    <div style={{ marginBottom: '60px' }}>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '8px' }}>Event Date</p>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>{formattedDate}</h1>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Event Name</label>
                            <input
                                type="text"
                                required
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="Enter the name of your event"
                                style={{ width: '100%', padding: '18px 24px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Club / Department</label>
                            <input
                                type="text"
                                required
                                value={clubDept}
                                onChange={(e) => setClubDept(e.target.value)}
                                placeholder="Which club or department is organizing this?"
                                style={{ width: '100%', padding: '18px 24px', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Description</label>
                            <textarea
                                required
                                rows="6"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a brief description of the event, its purpose, and any special requirements."
                                style={{ width: '100%', padding: '24px', borderRadius: '24px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', resize: 'none' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Upload Poster (Optional)</label>
                            <div style={{
                                position: 'relative',
                                padding: '40px',
                                borderRadius: '24px',
                                border: '2px dashed #e2e8f0',
                                backgroundColor: '#f8fafc',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}>
                                <input
                                    type="file"
                                    onChange={(e) => setPoster(e.target.files[0])}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                                <Upload size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{poster ? poster.name : 'Click or drag image to upload event poster'}</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '20px 60px', backgroundColor: '#000', color: '#fff',
                                    border: 'none', borderRadius: '35px', fontSize: '1.1rem',
                                    fontWeight: '700', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, opacity 0.2s'
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>

                </div>

                <style>{`
                input:focus, textarea:focus {
                    border-color: #000 !important;
                }
            `}</style>
            </div>
        </div>
    );
};

export default CreateEvent;
