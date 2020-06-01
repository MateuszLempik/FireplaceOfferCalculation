import React from 'react';
import logos from '../logo-lempik.png';
import './Logo.css'

const logo = () => (
    <div className="Logo">
        <img src={logos} alt="MyLogo" />
    </div>
);

export default logo;