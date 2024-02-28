import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';

const AddBook = () => {
    const [TITLE, setTITLE] = useState("");
    const [CATEGORY, setCATEGORY] = useState("");
    const [AUTHORS, setAUTHORS] = useState([]);
    const [PUBLISHER, setPUBLISHER] = useState(0);
    const [SHELF_ID, setSHELF_ID] = useState(0);

    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [shelves, setShelves] = useState([]);

    const navigate = useNavigate();


    const fetchAuthorsAndPublishers = async () => {
        try {
            const authorsResponse = await fetch("http://localhost:5000/authors");
            const publishersResponse = await fetch("http://localhost:5000/publishers");
            const categoryResponse = await fetch("http://localhost:5000/categories");
            const shelfResponse = await fetch("http://localhost:5000/shelves");

            if (authorsResponse.ok && publishersResponse.ok && categoryResponse.ok && shelfResponse.ok) {
                const authorsData = await authorsResponse.json();
                const publishersData = await publishersResponse.json();
                const categoryData = await categoryResponse.json();
                const shelfData = await shelfResponse.json();

                setAuthors(authorsData);
                setPublishers(publishersData);
                setCategories(categoryData);
                setShelves(shelfData);
            } else {
                console.error("Failed to fetch authors, publishers, categories, or shelves");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchAuthorsAndPublishers();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const body = {
                TITLE,
                CATEGORY,
                AUTHORS: AUTHORS.map(authorId => parseInt(authorId)),
                PUBLISHER: parseInt(PUBLISHER),
                SHELF_ID: parseInt(SHELF_ID)
            };

            const response = await fetch("http://localhost:5000/addBooks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                console.log("Book added successfully");
                setTITLE("");
                setCATEGORY("");
                setAUTHORS([]);
                setPUBLISHER(0);
                setSHELF_ID(0);
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

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showAuthorForm, setShowAuthorForm] = useState(false);
    const [showPublisherForm, setShowPublisherForm] = useState(false);
    const [showShelfForm, setShowShelfForm] = useState(false);

    const [newCategory, setNewCategory] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newPublisher, setNewPublisher] = useState("");
    const [newShelf, setNewShelf] = useState(0);

    const addCategory = async() => {
        console.log(newCategory);
        const body = {newCategory};
        const response = await fetch("http://localhost:5000/addCategory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        fetchAuthorsAndPublishers();
        setShowCategoryForm(false);
    }

    const addAuthor = async() => {
        console.log(newAuthor);
        const body = {newAuthor};
        const response = await fetch("http://localhost:5000/addAuthor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        fetchAuthorsAndPublishers();
        setShowAuthorForm(false);
    }

    const addPublisher = async() => {
        console.log(newPublisher);
        const body = {newPublisher};
        const response = await fetch("http://localhost:5000/addPublisher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        fetchAuthorsAndPublishers();
        setShowPublisherForm(false);
    }

    const addShelf = () => {
        console.log(newShelf);
    }


    return (
        <Fragment>
            <h1 className="text-center mb-4" style={{ color: "white" }}>BIBLIOPHILE</h1>
            <h1 className="text-center head-color fixed-header">Add Book</h1>
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
                        <select
                            id="Category"
                            className="form-control"
                            value={CATEGORY}
                            onChange={(e) => setCATEGORY(e.target.value)}
                        >
                            <option value=""> Select Category </option>
                            {categories.map((ct) => (
                                <option key={ct.category} value={ct.category}>
                                    {ct.category}
                                </option>
                            ))}
                        </select>
                        <label className="text-center text-button" onClick={() => setShowCategoryForm(true)}>
                            Add New Category
                        </label>

                        <Modal show={showCategoryForm} onHide={() => setShowCategoryForm(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={addCategory}>
                                    <div>
                                        <label htmlFor="category">Category Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3">Add</button>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="button-color" variant="secondary" onClick={() => setShowCategoryForm(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div>
                        <label htmlFor="author" className="mt-3">
                            Authors:
                        </label>
                        <Select
                            isMulti
                            options={authors.map((author) => ({ value: author.author_id, label: author.author_name }))}
                            value={AUTHORS.map((authorId) => ({ value: authorId, label: authors.find(author => author.author_id === authorId).author_name }))}
                            onChange={(selectedOptions) => setAUTHORS(selectedOptions.map(option => option.value))}
                        />
                        <label className="text-center text-button" onClick={() => setShowAuthorForm(true)}>Add New Author</label>
                        <Modal show={showAuthorForm} onHide={() => setShowAuthorForm(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Author</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={addAuthor}>
                                    <div>
                                        <label htmlFor="author">Author Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newAuthor}
                                            onChange={(e) => setNewAuthor(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3">Add</button>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="button-color" variant="secondary" onClick={() => setShowAuthorForm(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
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
                        <label className="text-center text-button" onClick={() => setShowPublisherForm(true)}>Add New Publisher</label>
                        <Modal show={showPublisherForm} onHide={() => setShowPublisherForm(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Publication</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={addPublisher}>
                                    <div>
                                        <label htmlFor="publisher">Publication Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newPublisher}
                                            onChange={(e) => setNewPublisher(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3">Add</button>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="button-color" variant="secondary" onClick={() => setShowPublisherForm(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div>
                        <label htmlFor="shelf" className="mt-3">
                            Shelf:
                        </label>
                        <select
                            id="Shelf"
                            className="form-control"
                            value={SHELF_ID}
                            onChange={(e) => setSHELF_ID(e.target.value)}
                        >
                            <option value=""> Select Shelf </option>
                            {shelves.map((shelf) => (
                                <option key={shelf.shelf_id} value={shelf.shelf_id}>
                                    {shelf.shelf_id}
                                </option>
                            ))}
                        </select>
                        <label className="text-center text-button" onClick={() => setShowShelfForm(true)}>Add New Shelf</label>
                        <Modal show={showShelfForm} onHide={() => setShowShelfForm(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Shelf</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={addShelf}>
                                    <div>
                                        <label htmlFor="shelf">Shelf No:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newShelf}
                                            onChange={(e) => setNewShelf(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3">Add</button>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="button-color" variant="secondary" onClick={() => setShowShelfForm(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
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
