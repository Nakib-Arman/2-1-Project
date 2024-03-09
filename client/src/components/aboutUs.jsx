// Import React and CSS file
import React, { Fragment } from 'react';
import './aboutUs.css'; // Create a CSS file for styling
import Footer from './footer';

// Functional component for the About Us page
const AboutUs = () => {
    return (
        <Fragment>
            <div className='page-container'>
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Welcome To Our Library Website</h1>
                <h1 className="text-center mb-2" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <div className="aboutus-container">
                    <p className='mt-5'>
                        Greetings! We are Nakib Arman and Shariar Al Kabir, students at BUET,
                        on a mission to create an exceptional library experience for you.
                    </p>

                    <h2 className='mt-5'>Our Vision</h2>
                    <p>
                        At the heart of our project is a vision to make the process of accessing
                        and enjoying literature seamless. We envision a digital library space
                        that not only serves as a repository of knowledge but also fosters a
                        sense of community among readers and learners.
                    </p>

                    <h2 className='mt-5'>Why Choose Our Library Website?</h2>
                    <ul>
                        <li>
                            <strong>Intuitive Design:</strong> Our website is designed with user
                            experience in mind, ensuring easy navigation and accessibility for all
                            users.
                        </li>
                        <li>
                            <strong>Comprehensive Collection:</strong> Explore a diverse range of
                            books, articles, and resources catering to various interests and
                            academic pursuits.
                        </li>
                        <li>
                            <strong>Collaborative Learning:</strong> Foster a sense of
                            collaboration by sharing your thoughts, recommendations, and reviews
                            with fellow readers.
                        </li>
                    </ul>

                    <h2 className='mt-5'>Meet the Team</h2>
                    <div class="team-members">
    <div class="member">
        {/* <img src="/nakib_arman.jpg" alt="Nakib Arman" /> */}
        <p>
            <strong>Nakib Arman</strong>
            <br />
            Student ID: 2105128
        </p>
    </div>
    <div class="member">
        {/* <img src="/shariar_al_kabir.jpg" alt="Shariar Al Kabir" /> */}
        <p>
            <strong>Shariar Al Kabir</strong>
            <br />
            Student ID: 2105132
        </p>
    </div>
</div>

                    <h2 className='mt-5'>Join Us on this Literary Journey</h2>
                    <p>
                        We invite you to join us on this literary journey as we strive to build
                        a space where knowledge meets innovation. Whether you're a student, an
                        academic, or an avid reader, our library website is designed to cater to
                        your literary needs. Thank you for being a part of our project!
                    </p>
                </div>
                <Footer />
            </div>
        </Fragment>
    );
};

export default AboutUs;
