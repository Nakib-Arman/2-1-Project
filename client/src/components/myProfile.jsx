import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MyProfile = () => {
  const [student, setStudent] = useState(null);
  const [staff, setStaff] = useState(null);
  const [shelves, setShelves] = useState([]);
  const [userType, setUserType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false); // State to manage modal visibility
  
  //const { id } = useParams();

  const getInfo = async () => {
    try {
      const user = await fetch("http://localhost:5000/getID", { method: "GET", headers: { token: localStorage.token, "Content-Type": "application/json" } });
      const user_id = await user.json();
      console.log(user_id);
      
      const studentResponse = await fetch(`http://localhost:5000/studentProfile/${user_id}`);
      const studentData = await studentResponse.json();
      if (studentData.length > 0) {
        setUserType('student');
        setStudent(studentData[0]);
      }

      // const teacher = await fetch(`http://localhost:5000/teacherProfile/${user_id}`);
      // const teacherData = await teacher.json();
      // setTeacher(teacherData[0]);

      const staffResponse = await fetch(`http://localhost:5000/staffProfile/${user_id}`);
      const staffData = await staffResponse.json();
      if (staffData.length > 0) {
        setUserType('staff');
        setStaff(staffData[0]);
        setShelves(staffData);
      }
    } catch (err) {
      console.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const[newFirstName, setNewFirstName] = useState("");
  const[newLastName, setNewLastName] = useState("");
  const[newPhoneNumber, setNewPhoneNumber] = useState("");

  const updateChange = async () => {
    try {
      if (!newFirstName && !newLastName && !newPhoneNumber) {
        alert("Please enter the new information to update");
        return;
      }
      
      const body = { newFirstName, newLastName, newPhoneNumber };
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
    } catch (err) {
      console.error(err.message);
    }
  };
  
  // Function to toggle modal visibility
  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  return (
    <Fragment>
      <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
      <h1 className="text-center mb-5 fixed-header head-color">My Profile</h1>
      <div className="book-details-container">
        {userType === 'staff' && staff &&
          <table className="table mx-auto">
            <tbody>
              <tr className="text-center">
                <td className="head-color">ID</td>
                <td className="table-row-2">{staff.staff_id}</td>
              </tr>
              <tr className="text-center">
                <td className="head-color">First Name</td>
                <td className="table-row-2">{staff.name}</td>
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
                <td className="table-row-2">{student.name}</td>
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
      {/* Button to trigger modal */}
      <button className="btn btn-primary" onClick={toggleEditModal}>Edit Profile</button>
      
      {/* Modal */}
      {showEditModal &&
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
                {/* Add your form fields for editing profile here */}
                {/* Example: */}
                <input type="text" id='f_name' className="form-control mb-3" placeholder="Enter first name" onChange={(e)=>setNewFirstName(e.target.value)} />
                <input type="text" id='l_name' className="form-control mb-3" placeholder="Enter last name" onChange={(e)=>setNewLastName(e.target.value)}/>
                <input type="text" id='p_name' className="form-control mb-3" placeholder="Enter new phone number" onChange={(e)=>setNewPhoneNumber(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={toggleEditModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={updateChange}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
}

export default MyProfile;
