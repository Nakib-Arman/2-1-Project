import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowBookDetails = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const { id } = useParams();

  const getBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/showBookDetails/${id}`);
      const jsonData = await response.json();
      setBooks(jsonData[0]);
      setAuthors(jsonData);
    } catch (err) {
      console.error("Failed to fetch book details");
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <Fragment>
      <div className="book-details-container">
        <h1 className="text-center head-color mb-5" style={{ fontSize: '50px' }}>Book Details</h1>
        <table className="table mx-auto">
          <tbody>
            <tr className="text-center">
              <td className="head-color">ID</td>
              <td className="table-row-2">{books.book_id}</td>
            </tr>
            <tr className="text-center">
              <td className="head-color">Title</td>
              
              <td className="table-row-2">{books.title}</td>
            </tr>
            <tr className="text-center">
              <td className="head-color">Category</td>
              
              <td className="table-row-2">{books.category}</td>
            </tr>
            <tr className="text-center mt-3">
              <td className="head-color">Author</td>
              
              <td className="table-row-2">
                <ul className="author-list">
                  {authors.map(author => (
                    <li key={author.author_id}>{author.author_name}</li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr className="text-center mt-3">
              <td className="head-color">Publication</td>
              
              <td className="table-row-2">{books.publication_name}</td>
            </tr>
            <tr className="text-center mt-3">
              <td className="head-color">Shelf No</td>
              
              <td className="table-row-2">{books.shelf_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default ShowBookDetails;