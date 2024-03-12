import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './LogIn.jpg';
import './LogIn.css';

const LogIn = ({ setAuth }) => {
  const [PHONE, setPHONE] = useState("");
  const [PASSWORD, setPASSWORD] = useState("");

  let navigate = useNavigate();

  const LogIn = async (e) => {
    e.preventDefault();
    try {
      const body = { PHONE, PASSWORD };

      const response = await fetch("http://localhost:5000/LogIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("token", user.token);

        const typeResponse = await fetch(`http://localhost:5000/userLogIn/${PHONE}`);
        const userTypes = await typeResponse.json();
        const userType = userTypes[0].user_type;

        setAuth(true);
        navigate('/');
      } else {
        alert("Wrong Phone or Password");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const containerStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: '100%',
    height: '100%',
    /* Other background properties like backgroundPosition, backgroundRepeat, etc. */
  };

  return (
    <div className='app-container' style={{minHeight: '800px'}}>
      <div style={{ ...containerStyle, height: '100%' }}>
        <div className='login-position'>
          <div className='login-container'>
            <h1><strong>Log In</strong></h1>
            <form onSubmit={LogIn}>
              <div>
                <label htmlFor='phone'>Phone Number:</label>
                <input type='tel' className='form-control' value={PHONE} onChange={(e) => setPHONE(e.target.value)} required />
              </div>
              <div>
                <label htmlFor='password'>Password:</label>
                <input type='password' className='form-control' value={PASSWORD} onChange={(e) => setPASSWORD(e.target.value)} required />
              </div>
              <button type='submit'>Log In</button>
            </form>
          </div>

          <p style={{ color: 'black' }}>
            Don't Have An Account. <Link to='/signUp'>Sign Up?</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LogIn;
