// Footer.js (Footer Component)

import React, { useState } from 'react';
import './footer.css'; // Import the corresponding CSS file
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const navigate = useNavigate();

  const openDeveloperModal = () => {
    setShowDeveloperModal(!showDeveloperModal);
  }

  const AboutUs = () => {
    navigate('/aboutUs');
  }

  return (
    <footer className="footer-container">
      <div className="footer-links">
        <button className="footer-link">Library Members</button>
        <button className="footer-link">Contacts</button>
        <button className="footer-link">Privacy Policy</button>
        <button className="footer-link" onClick={AboutUs}>About Us</button>
      </div>
      <label onClick={openDeveloperModal}>&copy; 2105128_2105132</label>
      {showDeveloperModal && (
        <div className="developer-modal">
          <h3>Developers</h3>
          <p>2105128 - Nakib Arman</p>
          <p>2105132 - Shariar Al Kabir</p>
        </div>
      )}
    </footer>
  );
};

export default Footer;
