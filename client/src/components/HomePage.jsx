import React,{useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const {id} = useParams();

  const showBooks = () =>{
    navigate('/showBooks');
  }

  const addBook = () =>{
    navigate('/addBooks');
  }

  const MyProfile =() =>{
    navigate(`/myProfile/${id}`);
  }

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  }

  const handleDropdownItemClick = (action) => {
    if (action === 'viewBorrowRequests') {
      navigate(`/borrowRequests/${id}`);
    } else if (action === 'addAuthor') {
      // Example: navigate to the add author page
      navigate('/addAuthor');
    } else if (action === 'addPublisher') {
      // Example: navigate to the add publisher page
      navigate('/addPublisher');
    } else if (action === 'logOut'){
      navigate('/LogIn');
    }
  }

  return (
    <div className="app-container">
      <header className="header left-container">
        <div className="transparent-buttons">
          <button onClick={addBook}>Add New Book</button>
          <button onClick={showBooks}>Search Books</button>
          <button onClick={MyProfile} >My Profile</button>
          <div className="hamburger-icon" onClick={toggleDropdown}>
            <button>&#9776;</button>
          </div>
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={() => handleDropdownItemClick('viewBorrowRequests')}>View Borrow Requests</button>
              <button onClick={() => handleDropdownItemClick('addAuthor')}>Add Author</button>
              <button onClick={() => handleDropdownItemClick('addPublisher')}>Add Publisher</button>
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
    </div>
  );
};

export default HomePage;