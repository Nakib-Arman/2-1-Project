import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShowCart.css";

const ShowCart = () => {
  const [cart, setCart] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  let navigate = useNavigate();

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

  const toggleBookSelection = (book_id) => {
    const updatedCart = cart.map(book => {
      if (book.book_id === book_id) {
        return {
          ...book,
          selected: !book.selected
        };
      }
      return book;
    });
    setCart(updatedCart);
  };

  const deleteBookFromCart = async (book_id) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteBookFromCart/${book_id}`, {
        method: "POST",
        headers: {
          "token": localStorage.token,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete book from cart');
      }
      // Update the cart after deletion
      getBooksFromCart();
    } catch (err) {
      console.error(err.message);
    }
  };

  const showBookByID = (id) => {
    navigate(`/showBookDetails/${id}`);
  };

  const handleSubmitRequest = () => {
    console.log("Submit request button clicked");
  };

  return (
    <Fragment>
      <div className="container">
        <h2 className="text-center mb-4">Your Cart</h2>
        <table className="table mt-5">
          <thead>
            <tr>
              <th>TITLE</th>
              <th>PUBLICATION</th>
              <th>CATEGORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((book) => (
              <tr key={book.book_id} className={`table-row ${book.selected ? 'selected' : ''}`}>
                <td onClick={() => showBookByID(book.book_id)}>{book.title}</td>
                <td onClick={() => showBookByID(book.book_id)}>{book.publication}</td>
                <td onClick={() => showBookByID(book.book_id)}>{book.category}</td>
                <td>
                  <button onClick={() => deleteBookFromCart(book.book_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center">
          <button onClick={handleSubmitRequest} className="submit-button">Submit Request</button>
        </div>
      </div>
    </Fragment>
  );
};

export default ShowCart;
