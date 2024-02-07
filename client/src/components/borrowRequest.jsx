import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BorrowRequests = () => {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [selectedOption, setSelectedOption] = useState('students');  // Initialize state with 'students'
    const { id } = useParams();

    const getStudents = async () => {
        try {
            setSelectedOption('students');
            const response = await fetch(`http://localhost:5000/borrowRequests/${id}`);
            const jsonData = await response.json();
            setStudents(jsonData);
            setTeachers([]);
            setStaffs([]);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getTeachers = async () => {
        try {
            setSelectedOption('teachers');
            const response = await fetch(`http://localhost:5000/borrowRequests/${id}`);
            const jsonData = await response.json();
            setTeachers(jsonData);
            setStudents([]);
            setStaffs([]);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getStaffs = async () => {
        try {
            setSelectedOption('staffs');
            const response = await fetch(`http://localhost:5000/borrowRequests/${id}`);
            const jsonData = await response.json();
            setStaffs(jsonData);
            setStudents([]);
            setTeachers([]);
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
                <button
                    style={{ width: '33%', border: '1px solid grey', backgroundColor: selectedOption === 'students' ? '#ccc' : 'inherit' }}
                    onClick={() => getStudents()}  // Set 'students' as the selected option
                >
                    Student
                </button>
                <button
                    style={{ width: '33%', border: '1px solid grey', backgroundColor: selectedOption === 'teachers' ? '#ccc' : 'inherit' }}
                    onClick={() => getTeachers()}
                >
                    Teacher
                </button>
                <button
                    style={{ width: '33%', border: '1px solid grey', backgroundColor: selectedOption === 'staffs' ? '#ccc' : 'inherit' }}
                    onClick={() => getStaffs()}
                >
                    Staff
                </button>
            </div>
            <div className="boxes-container mt-5">
                {selectedOption == 'students' && students.map((student, index) => (
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
                        <div className="day-hours-ago">
                            <span>1 hour ago</span>
                        </div>
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
                        <p className="request-status">{student.request_status}...</p>
                    </div>
                ))}

                {selectedOption === 'teachers' && teachers.map((teacher, index) => (
                    <div key={index} className="box">
                        <span className="option-text">
                            Name :
                            <Link to={`/showStudentDetails/${teacher.student_id}`} className="option-link">
                                {teacher.student}
                            </Link>
                        </span>
                        <span className="option-text">
                            Book:
                            <Link to={`/showBookDetails/${teacher.book_id}`} className="option-button">
                                {teacher.title}
                            </Link>
                        </span>
                        <span className="option-text">
                            Date: {formatDate(teacher.date_borrowed)}
                        </span>
                        <div className="day-hours-ago">
                            <span>1 hour ago</span>
                        </div>
                        <div className="buttons-container mt-2">
                            <button
                                className="btn accept-button mr-3"
                                onClick={() => handleAcceptClick(teacher.request_id)}
                            >
                                Accept
                            </button>
                            <button
                                className="btn deny-button"
                                onClick={() => handleDenyClick(teacher.request_id)}
                            >
                                Deny
                            </button>
                        </div>
                        <p className="request-status">{teacher.request_status}...</p>
                    </div>
                ))}

                {selectedOption == 'staffs' && staffs.map((staff, index) => (
                    <div key={index} className="box">
                        <span className="option-text">
                            Name :
                            <Link to={`/showStudentDetails/${staff.student_id}`} className="option-link">
                                {staff.student}
                            </Link>
                        </span>
                        <span className="option-text">
                            Book:
                            <Link to={`/showBookDetails/${staff.book_id}`} className="option-button">
                                {staff.title}
                            </Link>
                        </span>
                        <span className="option-text">
                            Date: {formatDate(staff.date_borrowed)}
                        </span>
                        <div className="day-hours-ago">
                            <span>1 hour ago</span>
                        </div>
                        <div className="buttons-container mt-2">
                            <button
                                className="btn accept-button mr-3"
                                onClick={() => handleAcceptClick(staff.request_id)}
                            >
                                Accept
                            </button>
                            <button
                                className="btn deny-button"
                                onClick={() => handleDenyClick(staff.request_id)}
                            >
                                Deny
                            </button>
                        </div>
                        <p className="request-status">{staff.request_status}...</p>
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default BorrowRequests;