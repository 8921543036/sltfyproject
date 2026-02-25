import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ textAlign: 'center' }}
            >
                <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-2px' }}>
                    Slotify
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}
                >
                    Campus Venue Booking Portal
                </motion.p>

                <div className="spinner"></div>
            </motion.div>
        </div>
    );
};

export default Splash;
