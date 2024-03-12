import React, { Fragment, useState, useEffect } from "react";
import { Link,useNavigate } from 'react-router-dom';
import backgroundImage from './LogIn.jpg';
import './SignUp.css'

const SignUp = () => {
  const [userType, setUserType] = useState('Student');
  const [userID, setUserID] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");
  const [term, setTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [levels, setLevels] = useState([]);
  const [terms, setTerms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);


  const navigate = useNavigate();

  const [phoneError, setPhoneError] = useState("");

  const validateInputs = () => {
    let isValid = true;

    // Phone number validation
    if (userType === 'Student' && !/^\d{11}$/.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      alert("Invalid phone number");
      return;
    }
  };

  const getInfo = async () => {
    try {
      const levelsResponse = await fetch("http://localhost:5000/getlevels");
      const termsResponse = await fetch("http://localhost:5000/getterms");
      const departmentsResponse = await fetch("http://localhost:5000/getdepartments");
      const designationsResponse = await fetch("http://localhost:5000/getdesignations");

      if (levelsResponse.ok && termsResponse.ok && departmentsResponse.ok && designationsResponse.ok) {
        const levelsData = await levelsResponse.json();
        const termsData = await termsResponse.json();
        const departmentsData = await departmentsResponse.json();
        const designationsData = await designationsResponse.json();

        setLevels(levelsData);
        setTerms(termsData);
        setDepartments(departmentsData);
        setDesignations(designationsData);
      } else {
        console.error("Failed to fetch authors, publishers, categories, or shelves");
      }
    } catch (err) {
      console.error(err.message);
    }

    try {

    } catch (err) {
      console.error(err.message);
    }
  };

  const submitSignUp = async () => {
    try {
      console.log(userType);
      if (!validateInputs()) {
        alert("Invalid phone number");
        return;
      }
      else if (userType === 'Student') {
        const body = { userID, firstName, lastName, phone, password, level, term, department };
        const response = await fetch("http://localhost:5000/signup/student", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (response.ok) {
          alert("Sign Up Successful");
          navigate('/LogIn');
        } else {
          alert("Sign Up Failed");
        }
      } else if (userType === 'Teacher') {
        const body = { userID, firstName, lastName, phone, password, department, designation };
        const response = await fetch("http://localhost:5000/signup/teacher", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (response.ok) {
          alert("Sign Up Successful");
          navigate('/LogIn');
        } else {
          alert("Sign Up Failed");
        }
      }
      else if (userType === 'Staff') {
        const body = { userID, firstName, lastName, phone, password };
        const response = await fetch("http://localhost:5000/signup/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (response.ok) {
          alert("Sign Up Successful");
          navigate('/LogIn');
        } else {
          alert("Sign Up Failed");
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const containerStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: '100%',
    height: '100%',
    /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Fragment>
      <div style={{ ...containerStyle, height: '100%' }}>
      <div
        className="add-book-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
        }}
      >
        
        <form
          className="signup-container mt-5"
          onSubmit={submit}
          style={{ width: '50%',alignContent: 'center' }}
        >
          <h1><strong>Sign Up</strong></h1>
          <div>
            <label htmlFor="user_type" className="mt-3">
              Sign Up as a:
            </label>
            <select
              id="user_type"
              className="form-control custom-select"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          {userType === 'Student' &&
            <div>
              <label htmlFor="user_id" className="mt-3">
                Student ID:
              </label>
              <input
                type="text"
                id="user_id"
                className="form-control "
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </div>
          }
          {userType === 'Teacher' &&
            <div>
              <label htmlFor="user_id" className="mt-3">
                Teacher ID:
              </label>
              <input
                type="text"
                id="user_id"
                className="form-control "
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </div>
          }
          {userType === 'Staff' &&
            <div>
              <label htmlFor="user_id" className="mt-3">
                Staff ID:
              </label>
              <input
                type="text"
                id="user_id"
                className="form-control "
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </div>
          }
          <div>
            <label htmlFor="first_name" className="mt-3">
              First Name:
            </label>
            <input
              type="text"
              id="first_name"
              className="form-control "
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="last_name" className="mt-3">
              Last Name:
            </label>
            <input
              type="text"
              id="last_name"
              className="form-control "
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="phone">Phone Number:</label>
            <input type="tel" className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} required />
          </div>
          {userType === 'Student' &&
            <div>
              <div>
                <label htmlFor="current_level" className="mt-3">
                  Level:
                </label>
                <select
                  id="current_level"
                  className="form-control"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value=""> Select Level </option>
                  {levels.map((lvl) => (
                    <option key={lvl.level_no} value={lvl.level_no}>
                      {lvl.level_no}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="current_term" className="mt-3">
                  Term:
                </label>
                <select
                  id="current_term"
                  className="form-control"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                >
                  <option value=""> Select Term </option>
                  {terms.map((tr) => (
                    <option key={tr.term_no} value={tr.term_no}>
                      {tr.term_no}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="department_code" className="mt-3">
                  Department:
                </label>
                <select
                  id="department_code"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value=""> Select Department </option>
                  {departments.map((dept) => (
                    <option key={dept.department_code} value={dept.department_code}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
          {userType === 'Teacher' &&
            <div>
              <div>
                <label htmlFor="department_code" className="mt-3">
                  Department:
                </label>
                <select
                  id="department_code"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value=""> Select Department </option>
                  {departments.map((dept) => (
                    <option key={dept.department_code} value={dept.department_code}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="designation" className="mt-3">
                  Designation:
                </label>
                <select
                  id="designation"
                  className="form-control"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                >
                  <option value=""> Select Designation </option>
                  {designations.map((des) => (
                    <option key={des.designation} value={des.designation}>
                      {des.designation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
          <button className="btn btn-success mt-3" onClick={submitSignUp}>Sign Up</button>
        </form>
        <p style={{ color: '#fffafa'}}>
            <Link to='/logIn'>Log In?</Link>
          </p>
      </div>
      </div>
      
    </Fragment>
  );
};

export default SignUp;
