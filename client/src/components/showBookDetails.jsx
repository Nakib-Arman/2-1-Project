import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./showBookDetails.css";

const ShowBookDetails = () => {
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const { id } = useParams();

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

    getBookDetails();
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

  return (
    <Fragment>
      <div className="book-details-container">
        
        <h1 className="text-center head-color mb-5" style={{ fontSize: '50px' }}>Book Details</h1>
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
            <button className="btn btn-primary" onClick={(e) => addToCart(book.book_id, e)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ShowBookDetails;
