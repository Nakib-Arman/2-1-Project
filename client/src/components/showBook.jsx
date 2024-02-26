import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./showBook.css";

const ShowBook = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [user, setUser] = useState(null);
  const [uId, setUId] = useState(null);
  const [cartbook, setCartBook] = useState(0);

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
  }, []);

  useEffect(() => {
    searchBooks();
  }, [title]);

  const showBookByID = (id) => {
    navigate(`/showBookDetails/${id}`);
  };

  const addToSearched=async(id,e)=>{
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

  const goToCart = () => {
    navigate("/showCart");
  };

  return (
    <Fragment>
      <h1 className="text-center mb-4" style={{ color: "white" }}>
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
                  {book.copy==0 &&
                  <button className="btn w-100" style={{backgroundColor: "#0358b4",color: "white"}}>
                    Unavailable  
                  </button>
                  }
                  {book.copy>0 &&
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
      <div className="head-color fixed-header">
        <h1 className="text-center">Search Books</h1>
        <button
          onClick={goToCart}
          className="cart-btn"
          style={{
            background: "transparent",
            color: "white",
            border: "white",
          }}
        >
          <FontAwesomeIcon style={{ height: "25px" }} icon={faCartShopping} />
        </button>
      </div>
    </Fragment>
  );
};

export default ShowBook;
