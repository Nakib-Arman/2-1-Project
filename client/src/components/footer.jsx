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

  const LibraryCatalogue = () => {
    navigate("/libraryCatalogue");
  }

  const CategorySearch = () => {
    navigate("/searchCategories");
  }

  const LibraryMembers = () => {
    navigate("/libraryMembers");
  }

  const Contacts = () => {
    navigate("/contactus");
  }

  const Feedback = () => {
    navigate('/feedback');
  }

  const AboutUs = () => {
    navigate('/aboutUs');
  }

  return (
    <footer className="footer-container mt-5">
      <div className="footer-links">
        <button className="footer-link" onClick={LibraryCatalogue}>Library Catalogue</button>
        <button className="footer-link" onClick={CategorySearch}>Category Search</button>
      </div>
      <div className="footer-links mb-5">
        <button className="footer-link" onClick={LibraryMembers}>Library Members</button>
        <button className="footer-link" onClick={Contacts}>Contact Us</button>
        <button className="footer-link" onClick={Feedback}>Feedback</button>
        <button className="footer-link" onClick={AboutUs}>About Us</button>
      </div>
      <label className="developer" onClick={openDeveloperModal}>&copy; 2105128_2105132</label>
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
