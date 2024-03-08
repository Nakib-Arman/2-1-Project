// src/App.js

import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';

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
        try{
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
        }catch(err){
            console.error(err.message);
        }
    }

    const goToHome = () => {
        navigate("/");
    };

    const addBook = () => {
        navigate('/addBooks');
    }

    const showBooks = () => {
        navigate('/showBooks');
    }

    async function MyProfile() {
        navigate('/myProfile');
    }


    const goToCart = () => {
        navigate("/showCart");
    };

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    }

    const handleDropdownItemClick = (action) => {
        if (action === 'viewBorrowRequests') {
            navigate('/borrowRequests');
        } else if (action === 'restoreBorrowedBooks') {
            navigate('/restoreBorrowedBooks');
        } else if (action === 'acquisitionRecords') {
            navigate('/acquisitionRecords');
        } else if (action === 'logOut') {
            localStorage.removeItem("token");
            setAuth(false);
        }
    }


    return (
        <Fragment>
            <div className='page-container'>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <header className="fixed-header" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5A1917' }}>

                    <div className="transparent-buttons">
                        <button className="btn" onClick={goToHome} style={{ position: 'relative', left: '10px' }}>Home</button>
                        <button className="btn" onClick={addBook} style={{ position: 'absolute', left: '400px' }}>Add New Book</button>
                        <button className="btn" onClick={showBooks} style={{ position: 'absolute', left: '540px' }}>Search Books</button>
                        <button className="btn" style={{ position: 'absolute', left: '670px' }}>My Profile</button>
                        <button className="btn" onClick={goToCart} style={{ position: 'absolute', left: '770px' }}>Cart</button>
                        <div className="hamburger-icon" onClick={toggleDropdown} style={{ position: 'absolute', right: '10px' }}>
                            <button>&#9776;</button>
                        </div>
                        {isDropdownVisible && (
                            <div className="dropdown-menu" style={{ opacity: 0.9, border: '1px solid black', position: 'absolute', left: '910px', width: '300px' }}>
                                <button onClick={() => handleDropdownItemClick('viewBorrowRequests')} style={{ width: '90%', textAlign: 'right' }}><b>View Borrow Requests</b></button>
                                <button onClick={() => handleDropdownItemClick('restoreBorrowedBooks')} style={{ width: '90%', textAlign: 'right' }}><b>Restore Borrowed Books</b></button>
                                <button onClick={() => handleDropdownItemClick('acquisitionRecords')} style={{ width: '90%', textAlign: 'right' }}><b>Acquisition Records</b></button>
                                <button onClick={() => handleDropdownItemClick('logOut')} className="logout-button" style={{ width: '90%', textAlign: 'right' }}><b>Log Out</b></button>
                            </div>
                        )}
                    </div>
                </header>
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
            <Footer/>
        </Fragment>
    );
};

export default Feedback;
