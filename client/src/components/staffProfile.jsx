import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./footer";

const StaffProfile = ({ setAuth }) => {
  const [staff, setStaff] = useState({});
  const { id } = useParams();

  const getInfo = async () => {
    try {
      // const student = await fetch("http://localhost:5000/getID",{ method: "GET", headers: {token: localStorage.token, "Content-Type": "application/json"}});
      // const student_id = await student.json();
      // console.log(student_id);
      //console.log(user_id);
      const response = await fetch(`http://localhost:5000/staffProfile/${id}`);
      const jsonData = await response.json();
      setStaff(jsonData[0]);
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
      <h1 className="text-center mb-5 fixed-header head-color">Staff Profile</h1>
      <div className="book-details-container">
        <table className="table mx-auto">
          <tbody>
            <tr className="text-center">
              <td className="head-color">ID</td>
              <td className="table-row-2">{staff.staff_id}</td>
            </tr>
            <tr className="text-center">
              <td className="head-color">Full Name</td>
              <td className="table-row-2">{staff.name}</td>
            </tr>
            <tr className="text-center mt-3">
              <td className="head-color">Phone Number</td>
              <td className="table-row-2">{staff.phone_number}</td>
            </tr>
            <tr className="text-center mt-3">
              <td className="head-color">Total Due</td>
              <td className="table-row-2">{staff.due} TK</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footer />
    </Fragment>
  );
};

export default StaffProfile;
