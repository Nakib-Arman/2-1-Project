import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHome } from "@fortawesome/free-solid-svg-icons"; // Added faHome icon
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import "./showBook.css";

const ShowBook = ({ setAuth }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [user, setUser] = useState(null);
  const [uId, setUId] = useState(null);
  const [cartbook, setCartBook] = useState(0);
  const [userType, setUserType] = useState(null);

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

  const addBook = () => {
    navigate('/addBooks');
  }

  const showBooks = () => {
    navigate('/showBooks');
  }

  const MyProfile = () => {
    navigate('/myProfile');
  }

  const goToCart = () => {
    navigate("/showCart");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  }

  const handleDropdownItemClick = (action) => {
    if (action === 'authorSearch') {
      navigate('/searchAuthors');
    } else if (action === 'publisherSearch') {
      navigate('/searchPublishers');
    } else if (action === 'myRequests') {
      navigate('/myRequests');
    } else if (action === 'viewBorrowRequests') {
      navigate('/borrowRequests');
    } else if (action === 'restoreBorrowedBooks') {
      navigate('/restoreBorrowedBooks');
    } else if (action === 'acquisitionRecords') {
      navigate('/acquisitionRecords');
    } else if (action === 'viewSuggestedBooks') {
      navigate('viewSuggestedBooks')
    } else if (action === 'logOut') {
      localStorage.removeItem("token");
      setAuth(false);
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


  return (
    <Fragment>
      <div className="page-container">
      <header className="fixed-header" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5A1917' }}>

<div className="transparent-buttons" style={{ width: '100%' }}>
  <button className="btn" onClick={() => { navigate("/") }} style={{ position: 'absolute', left: '10px' }}>Home</button>
  <div style={{ alignContent: 'center', width: '100%' }}>
    {userType === 'staff' &&
      <button className="btn" onClick={addBook}>Add New Book</button>
    }
    <button className="btn" style={{ backgroundColor: '#f7e8e8', color: '#5A1917'}}>Search Books</button>
    <button className="btn" onClick={MyProfile}>My Profile</button>
    <button className="btn" onClick={goToCart}>Cart</button>
  </div>
  <div className="hamburger-icon" onClick={toggleDropdown} style={{ position: 'absolute', right: '10px' }}>
    <button>&#9776;</button>
  </div>
  {isDropdownVisible && (
    <div className="dropdown-menu" style={{ opacity: 0.9, border: '1px solid black', position: 'absolute', left: '910px', width: '300px' }}>
      <button onClick={() => handleDropdownItemClick('authorSearch')} style={{ width: '90%', textAlign: 'right' }}><b>Search Authors</b></button>
      <button onClick={() => handleDropdownItemClick('publisherSearch')} style={{ width: '90%', textAlign: 'right' }}><b>Search Publishers</b></button>
      <button onClick={() => handleDropdownItemClick('myRequests')} style={{ width: '90%', textAlign: 'right' }}><b>My Requests</b></button>
      {userType === 'staff' &&
        <div style={{alignContent: 'right'}}>
          <button onClick={() => handleDropdownItemClick('viewBorrowRequests')} style={{ width: '100%', textAlign: 'right' }}><b>View Borrow Requests</b></button>
          <button onClick={() => handleDropdownItemClick('restoreBorrowedBooks')} style={{ width: '100%', textAlign: 'right' }}><b>Restore Borrowed Books</b></button>
          <button onClick={() => handleDropdownItemClick('acquisitionRecords')} style={{ width: '100%', textAlign: 'right' }}><b>Acquisition Records</b></button>
          <button onClick={() => handleDropdownItemClick('viewSuggestedBooks')} style={{ width: '100%', textAlign: 'right' }}><b>View Suggested Books</b></button>
        </div>
      }
      <button onClick={() => handleDropdownItemClick('logOut')} className="logout-button" style={{ width: '90%', textAlign: 'right' }}><b>Log Out</b></button>
    </div>
  )}
</div>
</header>
        <h1 className="text-center mb-4" style={{ color: 'transparent' }}>
          Search Books
        </h1>
        <div className="container">
          <form onSubmit={searchBooks} className="row search-form">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title or Author Name or Publisher Name or Category"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="container mt-5">
          <div className="row">
            {(isSearched ? searchedBooks : books || []).map((book) => (
              <div key={book.book_id} className="col-md-4 mb-4">
                <div
                  className="card h-100 book-card"
                  onClick={() => showBookByID(book.book_id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="book-image"
                    />
                    <h5 className="card-title book-title">{book.title}</h5>
                    <p className="card-text">
                      <strong>Publication:</strong> {book.publication_name}
                    </p>
                    <p className="card-text">
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

export default ShowBook;
