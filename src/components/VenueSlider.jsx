import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

import { venues } from '../data/venues';

const VenueSlider = () => {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % venues.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const currentVenue = venues[index];

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: -1,
                overflow: 'hidden'
            }}>
                <AnimatePresence>
                    <motion.img
                        key={currentVenue.image}
                        src={currentVenue.image}
                        initial={{ opacity: 0, scale: 1.1, zIndex: 1 }}
                        animate={{ opacity: 1, scale: 1, zIndex: 1 }}
                        exit={{ opacity: 1, scale: 1.05, zIndex: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(12px)',
                            transform: 'scale(1.1)'
                        }}
                    />
                </AnimatePresence >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    zIndex: 2
                }} />
            </div >

            <div style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="slider-wrapper" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: '40px',
                    paddingTop: '80px'
                }}>
                    <div className="slider-text-area" style={{ flex: 1, paddingLeft: '60px' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentVenue.name}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}
                            >
                                <motion.h1
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    style={{ fontSize: '4.5rem', fontWeight: '900', color: '#000', marginBottom: '10px' }}
                                >
                                    {currentVenue.name}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                    style={{ fontSize: '1.2rem', color: '#333', fontWeight: '600', marginBottom: '20px' }}
                                >
                                    {currentVenue.type}
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                    style={{ fontSize: '1.1rem', color: '#555', maxWidth: '400px', marginBottom: '30px', fontWeight: '500' }}
                                >
                                    {currentVenue.description}
                                </motion.p>

                                <motion.button
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                                    onClick={() => navigate('/book', { state: { venue: currentVenue } })}
                                    style={{
                                        padding: '10px 24px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        borderRadius: '50px',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                        cursor: 'pointer',
                                        border: 'none',
                                        display: 'inline-block'
                                    }}
                                >
                                    Book Venue
                                </motion.button>
                            </motion.div>
                        </AnimatePresence>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px', width: '100%' }}>
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
                </div>

                <div className="slider-image-area" style={{ flex: '0 0 40%', position: 'relative', top: '0px', left: '-30px', height: '400px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentVenue.image}
                            initial={{ opacity: 0, x: 150 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -150 }}
                            transition={{
                                duration: 0.6,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: '100%',
                                height: '400px',
                                borderRadius: '30px',
                                overflow: 'hidden',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
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
