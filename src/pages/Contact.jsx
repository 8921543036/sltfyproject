import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';

const Contact = () => {
    const [contactInfo, setContactInfo] = useState({
        email: 'support@slotify.com',
        phone: '+91 98765 43210',
        address: 'EMEA College'
    });
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_info')
                .select('*')
                .single();

            if (data) {
                setContactInfo(data);
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert([formData]);

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            alert('Message sent successfully!');
            setFormData({
                full_name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(`Failed to send message: ${error.message || 'Unknown error. Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

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

            <div className="responsive-grid-2" style={{
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
                            <p style={{ margin: 0, color: '#666' }}>
                                {fetching ? 'Loading...' : contactInfo.email}
                            </p>
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
                            <p style={{ margin: 0, color: '#666' }}>
                                {fetching ? 'Loading...' : contactInfo.phone}
                            </p>
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
                            <p style={{ margin: 0, color: '#666' }}>
                                {fetching ? 'Loading...' : contactInfo.address}
                            </p>
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
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    required
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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
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
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
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
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
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
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '16px',
                                backgroundColor: '#000',
                                color: '#fff',
                                borderRadius: '12px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: '10px',
                                transition: 'opacity 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}>
                            {loading ? (
                                <>Sending... <Loader2 className="animate-spin" size={18} /></>
                            ) : (
                                <>Send Message <Send size={18} /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
