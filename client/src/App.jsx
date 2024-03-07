import React, { Fragment, useState,useEffect } from "react";
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
import RestoreBorrowedBooks from "./components/restoreBorrowedBooks";
import AboutUs from "./components/aboutUs";
import AcquisitionRecords from "./components/acquisitionRecords";
import Feedback from "./components/feedback";
import ContactUs from "./components/contacts";
import LibraryMembers from "./components/libraryMembers";
// import editProfile from "./components/editProfile";

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) =>{
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try{
      const response = await fetch ("http://localhost:5000/verify",{
        method: "GET",
        headers: {token : localStorage.token}
      });
      const parseRes = await response.json();
      parseRes===true? setIsAuthenticated(true): setIsAuthenticated(false);
    }catch(err){
      console.error(err.message);
    }
  }

  useEffect(()=> {
    isAuth()
  })

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/signUp" element={<SignUp/>}/> 
          <Route exact path="/" element={isAuthenticated ? <HomePage setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/LogIn" element={!isAuthenticated ? <LogIn setAuth={setAuth}/> : <Navigate to = "/" />} />
          <Route exact path="/addBooks" element={isAuthenticated ? <AddBook setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/showBooks" element={isAuthenticated ? <ShowBook setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/myProfile" element={isAuthenticated ? <MyProfile setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/showBookDetails/:id" element={isAuthenticated ? <ShowBookDetails setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/borrowRequests" element={isAuthenticated ? <BorrowRequests setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/showCart" element={isAuthenticated ? <ShowCart setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/HomePageForStudentTeacher" element={isAuthenticated ? <HomePageForStudentTeacher setAuth={setAuth}/> : <Navigate to = "/LogIn"/>} />
          <Route exact path="/studentProfile/:id" element={isAuthenticated ? <StudentProfile setAuth={setAuth}/> : <Navigate to = "/LogIn"/>}/>
          <Route exact path="/staffProfile/:id" element={isAuthenticated ? <StaffProfile setAuth={setAuth}/> : <Navigate to = "/LogIn"/>}/> 
          <Route exact path="/restoreBorrowedBooks" element={<RestoreBorrowedBooks/>}/> 
          <Route exact path="/aboutUs" element={<AboutUs/>}/>
          <Route exact path="/acquisitionRecords" element={<AcquisitionRecords/>}/>
          <Route exact path="/feedback" element={<Feedback/>}/>
          <Route exact path="/contactus" element={<ContactUs/>}/>
          <Route exact path="/libraryMembers" element={<LibraryMembers/>}/>
          {/* <Route exact path="/editProfile" element={<editProfile/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
