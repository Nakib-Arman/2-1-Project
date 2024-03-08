import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./footer";

const StudentProfile = ({ setAuth }) => {
  const [student, setStudent] = useState({});
  const { id } = useParams();

  const getInfo = async () => {
    try {
      // const student = await fetch("http://localhost:5000/getID",{ method: "GET", headers: {token: localStorage.token, "Content-Type": "application/json"}});
      // const student_id = await student.json();
      // console.log(student_id);
      //console.log(user_id);
      const response = await fetch(`http://localhost:5000/studentProfile/${id}`);
      const jsonData = await response.json();
      setStudent(jsonData[0]);
    } catch (err) {
      console.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Fragment>
      <div className="page-container">
      <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>
      <h1 className="text-center mb-5 fixed-header head-color">Student Profile</h1>
      <div className="book-details-container">
        <table className="table mx-auto">
          <tbody>
            <tr className="text-center">
              <td className="head-color">ID</td>
              <td className="table-row-2">{student.student_id}</td>
            </tr>
            <tr className="text-center">
              <td className="head-color">Full Name</td>
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
              <td className="head-color">Total Due</td>
              <td className="table-row-2">{student.due} TK</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default StudentProfile;
