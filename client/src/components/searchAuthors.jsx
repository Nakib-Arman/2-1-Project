import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

const SearchAuthors = ({ setAuth }) => {
    const [authors, setAuthors] = useState([]);
    const [searchedAuthors, setSearchedAuthors] = useState([]);
    const [name, setName] = useState("");
    const [isSearched, setIsSearched] = useState(false);

    let navigate = useNavigate();

    const getInfo = async () => {
        try {
            const author = await fetch("http://localhost:5000/authors2");
            const authorData = await author.json();
            setAuthors(authorData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getInfo2 = async () => {
        try {
            const author = await fetch(`http://localhost:5000/authors/${name}`);
            const authorData = await author.json();
            setIsSearched(true);
            setSearchedAuthors(authorData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getInfo();
    }, []);

    useEffect(() => {
        getInfo2();
    }, [name]);

    return (
        <Fragment>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Authors</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>

                <div className="container">
                    <form onSubmit={getInfo2} className="row search-form">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Author Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th>Author Name</th>
                            <th>Number of Books</th>
                        </tr>
                    </thead>
                    <tbody>
                        {console.log(authors)}
                        {searchedAuthors.map((author2) => {
                            console.log("Author:", author2); // Log the author object
                            return (
                                <tr key={author2.author_id} className="table-row">
                                    <td>{author2.author_name}</td>
                                    <td>{author2.book_count}</td>
                                </tr>
                            );
                        })}
                    </tbody>


                </table>
            </div>
            <Footer />
        </Fragment>
    );
};

export default SearchAuthors;
