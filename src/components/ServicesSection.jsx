import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Layout, Bell, Shield, MapPin, Zap } from 'lucide-react';

const services = [
    {
        icon: <Calendar size={32} />,
        title: 'Seamless Booking',
        description: 'Book seminar halls, labs, and theatres with just a few clicks. Real-time availability at your fingertips.'
    },
    {
        icon: <Layout size={32} />,
        title: 'Event Management',
        description: 'Organize workshops, conferences, and club events efficiently with our integrated management tools.'
    },
    {
        icon: <Bell size={32} />,
        title: 'Instant Updates',
        description: 'Get notified immediately via email and app alerts when your booking is accepted or updated.'
    },
    {
        icon: <Shield size={32} />,
        title: 'Secure Access',
        description: 'Verified login system ensures that only authorized students and faculty can make reservations.'
    },
    {
        icon: <MapPin size={32} />,
        title: 'Venue Discovery',
        description: 'Explore various venues across campus with detailed information on capacity and facilities.'
    },
    {
        icon: <Zap size={32} />,
        title: 'Quick Approvals',
        description: 'Fast-tracked administrative workflow to get your events approved and scheduled in record time.'
    }
];

const ServicesSection = () => {
    return (
        <section id="services" style={{ padding: '100px 0', position: 'relative', zIndex: 1 }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Our Services</h2>
                    <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Everything you need to manage campus events and venue bookings in one powerful platform.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(10px)',
                                padding: '40px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '15px',
                                backgroundColor: '#000',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{service.title}</h3>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
