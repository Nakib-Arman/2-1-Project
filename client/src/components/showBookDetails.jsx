import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link,Navigate } from "react-router-dom";
import "./showBookDetails.css";
import Footer from "./footer";
import blackImage from "./black.jpg";

const ShowBookDetails = ({ setAuth }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const { id } = useParams();
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [userType, setUserType] = useState([]);
  const [visible, setVisible] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/showBookDetails/${id}`);
        const jsonData = await response.json();
        setBook(jsonData[0]);
        setVisible(jsonData[0].is_visible);
        setAuthors(jsonData);
        setBackgroundImage(jsonData[0].image_url);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
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
    getUserType();
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

  const removeBook = async (id, e) => {
    e.stopPropagation();
    try {
      const body = { id };
      const response = await fetch("http://localhost:5000/removeBook", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        console.log("Removed book with ID", id);
        navigate('/showBooks');
      } else {
        console.error("Failed to remove book");
      }
    } catch (err) {
      console.error("Failed to remove book:", err.message);
    }
  }

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

  const restoreBook = async (id) => {
    try {
      const body = { id };
      const response = await fetch("http://localhost:5000/restoreBook", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        console.log("Restored book with ID", id);
        navigate('/showBooks');
      } else {
        console.error("Failed to restore book");
      }
    } catch (err) {
      console.error("Failed to restore book:", err.message);
    }
  }

  const handleBookClick = (bookId) => {
    navigate(`/showBookDetails/${bookId}`);
  };

  const containerStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: '100%',
    height: '100%',
    /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
  };

  const containerStyle2 = {
    backgroundImage: `url('${blackImage}')`,
    backgroundSize: '100%',
    height: '100%',
    /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
  };

  return (
    <Fragment>
      <div className="fixed-bg" style={{ ...containerStyle , opacity: '0.85'}}></div>
      <div className="fixed-bg2" style={{...containerStyle2}}></div>
      <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Book Details</h1>
      <h1 className="text-center" style={{ color: "white" }}>BIBLIOPHILE</h1>
      
      <div className="book-details-container">
        <h1 className="text-center mb-4" style={{ color: 'transparent' }}>
          Book Details
        </h1>
        <div className="book-details-grid">
          <div className="book-cover">
            {book && <img src={book.image_url} alt={book.title} />}
          </div>
          <div className="book-info" style={{opacity: '0.8'}}>
            <table className="table">
              <tbody>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>ID</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>{book?.book_id}</td>
                </tr>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>Title</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>{book?.title}</td>
                </tr>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>Category</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>
                    <Link to={`/booksofCategory/${book?.category}`} className="new-link">
                     {book?.category}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>Author</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>
                    <ul className="author-list">
                      {authors.map(author => (
                        <li key={author.author_id}>
                          <Link to={`/booksofAuthor/${author.author_id}`} className="new-link">
                            {author.author_name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>Publication</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>
                    <Link to={ `/booksofPublisher/${book?.publisher_id}`} className="new-link">
                    {book?.publication_name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>Shelf No</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>{book?.shelf_id}</td>
                </tr>
                <tr>
                  <td className="head-color" style={{border: '1px solid #333'}}>Copies Available</td>
                  <td className="data-color" style={{border: '1px solid #111'}}>{book?.copy}</td>
                </tr>
              </tbody>
            </table>
            {visible &&
              <div>
                {book?.copy == 0 &&
                  <button className="btn w-100" style={{ backgroundColor: "#0358b4", color: "white" }}>
                    Unavailable
                  </button>
                }
                {book?.copy > 0 &&
                  <button
                    onClick={(e) => addToCart(book.book_id, e)}
                    className="btn btn-primary w-100"
                  >
                    Add to Cart
                  </button>
                }
              </div>
            }
            {userType === 'staff' &&
              <div>
                {visible &&
                  <button
                    onClick={(e) => removeBook(book.book_id, e)}
                    className="btn deny-button w-100 mt-3"
                  >
                    Remove Book
                  </button>
                }
                {visible === false &&
                  <button
                    onClick={() => restoreBook(book.book_id)}
                    className="btn deny-button w-100 mt-3"
                  >
                    Restore Book
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>
      <div className="container mt-5" style={{ opacity: '0.9' }}>
        <h3 style={{ background: '#9b0500', color: 'white' }}>Related Books</h3>
        <Slider {...settings}>
          {relatedBooks.map((book) => (
            <div key={book.book_id} className="card2" onClick={() => handleBookClick(book.book_id)}>
              <div className="container">
                <div calss="row">
                  <div className="mb-2" style={{ height: '100%' }}>
                    <img src={book.image_url} alt={book.title} />
                  </div>
                  <div calss='card2-body'>
                    <h5 className="card-title book-title" style={{ color: '#dd0000' }}>{book.title}</h5>
                    <p className="card-text" style={{ color: 'white',fontSize:'14px' }}><strong>Publication:</strong> {book.publication_name}</p>
                    <p className="card-text" style={{ color: 'white',fontSize: '14px' }}><strong>Category:</strong> {book.category}</p>
                  </div>
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
