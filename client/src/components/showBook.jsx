import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShowBook = () => {

  const [books, setbooks] = useState([]);
  const [title, settitle] = useState("");
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  let navigate = useNavigate();

  const getBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/showBooks");
      const jsonData = await response.json();
      setbooks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  const searchBooks = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/searchBOoks/${title}`);
      const jsonData = await response.json();
      setSearchedBooks(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);
  console.log(books);

  const showBookByID = (id) => {
    navigate(`/showBookDetails/${id}`);
  }

  const toggleIsSearched =() =>{
    if(title!="") setIsSearched(true);
    else setIsSearched(false);
  }

  return (<Fragment>
    <header className="head-color">
    <form onSubmit={searchBooks} className="search-form mx-3" >
      <div>
        <label htmlFor="title" className="mt-3">Title:</label>
        <input type="text" id="title" className="form-control " style={{width: '300px'}} value={title} onChange={(e) => settitle(e.target.value)} />
      </div>
      <button className="btn button-color mt-3 mb-3" style={{background: 'rgb(233, 229, 229)',color: '#333'}} onClick={toggleIsSearched}>Search</button>
    </form>
    </header>

    <table class="table mt-5">
      <thead>
        <tr>
          <th>TITLE</th>
          <th>PUBLICATION</th>
          <th>CATEGORY</th>
        </tr>
      </thead>
      <tbody>
        {isSearched
          ? searchedBooks.map((book) => (
            <tr onClick={() => showBookByID(book.book_id)} key={book.book_id} className="table-row">
              <td>{book.title}</td>
              <td>{book.publication}</td>
              <td>{book.category}</td>
            </tr>
          ))
          : books.map(book => (
            <tr onClick={() => showBookByID(book.book_id)} key={book.book_id} className="table-row">
              <td>{book.title}</td>
              <td>{book.publication}</td>
              <td>{book.category}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </Fragment>);
};

export default ShowBook; 