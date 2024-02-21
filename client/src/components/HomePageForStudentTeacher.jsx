// HomePageForStudentTeacher.js
import React, { Fragment, useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePageForStudentTeacher = ({ setAuth }) => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [topPriorityBooks, setTopPriorityBooks] = useState([]);
  const [userType, setUserType] = useState(null);

  const getPriorityBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/showBooks");
      const jsonData = await response.json();
      setTopPriorityBooks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getUserType = async () => {
    try {
      const response = await fetch("http://localhost:5000/getUserType", {
        method: "GET",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      setUserType(jsonData[0].user_type);
    } catch (err) {
      console.error(err.message);
    }
  };

  const showBooks = () => {
    navigate("/showBooks");
  };

  const MyProfile = () => {
    navigate("/myProfile");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleDropdownItemClick = (action) => {
    if (action === "logOut") {
      setAuth(false);
    }
  };

  const NextArrow = ({ onClick }) => (
    <button className="custom-slick-arrow custom-slick-next" onClick={onClick}>
      {">"}
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="custom-slick-arrow custom-slick-prev" onClick={onClick}>
      {"<"}
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
    nextArrow: <NextArrow style={{ fontSize: "24px", color: "#000" }} />,
    prevArrow: <PrevArrow style={{ fontSize: "24px", color: "#000" }} />,
  };

  useEffect(() => {
    getPriorityBooks();
    getUserType();
  }, []);

  return (
    <Fragment>
      <div className="app-container">
        <header className="header left-container fixed-header" style={{ height: '70px' }}>
          <div className="transparent-buttons">
            <button onClick={showBooks}>Search Books</button>
            <button onClick={MyProfile}>My Profile</button>
            <div className="hamburger-icon" onClick={toggleDropdown}>
              <button>&#9776;</button>
            </div>
            {isDropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={() => handleDropdownItemClick('logOut')} className="logout-button">Log Out</button>
              </div>
            )}
          </div>
        </header>
        <main className="main-content">
          <div className="welcome-container mt-5" style={{ marginBottom: '30px' }}>
            <h3 className="text-center mt-5" style={{ fontSize: '30px', fontFamily: "'Open Sans','Helvetica Neue'", color: '#555' }}>Welcome to</h3>
            <h1 className="text-center" style={{ fontSize: '100px', fontFamily: "'Open Sans','Helvetica Neue'", color: '#560' }}>BIBLIOPHILE</h1>
          </div>
        </main>
        <div className="container mt-5">
          <h2 style={{ background: '#f4f4f4', color: '#333' }}>Top Priorities</h2>
          <Slider {...settings}>
            {topPriorityBooks.map((book) => (
              <div key={book.book_id} className="book-slider-item">
                <div className="card h-100" style={{ cursor: "pointer" }}>
                  <div className="card-body">
                    <h5 className="card-title book-title">{book.title}</h5>
                    <p className="card-text"><strong>Publication:</strong> {book.publication}</p>
                    <p className="card-text"><strong>Category:</strong> {book.category}</p>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-primary w-100">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </Fragment>
  );
};

export default HomePageForStudentTeacher;
