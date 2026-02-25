import React from 'react';
import Navbar from '../components/Navbar';
import VenueSlider from '../components/VenueSlider';

const Home = () => {
    return (
        <div className="container" style={{ minHeight: '100vh' }}>
            <Navbar />
            <VenueSlider />
        </div>
    );
};

export default Home;
