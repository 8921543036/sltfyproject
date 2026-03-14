import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { venues } from '../data/venues';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Venues = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            <Navbar />

            {/* Hero Section */}
            <div style={{
                padding: '120px 20px 60px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                marginBottom: '40px'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '16px',
                        letterSpacing: '-2px',
                        color: '#0f172a'
                    }}
                >
                    Our Venues
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        fontSize: '1.2rem',
                        color: '#64748b',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}
                >
                    Explore our range of state-of-the-art venues designed for every type of event, from intimate workshops to grand ceremonies.
                </motion.p>
            </div>

            {/* Venues Grid */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px 80px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
                gap: '30px'
            }}>
                {venues.map((venue, index) => (
                    <motion.div
                        key={venue.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={venue.image}
                                alt={venue.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                color: '#0f172a'
                            }}>
                                {venue.type.split('|')[0].trim()}
                            </div>
                        </div>

                        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
                                {venue.name}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                                {venue.description}
                            </p>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.9rem' }}>
                                    <Users size={16} />
                                    <span>{venue.capacity}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.9rem' }}>
                                    <MapPin size={16} />
                                    <span>{venue.location || 'Main Campus'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/book', { state: { venue } })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                Book Venue <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default Venues;
