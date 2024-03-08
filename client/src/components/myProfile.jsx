import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import "./myProfile.css";

const MyProfile = ({ setAuth }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [student, setStudent] = useState(null);
  const [staff, setStaff] = useState(null);
  const [shelves, setShelves] = useState([]);
  const [userType, setUserType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayDueModal, setShowPayDueModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [payment, setPayment] = useState(0);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");

  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [terms, setTerms] = useState([]);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  let navigate = useNavigate();

  const getInfo = async () => {
    try {
      const user = await fetch("http://localhost:5000/getID", { method: "GET", headers: { token: localStorage.token, "Content-Type": "application/json" } });
      const user_id = await user.json();
      console.log(user_id);

      const levelsResponse = await fetch("http://localhost:5000/getlevels");
      const termsResponse = await fetch("http://localhost:5000/getterms");
      const departmentsResponse = await fetch("http://localhost:5000/getdepartments");
      const designationsResponse = await fetch("http://localhost:5000/getdesignations");

      if (levelsResponse.ok && termsResponse.ok && departmentsResponse.ok && designationsResponse.ok) {
        const levelsData = await levelsResponse.json();
        const termsData = await termsResponse.json();
        const departmentsData = await departmentsResponse.json();

        setLevels(levelsData);
        setTerms(termsData);
        setDepartments(departmentsData);
      } else {
        console.error("Failed to fetch levels, terms, departments, or designations");
      }

      const studentResponse = await fetch(`http://localhost:5000/studentProfile/${user_id}`);
      const studentData = await studentResponse.json();
      if (studentData.length > 0) {
        setUserType('student');
        setStudent(studentData[0]);
      }

      const staffResponse = await fetch(`http://localhost:5000/staffProfile/${user_id}`);
      const staffData = await staffResponse.json();
      if (staffData.length > 0) {
        setUserType('staff');
        setStaff(staffData[0]);
        setShelves(staffData);
      }

      const staffResponse2 = await fetch(`http://localhost:5000/staffProfile2/${user_id}`);
      const staffData2 = await staffResponse2.json();
      if (staffData2.length > 0) {
        setUserType('staff');
        setStaff(staffData2[0]);
      }
    } catch (err) {
      console.error("Failed to fetch user details", err.message);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const [staffFirstName, setStaffFirstName] = useState("");
  const [staffLastName, setStaffLastName] = useState("");

  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentDept, setStudentDept] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [studentTerm, setStudentTerm] = useState("");

  const updateStaffChange = async () => {
    try {
      if (!staffFirstName || !staffLastName) {
        alert("Please enter the new information to update");
        return;
      }

      const body = { staffFirstName, staffLastName };
      console.log(body);
      const url = `http://localhost:5000/updateStaffProfile/${staff.staff_id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token: localStorage.token },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes === "Updated Successfully") {
        alert("Profile Updated Successfully");
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating staff profile", err.message);
    }
  };

  const updateStudentChange = async () => {
    try {
      if (!studentFirstName || !studentLastName || !studentDept || !studentLevel || !studentTerm) {
        alert("Please enter the new information to update");
        return;
      }

      const body = { studentFirstName, studentLastName, studentDept, studentLevel, studentTerm };
      console.log(body);
      const url = `http://localhost:5000/updateStudentProfile/${student.student_id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token: localStorage.token },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes === "Updated Successfully") {
        alert("Profile Updated Successfully");
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating student profile", err.message);
    }
  };

  const submitChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        alert("Please enter all the fields");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        alert("New password and confirm new password do not match");
        return;
      }
      const body = { oldPassword, newPassword };
      console.log(body);
      const url = "http://localhost:5000/changePassword";
      console.log(body);
      const response = await fetch(url, {
        method: "PUT",
        headers: { token: localStorage.token, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const parseRes = await response.json();
      if (response.ok) {
        console.log("Password Changed Successfully")
        alert("Password Changed Successfully");
        setShowChangePasswordModal(false);
      } else {
        alert("Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password", err.message);
    }
  };

  const toggleEditModal = () => {
    if (userType === 'staff') {
      setStaffFirstName(staff.first_name);
      setStaffLastName(staff.last_name);
    } else if (userType === 'student') {
      setStudentFirstName(student.first_name);
      setStudentLastName(student.last_name);
      setStudentDept(student.department_code);
      setStudentLevel(student.current_level);
      setStudentTerm(student.current_term);
    }
    setShowEditModal(!showEditModal);
  };

  const togglePayDueModal = () => {
    setShowPayDueModal(!showPayDueModal);
  };
  const toggleChangePasswordModal = () => {
    setShowChangePasswordModal(!showChangePasswordModal);
  };

  const payDue = async () => {
    try {
      if (payment <= 0) {
        alert("Please enter a valid amount to pay");
        return;
      }
      if (accountHolderName.length < 3 || accountNumber.length < 10 || pin.length < 4) {
        alert("Please enter valid account holder name, account number, and pin");
        return;
      }
      let url;
      let body;
      if (userType === 'staff') {
        url = `http://localhost:5000/payDue/${staff.staff_id}`;
        body = { payment };
      } else if (userType === 'student') {
        url = `http://localhost:5000/payDue/${student.student_id}`;
        body = { payment };
      }
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", token: localStorage.token },
        body: JSON.stringify(body)
      });
      setShowPayDueModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Error paying due", err.message);
    }
  };

  const addBook = () => {
    navigate('/addBooks');
  }

  const showBooks = () => {
    navigate('/showBooks');
  }

  const MyProfile = () => {
    navigate('/myProfile');
  }

  const goToCart = () => {
    navigate("/showCart");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  }

  const handleDropdownItemClick = (action) => {
    if (action === 'authorSearch') {
      navigate('/searchAuthors');
    } else if (action === 'publisherSearch') {
      navigate('/searchPublishers');
    } else if (action === 'myRequests') {
      navigate('/myRequests');
    } else if (action === 'viewBorrowRequests') {
      navigate('/borrowRequests');
    } else if (action === 'restoreBorrowedBooks') {
      navigate('/restoreBorrowedBooks');
    } else if (action === 'acquisitionRecords') {
      navigate('/acquisitionRecords');
    } else if (action === 'viewSuggestedBooks') {
      navigate('viewSuggestedBooks')
    } else if (action === 'logOut') {
      localStorage.removeItem("token");
      setAuth(false);
    }
  }


  return (
    <Fragment>
      <div className="page-container mb-5">

        <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
        <h1 className="text-center mb-5 fixed-header head-color">My Profile</h1>
        <header className="fixed-header" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#5A1917' }}>

          <div className="transparent-buttons" style={{ width: '100%' }}>
            <button className="btn" onClick={() => { navigate("/") }} style={{ position: 'absolute', left: '10px'}}>Home</button>
            <div style={{ alignContent: 'center', width: '100%' }}>
              {userType === 'staff' &&
                <button className="btn" onClick={addBook}>Add New Book</button>
              }
              <button className="btn" onClick={showBooks}>Search Books</button>
              <button className="btn" style={{ backgroundColor: '#f7e8e8', color: '#5A1917' }}>My Profile</button>
              <button className="btn" onClick={goToCart}>Cart</button>
            </div>
            <div className="hamburger-icon" onClick={toggleDropdown} style={{ position: 'absolute', right: '10px' }}>
              <button>&#9776;</button>
            </div>
            {isDropdownVisible && (
              <div className="dropdown-menu" style={{ opacity: 0.9, border: '1px solid black', position: 'absolute', left: '910px', width: '300px' }}>
                <button onClick={() => handleDropdownItemClick('authorSearch')} style={{ width: '90%', textAlign: 'right' }}><b>Search Authors</b></button>
                <button onClick={() => handleDropdownItemClick('publisherSearch')} style={{ width: '90%', textAlign: 'right' }}><b>Search Publishers</b></button>
                <button onClick={() => handleDropdownItemClick('myRequests')} style={{ width: '90%', textAlign: 'right' }}><b>My Requests</b></button>
                {userType === 'staff' &&
                  <div style={{ alignContent: 'right' }}>
                    <button onClick={() => handleDropdownItemClick('viewBorrowRequests')} style={{ width: '100%', textAlign: 'right' }}><b>View Borrow Requests</b></button>
                    <button onClick={() => handleDropdownItemClick('restoreBorrowedBooks')} style={{ width: '100%', textAlign: 'right' }}><b>Restore Borrowed Books</b></button>
                    <button onClick={() => handleDropdownItemClick('acquisitionRecords')} style={{ width: '100%', textAlign: 'right' }}><b>Acquisition Records</b></button>
                    <button onClick={() => handleDropdownItemClick('viewSuggestedBooks')} style={{ width: '100%', textAlign: 'right' }}><b>View Suggested Books</b></button>
                  </div>
                }
                <button onClick={() => handleDropdownItemClick('logOut')} className="logout-button" style={{ width: '90%', textAlign: 'right' }}><b>Log Out</b></button>
              </div>
            )}
          </div>
        </header>


        <div className="book-details-container">
          {userType === 'staff' && staff &&
            <table className="table mx-auto">
              <tbody>
                <tr className="text-center">
                  <td className="head-color">ID</td>
                  <td className="table-row-2">{staff.staff_id}</td>
                </tr>
                <tr className="text-center">
                  <td className="head-color">Name</td>
                  <td className="table-row-2">{staff.first_name} {staff.last_name}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Phone Number</td>
                  <td className="table-row-2">{staff.phone_number}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Shelves Managed</td>
                  <td className="table-row-2">
                    <ul className="author-list">
                      {shelves.map(shelf => (
                        <li key={shelf.shelf_id}>Shelf ID - {shelf.shelf_id}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Fine Status</td>
                  <td className="table-row-2">{staff.due} TK Due</td>
                </tr>
              </tbody>
            </table>
          }

          {userType === 'student' && student &&
            <table className="table mx-auto">
              <tbody>
                <tr className="text-center">
                  <td className="head-color">ID</td>
                  <td className="table-row-2">{student.student_id}</td>
                </tr>
                <tr className="text-center">
                  <td className="head-color">Name</td>
                  <td className="table-row-2">{student.first_name} {student.last_name}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Phone Number</td>
                  <td className="table-row-2">{student.phone_number}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Department</td>
                  <td className="table-row-2">{student.department_name}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Current Level</td>
                  <td className="table-row-2">{student.current_level}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Current Term</td>
                  <td className="table-row-2">{student.current_term}</td>
                </tr>
                <tr className="text-center mt-3">
                  <td className="head-color">Fine Status</td>
                  <td className="table-row-2">{student.due} TK Due</td>
                </tr>
              </tbody>
            </table>
          }
        </div>
        <div>
          <button className="btn button-color ml-3" onClick={toggleEditModal}>Edit Profile</button>
          <button className="btn button-color mt-2 ml-3" onClick={toggleChangePasswordModal}>Change Password</button>

          {showEditModal && userType === 'staff' &&
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Profile</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleEditModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <label>First Name:</label>
                    <input type="text" id='f_name' className="form-control mb-4" value={staffFirstName} onChange={(e) => setStaffFirstName(e.target.value)} />
                    <label>Last Name:</label>
                    <input type="text" id='l_name' className="form-control mb-3" value={staffLastName} onChange={(e) => setStaffLastName(e.target.value)} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn button-color" onClick={toggleEditModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={updateStaffChange}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          }
          {showEditModal && userType === 'student' &&
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Profile</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleEditModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <label>First Name:</label>
                    <input type="text" id='f_name' className="form-control mb-3" value={studentFirstName} onChange={(e) => setStudentFirstName(e.target.value)} />
                    <label>Last Name:</label>
                    <input type="text" id='l_name' className="form-control mb-3" value={studentLastName} onChange={(e) => setStudentLastName(e.target.value)} />
                    <label htmlFor="department_code">
                      Department:
                    </label>
                    <select
                      id="department"
                      className="form-control"
                      value={studentDept}
                      onChange={(e) => setStudentDept(e.target.value)}
                    >
                      <option value=""> Select Department </option>
                      {departments.map((dept) => (
                        <option key={dept.department_code} value={dept.department_code}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                    <label>Level:</label>
                    <select
                      id="current_level"
                      className="form-control"
                      value={studentLevel}
                      onChange={(e) => setStudentLevel(e.target.value)}
                    >
                      <option value=""> Select Level </option>
                      {levels.map((lvl) => (
                        <option key={lvl.level_no} value={lvl.level_no}>
                          {lvl.level_no}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="current_term" className="mt-3">
                      Term:
                    </label>
                    <select
                      id="current_term"
                      className="form-control"
                      value={studentTerm}
                      onChange={(e) => setStudentTerm(e.target.value)}
                    >
                      <option value=""> Select Term </option>
                      {terms.map((tr) => (
                        <option key={tr.term_no} value={tr.term_no}>
                          {tr.term_no}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn button-color" onClick={toggleEditModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={updateStudentChange}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          }

          <button className="btn button-color mt-2 ml-3" onClick={togglePayDueModal}>Pay Due</button>
        </div>

        {showPayDueModal &&
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Pay Due - {staff.due}</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={togglePayDueModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <label >Account Holder Name </label>
                  <input type="text" className="form-control mb-3" onChange={(e) => setAccountHolderName(e.target.value)} />
                  <label >Account Number </label>
                  <input type="text" className="form-control mb-3" onChange={(e) => setAccountNumber(e.target.value)} />
                  <label>Amount:</label>
                  <input type="number" className="form-control mb-3" onChange={(e) => setPayment(e.target.value)} />
                  <label>PIN</label>
                  <input type="password" className="form-control mb-3" onChange={(e) => setPin(e.target.value)} />

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn button-color" onClick={togglePayDueModal}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={payDue}>Pay Due</button>
                </div>
              </div>
            </div>
          </div>
        }
        {
          showChangePasswordModal &&
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleChangePasswordModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <label>Old Password:</label>
                  <input type="password" className="form-control mb-3" onChange={(e) => setOldPassword(e.target.value)} />
                  <label>New Password:</label>
                  <input type="password" className="form-control mb-3" onChange={(e) => setNewPassword(e.target.value)} />
                  <label>Confirm New Password:</label>
                  <input type="password" className="form-control mb-3" onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn button-color" onClick={toggleChangePasswordModal}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={submitChangePassword}>Change Password</button>
                </div>
              </div>
            </div>
          </div>
        }

      </div>
      <Footer />
    </Fragment>
  );
}

export default MyProfile;
