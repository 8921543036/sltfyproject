import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    textAlign: 'center',
                    marginBottom: '60px'
                }}
            >
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px' }}>Get in Touch</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                    Have questions about booking a venue or hosting an event? We're here to help.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: '40px',
                marginBottom: '80px'
            }}>
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        padding: '40px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px'
                    }}
                >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '15px',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}>
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Email Us</h3>
                            <p style={{ margin: 0, color: '#666' }}>support@slotify.com</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '15px',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}>
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Call Us</h3>
                            <p style={{ margin: 0, color: '#666' }}>+91 98765 43210</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '15px',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Visit Us</h3>
                            <p style={{ margin: 0, color: '#666' }}>Main Campus, Slotify University</p>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{
                        padding: '40px',
                        backgroundColor: '#fff',
                        borderRadius: '30px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                    }}
                >
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        outline: 'none',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        outline: 'none',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Subject</label>
                            <input
                                type="text"
                                placeholder="How can we help?"
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    outline: 'none',
                                    backgroundColor: '#f9f9f9'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Message</label>
                            <textarea
                                placeholder="Tell us more about your inquiry..."
                                rows="4"
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    outline: 'none',
                                    backgroundColor: '#f9f9f9',
                                    resize: 'none'
                                }}
                            ></textarea>
                        </div>
                        <button style={{
                            padding: '16px',
                            backgroundColor: '#000',
                            color: '#fff',
                            borderRadius: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '10px',
                            transition: 'opacity 0.2s'
                        }}>
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
