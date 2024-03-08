import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
import Footer from "./footer";

const AddBook = ({ setAuth }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [TITLE, setTITLE] = useState("");
  const [CATEGORY, setCATEGORY] = useState("");
  const [AUTHORS, setAUTHORS] = useState([]);
  const [PUBLISHER, setPUBLISHER] = useState(0);
  const [SHELF_ID, setSHELF_ID] = useState(0);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [edition, setEdition] = useState(1);
  const [copiesBought, setCopiesBought] = useState(0);
  const [coverImage, setCoverImage] = useState(null);


  const navigate = useNavigate();

  const fetchAuthorsAndPublishers = async () => {
    try {
      const authorsResponse = await fetch("http://localhost:5000/authors");
      const publishersResponse = await fetch(
        "http://localhost:5000/publishers"
      );
      const categoryResponse = await fetch("http://localhost:5000/categories");
      const shelfResponse = await fetch("http://localhost:5000/shelves");

      if (
        authorsResponse.ok &&
        publishersResponse.ok &&
        categoryResponse.ok &&
        shelfResponse.ok
      ) {
        const authorsData = await authorsResponse.json();
        const publishersData = await publishersResponse.json();
        const categoryData = await categoryResponse.json();
        const shelfData = await shelfResponse.json();

        setAuthors(authorsData);
        setPublishers(publishersData);
        setCategories(categoryData);
        setShelves(shelfData);
      } else {
        console.error(
          "Failed to fetch authors, publishers, categories, or shelves"
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAuthorsAndPublishers();
    getUserType();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        TITLE,
        CATEGORY,
        AUTHORS: AUTHORS.map((authorId) => parseInt(authorId)),
        PUBLISHER: parseInt(PUBLISHER),
        SHELF_ID: parseInt(SHELF_ID),
        edition,
        copiesBought,
        coverImage
      };

      const response = await fetch("http://localhost:5000/addBooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log("Book added successfully");
        setTITLE("");
        setCATEGORY("");
        setAUTHORS([]);
        setPUBLISHER(0);
        setSHELF_ID(0);
        setEdition(1);
        setCopiesBought(0);
        setCoverImage("");
      } else {
        console.error("Failed to add book");
      }

      navigate("/addBooks");
    } catch (err) {
      console.error(err.message);
    }
  };

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const [showShelfForm, setShowShelfForm] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newPublisher, setNewPublisher] = useState("");
  const [newShelf, setNewShelf] = useState(0);
  const [userType, setUserType] = useState(null);

  const addCategory = async () => {
    console.log(newCategory);
    const body = { newCategory };
    const response = await fetch("http://localhost:5000/addCategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchAuthorsAndPublishers();
    setShowCategoryForm(false);
  };

  const addAuthor = async () => {
    console.log(newAuthor);
    const body = { newAuthor };
    const response = await fetch("http://localhost:5000/addAuthor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchAuthorsAndPublishers();
    setShowAuthorForm(false);
  };

  const addPublisher = async () => {
    console.log(newPublisher);
    const body = { newPublisher };
    const response = await fetch("http://localhost:5000/addPublisher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchAuthorsAndPublishers();
    setShowPublisherForm(false);
  };

  const addShelf = () => {
    console.log(newShelf);
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
      navigate('/viewSuggestedBooks')
    } else if (action === 'logOut') {
      localStorage.removeItem("token");
      setAuth(false);
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

  return (
    <Fragment>
      <div className="page-container">
        <header className="fixed-header" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5A1917' }}>

          <div className="transparent-buttons" style={{ width: '100%' }}>
            <button className="btn" onClick={() => { navigate("/") }} style={{ position: 'absolute', left: '10px' }}>Home</button>
            <div style={{ alignContent: 'center', width: '100%' }}>
              {userType === 'staff' &&
                <button className="btn" style={{ backgroundColor: '#f7e8e8', color: '#5A1917' }}>Add New Book</button>
              }
              <button className="btn" onClick={showBooks}>Search Books</button>
              <button className="btn" onClick={MyProfile}>My Profile</button>
              <button className="btn" onClick={goToCart}>Cart</button>
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
                  <div style={{ alignContent: 'right' }}>
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

        <h1 className="text-center mb-4" style={{ color: "white" }}>
          BIBLIOPHILE
        </h1>
        <div
          className="add-book-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <form
            className="login-container mt-5 mb-5"
            onSubmit={submit}
            style={{ width: "50%" }}
          >
            <div>
              <label htmlFor="title" className="mt-3">
                Title:
              </label>
              <input
                type="text"
                id="title"
                className="form-control "
                value={TITLE}
                onChange={(e) => setTITLE(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="edition" className="mt-3">
                Edition:
              </label>
              <input
                type="number"
                id="edition"
                className="form-control"
                value={edition}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (!isNaN(newValue) && newValue > 0) {
                    setEdition(newValue);
                  } else {
                    // If the input is not a valid number greater than 0,
                    // you can choose to handle it in some way, such as
                    // displaying an error message or resetting the input value.
                    // Here, we're resetting the input value to an empty string.
                    setEdition("");
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="category" className="mt-3">
                Category:
              </label>
              <select
                id="Category"
                className="form-control"
                value={CATEGORY}
                onChange={(e) => setCATEGORY(e.target.value)}
              >
                <option value=""> Select Category </option>
                {categories.map((ct) => (
                  <option key={ct.category} value={ct.category}>
                    {ct.category}
                  </option>
                ))}
              </select>
              <label
                className="text-center text-button"
                onClick={() => setShowCategoryForm(true)}
              >
                Add New Category
              </label>

              <Modal
                show={showCategoryForm}
                onHide={() => setShowCategoryForm(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={addCategory}>
                    <div>
                      <label htmlFor="category">Category Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">
                      Add
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="button-color"
                    variant="secondary"
                    onClick={() => setShowCategoryForm(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <label htmlFor="author" className="mt-3">
                Authors:
              </label>
              <Select
                isMulti
                options={authors.map((author) => ({
                  value: author.author_id,
                  label: author.author_name,
                }))}
                value={AUTHORS.map((authorId) => ({
                  value: authorId,
                  label: authors.find((author) => author.author_id === authorId)
                    .author_name,
                }))}
                onChange={(selectedOptions) =>
                  setAUTHORS(selectedOptions.map((option) => option.value))
                }
              />
              <label
                className="text-center text-button"
                onClick={() => setShowAuthorForm(true)}
              >
                Add New Author
              </label>
              <Modal
                show={showAuthorForm}
                onHide={() => setShowAuthorForm(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add New Author</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={addAuthor}>
                    <div>
                      <label htmlFor="author">Author Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">
                      Add
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="button-color"
                    variant="secondary"
                    onClick={() => setShowAuthorForm(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <label htmlFor="publisher" className="mt-3">
                Publisher:
              </label>
              <select
                id="publisher"
                className="form-control"
                value={PUBLISHER}
                onChange={(e) => setPUBLISHER(e.target.value)}
              >
                <option value=""> Select Publisher </option>
                {publishers.map((publisher) => (
                  <option
                    key={publisher.publisher_id}
                    value={publisher.publisher_id}
                  >
                    {publisher.publication_name}
                  </option>
                ))}
              </select>
              <label
                className="text-center text-button"
                onClick={() => setShowPublisherForm(true)}
              >
                Add New Publisher
              </label>
              <Modal
                show={showPublisherForm}
                onHide={() => setShowPublisherForm(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add New Publication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={addPublisher}>
                    <div>
                      <label htmlFor="publisher">Publication Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPublisher}
                        onChange={(e) => setNewPublisher(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">
                      Add
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="button-color"
                    variant="secondary"
                    onClick={() => setShowPublisherForm(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <label htmlFor="shelf" className="mt-3">
                Shelf:
              </label>
              <select
                id="Shelf"
                className="form-control"
                value={SHELF_ID}
                onChange={(e) => setSHELF_ID(e.target.value)}
              >
                <option value=""> Select Shelf </option>
                {shelves.map((shelf) => (
                  <option key={shelf.shelf_id} value={shelf.shelf_id}>
                    {shelf.shelf_id}
                  </option>
                ))}
              </select>
              <label
                className="text-center text-button"
                onClick={() => setShowShelfForm(true)}
              >
                Add New Shelf
              </label>
              <Modal
                show={showShelfForm}
                onHide={() => setShowShelfForm(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add New Shelf</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={addShelf}>
                    <div>
                      <label htmlFor="shelf">Shelf No:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newShelf}
                        onChange={(e) => setNewShelf(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">
                      Add
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="button-color"
                    variant="secondary"
                    onClick={() => setShowShelfForm(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <label htmlFor="copiesBought" className="mt-3">
                Copies Bought:
              </label>
              <input
                type="number"
                id="copiesBought"
                className="form-control"
                value={copiesBought}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (!isNaN(newValue) && newValue > 0) {
                    setCopiesBought(newValue);
                  } else {
                    // If the input is not a valid number greater than 0,
                    // you can choose to handle it in some way, such as
                    // displaying an error message or resetting the input value.
                    // Here, we're resetting the input value to an empty string.
                    setCopiesBought("");
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="url" className="mt-3">
                Cover Page URL:
              </label>
              <input
                type="text"
                id="url"
                className="form-control "
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
            <button className="btn btn-success mt-3">Add</button>
          </form>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default AddBook;
