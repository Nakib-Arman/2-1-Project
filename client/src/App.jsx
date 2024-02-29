import React, { Fragment, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import './App.css';


import HomePage from "./components/HomePage";
import LogIn from "./components/LogIn";
import AddBook from './components/addBook';
import ShowBook from "./components/showBook";
import ShowBookDetails from "./components/showBookDetails";
import MyProfile from "./components/myProfile";
import BorrowRequests from "./components/borrowRequest";
// import CommonLogIn from "./components/CommonLogIn";
import ShowCart from "./components/showCart";
import HomePageForStudentTeacher from "./components/HomePageForStudentTeacher";
import StudentProfile from "./components/studentProfile";
import StaffProfile from "./components/staffProfile";
import SignUp from "./components/SignUp";
// import editProfile from "./components/editProfile";

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) =>{
    setIsAuthenticated(boolean);
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={isAuthenticated ? <HomePage setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/LogIn" element={!isAuthenticated ? <LogIn setAuth={setAuth}/> : <Navigate to = "/" />} />
          <Route exact path="/addBooks" element={<AddBook />} />
          <Route exact path="/showBooks" element={<ShowBook />} />
          <Route exact path="/myProfile" element={<MyProfile />} />
          <Route exact path="/showBookDetails/:id" element={<ShowBookDetails />} />
          <Route exact path="/borrowRequests" element={<BorrowRequests />} />
          <Route exact path="/showCart" element={<ShowCart />} />
          <Route exact path="/HomePageForStudentTeacher" element={<HomePageForStudentTeacher />} />
          <Route exact path="/studentProfile/:id" element={<StudentProfile/>}/>
          <Route exact path="/staffProfile/:id" element={<StaffProfile/>}/>
          <Route exact path="/signUp" element={<SignUp/>}/>   
          {/* <Route exact path="/editProfile" element={<editProfile/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
