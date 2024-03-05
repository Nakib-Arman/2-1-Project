import React, { Fragment, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./footer";
import image from './image.jpg';

const HomePage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [topPriorityBooks, setTopPriorityBooks] = useState([]);
  const [recentSearchedBooks, setRecentSearchedBooks] = useState([]);
  const [userType, setUserType] = useState(null);

  const getPriorityBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/showBooks");
      const jsonData = await response.json();
      setTopPriorityBooks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  const getRecentSearchedBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/showBooks");
      const jsonData = await response.json();
      setRecentSearchedBooks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  const getUserType = async () => {
    try {
      const response = await fetch("http://localhost:5000/getUserType", {
        method: "GET",
        headers: { token: localStorage.token, "Content-Type": "application/json" }
      });
      const jsonData = await response.json();
      setUserType(jsonData[0].user_type);
      console.log(jsonData[0].user_type);
    } catch (err) {
      console.error(err.message);
    }
  }



  const showBooks = () => {
    navigate('/showBooks');
  }

  const addBook = () => {
    navigate('/addBooks');
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

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  }

  const handleDropdownItemClick = (action) => {
    if (action === 'viewBorrowRequests') {
      navigate('/borrowRequests');
    } else if (action === 'addAuthor') {
      navigate('/addAuthor');
    } else if (action === 'addPublisher') {
      navigate('/addPublisher');
    } else if (action === 'logOut') {
      setAuth(setAuth);
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

  const handleBookClick = (bookId) => {
    navigate(`/showBookDetails/${bookId}`);
  };




  useEffect(() => {
    getPriorityBooks();
    getRecentSearchedBooks();
    getUserType();
    // Attach the scroll event listener

  }, []);

  return (
    <Fragment>
      <div className="page-container">
        <header className="header left-container fixed-header" style={{ height: '70px' }}>

          <div className="transparent-buttons">
            <button onClick={addBook}>Add New Book</button>
            <button onClick={showBooks}>Search Books</button>
            <button onClick={MyProfile} >My Profile</button>
            <button>Cart</button>
            <div className="hamburger-icon" onClick={toggleDropdown}>
              <button>&#9776;</button>
            </div>
            {isDropdownVisible && (
              <div className="dropdown-menu" style={{ opacity: 0.4 }}>
              <button onClick={() => handleDropdownItemClick('viewBorrowRequests')} style={{ width: '100%', textAlign: 'right' }}><b>View Borrow Requests</b></button>
              <button onClick={() => handleDropdownItemClick('addAuthor')} style={{ width: '100%', textAlign: 'right' }}><b>Add Author</b></button>
              <button onClick={() => handleDropdownItemClick('addPublisher')} style={{ width: '100%', textAlign: 'right' }}><b>Add Publisher</b></button>
              <button onClick={() => handleDropdownItemClick('logOut')} className="logout-button" style={{ width: '100%', textAlign: 'right' }}><b>Log Out</b></button>
            </div>
            
            )}
          </div>
        </header>
        <main className="image-container mt-5" style={{ height: '70vh', position: 'relative' }}>
          <img src={image} alt="Full Screen Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div>
            <h1 className="text-overlay" style={{
              fontSize: '50px',
              fontFamily: "'Open Sans','Helvetica Neue'",
              color: 'white',
              position: 'relative',
              bottom: '180px',
              left: '180px',
            }}>
              BIBLIOPHILE
            </h1>
            <h1 className="text-overlay" style={{
              fontSize: '20px',
              fontFamily: "'Open Sans','Helvetica Neue'",
              color: 'white',
              position: 'relative',
              bottom: '210px',
              left: '155px',
            }}>
              A Library Management Website
            </h1>
            <h1 className="text-overlay" style={{
              fontSize: '20px',
              fontFamily: "'Open Sans','Helvetica Neue'",
              color: 'white',
              position: 'relative',
              bottom: '230px',
              left: '180px',
            }}>
              _______________________________
            </h1>
          </div>

        </main>
        <div className="container mt-5">
          <h3 style={{ background: '#555', color: 'white' }}>Top Priorities</h3>
          <Slider {...settings}>
            {topPriorityBooks.map((book) => (
              <div key={book.book_id} className="book-slider-item" style={{ backgroundColor: '#333' }} onClick={() => handleBookClick(book.book_id)}>
                <div className="card h-100" style={{ cursor: "pointer" }}>
                  <div className="card-body">
                    <h5 className="card-title book-title">{book.title}</h5>
                    <p className="card-text"><strong>Publication:</strong> {book.publication_name}</p>
                    <p className="card-text"><strong>Category:</strong> {book.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="container mt-5">
          <h3 style={{ background: '#555', color: 'white' }}>Recently Searched</h3>
          <Slider {...settings}>
            {recentSearchedBooks.map((book) => (
              <div key={book.book_id} className="book-slider-item" style={{ backgroundColor: '#333' }} onClick={() => handleBookClick(book.book_id)}>
                <div className="card h-100" style={{ cursor: "pointer" }}>
                  <div className="card-body">
                    <h5 className="card-title book-title">{book.title}</h5>
                    <p className="card-text"><strong>Publication:</strong> {book.publication_name}</p>
                    <p className="card-text"><strong>Category:</strong> {book.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <Footer/>
    </Fragment>
  );
};

export default HomePage;