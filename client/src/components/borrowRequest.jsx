import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BorrowRequests = () => {
    const [students, setStudents] = useState([]);
    const [selectedOption, setSelectedOption] = useState('students');
    const { id } = useParams();

    const getStudents = async () => {
        try {
            const response = await fetch(`http://localhost:5000/borrowRequests/${id}`);
            const jsonData = await response.json();
            setStudents(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const handleAcceptClick = (requestId) => {
        // Logic to handle accepting the request
        console.log(`Accept request with ID: ${requestId}`);
    };

    const handleDenyClick = (requestId) => {
        // Logic to handle denying the request
        console.log(`Deny request with ID: ${requestId}`);
    };

    useEffect(() => {
        getStudents();
    }, []);

    return (
        <Fragment>
            <h1 className="text-center head-color mb-5" style={{ fontSize: '50px' }}>Borrow Requests</h1>
            <div>
                <button style={{width:'33%',border:'1px solid grey'}}>Student</button>
                <button style={{width:'33%',border:'1px solid grey'}}>Teacher</button>
                <button style={{width:'33%',border:'1px solid grey'}}>Staff</button>
            </div>
            <div className="boxes-container mt-5">
                {students.map((student, index) => (
                    <div key={index} className="box">
                        <span className="option-text">
                            Name :
                            <Link to={`/showStudentDetails/${student.student_id}`} className="option-link">
                                {student.student}
                            </Link>
                        </span>
                        <span className="option-text">
                            Book:
                            <Link to={`/showBookDetails/${student.book_id}`} className="option-button">
                                {student.title}
                            </Link>
                        </span>
                        <span className="option-text">
                            Date: {formatDate(student.date_borrowed)}
                        </span>
                        <div className="buttons-container mt-2">
                            <button
                                className="btn accept-button mr-3"
                                onClick={() => handleAcceptClick(student.request_id)}
                            >
                                Accept
                            </button>
                            <button
                                className="btn deny-button"
                                onClick={() => handleDenyClick(student.request_id)}
                            >
                                Deny
                            </button>
                        </div>
                        <p> </p>
                        <p>
                            {student.request_status}...
                        </p>
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default BorrowRequests;
