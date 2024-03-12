import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import backgroundImage from "./HomePage.jpg";

const SearchPublishers = ({ setAuth }) => {
    const [publishers, setPublishers] = useState([]);
    const [searchedPublishers, setSearchedPublishers] = useState([]);
    const [name, setName] = useState("");
    const [isSearched, setIsSearched] = useState(false);

    let navigate = useNavigate();


    const getInfo2 = async () => {
        try {
            const publisher = await fetch(`http://localhost:5000/publishers/${name}`);
            const publisherData = await publisher.json();
            setIsSearched(true);
            setSearchedPublishers(publisherData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const goToPublisher = (publisher_id) => {
        navigate(`/booksofPublisher/${publisher_id}`);
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
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Publishers</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>

                <div className="container">
                    <form onSubmit={getInfo2} className="row search-form" style={{boxShadow:'0 0 10px black',position: 'fixed',zIndex: '500', top:'70px',left: '5%', width: '90%'}}>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Publisher Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th>Publication Name</th>
                            <th>Number of Books</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedPublishers.map((publisher) => {
                            return (
                                <tr key={publisher.publisher_id} className="table-row" style={{opacity: '0.9'}} onClick={() => goToPublisher(publisher.publisher_id)}>
                                    <td style={{borderLeft: '1px solid #111'}}>{publisher.publication_name}</td>
                                    <td style={{borderLeft: '1px solid #111'}}>{publisher.book_count}</td>
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

export default SearchPublishers;
