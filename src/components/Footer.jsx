import React from 'react';
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            position: 'relative',
            marginTop: '100px',
            paddingBottom: '40px',
            zIndex: 1
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>


                {/* Glassmorphic Links Section */}
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '30px',
                    padding: '60px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                    gap: '40px'
                }}>
                    {/* Brand Info */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px' }}>About Slotfy</h4>
                        <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '25px' }}>
                            The smartest way to book and manage campus venues. Empowering student activities since 2024.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ color: '#000' }}><Github size={18} /></a>
                            <a href="#" style={{ color: '#000' }}><Twitter size={18} /></a>
                            <a href="#" style={{ color: '#000' }}><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><Link to="/" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Home</Link></li>
                            <li><a href="#services" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Services</a></li>
                            <li><Link to="/contact" style={{ color: '#555', textDecoration: 'none', fontWeight: '500' }}>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li style={{ display: 'flex', gap: '10px', color: '#555', fontSize: '0.9rem' }}>
                                <MapPin size={16} /> EMEA College
                            </li>
                            <li style={{ display: 'flex', gap: '10px', color: '#555', fontSize: '0.9rem' }}>
                                <Mail size={16} /> hello@slotfy.edu
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    color: '#666',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                }}>
                    © {new Date().getFullYear()} Slotify. Built for Campus Excellence.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
