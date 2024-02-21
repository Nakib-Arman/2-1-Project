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
      getBooksFromCart();
    } catch (err) {
      console.error(err.message);
    }
  };

  const showBookByID = (id) => {
    navigate(`/showBookDetails/${id}`);
  };

  const handleSubmitRequest = async (book_id) => {
    try {
      const selectedBook = cart.find(book => book.book_id === book_id);

      const existRequest = await fetch(`http://localhost:5000/checkRequest/${book_id}`,{ method: "GET", headers: {token: localStorage.token, "Content-Type": "application/json"}});
      console.log(existRequest);
      const existRequestData = await existRequest.json();
      if (existRequestData.length>0) {
        alert("Book already requested");
      }
      else {
        const requestID = await fetch(`http://localhost:5000/userRequest/${book_id}`, {
          method: "POST",
          headers: {
            "token": localStorage.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(selectedBook)
        });
        const requestIDData = await requestID.json(); // Await the JSON promise
        //console.log(requestIDData);
        const response2 = await fetch(`http://localhost:5000/userBorrowRelation/${book_id}`, {
          method: "POST",
          headers: {
            "token": localStorage.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(selectedBook)
        });
        if (response2.length>0) {
          //console.alert("Book Already Requested");
          console.log("Book already requested");
        }

        const response3 = await fetch(`http://localhost:5000/requestBorrowRelation?requestID=${requestIDData}&book_id=${book_id}`, {
          method: "POST",
          headers: {
            "token": localStorage.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(selectedBook)
        });


        //const jsonData = await requestID.json();


        getBooksFromCart();
      }
    } catch (err) {
      console.error(err.message);
    }
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
              <th>Submit Request</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((book) => (
              <tr key={book.book_id} className={`table-row ${book.selected ? 'selected' : ''}`}>
                <td onClick={() => showBookByID(book.book_id)}>{book.title}</td>
                <td onClick={() => showBookByID(book.book_id)}>{book.publication}</td>
                <td onClick={() => showBookByID(book.book_id)}>{book.category}</td>
                <td>
                  <button className="btn deny-button" onClick={() => deleteBookFromCart(book.book_id)}>Remove From Cart</button>
                </td>
                <td>
                  <button className="btn btn-success" onClick={() => { handleSubmitRequest(book.book_id); deleteBookFromCart(book.book_id); }}>Submit Request</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ShowCart;
