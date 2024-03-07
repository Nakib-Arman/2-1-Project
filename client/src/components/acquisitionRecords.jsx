import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import "./ShowCart.css";

const AcquisitionRecords = ({ setAuth }) => {
    const [books, setBooks] = useState([]);

    let navigate = useNavigate();

    const getInfo = async () => {
        try {
            const response = await fetch("http://localhost:5000/getAcquisitionRecord");
            const jsonData = await response.json();
            setBooks(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const showBookByID = (id) => {
        navigate(`/showBookDetails/${id}`);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    useEffect(() => {
        getInfo();
    },[]);

    return (
        <Fragment>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Acquisition Records</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                
                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Publication</th>
                            <th>Date Bought</th>
                            <th>Copies Bought</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.book_id} className={`table-row ${book.selected ? 'selected' : ''}`}>
                                <td onClick={() => showBookByID(book.book_id)}>{book.title}</td>
                                <td onClick={() => showBookByID(book.book_id)}>{book.publication_name}</td>
                                <td onClick={() => showBookByID(book.book_id)}>{formatDate(book.date_bought)}</td>
                                <td onClick={() => showBookByID(book.book_id)}>{book.copies_bought}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </Fragment>
    );
};

export default AcquisitionRecords;
