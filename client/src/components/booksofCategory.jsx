import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHome } from "@fortawesome/free-solid-svg-icons"; // Added faHome icon
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./footer";
import "./showBook.css";
import backgroundImage from "./HomePage.jpg";

const BooksofCategory = ({ setAuth }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState("");
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [user, setUser] = useState(null);
    const [uId, setUId] = useState(null);
    const [cartbook, setCartBook] = useState(0);
    const [userType, setUserType] = useState(null);
    const { category } = useParams();
    const [categoryName, setCategoryName] = useState("");

    let navigate = useNavigate();

    const getInfo = async () => {
        try {
            const userResponse = await fetch("http://localhost:5000/getID", {
                method: "GET",
                headers: {
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
            });
            const user_id = await userResponse.json();
            setUId(user_id);
            const response = await fetch(`http://localhost:5000/myProfile/${user_id}`);
            const jsonData = await response.json();
            setUser(jsonData[0]);
        } catch (err) {
            console.error("Failed to fetch user details");
        }
    };

    const getBooks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/booksofCategory/${category}`);
            const jsonData = await response.json();
            setBooks(jsonData);
            setCategoryName(jsonData[0].category);
        } catch (err) {
            console.error(err.message);
        }
    };

    const searchBooks = async () => {
        try {
            console.log(title);
            const response = await fetch(`http://localhost:5000/bookofCategory/${category}?title=${title}`);
            const jsonData = await response.json();
            setSearchedBooks(jsonData);
            setIsSearched(true);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getInfo();
        getBooks();
        getUserType();
    }, []);

    useEffect(() => {
        searchBooks();
    }, [title]);

    const showBookByID = (id) => {
        try {
            const body = { book_id: id };
            const response = fetch(`http://localhost:5000/addToSearched`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            });
        } catch (err) {
            console.error(err.message);
        }
        navigate(`/showBookDetails/${id}`);
    };

    const addToSearched = async (id, e) => {
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
    }


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

    const getUserType = async () => {
        try {
            const response = await fetch("http://localhost:5000/getUserType", {
                method: "GET",
                headers: { token: localStorage.token, "Content-Type": "application/json" }
            });
            const jsonData = await response.json();
            setUserType(jsonData[0].type_of_user);
        } catch (err) {
            console.error(err.message);
        }
    }

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
    };


    return (
        <Fragment>
            <div className="page-container">
                <div className="fixed-bg" style={{ ...containerStyle }}></div>
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Books of {categoryName}</h1>
                <h1 className="text-center" style={{ color: 'transparent' }}>
                    Search Books
                </h1>
                <h1 className="text-center mb-3" style={{ color: 'transparent' }}>
                    Search Books
                </h1>
                <div className="container">
                    <form onSubmit={searchBooks} className="row search-form" style={{ boxShadow: '0 0 10px black', position: 'fixed', zIndex: '500', top: '70px', left: '5%', width: '90%' }}>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <div className="container mt-5" style={{ opacity: '0.9' }}>
                    <div className="row">
                        {isSearched === false || searchedBooks.length == 0 &&
                            <h6 className="text-center mt-5" style={{ width: '100%' }}>No Matches Found</h6>
                        }
                        {(isSearched ? searchedBooks : books || []).map((book) => (
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
                                        {book.copy == 0 &&
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
            </div>
            <Footer />
        </Fragment>
    );
};

export default BooksofCategory;
