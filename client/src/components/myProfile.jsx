import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MyProfile = () => {
  const [Student,setStudent] = useState([]);
  const [Teacher,setTeacher] = useState([]);
  const [Staff,setStaff] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [userType, setUserType] = useState("");
  //const { id } = useParams();

  const getInfo = async () => {
    try {
      const user = await fetch("http://localhost:5000/getID",{ method: "GET", headers: {token: localStorage.token, "Content-Type": "application/json"}});
      const user_id = await user.json();
      console.log(user_id);
      const student = await fetch(`http://localhost:5000/studentProfile/${user_id}`);
      const studentData = await student.json();
      setStudent(studentData[0]);

      // const teacher = await fetch(`http://localhost:5000/teacherProfile/${user_id}`);
      // const teacherData = await teacher.json();
      // setTeacher(teacherData[0]);

      const staff = await fetch(`http://localhost:5000/staffProfile/${user_id}`);
      const staffData = await staff.json();
      setStaff(staffData[0]);
      setShelves(staffData);

      if (studentData.length > 0) setUserType('student');
      else if (staffData.length > 0) setUserType('staff');

    } catch (err) {
      console.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Fragment>
      <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
      <h1 className="text-center mb-5 fixed-header head-color">My Profile</h1>
      <div className="book-details-container">
        {userType==='staff' &&
          <table className="table mx-auto">
            <tbody>
              <tr className="text-center">
                <td className="head-color">ID</td>
                <td className="table-row-2">{Staff.staff_id}</td>
              </tr>
              <tr className="text-center">
                <td className="head-color">First Name</td>
                
                <td className="table-row-2">{Staff.name}</td>
              </tr>
              <tr className="text-center mt-3">
                <td className="head-color">Phone Number</td>
                
                <td className="table-row-2">{Staff.phone_number}</td>
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
                
                <td className="table-row-2">{Staff.due} TK Due</td>
              </tr>
            </tbody>
          </table>
        }

        {userType==='student' &&
          <table className="table mx-auto">
            <tbody>
              <tr className="text-center">
                <td className="head-color">ID</td>
                <td className="table-row-2">{Student.student_id}</td>
              </tr>
              <tr className="text-center">
                <td className="head-color">Name</td>
                
                <td className="table-row-2">{Student.name}</td>
              </tr>
              <tr className="text-center mt-3">
                <td className="head-color">Phone Number</td>
                
                <td className="table-row-2">{Student.phone_number}</td>
              </tr>
              <tr className="text-center mt-3">
                <td className="head-color">Department</td>
                
                <td className="table-row-2">{Student.department_name}</td>
              </tr>
              <tr className="text-center mt-3">
                <td className="head-color">Current Level</td>
                
                <td className="table-row-2">{Student.current_level}</td>
              </tr>
              <tr className="text-center mt-3">
                <td className="head-color">Current Term</td>
                
                <td className="table-row-2">{Student.current_term}</td>
              </tr>
              <tr className="text-center mt-3">
                <td className="head-color">Fine Status</td>
                
                <td className="table-row-2">{Student.due} TK Due</td>
              </tr>
            </tbody>
          </table>
        }
      </div>
    </Fragment>
  );
}

export default MyProfile;