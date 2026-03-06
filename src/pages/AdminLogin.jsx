import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { Lock, User as UserIcon, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if user is already logged in as admin
    useEffect(() => {
        if (localStorage.getItem('isAdmin') === 'true') {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulating a minor network delay
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials. Hint: use admin / admin');
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#000',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <Lock color="#fff" size={28} />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>Admin Login</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Sign in to access the dashboard</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        color: '#ef4444',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '20px',
                        border: '1px solid #fecaca',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <UserIcon color="#94a3b8" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#f8fafc',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock color="#94a3b8" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#f8fafc',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
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
                            opacity: loading ? 0.7 : 1,
                            fontSize: '1.05rem'
                        }}>
                        {loading ? (
                            <>Authenticating... <Loader2 className="animate-spin" size={18} /></>
                        ) : (
                            'Sign In to Dashboard'
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a href="/" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '500' }}>
                        &larr; Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
