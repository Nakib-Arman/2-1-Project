import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MyProfile = () => {
  const [student, setStudent] = useState(null);
  const [staff, setStaff] = useState(null);
  const [shelves, setShelves] = useState([]);
  const [userType, setUserType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);


  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [terms, setTerms] = useState([]);
  
  //const { id } = useParams();

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
        console.error("Failed to fetch authors, publishers, categories, or shelves");
      }

      
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


  const[staffFirstName, setStaffFirstName] = useState("");
  const[staffLastName, setStaffLastName] = useState("");

  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentDept, setStudentDept] = useState();
  const [studentLevel, setStudentLevel] = useState(0);
  const [studentTerm, setStudentTerm] = useState(0);


  const updateStaffChange = async () => {
    try {
      if (!staffFirstName && !staffLastName) {
        alert("Please enter the new information to update");
        return;
      }
      
      const body = { staffFirstName, staffLastName};
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
      console.error(err.message);
    }
  };

  const updateStudentChange = () =>{
    console.log("Hello student");
    console.log(studentFirstName);
    console.log(studentLastName);
    console.log(studentDept);
    console.log(studentLevel);
    console.log(studentTerm);
  }
  
  // Function to toggle modal visibility
  const toggleEditModal = () => {
    if(userType==='staff'){
      setStaffFirstName(staff.first_name);
      setStaffLastName(staff.last_name);
    }
    else if(userType==='student'){
      setStudentFirstName(student.first_name);
      setStudentLastName(student.last_name);
      setStudentDept(student.department_code);
      setStudentLevel(student.current_level);
      setStudentTerm(student.current_term);
    }
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
      {/* Button to trigger modal */}
      <div>
      <button className="btn button-color ml-3" onClick={toggleEditModal}>Edit Profile</button>
      </div>
      <div>
      <button className="btn button-color mt-2 ml-3">Change Password</button>
      </div>

      {showEditModal && userType==='staff' &&
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
                <label>First Name:</label>
                <input type="text" id='f_name' className="form-control mb-4" value={staffFirstName} onChange={(e)=>setStaffFirstName(e.target.value)} />
                <label>Last Name:</label>
                <input type="text" id='l_name' className="form-control mb-3" value={staffLastName} onChange={(e)=>setStaffLastName(e.target.value)}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn button-color" onClick={toggleEditModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={updateStaffChange}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      }
      {showEditModal && userType==='student' &&
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
                <input type="text" id='f_name' className="form-control mb-3" value={studentFirstName} onChange={(e)=>setStudentFirstName(e.target.value)} />
                <label>Last Name:</label>
                <input type="text" id='l_name' className="form-control mb-3" value={studentLastName} onChange={(e)=>setStudentLastName(e.target.value)}/>
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
    </Fragment>
  );
}

export default MyProfile;
