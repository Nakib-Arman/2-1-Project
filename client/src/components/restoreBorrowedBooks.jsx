import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "./footer";
import backgroundImage from "./HomePage.jpg";

const RestoreBorrowedBooks = ({ setAuth }) => {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [selectedOption, setSelectedOption] = useState('students');
    const [requestType, setRequestType] = useState('Pending');
    const [searchtext, setSearchtext] = useState("");
    const [searchedStudents, setSearchedStudents] = useState([]);
    const [searchedTeachers, setSearchedTeachers] = useState([]);
    const [searchedStaffs, setSearchedStaffs] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    const fetchData = async () => {
        switch (selectedOption) {
            case 'students':
                await getStudents();
                break;
            case 'teachers':
                await getTeachers();
                break;
            case 'staffs':
                await getStaffs();
                break;
            default:
                break;
        }
    };

    const fetchData2 = async () => {
        switch (selectedOption) {
            case 'students':
                await getSearchedStudents();
                break;
            case 'teachers':
                await getSearchedTeachers();
                break;
            case 'staffs':
                await getSearchedStaffs();
                break;
            default:
                break;
        }
    };

    const getStudents = async () => {
        try {

            const Acceptedresponse = await fetch("http://localhost:5000/studentAllAccepted");
            const AcceptedData = await Acceptedresponse.json();
            setStudents(AcceptedData);

        } catch (err) {
            console.error(err.message);
        }
    }

    const getTeachers = async () => {
        try {
            const Acceptedresponse = await fetch("http://localhost:5000/teacherAllAccepted");
            const AcceptedData = await Acceptedresponse.json();
            setTeachers(AcceptedData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getStaffs = async () => {
        try {
            const Acceptedresponse = await fetch("http://localhost:5000/staffAllAccepted");
            const AcceptedData = await Acceptedresponse.json();
            setStaffs(AcceptedData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const getSearchedStudents = async () => {
        try {
            const response = await fetch(`http://localhost:5000/getSearchedStudentRequest/${searchtext}`);
            const jsonData = await response.json();
            setSearchedStudents(jsonData);
            setIsSearched(true);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getSearchedTeachers = async () => {
        const response = await fetch(`http://localhost:5000/getSearchedTeacherRequest/${searchtext}`);
        const jsonData = await response.json();
        setSearchedTeachers(jsonData);
        setIsSearched(true);
    }

    const getSearchedStaffs = async () => {
        const response = await fetch(`http://localhost:5000/getSearchedStaffRequest/${searchtext}`);
        const jsonData = await response.json();
        setSearchedStaffs(jsonData);
        setIsSearched(true);
    }

    const restoreBook = async (request_id, user_id, book_id) => {
        const response1 = await fetch(`http://localhost:5000/returnedStatus/${request_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const body = { user_id, book_id };
        const response2 = await fetch("http://localhost:5000/returnedUserBook", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        if (response1.ok && response2.ok) {
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, [selectedOption, requestType]);

    useEffect(() => {
        fetchData2();
    }, [selectedOption, requestType, searchtext]);

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
    };


    return (
        <Fragment>
            <div className="fixed-bg" style={{ ...containerStyle }}></div>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Restore Books</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <div className="container">
                    <form onSubmit={fetchData2} className="row search-form">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Book Title or User Name"
                                value={searchtext}
                                onChange={(e) => setSearchtext(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <div className="mt-5">
                    <button style={{ width: '33%', border: '1px solid grey', background: selectedOption === 'students' ? '#f7e8e8' : 'white' }} onClick={() => setSelectedOption('students')}>
                        Student
                    </button>
                    <button style={{ width: '33%', border: '1px solid grey', background: selectedOption === 'teachers' ? '#f7e8e8' : 'white' }} onClick={() => setSelectedOption('teachers')}>
                        Teacher
                    </button>
                    <button style={{ width: '33%', border: '1px solid grey', background: selectedOption === 'staffs' ? '#f7e8e8' : 'white' }} onClick={() => setSelectedOption('staffs')}>
                        Staff
                    </button>
                </div>
                <div className="boxes-container mt-5">
                    {selectedOption === 'students' && (isSearched ? searchedStudents : students).map((student, index) => (
                        <div key={index} className="box">
                            <span className="option-text">
                                Name :
                                <Link to={`/studentProfile/${student.student_id}`} className="option-link">
                                    {student.name}
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
                                <button className="btn accept-button mr-3" onClick={() => restoreBook(student.request_id, student.student_id, student.book_id)}>Restore Book</button>
                            </div>
                            <p> </p>
                            <p>
                                {student.request_status}
                            </p>
                        </div>
                    ))}

                    {selectedOption === 'teachers' && (isSearched ? searchedTeachers : teachers || []).map((teacher, index) => (
                        <div key={index} className="box">
                            <span className="option-text">
                                Name :
                                <Link to={`/showStudentDetails/${teacher.teacher_id}`} className="option-link">
                                    {teacher.name}
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
                            <div className="buttons-container mt-2">
                                <button className="btn accept-button mr-3" onClick={restoreBook}>Restore Book</button>
                            </div>
                            <p> </p>
                            <p>
                                {teacher.request_status}...
                            </p>
                        </div>
                    ))}

                    {selectedOption === 'staffs' && (isSearched ? searchedStaffs : staffs || []).map((staff, index) => (
                        <div key={index} className="box">
                            <span className="option-text">
                                Name :
                                <Link to={`/staffProfile/${staff.staff_id}`} className="option-link">
                                    {staff.name}
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
                            <div className="buttons-container mt-2">
                                <button className="btn accept-button mr-3" onClick={restoreBook}>Restore Book</button>
                            </div>
                            <p> </p>
                            <p>
                                {staff.request_status}...
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <p className="mt-5"></p>
            <Footer />
        </Fragment>
    );
};

export default RestoreBorrowedBooks;
