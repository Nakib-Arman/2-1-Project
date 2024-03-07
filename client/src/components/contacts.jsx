// ContactUs.js

import React, { Fragment } from 'react';
import './contacts.css'; // Import the corresponding CSS file
import Footer from './footer';

const ContactUs = () => {
    return (
        <Fragment>
            <div className='page-container'>
                <div className="contact-container">
                    <h2>Contact Us</h2>
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
