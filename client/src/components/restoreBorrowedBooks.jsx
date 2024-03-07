import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const RestoreBorrowedBooks = ({ setAuth }) => {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [selectedOption, setSelectedOption] = useState('students');
    const [requestType, setRequestType] = useState('Pending');
    const [searchtext, setSearchtext] = useState("");
    const [searchedData, setSearchedData] = useState([]);
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

    const handleAcceptClick = async (request_id, user_id, book_id) => {
        const response1 = await fetch(`http://localhost:5000/updateStatus/${request_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const body = { user_id, book_id };
        const response2 = await fetch("http://localhost:5000/updateUserBook", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        fetchData();
    };

    const handleDenyClick = async (request_id) => {
        const response1 = await fetch(`http://localhost:5000/denyStatus/${request_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        fetchData();
    };

    const getSearchedData = async() =>{
        const response = await fetch(`http://localhost:5000/getSearchedUserRequest/${searchtext}`);
        const jsonData = response.json();
        setSearchedData(jsonData);
        setIsSearched(true);
    }

    useEffect(() => {
        fetchData();
    }, [selectedOption, requestType]);


    return (
        <Fragment>
            <div className="page-container">
            <h1 className="fixed-header" style={{backgroundColor: '#5A1917'}}>Borrow Requests</h1>
            <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
            <div className="container">
          <form onSubmit={getSearchedData} className="row search-form">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title or Author Name or Publisher Name or Category"
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
                {selectedOption === 'students' && students.map((student, index) => (
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
                            <button className="btn accept-button mr-3">Restore Book</button>
                        </div>
                        <p> </p>
                        <p>
                            {student.request_status}
                        </p>
                    </div>
                ))}

                {selectedOption === 'teachers' && teachers.map((teacher, index) => (
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
                            <button className="btn accept-button mr-3">Restore Book</button>
                        </div>
                        <p> </p>
                        <p>
                            {teacher.request_status}...
                        </p>
                    </div>
                ))}

                {selectedOption === 'staffs' && staffs.map((staff, index) => (
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
                            <button className="btn accept-button mr-3">Restore Book</button>
                        </div>
                        <p> </p>
                        <p>
                            {staff.request_status}...
                        </p>
                    </div>
                ))}
            </div>
            </div>
        </Fragment>
    );
};

export default RestoreBorrowedBooks;
