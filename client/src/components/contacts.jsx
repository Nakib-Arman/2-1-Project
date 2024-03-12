// ContactUs.js

import React, { Fragment } from 'react';
import './contacts.css'; // Import the corresponding CSS file
import Footer from './footer';
import backgroundImage from "./HomePage.jpg";

const ContactUs = () => {

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
      };

    return (
        <Fragment>
            <div className="fixed-bg" style={{ ...containerStyle }}></div>
            <div className='page-container'>
            <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Contact Us</h1>
            <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <div className="aboutus-container" style={{opacity: '0.9'}}>
                    <div className="contact-info">
                        <p>
                            <strong>Shariar Al Kabir</strong>
                            <br />
                            <strong>Nakib Arman</strong>
                        </p>
                        <p>Bangladesh University of Engineering and Technology</p>
                        <p>Phone: 01581577332
                            <br /><span style={{ margin: '55px' }}>01720660209</span>                        </p>
                        <p>Email: <a href="mailto:2105132@ugrad.cse.buet.ac.bd">2105132@ugrad.cse.buet.ac.bd</a>
                            <br /> <span style={{ margin: '50px' }}><a href="mailto:210528@ugrad.cse.buet.ac.bd">2105128@ugrad.cse.buet.ac.bd</a></span>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ContactUs;
