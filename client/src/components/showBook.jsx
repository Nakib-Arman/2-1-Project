import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./showBook.css"; // Import the provided CSS file

const ShowBook = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [categories, setCategories] = useState([]);

  let navigate = useNavigate();

  const getBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/showBooks");
      const categoryResponse = await fetch("http://localhost:5000/categories");
      const jsonData = await response.json();
      const categoryData = await categoryResponse.json();
      setBooks(jsonData);
      setCategories(categoryData);
    } catch (err) {
      console.error(err.message);
    }
  }

  const searchBooks = async () => {
    try {
      let url;
      if (category !== "") {
        url = `http://localhost:5000/showBooksByCategory?title=${title}&category=${category}`;
      } else {
        url = `http://localhost:5000/searchBooks/${title}`;
      }
      const response = await fetch(url);
      const jsonData = await response.json();
      setSearchedBooks(jsonData);
      setIsSearched(true);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    searchBooks();
  }, [title, category]);

  const showBookByID = (id) => {
    navigate(`/showBookDetails/${id}`);
  }

  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center head-color mb-4">Search Books</h1>
        <form onSubmit={searchBooks} className="row search-form">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((ct) => (
                <option key={ct.category} value={ct.category}>{ct.category}</option>
              ))}
            </select>
          </div>
          {/* No separate search button */}
        </form>
      </div>

      <div className="container mt-5">
        <div className="row">
          {isSearched
            ? searchedBooks.map((book) => (
              <div key={book.book_id} className="col-md-4 mb-4">
                <div className="card h-100 book-card" onClick={() => showBookByID(book.book_id)} style={{ cursor: "pointer" }}>
                  <div className="card-body">
                    <h5 className="card-title book-title">{book.title}</h5>
                    <p className="card-text"><strong>Publication:</strong> {book.publication}</p>
                    <p className="card-text"><strong>Category:</strong> {book.category}</p>
                  </div>
                </div>
              </div>
            ))
            : books.map((book) => (
              <div key={book.book_id} className="col-md-4 mb-4">
                <div className="card h-100 book-card" onClick={() => showBookByID(book.book_id)} style={{ cursor: "pointer" }}>
                  <div className="card-body">
                    <h5 className="card-title book-title">{book.title}</h5>
                    <p className="card-text"><strong>Publication:</strong> {book.publication}</p>
                    <p className="card-text"><strong>Category:</strong> {book.category}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ShowBook;
