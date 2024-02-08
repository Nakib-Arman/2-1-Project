import React, { Fragment } from "react";
import {BrowserRouter as Router, Switch, Route,Routes} from "react-router-dom";
import './App.css';

import HomePage from "./components/HomePage";
import LogIn from "./components/LogIn";
import AddBook from './components/addBook';
import ShowBook from "./components/showBook";
import ShowBookDetails from "./components/showBookDetails";
import MyProfile from "./components/myProfile";
import BorrowRequests from "./components/borrowRequest";
// inport CommonLogIn from "./components/CommonLogIn";

const App = () =>{
  return(
    <div>
      <Router>
        <Routes>
          <Route exact path="/:id" Component={HomePage}/>
          <Route exact path="/LogIn" Component={LogIn}/>
          <Route exact path="/addBooks" Component={AddBook}/>
          <Route exact path="/showBooks" Component={ShowBook}/>
          <Route exact path="/myProfile/:id" Component={MyProfile}/>
          <Route exact path="/showBookDetails/:id" Component={ShowBookDetails}/>
          <Route exact path="/borrowRequests/:id" Component={BorrowRequests}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
