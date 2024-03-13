import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import backgroundImage from "./HomePage.jpg";

const SearchCategories = ({ setAuth }) => {
    const [categories, setCategories] = useState([]);
    const [searchedCategories, setSearchedCategories] = useState([]);
    const [name, setName] = useState("");
    const [isSearched, setIsSearched] = useState(false);

    let navigate = useNavigate();


    const getInfo2 = async () => {
        try {
            const category = await fetch(`http://localhost:5000/categories/${name}`);
            const categoryData = await category.json();
            setIsSearched(true);
            setSearchedCategories(categoryData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const goToCategory = (category) => {
        navigate(`/booksofCategory/${category}`);
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
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Categories</h1>
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
                            <th>Category</th>
                            <th>Number of Books</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedCategories.map((category) => {
                            return (
                                <tr key={category.category} className="table-row" style={{opacity: '0.9'}} onClick={() => goToCategory(category.category)}>
                                    <td style={{borderLeft: '1px solid #111'}}>{category.category}</td>
                                    <td style={{borderLeft: '1px solid #111'}}>{category.book_count}</td>
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

export default SearchCategories;
