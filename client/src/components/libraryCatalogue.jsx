import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import "./showBook.css";
import backgroundImage from "./HomePage.jpg";

const LibraryCatalogue = ({ setAuth }) => {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState("");
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    const shelfRef = useRef(null);
    let navigate = useNavigate();

    const getBooks = async () => {
        try {
            const response = await fetch("http://localhost:5000/showBooks");
            const jsonData = await response.json();
            setBooks(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const searchBooks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/searchBooks/${title}`);
            const jsonData = await response.json();
            setSearchedBooks(jsonData);
            setIsSearched(true);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getBooks();
    }, []);

    useEffect(() => {
        searchBooks();
    }, [title]);

    const showBookByID = (id) => {
        navigate(`/showBookDetails/${id}`);
    };

    const addToCart = async (id, e) => {
        e.stopPropagation();
        try {
            const body = { book_id: id };
            const response = await fetch("http://localhost:5000/addToCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                console.log("Added book with ID", id, "to cart");
            } else {
                console.error("Failed to add book to cart");
            }
        } catch (err) {
            console.error("Failed to add book to cart:", err.message);
        }
    };

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
    };

    // Function to group books by shelf number
    const groupBooksByShelf = () => {
        const booksByShelf = {};
        books.forEach(book => {
            if (!booksByShelf[book.shelf_id]) {
                booksByShelf[book.shelf_id] = [];
            }
            booksByShelf[book.shelf_id].push(book);
        });
        return booksByShelf;
    };

    // Function to scroll to the selected shelf
    const scrollToShelf = (shelf_id) => {
        const shelfElement = document.getElementById(`shelf_${shelf_id}`);
        if (shelfElement) {
            shelfElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Fragment>
            <div className="fixed-bg" style={{ ...containerStyle }}></div>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Library Catalogue</h1>
                <h1 className="text-center" style={{ color: 'transparent' }}>
                    Search Books
                </h1>
                <h1 className="text-center" style={{ color: 'transparent' }}>
                    Search Books
                </h1>
                <div className="shelf-navigation-container" style={{ position: 'fixed', top: '70px', left: '0',zIndex: '1000' }}>
                    {Object.keys(groupBooksByShelf()).map(shelf_id => (
                        <button
                            key={shelf_id}
                            className="btn-secondary"
                            style={{width: '50px',height: '50px'}}
                            onClick={() => scrollToShelf(shelf_id)}
                        >
                            {shelf_id}
                        </button>
                    ))}
                </div>
                <div className="container mt-5" style={{ opacity: '0.9' }}>
                    {Object.entries(groupBooksByShelf()).map(([shelf_id, shelfBooks]) => (
                        <div key={shelf_id} id={`shelf_${shelf_id}`} className="mt-5 mb-5">
                            <h3 style={{background: '#9b0500', color: 'white', marginBottom: '15px' }}>Shelf no: {shelf_id}</h3>
                            <div className="row">
                                {shelfBooks.map(book => (
                                    <div key={book.book_id} className="col-md-4 mb-4">
                                        <div
                                            className="card h-100 book-card"
                                            onClick={() => showBookByID(book.book_id)}
                                            style={{ cursor: "pointer", backgroundColor: '#111' }}
                                        >
                                            <div className="card-body">
                                                <img
                                                    src={book.image_url}
                                                    alt={book.title}
                                                    className="book-image"
                                                />
                                                <h5 className="card-title book-title mt-2" style={{ color: '#dd0000' }}>{book.title}</h5>
                                                <p className="card-text" style={{ color: 'white' }}>
                                                    <strong>Publication:</strong> {book.publication_name}
                                                </p>
                                                <p className="card-text" style={{ color: 'white' }}>
                                                    <strong>Category:</strong> {book.category}
                                                </p>
                                            </div>
                                            <div className="card-footer">
                                                {book.copy === 0 &&
                                                    <button className="btn w-100" style={{ backgroundColor: "#0358b4", color: "white" }}>
                                                        Unavailable
                                                    </button>
                                                }
                                                {book.copy > 0 &&
                                                    <button
                                                        onClick={(e) => addToCart(book.book_id, e)}
                                                        className="btn btn-primary w-100"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default LibraryCatalogue;
