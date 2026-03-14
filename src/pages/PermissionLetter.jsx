import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FileText, Download, CheckCircle } from 'lucide-react';

const PermissionLetter = () => {
    const [formData, setFormData] = useState({
        date: '',
        institutionName: 'MEA Engineering College',
        venueName: '',
        eventTitle: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        yourName: '',
        designation: '',
        contactInfo: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownloadTemplate = () => {
        const templateContent = `PERMISSION LETTER FOR VENUE BOOKING

Date: ${formData.date || '[Date]'}

To,
The Principal / Head of Department
${formData.institutionName || '[Institution/Department Name]'}

Subject: Request for permission to use ${formData.venueName || '[Venue Name]'}

Respected Sir/Madam,

I am writing to formally request permission to use the ${formData.venueName || '[Venue Name]'} for organizing an event titled "${formData.eventTitle || '[Event Title]'}". 

The proposed schedule for the event is as follows:
Date: ${formData.eventDate || '[Event Date]'}
Time: ${formData.startTime || '[Start Time]'} to ${formData.endTime || '[End Time]'}
Purpose: ${formData.purpose || '[Brief description of the event\'s purpose]'}

We assure you that all necessary protocols will be followed, and the venue will be maintained in its original condition.

Kindly grant us the permission to proceed with the booking.

Thank you.

Yours sincerely,

${formData.yourName || '[Your Name]'}
${formData.designation || '[Your Designation/Class]'}
${formData.contactInfo || '[Contact Information]'}

-----------------------------------------
Official Use Only:
[ ] Approved
[ ] Rejected

Signature of Authority: _______________
Date: _______________
`;

        const blob = new Blob([templateContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.eventTitle || 'Venue'}_Permission_Letter.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '100px', paddingBottom: '60px' }}>
            <Navbar />
            
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '50px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    textAlign: 'left'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <FileText size={40} color="#0f172a" />
                    </div>
                    
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '15px', letterSpacing: '-1px', textAlign: 'center' }}>
                        Connect & IEDC Permission Letter
                    </h1>
                    
                    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', textAlign: 'center' }}>
                        Fill the columns below to instantly generate your permission letter. Once completed, your generated letter will download directly to your device.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Today's Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Institution/Dept Name</label>
                                <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Venue Name</label>
                                <input type="text" name="venueName" placeholder="e.g. Main Auditorium" value={formData.venueName} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Event Title</label>
                                <input type="text" name="eventTitle" placeholder="e.g. Connect IEDC Workshop" value={formData.eventTitle} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Event Date</label>
                                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Start Time</label>
                                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>End Time</label>
                                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Purpose of Event</label>
                            <textarea name="purpose" rows="3" placeholder="Briefly describe the purpose..." value={formData.purpose} onChange={handleInputChange} style={{...inputStyle, resize: 'vertical'}}></textarea>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Your Name</label>
                                <input type="text" name="yourName" placeholder="e.g. John Doe" value={formData.yourName} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Designation/Class</label>
                                <input type="text" name="designation" placeholder="e.g. IEDC Coordinator" value={formData.designation} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Contact Info</label>
                                <input type="text" name="contactInfo" placeholder="e.g. 9876543210" value={formData.contactInfo} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleDownloadTemplate}
                            style={{
                                padding: '16px 32px',
                                backgroundColor: '#10b981',
                                color: '#fff',
                                borderRadius: '16px',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'transform 0.2s, boxShadow 0.2s',
                                boxShadow: '0 10px 20px -5px rgba(16,185,129,0.3)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Download size={20} />
                            Download Filled Letter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    transition: 'border-color 0.2s, boxShadow 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
};

export default PermissionLetter;
