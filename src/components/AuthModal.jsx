import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { name } }
                });
                if (error) throw error;
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '40px',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={18} color="#64748b" />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                {isLogin ? 'Login to your campus account' : 'Start booking venues today'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {!isLogin && (
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#94a3b8' }} />
                                    <input
                                        style={{ paddingLeft: '45px' }}
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#94a3b8' }} />
                                <input
                                    style={{ paddingLeft: '45px' }}
                                    type="email"
                                    placeholder="College Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#94a3b8' }} />
                                <input
                                    style={{ paddingLeft: '45px' }}
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '14px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    marginTop: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <span
                                    onClick={() => setIsLogin(!isLogin)}
                                    style={{ color: '#000', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {isLogin ? 'Register' : 'Login'}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
