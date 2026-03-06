import React from 'react';
import Navbar from '../components/Navbar';
import VenueSlider from '../components/VenueSlider';
import ServicesSection from '../components/ServicesSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <VenueSlider />
            <ServicesSection />
            <Footer />
        </div>
    );
};

export default Home;
