// src/App.js

import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import backgroundImage from "./HomePage.jpg";

const Feedback = ({ setAuth }) => {

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");
    const [description, setDescription] = useState("");
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const navigate = useNavigate();

    const submit = () => {
        if (title === "") {
            alert("Title is required");
            return;
        }
        try {
            fetch("http://localhost:5000/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify({ title, author, publisher, description })
            }).then(response => response.json())
                .then(data => {
                    if (data === "Feedback Submitted") {
                        alert("Feedback Submitted");
                        navigate('/');
                    } else {
                        alert("Feedback not Submitted");
                    }
                });
        } catch (err) {
            console.error(err.message);
        }
    }

    const goToHome = () => {
        navigate("/");
    };

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
    };

    return (
        <Fragment>
            <div className="fixed-bg" style={{ ...containerStyle }}></div>
            <div className='page-container' style={{opacity: '0.9'}}>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Feedback</h1>
                <div
                    className="add-book-container"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                    }}
                >

                    <form
                        className="login-container mt-5 mb-5"
                        onSubmit={submit}
                        style={{ width: '50%' }}
                    >
                        <h2 className='mb-3'>Suggest A Book</h2>
                        <div>
                            <label htmlFor="title" className="mt-3">
                                <p style={{ color: 'red', display: 'inline' }}>*</p>Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="form-control "
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="author" className="mt-3">
                                Authors:
                            </label>
                            <textarea
                                type="text"
                                id="author"
                                className="form-control "
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="publisher" className="mt-3">
                                Publisher:
                            </label>
                            <input
                                type="text"
                                id="publisher"
                                className="form-control "
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor='description' className='mt-3'>
                                Write something about this Book:
                            </label>
                            <textarea
                                type="text"
                                id="description"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ height: '100px' }}
                            />
                        </div>
                        <button className="btn btn-success mt-3">Submit Suggestion</button>
                    </form>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Feedback;
