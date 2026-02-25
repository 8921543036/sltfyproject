import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const venues = [
    {
        name: 'Seminar Hall',
        type: 'Seminar | Conference | Workshop',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop',
        description: 'Spacious hall for large academic gatherings.'
    },
    {
        name: 'AVT',
        type: 'Audio Visual Theatre',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
        description: 'Modern theatre with advanced AV systems.'
    },
    {
        name: 'IEDC Room',
        type: 'Innovation | Startup | Meeting',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
        description: 'Creative space for entrepreneurs and innovators.'
    },
    {
        name: 'CA Lab',
        type: 'Computing | Lab | Research',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
        description: 'State-of-the-art computing facility.'
    }
];

const VenueSlider = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % venues.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const currentVenue = venues[index];

    return (
        <>
            {/* Dynamic Background Image */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                overflow: 'hidden'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentVenue.image}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${currentVenue.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(30px) brightness(0.8)'
                        }}
                    />
                </AnimatePresence>
                {/* Overlay for better contrast */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)'
                }} />
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '80vh',
                paddingTop: '100px',
                gap: '40px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ flex: 1 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentVenue.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#000', marginBottom: '10px' }}>
                                {currentVenue.name}
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#333', fontWeight: '600', marginBottom: '20px' }}>
                                {currentVenue.type}
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '400px', marginBottom: '30px', fontWeight: '500' }}>
                                {currentVenue.description}
                            </p>
                            <button style={{
                                padding: '16px 40px',
                                backgroundColor: '#000',
                                color: '#fff',
                                fontSize: '1rem',
                                borderRadius: '50px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }}>
                                Book Venue
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
                        {venues.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setIndex(i)}
                                style={{
                                    width: i === index ? '30px' : '10px',
                                    height: '10px',
                                    borderRadius: '5px',
                                    backgroundColor: i === index ? '#000' : '#ccc',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ flex: 0.8, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentVenue.image}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                width: '100%',
                                height: '350px',
                                borderRadius: '30px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            <img
                                src={currentVenue.image}
                                alt={currentVenue.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default VenueSlider;
