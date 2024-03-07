import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import "./showBookDetails.css";
import Footer from "./footer";

const ShowBookDetails = ({ setAuth }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const { id } = useParams();
  const [relatedBooks, setRelatedBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/showBookDetails/${id}`);
        const jsonData = await response.json();
        setBook(jsonData[0]);
        setAuthors(jsonData);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      }
    };

    const getRelatedBooks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/showRelatedBooks/${id}`);
        const jsonData = await response.json();
        setRelatedBooks(jsonData);
      } catch (err) {
        console.error("Failed to fetch related books:", err);
      }
    };

    getBookDetails();
    getRelatedBooks();
  }, [id]);

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

  const NextArrow = ({ onClick }) => (
    <button className="custom-slick-arrow custom-slick-next" onClick={onClick}>
      {'>'}
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="custom-slick-arrow custom-slick-prev" onClick={onClick}>
      {'<'}
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow style={{ fontSize: '24px', color: '#000' }} />,
    prevArrow: <PrevArrow style={{ fontSize: '24px', color: '#000' }} />,
  };

  const goToCart = () => {
    navigate("/showCart");
  };

  const addBook = () => {
    navigate('/addBooks');
  }

  const showBooks = () => {
    navigate('/showBooks');
  }

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  }

  async function MyProfile() {
    navigate('/myProfile');
    //e.preventDefault();
    /*try {
      const response = await fetch("http://localhost:5000/getID",{ method: "GET", headers: {token: localStorage.token, "Content-Type": "application/json"}});
      const user = await response.json();

    } catch (err) {
      console.error(err.message);
    }*/
  }


  const handleDropdownItemClick = (action) => {
    if (action === 'viewBorrowRequests') {
      navigate('/borrowRequests');
    } else if (action === 'addAuthor') {
      navigate('/addAuthor');
    } else if (action === 'addPublisher') {
      navigate('/addPublisher');
    }
  }

  // const addToCart = async (id, e) => {
  //   e.stopPropagation();
  //   try {
  //     const body = { book_id: id };
  //     const response = await fetch("http://localhost:5000/addToCart", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: localStorage.token,
  //       },
  //       body: JSON.stringify(body),
  //     });
  //     if (response.ok) {
  //       console.log("Added book with ID", id, "to cart");
  //     } else {
  //       console.error("Failed to add book to cart");
  //     }
  //   } catch (err) {
  //     console.error("Failed to add book to cart:", err.message);
  //   }
  // };

  // const goToCart = () => {
  //   navigate("/showCart");
  // };

  const goToHome = () => {
    navigate("/");
  };


  return (
    <Fragment>
      <header className="fixed-header" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5A1917' }}>

<div className="transparent-buttons">
  <button className="btn" onClick={()=>{navigate("/")}}  >Home</button>
  <button className="btn" onClick={addBook} style={{ position: 'absolute', left: '400px' }}>Add New Book</button>
  <button className="btn" onClick={showBooks} style={{ position: 'absolute', left: '540px' }}>Search Books</button>
  <button className="btn" onClick={MyProfile} style={{ position: 'absolute', left: '670px' }}>My Profile</button>
  <button className="btn" onClick={goToCart} style={{ position: 'absolute', left: '770px' }}>Cart</button>
  <div className="hamburger-icon" onClick={toggleDropdown} style={{ position: 'absolute', right: '10px' }}>
    <button>&#9776;</button>
  </div>
  {isDropdownVisible && (
    <div className="dropdown-menu" style={{ opacity: 0.9, border: '1px solid black',position: 'absolute', left:'910px' ,width: '300px'}}>
      <button onClick={() => handleDropdownItemClick('viewBorrowRequests')} style={{ width: '90%', textAlign: 'right' }}><b>View Borrow Requests</b></button>
      <button onClick={() => handleDropdownItemClick('addAuthor')} style={{ width: '90%', textAlign: 'right' }}><b>Add Author</b></button>
      <button onClick={() => handleDropdownItemClick('addPublisher')} style={{ width: '90%', textAlign: 'right' }}><b>Add Publisher</b></button>
      <button onClick={() => handleDropdownItemClick('logOut')} className="logout-button" style={{ width: '90%', textAlign: 'right' }}><b>Log Out</b></button>
    </div>
  )}
</div>
</header>
      {/* <div className="head-color fixed-header">
        <h1 className="text-center">Book Details</h1>
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
      </div> */}
      <div className="book-details-container">
      <h1 className="text-center mb-4" style={{ color: 'white' }}>
        Book Details
      </h1>
        <div className="book-details-grid">
          <div className="book-cover">
            {book && <img src={book.image_url} alt={book.title} />}
          </div>
          <div className="book-info">
            <table className="table">
              <tbody>
                <tr>
                  <td className="head-color">ID</td>
                  <td>{book?.book_id}</td>
                </tr>
                <tr>
                  <td className="head-color">Title</td>
                  <td>{book?.title}</td>
                </tr>
                <tr>
                  <td className="head-color">Category</td>
                  <td>{book?.category}</td>
                </tr>
                <tr>
                  <td className="head-color">Author</td>
                  <td>
                    <ul className="author-list">
                      {authors.map(author => (
                        <li key={author.author_id}>{author.author_name}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="head-color">Publication</td>
                  <td>{book?.publication_name}</td>
                </tr>
                <tr>
                  <td className="head-color">Shelf No</td>
                  <td>{book?.shelf_id}</td>
                </tr>
                <tr>
                  <td className="head-color">Copies Available</td>
                  <td>{book?.copy}</td>
                </tr>
              </tbody>
            </table>
            {book?.copy==0 &&
                  <button className="btn w-100" style={{backgroundColor: "#0358b4",color: "white"}}>
                    Unavailable  
                  </button>
                  }
                  {book?.copy>0 &&
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
      <div className="container mt-5">
          <h3 style={{ background: '#555', color: 'white' }}>Related Books</h3>
          <Slider {...settings}>
            {relatedBooks.map((book) => (
              <div key={book.book_id} className="book-slider-item" style={{backgroundColor: '#333'}}>
                <div className="card h-100" style={{ cursor: "pointer" }}>
                  <div className="card-body">
                    <h5 className="card-title book-title"><i>{book.title}</i></h5>
                    <p className="card-text"><strong>Publication:</strong> {book.publication_name}</p>
                    <p className="card-text"><strong>Category:</strong> {book.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <Footer />
    </Fragment>
  );
}

export default ShowBookDetails;
