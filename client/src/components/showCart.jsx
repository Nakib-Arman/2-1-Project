// ShowCart.js
import React, { Fragment, useEffect, useState } from "react";
import "./ShowCart.css";

const ShowCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getBooksFromCart();
  }, []);

  const getBooksFromCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/showCart", {
        method: "GET",
        headers: {
          "token": localStorage.token,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }
      const jsonData = await response.json();
      setCart(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const showBookByID = (book_id) => {
    // Implement this function if needed
  };

  return (
    <Fragment>
      <div className="container">
        <h2 className="text-center mb-4">Your Cart</h2>
        <div className="cart-list">
          {cart.map((book, index) => (
            <div key={index} className="cart-item">{book.title}</div> 
          ))}
        </div>
      </div>

      {/* Render the books */}
      <div className="container book-container">
        {cart.map((book) => (
          <div key={book.book_id} className="book-card" onClick={() => showBookByID(book.book_id)}>
            <h3 className="book-title">{book.title}</h3>
            <p className="publication-info"><strong>Publication:</strong> {book.publication}</p>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default ShowCart;
