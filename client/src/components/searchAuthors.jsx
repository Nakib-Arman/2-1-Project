import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import backgroundImage from "./HomePage.jpg";

const SearchAuthors = ({ setAuth }) => {
    const [authors, setAuthors] = useState([]);
    const [searchedAuthors, setSearchedAuthors] = useState([]);
    const [name, setName] = useState("");
    const [isSearched, setIsSearched] = useState(false);

    let navigate = useNavigate();


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

    const goToAuthor = async(author_id) => {
        navigate(`/booksofAuthor/${author_id}`);
    }

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
      };

    useEffect(() => {
        getInfo2();
    }, [name]);

    return (
        <Fragment>
            <div className="fixed-bg" style={{ ...containerStyle }}></div>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Authors</h1>
                <h1 className="text-center mb-5" style={{ color: "transparent" }}>BIBLIOPHILE</h1>
                <h1 className="text-center mb-5" style={{ color: "transparent" }}>BIBLIOPHILE</h1>

                <div className="container">
                    <form onSubmit={getInfo2} className="row search-form" style={{boxShadow:'0 0 10px black',position: 'fixed',zIndex: '500', top:'70px',left: '5%', width: '90%'}}>
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
                        {searchedAuthors.map((author) => {
                            console.log("Author:", author); // Log the author object
                            return (
                                <tr key={author.author_id} className="table-row" style={{opacity: '0.9'}} onClick={() => goToAuthor(author.author_id)}>
                                    <td style={{borderLeft: '1px solid #111'}}>{author.author_name}</td>
                                    <td style={{borderLeft: '1px solid #111'}}>{author.book_count}</td>
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
