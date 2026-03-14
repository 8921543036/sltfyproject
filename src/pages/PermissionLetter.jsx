import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FileText, Download, CheckCircle } from 'lucide-react';

const PermissionLetter = () => {
    const [formData, setFormData] = useState({
        date: '',
        institutionName: 'EMEA College',
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
        const header = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Permission Letter</title></head><body>`;
        const footer = "</body></html>";
        const content = `
            <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                <h2 style="text-align: center; text-decoration: underline;">PERMISSION LETTER FOR VENUE BOOKING</h2>
                <br/>
                <p>Date: ${formData.date || '[Date]'}</p>
                <br/>
                <p>To,<br/>
                The Principal / Head of Department<br/>
                ${formData.institutionName || '[Institution/Department Name]'}</p>
                <br/>
                <p><b>Subject: Request for permission to use ${formData.venueName || '[Venue Name]'}</b></p>
                <br/>
                <p>Respected Sir/Madam,</p>
                <p>I am writing to formally request permission to use the <b>${formData.venueName || '[Venue Name]'}</b> for organizing an event titled "<b>${formData.eventTitle || '[Event Title]'}</b>".</p>
                <p>The proposed schedule for the event is as follows:</p>
                <ul style="list-style-type: none;">
                    <li><b>Date:</b> ${formData.eventDate || '[Event Date]'}</li>
                    <li><b>Time:</b> ${formData.startTime || '[Start Time]'} to ${formData.endTime || '[End Time]'}</li>
                </ul>
                <p><b>Purpose:</b> ${formData.purpose || '[Brief description of the event\'s purpose]'}</p>
                <br/>
                <p>We assure you that all necessary protocols will be followed, and the venue will be maintained in its original condition.</p>
                <p>Kindly grant us the permission to proceed with the booking.</p>
                <br/>
                <p>Thank you.</p>
                <br/>
                <p>Yours sincerely,</p>
                <br/>
                <p><b>${formData.yourName || '[Your Name]'}</b><br/>
                ${formData.designation || '[Your Designation/Class]'}<br/>
                ${formData.contactInfo || '[Contact Information]'}</p>
                <br/><br/>
                <p>-----------------------------------------</p>
                <p><b>Official Use Only:</b></p>
                <p>[ ] Approved&nbsp;&nbsp;&nbsp;&nbsp;[ ] Rejected</p>
                <br/>
                <p>Signature of Authority: _______________<br/>
                Date: _______________</p>
            </div>
        `;
        const source = header + content + footer;
        
        const blob = new Blob(['\ufeff', source], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PermissionLetter.doc`;
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
                        Permission Letter
                    </h1>
                    
                    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', textAlign: 'center' }}>
                        Fill the columns below to instantly generate your permission letter. Once completed, your generated letter will download directly to your device.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Today's Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Institution/Dept Name</label>
                                <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>

                        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Venue Name</label>
                                <input type="text" name="venueName" placeholder="e.g. Main Auditorium" value={formData.venueName} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Event Title</label>
                                <input type="text" name="eventTitle" placeholder="e.g. Connect IEDC Workshop" value={formData.eventTitle} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>

                        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
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

                        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
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
