import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "./footer";

const ViewSuggestedBooks = ({ setAuth }) => {
    const [books, setBooks] = useState([]);


    const getBooks = async () => {
        try {
            const user = await fetch("http://localhost:5000/getID", { method: "GET", headers: { token: localStorage.token, "Content-Type": "application/json" } });
            const user_id = await user.json();
            const response = await fetch("http://localhost:5000/suggestedBooks");
            const jsonData = await response.json();
            console.log(jsonData);
            setBooks(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    useEffect(() => {
        getBooks();
    }, []);


    return (
        <Fragment>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Suggested Books</h1>
                <h1 className="text-center mb-5" style={{ color: "transparent" }}>BIBLIOPHILE</h1>
                <div className="boxes-container mt-5">
                    {books.map((book) => (
                        <div className="box" style={{width:'80%'}}>
                            <span className="option-text">
                                Suggested By: 
                                <Link to={`/staffProfile/${book.user_id}`} className="option-link">
                                    {book.first_name} {book.last_name}
                                </Link>
                            </span>
                            <span className="option-text">
                                Book Name:
                                    {book.title}
                            </span>
                            <span className="option-text">
                                Authors: {book.authors}
                            </span>
                            <span className="option-text">
                                Publisher: {book.pusblisher}
                            </span>
                            <span className="option-text">
                                Description: {book.description}
                            </span>
                            <p> </p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ViewSuggestedBooks;
