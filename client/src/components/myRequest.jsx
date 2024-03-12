import React, { Fragment, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./HomePage.jpg";

const MyRequests = ({ setAuth }) => {
    const [resquests, setRequests] = useState([]);
    const [requestType, setRequestType] = useState('Pending');

    const navigate = useNavigate();


    const getRequests = async () => {
        try {
            const user = await fetch("http://localhost:5000/getID", { method: "GET", headers: { token: localStorage.token, "Content-Type": "application/json" } });
            const user_id = await user.json();
            const Pendingresponse = await fetch(`http://localhost:5000/mypendingRequests/${user_id}`);
            const PendingData = await Pendingresponse.json();
            const Acceptedresponse = await fetch(`http://localhost:5000/myacceptRequests/${user_id}`);
            const AcceptedData = await Acceptedresponse.json();
            const Deniedresponse = await fetch(`http://localhost:5000/myrejectedRequests/${user_id}`);
            const DeniedData = await Deniedresponse.json();
            if (requestType === 'Pending') {
                setRequests(PendingData);
            }
            else if (requestType === 'Accepted') {
                setRequests(AcceptedData);
            }
            else if (requestType === 'Rejected') {
                setRequests(DeniedData);
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteRequest = async (book_id) => {
        try {
            console.log("hello");
            const body= {book_id};
            console.log(body);
            const user = await fetch("http://localhost:5000/getID", { method: "GET", headers: { token: localStorage.token, "Content-Type": "application/json" } });
            const user_id = await user.json();
            const response = await fetch(`http://localhost:5000/deleteRequest/${book_id}`, {
                method: "POST",
                headers: { token: localStorage.token },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            setRequests(resquests.filter(request => request.request_id !== parseRes.request_id));
        } catch (err) {
            console.error(err.message);
        }
        navigate('/myRequests')
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const containerStyle = {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: '100%',
        height: '100%',
        /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
      };

    useEffect(() => {
        getRequests();
    }, [requestType]);


    return (
        <Fragment>
            <div className="fixed-bg" style={{ ...containerStyle }}></div>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>My Requests</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
                <div>
                    <select
                        className="form-control custom-select"
                        style={{ width: '200px', position: 'relative', left: '10px' }}
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div className="boxes-container mt-5">
                    {resquests.map((request) => (
                        <div className="box">
                            <span className="option-text">
                                Book:
                                <Link to={`/showBookDetails/${request.book_id}`} className="option-button">
                                    {request.title}
                                </Link>
                            </span>
                            <span className="option-text">
                                Date Requested: {formatDate(request.request_date)}
                            </span>
                            {requestType == 'Pending' &&
                                <div className="buttons-container mt-2">
                                    <button
                                        className="btn deny-button mr-3"
                                        onClick={()=>deleteRequest(request.book_id)}
                                    >
                                        Cancel Request
                                    </button>
                                </div>
                            }
                            {requestType == 'Accepted' &&
                            <div>
                                <span className="option-text">
                                Date Approved: {formatDate(request.date_borrowed)}
                            </span>
                                <div className="buttons-container mt-2">
                                    <button
                                        className="btn accept-button mr-3"
                                    >
                                        Accepted
                                    </button>
                                </div>
                                </div>
                            }
                            {requestType == 'Rejected' &&
                                <div className="buttons-container mt-2">
                                    <button
                                        className="btn deny-button mr-3"
                                    >
                                        Rejected
                                    </button>
                                </div>
                            }
                            <p> </p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default MyRequests;
