import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import "./ShowCart.css";

const ShowCart = ({ setAuth }) => {
  const [cart, setCart] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userType, setUserType] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    getBooksFromCart();
    getUserType();
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

      const existRequest = await fetch(`http://localhost:5000/checkRequest/${book_id}`, { method: "GET", headers: { token: localStorage.token, "Content-Type": "application/json" } });
      console.log(existRequest);
      const existRequestData = await existRequest.json();
      if (existRequestData.length > 0) {
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
        if (response2.length > 0) {
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

  return (
    <Fragment>
      <div className="page-container">
        {/* <h2 className="text-center mb-4">Your Cart</h2> */}
        <header className="fixed-header" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5A1917' }}>

          <div className="transparent-buttons" style={{ width: '100%' }}>
            <button className="btn" onClick={() => { navigate("/") }} style={{ position: 'absolute', left: '10px'}}>Home</button>
            <div style={{ alignContent: 'center', width: '100%' }}>
              {userType === 'staff' &&
                <button className="btn" onClick={addBook}>Add New Book</button>
              }
              <button className="btn" onClick={showBooks}>Search Books</button>
              <button className="btn" onClick={MyProfile}>My Profile</button>
              <button className="btn" style={{ backgroundColor: '#f7e8e8', color: '#5A1917' }}>Cart</button>
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
        <p style={{
          height: '30px',
        }}></p>
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
          {cart.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Your cart is empty.
                  </td>
                </tr>
              ) : (
            cart.map((book) => (
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
            ))
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </Fragment>
  );
};

export default ShowCart;
