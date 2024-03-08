import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBackground from './logIn.png';
import videoBackground from './video.mp4';

const LogIn = ({ setAuth }) => {
  const [PHONE, setPHONE] = useState("");
  const [PASSWORD, setPASSWORD] = useState("");

  let navigate = useNavigate();

  const LogIn = async e => {
    e.preventDefault();
    try {
      const body = { PHONE, PASSWORD };
      
      const response = await fetch("http://localhost:5000/LogIn", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("token", user.token);
        
        const typeResponse = await fetch(`http://localhost:5000/userLogIn/${PHONE}`);
        const userTypes = await typeResponse.json();
        const userType = userTypes[0].user_type;

        setAuth(true);
        navigate('/');

      }
      else {
        alert("Wrong Phone or Password");
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  const gotoSignUp = () => {
    navigate("/signUp");
  }

  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <div className="app-container">
        <header className="header">
          <div className="transparent-buttons">
            <button onClick={gotoSignUp}>Sign Up</button>
          </div>
        </header>
        <div className="video-background">
            <video autoPlay muted loop id="video-background">
              <source src={videoBackground} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          {/* <h1>Log In</h1> */}
            <div className="overlay">
              <main className="main-content">
                <div className="login-container mt-5">
                  <h1>Log In</h1>
                  <form onSubmit={LogIn}>
                    <div>
                      <label htmlFor="phone">Phone Number:</label>
                      <input type="tel" className="form-control" value={PHONE} onChange={(e) => setPHONE(e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="password">Password:</label>
                      <input type="password" className="form-control" value={PASSWORD} onChange={(e) => setPASSWORD(e.target.value)} required />
                    </div>
                    <button type="submit">Log In</button>
                  </form>
                </div>
              </main>
            </div>
          </div>
        </div>
    </div>
  )
};

export default LogIn;
