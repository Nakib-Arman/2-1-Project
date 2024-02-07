import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [TITLE, setTITLE] = useState("");
    const [CATEGORY, setCATEGORY] = useState("");
    const [AUTHOR, setAUTHOR] = useState(0);
    const [PUBLISHER, setPUBLISHER] = useState(0);
    const [SHELF_ID, setSHELF_ID] = useState(0);

    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch authors and publishers data from the backend
        const fetchAuthorsAndPublishers = async () => {
            try {
                const authorsResponse = await fetch("http://localhost:5000/authors");
                const publishersResponse = await fetch("http://localhost:5000/publishers");

                if (authorsResponse.ok && publishersResponse.ok) {
                    const authorsData = await authorsResponse.json();
                    const publishersData = await publishersResponse.json();

                    setAuthors(authorsData);
                    setPublishers(publishersData);
                } else {
                    console.error("Failed to fetch authors or publishers");
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchAuthorsAndPublishers();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const body = {TITLE,CATEGORY,AUTHOR: parseInt(AUTHOR),PUBLISHER: parseInt(PUBLISHER),SHELF_ID: parseInt(SHELF_ID)};
            const response = await fetch("http://localhost:5000/addBooks", {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify(body)});

            if (response.ok) {
                console.log("Book added successfully");
            } else {
                console.error("Failed to add book");
            }

            navigate('/addBooks');
        } catch (err) {
            console.error(err.message);
        }
    };

    const showAllBooks = () => {
        navigate('/showBooks');
    };

    return (
        <Fragment>
            <h1 className="text-center head-color">Add Book</h1>
            <div
                className="add-book-container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                }}
            >
                <form
                    className="login-container mt-5 mb-5"
                    onSubmit={submit}
                    style={{ width: '50%' }}
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
                        <label htmlFor="category" className="mt-3">
                            Category:
                        </label>
                        <input
                            type="text"
                            id="category"
                            className="form-control"
                            value={CATEGORY}
                            onChange={(e) => setCATEGORY(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="author" className="mt-3">
                            Author:
                        </label>
                        <select
                            id="author"
                            className="form-control"
                            value={AUTHOR}
                            onChange={(e) => setAUTHOR(e.target.value)}
                        >
                            <option value=""> Select Author </option>
                            {authors.map((author) => (
                                <option key={author.author_id} value={author.author_id}>
                                    {author.author_name}
                                </option>
                            ))}
                        </select>
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
                                <option key={publisher.publisher_id} value={publisher.publisher_id}>
                                    {publisher.publication_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="shelfId" className="mt-3">
                            Shelf ID:
                        </label>
                        <input
                            type="number"
                            id="shelfId"
                            className="form-control"
                            value={SHELF_ID}
                            onChange={(e) => setSHELF_ID(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success mt-3">Add</button>
                </form>
            </div>
            <div style={{ position: 'absolute', right: 10 }}>
                <button
                    className=" btn button-color mt-3"
                    onClick={showAllBooks}
                >
                    See All Books
                </button>
            </div>
        </Fragment>
    );
};

export default AddBook;