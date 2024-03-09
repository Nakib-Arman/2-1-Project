const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const authorization = require("./middleware/authorization");
const jwtGenerator = require("./jwtGenerator");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

/*app.post("/studentLogIn", async (req, res) => {
    try {
        const { PHONE, PASSWORD } = req.body;
        const staff = await pool.query("SELECT * FROM USERS U JOIN STUDENTS S ON (U.USER_ID = S.STUDENT_ID) WHERE U.PHONE_NUMBER = $1 AND U.LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
        if (staff.rows.length > 0) {
            res.json(staff.rows[0]);
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err.message);
    }
})

app.post("/teacherLogIn", async (req, res) => {
    try {
        const { PHONE, PASSWORD } = req.body;
        const staff = await pool.query("SELECT * FROM USERS U JOIN TEACHERS T ON (U.USER_ID = T.TEACHER_ID) WHERE U.PHONE_nUMBER = $1 AND U.LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
        if (staff.rows.length > 0) {
            res.json(staff.rows[0]);
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err.message);
    }
})

app.post("/userLogIn", async (req, res) => {
    try {
        const { PHONE, PASSWORD } = req.body;
        const user = await pool.query("SELECT * FROM USERS WHERE PHONE_NUMBER = $1 AND LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
        if (user.rows.length > 0) {
            res.json(user.rows[0]);
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err.message);
    }
})

app.post("/staffLogIn", async (req, res) => {
    try {

        const { PHONE, PASSWORD } = req.body;
        const staff = await pool.query("SELECT * FROM USERS U JOIN STAFFS S ON (U.USER_ID = S.STAFF_ID) WHERE U.PHONE_NUMBER = $1 AND U.LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
        if (staff.rows.length > 0) {
            console.log(staff.rows[0]);
            res.json(staff.rows[0]);
        }
        else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err.message);
    }
})



app.get("/staffLogIn/:PHONE",async (req,res) => {
    try{
        console.log("staff log in")
        const {PHONE} = req.params;
        const staff = await pool.query("SELECT * FROM USERS U JOIN STAFFS S ON (U.USER_ID=S.STAFF_ID) WHERE U.PHONE_NUMBER=$1", [PHONE]);
        res.json(staff.rows)
        console.log(staff.rows);
    }catch(err){
        console.log(err.message);
    }
})*/



app.post("/userRequest/:id", authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user;
        // const book_id=id;
        const request = await pool.query("INSERT INTO USER_REQUEST (USER_ID,REQUEST_DATE) VALUES ($1,CURRENT_DATE) RETURNING *", [user_id]);
        const userRequest = request.rows[0].user_request_id;
        console.log(userRequest);
        // const requestBook = await pool.query("INSERT INTO REQUEST_BOOK_RELATION (USER_REQUEST_ID, BOOK_ID, REQUEST_STATUS) VALUES ($1, $2, 'PENDING') RETURNING *", [userRequest, id]);
        res.json(userRequest);
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/userBorrowRelation/:id", authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user;
        const response = await pool.query("INSERT INTO USER_BORROW_RELATION VALUES($1,$2,NULL,NULL) RETURNING *",[user_id,id]);
        //console.log(response.json().)
        res.json(response.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/checkRequest/:id",authorization, async (req,res) =>{
    try{
        console.log("called");
        const {id} = req.params;
        const user_id = req.user;
        const response = await pool.query("SELECT * FROM USER_BORROW_RELATION WHERE USER_ID=$1 AND BOOK_ID=$2",[user_id,id]);
        //console.log(response.rows);
        res.json(response.rows);
    }catch(err) {
        console.error(err.message);
    }
})

app.post("/requestBorrowRelation", (req, res) => {
    try {
        const {requestID,book_id} = req.query;
        
        const response = pool.query("INSERT INTO REQUEST_BOOK_RELATION (USER_REQUEST_ID,BOOK_ID,REQUEST_STATUS) VALUES($1,$2,'Pending') RETURNING *",[requestID,book_id]);
        res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post("/LogIn", async (req, res) => {
    try {
      const { PHONE, PASSWORD } = req.body;
      const user = await pool.query("SELECT * FROM USERS WHERE PHONE_NUMBER=$1", [PHONE]);
  
      if (user.rows.length > 0) {
        const isPasswordValid = await bcrypt.compare(PASSWORD, user.rows[0].library_password);
  
        if (isPasswordValid) {
          const token = jwtGenerator(user.rows[0].user_id);
          res.json({ token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/changePassword",authorization,async (req,res) => {
    try {
        console.log("Hello");
        const {oldPassword, newPassword} = req.body;
        console.log(oldPassword, newPassword);
        const user_id = req.user;
        const user = await pool.query("SELECT * FROM USERS WHERE USER_ID=$1",[user_id]);
        const isPasswordValid = await bcrypt.compare(oldPassword,user.rows[0].library_password);
        if(isPasswordValid){
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword,salt);
            const response = await pool.query("UPDATE USERS SET LIBRARY_PASSWORD=$1 WHERE USER_ID=$2",[newPassword,user_id]);
            console.log(response);
            res.json(response);
        }else{
            res.status(401).json({message:"Invalid credentials"});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message:"Internal server error"});
    }
});


  
  // Function to compare passwords
  async function comparePasswords(plainPassword, encryptedPassword) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT $1 = crypt($2, $1) AS match', [encryptedPassword, plainPassword], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0].match);
        }
      });
    });
  }
  

app.get("/userLogIn/:PHONE", async (req, res) => {
    try {
        const { PHONE } = req.params;
        const user = await pool.query("SELECT * FROM USERS WHERE PHONE_NUMBER = $1", [PHONE]);
        res.json(user.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/getID",authorization, async (req,res) =>{
    try {
        //console.log("Hello");
        //const user = await pool.query("SELECT USER_ID FROM USERS WHERE USER_ID = $1",[req.user]);
        res.json(req.user);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json("server Error");
    }
});

app.post("/addToCart", authorization, async (req, res) => {
    try {
        const { book_id } = req.body;
        const user_id = req.user;

        const cart = await pool.query("INSERT INTO CART (USER_ID, BOOK_ID) VALUES ($1, $2) RETURNING *", [user_id, book_id]);
        res.json(cart.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/showCart", authorization, async (req, res) => {
    try {
        const user_id = req.user;
        const cart = await pool.query("SELECT C.BOOK_ID, B.TITLE, B.CATEGORY, (SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID = B.PUBLISHER_ID) AS PUBLICATION FROM CART C JOIN BOOKS B ON (C.BOOK_ID = B.BOOK_ID) WHERE C.USER_ID = $1", [user_id]);
        res.json(cart.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/verify", authorization,async (req,res) =>{
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message); 
        res.status(500).send("Server Error");
    }
})


app.post("/addBooks", async (req, res) => {
    try {
        const { TITLE, CATEGORY, AUTHORS, PUBLISHER, SHELF_ID,edition, copiesBought,coverImage} = req.body;

        const book = await pool.query(
            "INSERT INTO BOOKS (TITLE, CATEGORY, PUBLISHER_ID, SHELF_ID,EDITION,IMAGE_URL) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *",
            [TITLE, CATEGORY, PUBLISHER, SHELF_ID,edition,coverImage]
        );

        const bookId = book.rows[0].book_id;

        const authorPromises = AUTHORS.map(async (authorId) => {
            const bookAuthorRelation = await pool.query(
                "INSERT INTO BOOK_AUTHOR_RELATION (BOOK_ID, AUTHOR_ID) VALUES ($1, $2) RETURNING *",
                [bookId, authorId]
            );
            return bookAuthorRelation.rows[0];
        });

        const bookAcquisition = await pool.query("INSERT INTO ACQUISITION (BOOK_ID, DATE_BOUGHT, COPIES_BOUGHT) VALUES ($1, CURRENT_DATE, $2) RETURNING *", [bookId, copiesBought]);


        const bookAuthorRelations = await Promise.all(authorPromises);

        res.json({ book: book.rows[0], authors: bookAuthorRelations, acquisition: bookAcquisition.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/authors",async(req,res)=>{
    try{
        const authors= await pool.query("SELECT A.*,COUNT(BA.BOOK_ID) AS BOOK_COUNT FROM AUTHORS A LEFT JOIN BOOK_AUTHOR_RELATION BA ON (A.AUTHOR_ID=BA.AUTHOR_ID) GROUP BY A.AUTHOR_ID");
        res.json(authors.rows);
    }catch(err){
        console.log(err.message);
    }
});

app.get("/authors/:name",async (req,res) => {
    try{
        const {name} = req.params;
        const authors = await pool.query("SELECT *,BOOK_COUNT_FOR_AUTHOR(AUTHOR_ID) BOOK_COUNT FROM AUTHORS WHERE LOWER(AUTHOR_NAME) LIKE $1 ORDER BY AUTHOR_NAME",[`%${name.toLowerCase()}%`]);
        res.json(authors.rows);
    }catch(err){
        console.log(err.message);
    }
})

app.get("/shelves",async(req,res)=>{
    try{
        const shelves= await pool.query("SELECT * FROM SHELVES ORDER BY SHELF_ID");
        res.json(shelves.rows);
    }catch(err){
        console.log(err.message);
    }
});

app.get("/categories",async(req,res)=>{
    try{
        const categories= await pool.query("SELECT * FROM CATEGORIES ORDER BY CATEGORY");
        res.json(categories.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

app.get("/publishers",async(req,res)=>{
    try{
        const publishers= await pool.query("SELECT P.*, COUNT(B.BOOK_ID) AS BOOK_COUNT FROM PUBLISHERS P LEFT JOIN BOOKS B ON (P.PUBLISHER_ID=B.PUBLISHER_ID) GROUP BY P.PUBLISHER_ID");
        res.json(publishers.rows);
    }catch(err){
        console.log(err.message);
    }
})

app.get("/publishers/:name",async (req,res) => {
    try{
        const {name} = req.params;
        const publisher = await pool.query("SELECT P.*, COUNT(B.BOOK_ID) AS BOOK_COUNT FROM PUBLISHERS P LEFT JOIN BOOKS B ON (P.PUBLISHER_ID=B.PUBLISHER_ID) GROUP BY P.PUBLISHER_ID HAVING LOWER(P.PUBLICATION_NAME) LIKE $1",[`%${name.toLowerCase()}%`]);
        res.json(publisher.rows);
    }catch(err){
        console.log(err.message);
    }
})

app.get("/showBooks", async (req, res) => {
    try {
        const books = await pool.query("SELECT BOOK_ID,IMAGE_URL,COPIES_AVAILABLE(BOOK_ID) COPY,TITLE,CATEGORY,(SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID=B.PUBLISHER_ID) AS PUBLICATION_NAME FROM BOOKS B ORDER BY TITLE");
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/showTopPriority", async (req, res) => {
    try {
        const books = await pool.query("SELECT DISTINCT BS.BOOK_ID,B.TITLE, B.CATEGORY,COUNT(*) AS COUNT,PU.PUBLICATION_NAME FROM BOOKS B JOIN BOOK_SEARCHED BS ON (B.BOOK_ID=BS.BOOK_ID) JOIN PUBLISHERS PU ON(B.PUBLISHER_ID=PU.PUBLISHER_ID) GROUP BY BS.BOOK_ID,B.TITLE,B.CATEGORY,PU.PUBLICATION_NAME ORDER BY COUNT DESC;");
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/showBooksByCategory", async (req, res) => {
    try {
        const { title, category } = req.query; 
        const books = await pool.query("SELECT BOOK_ID,B.IMAGE_URL,COPIES_AVAILABLE(BOOK_ID) COPY, TITLE, CATEGORY, (SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID = B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B WHERE B.CATEGORY = $1 AND LOWER(B.TITLE) LIKE $2 ORDER BY BOOK_ID", [category, `%${title.toLowerCase()}%`]); // Adjusted query to use LIKE for case-insensitive title search
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

app.get("/studentProfile/:id",async (req,res) => {
    try{
        const student = await pool.query("SELECT S.STUDENT_ID,U.FIRST_NAME,LAST_NAME,U.PHONE_NUMBER,S.CURRENT_LEVEL,S.CURRENT_TERM,S.DEPARTMENT_CODE,D.DEPARTMENT_NAME,TOTAL_DUE(U.USER_ID) DUE FROM STUDENTS S JOIN USERS U ON(U.USER_ID=S.STUDENT_ID) JOIN DEPARTMENTS D ON (S.DEPARTMENT_CODE=D.DEPARTMENT_CODE) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(student.rows);
    }catch (err) {
        console.error(err.message);
    }
})


app.get("/teacherProfile/:id",async (req,res) =>{
    try{
        const teacher = await pool.query("SELECT T.TEACHER_ID,U.FIRST_NAME,U.LAST_NAME,U.PHONE_NUMBER,T.DESIGNATION,T.DEPARTMENT_CODE,D.DEPARTMENT_NAME, TOTAL_DUE(U.USER_ID) AS DUE FROM TEACHERS T JOIN USERS U ON (U.USER_ID=T.TEACHER_ID) JOIN DEPARTMENTS D ON (T.DEPARTMENT_CODE = D.DEPARTMENT_CODE) WHERE U.USER_ID=$1",[req.params.id]);
        
        res.json(teacher.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffProfile/:id",async (req,res) => {
    try{
        const staff = await pool.query("SELECT ST.STAFF_ID, U.FIRST_NAME, U.LAST_NAME, U.PHONE_NUMBER, SH.SHELF_ID,TOTAL_DUE(U.USER_ID) DUE FROM USERS U JOIN STAFFS ST ON(U.USER_ID=ST.STAFF_ID) JOIN SHELVES SH ON(ST.STAFF_ID=SH.STAFF_ID) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(staff.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffProfile2/:id",async (req,res) => {
    try{
        const staff = await pool.query("SELECT ST.STAFF_ID,U.FIRST_NAME, U.LAST_NAME, U.PHONE_NUMBER, TOTAL_DUE(U.USER_ID) DUE FROM USERS U JOIN STAFFS ST ON (U.USER_ID=ST.STAFF_ID) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(staff.rows);
    }catch(err) {
        console.error(err.message);
    }
})

app.get("/searchBooks/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const searchResults = await pool.query(
            `SELECT 
                B.IMAGE_URL, 
                COPIES_AVAILABLE(B.BOOK_ID) AS COPY, 
                B.TITLE, 
                B.CATEGORY, 
                BOOK_PUBLICATION(B.BOOK_ID) AS PUBLICATION_NAME, 
                B.BOOK_ID 
            FROM 
                BOOKS B 
                JOIN BOOK_AUTHOR_RELATION BAR ON (B.BOOK_ID = BAR.BOOK_ID) 
                JOIN AUTHORS A ON (BAR.AUTHOR_ID = A.AUTHOR_ID) 
            WHERE 
                LOWER(A.AUTHOR_NAME) LIKE $1 
            UNION 
            SELECT 
                B2.IMAGE_URL, 
                COPIES_AVAILABLE(B2.BOOK_ID) AS COPY, 
                B2.TITLE, 
                B2.CATEGORY, 
                BOOK_PUBLICATION(B2.BOOK_ID) AS PUBLICATION_NAME, 
                B2.BOOK_ID 
            FROM 
                BOOKS B2  
            WHERE 
                LOWER(BOOK_PUBLICATION(B2.BOOK_ID)) LIKE $1 
            UNION 
            SELECT 
                B3.IMAGE_URL, 
                COPIES_AVAILABLE(B3.BOOK_ID) AS COPY, 
                B3.TITLE, 
                B3.CATEGORY, 
                BOOK_PUBLICATION(B3.BOOK_ID) AS PUBLICATION_NAME, 
                B3.BOOK_ID 
            FROM 
                BOOKS B3 
            WHERE 
                LOWER(B3.TITLE) LIKE $1 
            UNION 
            SELECT 
                B4.IMAGE_URL, 
                COPIES_AVAILABLE(B4.BOOK_ID) AS COPY, 
                B4.TITLE, 
                B4.CATEGORY, 
                P4.PUBLICATION_NAME, 
                B4.BOOK_ID 
            FROM 
                BOOKS B4  
                JOIN PUBLISHERS P4 ON (B4.PUBLISHER_ID = P4.PUBLISHER_ID) 
            WHERE 
                LOWER(B4.CATEGORY) LIKE $1 
            ORDER BY 
                TITLE`, 
            [`%${title.toLowerCase()}%`]
        );
        res.json(searchResults.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/showBookDetails/:id", async (req, res) => {
    try {
        const books = await pool.query
            ("SELECT B.IMAGE_URL, B.BOOK_ID,COPIES_AVAILABLE(B.BOOK_ID) COPY, B.TITLE, B.CATEGORY, AU.AUTHOR_NAME, PB.PUBLICATION_NAME, B.SHELF_ID FROM BOOKS B JOIN BOOK_AUTHOR_RELATION BAR ON(B.BOOK_ID=BAR.BOOK_ID) JOIN AUTHORS AU ON(BAR.AUTHOR_ID=AU.AUTHOR_ID) JOIN PUBLISHERS PB ON(B.PUBLISHER_ID=PB.PUBLISHER_ID) WHERE B.BOOK_ID=$1", [req.params.id]);
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/addToBookSearched/:id", async (req, res) => {
    try {
        const books= await pool.query("INSERT INTO BOOK_SEARCHED VALUES ($1)",[req.params.id]);
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/studentborrowRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const students = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STUDENT_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STUDENTS ST ON (ST.STUDENT_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Pending'",[req.params.id]);
        res.json(students.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/studentacceptRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const students = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STUDENT_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STUDENTS ST ON (ST.STUDENT_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Accepted'",[req.params.id]);
        res.json(students.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/studentrejectedRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const students = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STUDENT_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STUDENTS ST ON (ST.STUDENT_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Rejected'",[req.params.id]);
        res.json(students.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/teacherborrowRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const teachers = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS TEACHER_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN TEACHERS T ON (T.TEACHER_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Pending'",[req.params.id]);
        res.json(teachers.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/teacheracceptRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const teachers = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS TEACHER_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN TEACHERS T ON (T.TEACHER_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Accepted'",[req.params.id]);
        res.json(teachers.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/teacherrejectedRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const teachers = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS TEACHER_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN TEACHERS T ON (T.TEACHER_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Rejected'",[req.params.id]);
        res.json(teachers.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffborrowRequests/:id",async (req,res) =>{
    try{
        const staffs = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STAFF_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STAFFS STA ON (STA.STAFF_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Pending'",[req.params.id]);
        res.json(staffs.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffacceptRequests/:id",async (req,res) =>{
    try{
        const staffs = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STAFF_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STAFFS STA ON (STA.STAFF_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Accepted'",[req.params.id]);
        res.json(staffs.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffrejectedRequests/:id",async (req,res) =>{
    try{
        const staffs = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STAFF_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STAFFS STA ON (STA.STAFF_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Rejected'",[req.params.id]);
        res.json(staffs.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/studentAllAccepted",async (req,res) =>{
    try{
        const students = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STUDENT_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STUDENTS ST ON (ST.STUDENT_ID = U.USER_ID) WHERE RBR.REQUEST_STATUS='Accepted'"
        );
        res.json(students.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/teacherAllAccepted",async (req,res) =>{
    try{
        const teachers = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS TEACHER_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN TEACHERS T ON (T.TEACHER_ID = U.USER_ID) WHERE RBR.REQUEST_STATUS='Accepted'");
        res.json(teachers.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffAllAccepted",async (req,res) =>{
    try{
        const staffs = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STAFF_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STAFFS STA ON (STA.STAFF_ID = U.USER_ID) WHERE RBR.REQUEST_STATUS='Accepted'");
        res.json(staffs.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/getSearchedStudentRequest/:searchtext",async (req,res) =>{
    try{
        const {searchtext} = req.params;
        const student = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STUDENT_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STUDENTS ST ON (ST.STUDENT_ID = U.USER_ID) WHERE RBR.REQUEST_STATUS='Accepted' AND (LOWER(U.FIRST_NAME) LIKE $1 OR LOWER(U.LAST_NAME) LIKE $1 OR LOWER(B.TITLE) LIKE $1)",[`%${searchtext.toLowerCase()}%`]
        )
        res.json(student.rows);
    }catch(err){
        console.error(err.message);
    }
})


app.post("/addToUserRequest", authorization, async (req, res) => {
    try {
        const { book_id } = req.body;
        const user_id = req.user;

        const userRequest = await pool.query("INSERT INTO USER_REQUEST (USER_ID,REQUEST_DATE) VALUES ($1,CURRENT_DATE) RETURNING *", [user_id]);
        

        res.json(userRequest.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
})

app.post("/addToRequestBookRelation", authorization, async (req, res) => {
    try {
        const { book_id } = req.body;
        const user_id = req.user;

        const userRequest = await pool.query("INSERT INTO REQUEST_BOOK_RELATION (USER_REQUEST_ID,BOOK_ID,REQUEST_STATUS) VALUES ((SELECT USER_REQUEST_ID FROM USER_REQUEST WHERE USER_ID=$1 AND REQUEST_DATE=CURRENT_DATE),$2,'PENDING') RETURNING *", [user_id, book_id]);
        

        res.json(userRequest.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
})

app.get("/getUserType", authorization, async (req, res) => {
    try {
      const user = await pool.query("SELECT TYPE_OF_USER($1)", [req.user]);
      console.log(user.rows[0]);
      res.json(user.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' }); // You can handle errors as per your application's requirements
    }
  })

app.post("/deleteBookFromCart/:id", authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id=req.user;
        const book = await pool.query("DELETE FROM CART WHERE USER_ID = $1 AND BOOK_ID = $2", [user_id, id]);
        res.json({ message: "Book deleted from cart" });
    } catch (err) {
        console.error(err.message);
    }
})

app.put("/updateStatus/:request_id",async (req,res) =>{
    try{
        const {request_id} = req.params;
        const response = await pool.query("UPDATE REQUEST_BOOK_RELATION SET REQUEST_STATUS='Accepted' WHERE USER_REQUEST_ID=$1",[request_id]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.put("/updateUserBook",async (req,res) => {
    try{
        const {user_id,book_id} = req.body;
        const response = await pool.query("UPDATE USER_BORROW_RELATION SET DATE_BORROWED=CURRENT_DATE WHERE USER_ID=$1 AND BOOK_ID=$2",[user_id,book_id]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.put("/denyStatus/:request_id",async (req,res) => {
    try{
        const {request_id} = req.params;
        const response = await pool.query("UPDATE REQUEST_BOOK_RELATION SET REQUEST_STATUS='Rejected' WHERE USER_REQUEST_ID=$1",[request_id]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/getlevels",async (req,res) =>{
    try{
        const response = await pool.query("SELECT * FROM LEVELS");
        console.log(response.rows);
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/getterms",async (req,res) =>{
    try{
        const response = await pool.query("SELECT * FROM TERMS");
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/getdepartments",async (req,res) =>{
    try{
        const response = await pool.query("SELECT * FROM DEPARTMENTS");
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/getdesignations",async (req,res) =>{
    try{
        const response = await pool.query("SELECT * FROM TEACHER_DESIGNATION");
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.post("/addCategory",async (req,res) =>{
    try{
        const { newCategory } = req.body;
        console.log(req.body);
        console.log(newCategory);
        const response = await pool.query("INSERT INTO CATEGORIES VALUES ($1) RETURNING *",[newCategory]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.post("/addAuthor",async (req,res) =>{
    try{
        const { newAuthor } = req.body;
        const response = await pool.query("INSERT INTO AUTHORS (AUTHOR_NAME) VALUES ($1) RETURNING *",[newAuthor]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.post("/addPublisher",async (req,res) =>{
    try{
        const { newPublisher } = req.body;
        console.log(req.body);
        console.log(newPublisher);
        const response = await pool.query("INSERT INTO PUBLISHERS (PUBLICATION_NAME) VALUES ($1) RETURNING *",[newPublisher]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.post("/addShelf",async (req,res) =>{
    try{
        const { newShelf } = req.body;
        console.log(req.body);
        console.log(newShelf);
        const response = await pool.query("INSERT INTO SHELVES (STAFF_ID) VALUES ($1) RETURNING *",[newShelf]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})


app.get("/showRelatedBooks/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const books = await pool.query("SELECT DISTINCT B.TITLE, P.PUBLICATION_NAME, B.CATEGORY FROM BOOKS B JOIN BOOK_AUTHOR_RELATION BAR ON(B.BOOK_ID=BAR.BOOK_ID) JOIN AUTHORS A ON(BAR.AUTHOR_ID=A.AUTHOR_ID) JOIN PUBLISHERS P ON(B.PUBLISHER_ID=P.PUBLISHER_ID) WHERE A.AUTHOR_ID IN(SELECT BAR2.AUTHOR_ID FROM BOOK_AUTHOR_RELATION BAR2 WHERE BAR2.BOOK_ID=$1) UNION (SELECT DISTINCT B.TITLE, P.PUBLICATION_NAME, B.CATEGORY FROM BOOKS B JOIN BOOK_AUTHOR_RELATION BAR ON(B.BOOK_ID=BAR.BOOK_ID) JOIN AUTHORS A ON(BAR.AUTHOR_ID=A.AUTHOR_ID) JOIN PUBLISHERS P ON(B.PUBLISHER_ID=P.PUBLISHER_ID) WHERE B.PUBLISHER_ID=(SELECT PUBLISHER_ID FROM BOOKS WHERE BOOK_ID=$1))", [req.params.id]);
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.put("/updateStaffProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { staffFirstName, staffLastName} = req.body;
    console.log(staffFirstName, staffLastName, id)
    // console.log(firstName, lastName, phoneNumber, id)
    const response = await pool.query("UPDATE USERS SET FIRST_NAME=$1, LAST_NAME=$2 WHERE USER_ID=$3", [staffFirstName, staffLastName, id]);
    res.json("Updated Successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Failed to update profile");
  }
});

app.put("/updateStudentProfile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { studentFirstName, studentLastName, studentDept, studentLevel, studentTerm } = req.body;
      // console.log(firstName, lastName, phoneNumber, id)
      const response1 = await pool.query("UPDATE USERS SET FIRST_NAME=$1, LAST_NAME=$2 WHERE USER_ID=$3", [studentFirstName, studentLastName, id]);
      const response2 = await pool.query("UPDATE STUDENTS SET DEPARTMENT_CODE=$1, CURRENT_LEVEL=$2, CURRENT_TERM=$3 WHERE STUDENT_ID=$4",[studentDept,studentLevel, studentTerm,id]);
      res.json("Updated Successfully");
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Failed to update profile");
    }
  });

  app.put("/updateTeacherProfile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { teacherFirstName, teacherLastName, teacherDept, teacherDesignation} = req.body;
      // console.log(firstName, lastName, phoneNumber, id)
      const response = await pool.query("UPDATE USERS SET FIRST_NAME=$1, LAST_NAME=$2 WHERE USER_ID=$3", [teacherFirstName, teacherLastName, id]);
      const response2 = await pool.query("UPDATE TEACHERS SET DEPARTMENT_CODE=$1,DESIGNATION=$2 WHERE TEACHER_ID=$3", [teacherDept,teacherDesignation,id]);
      res.json("Updated Successfully");
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Failed to update profile");
    }
  });

app.post("/payDue/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { payment } = req.body;
        const response = await pool.query("INSERT INTO USER_TRANSACTON (USER_ID,PAID) VALUES ($1,$2)", [id,payment]);
        res.json(response);
    } catch (err) {
        console.error(err.message);
    }
});

app.post("/addToSearched", authorization,async (req, res) => {
    try {
        const id = req.user;
        const { book_id } = req.body;
        console.log(id, book_id);
        const response = await pool.query("INSERT INTO BOOK_SEARCHED (USER_ID,BOOK_ID) VALUES ($1,$2)", [id,book_id]);
        res.json(response);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/getAcquisitionRecord", async (req,res) => {
    try{
        const response = await pool.query("SELECT * FROM BOOKS B JOIN ACQUISITION A ON (B.BOOK_ID=A.BOOK_ID) JOIN PUBLISHERS P ON (B.PUBLISHER_ID=P.PUBLISHER_ID) ORDER BY A.DATE_BOUGHT");
        console.log(response);
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.post("/signup/student", async (req, res) => {
    try {
        const { userID, firstName, lastName, phone, password, level, term, department } = req.body;
        const response = await pool.query("CALL STUDENT_SIGN_UP($1, $2, $3, $4, $5, $6, $7, $8)", [userID, firstName, lastName, phone, password, level, term, department]);
        res.json(response.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post("/signup/staff",async(req, res)=>{
    try{
        const {userID,firstName,lastName,phone,password}=req.body;
        const response=await pool.query("CALL STAFF_SIGN_UP($1,$2,$3,$4,$5)",[userID,firstName,lastName,phone,password]);
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).json({error:err.message});
    }
});

app.post("/signup/teacher",async(req, res)=>{
    try{
        const {userID,firstName,lastName,phone,password,department,designation}=req.body;
        console.log(userID,firstName,lastName,phone,password,department,designation)
        const response=await pool.query("CALL TEACHER_SIGN_UP($1,$2,$3,$4,$5,$6,$7);",[userID,firstName,lastName,phone,password,department,designation]);
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).json({error:err.message});
    }
});

app.get("/getStaffContacts", async(req, res) => {
    try{
        const response = await pool.query("SELECT ST.STAFF_ID, U.FIRST_NAME, U.LAST_NAME, U.PHONE_NUMBER, SH.SHELF_ID,TOTAL_DUE(U.USER_ID) DUE FROM USERS U JOIN STAFFS ST ON(U.USER_ID=ST.STAFF_ID) JOIN SHELVES SH ON(ST.STAFF_ID=SH.STAFF_ID) ORDER BY SH.SHELF_ID");
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/mypendingRequests/:user_id",async (req,res) => {
    try{
        const{user_id} = req.params;
        console.log(user_id);
        const request = await pool.query(
            "SELECT * FROM USER_REQUEST UR JOIN REQUEST_BOOK_RELATION RBR ON (UR.USER_REQUEST_ID=RBR.USER_REQUEST_ID) JOIN BOOKS B ON (B.BOOK_ID=RBR.BOOK_ID) WHERE UR.USER_ID=$1 AND RBR.REQUEST_STATUS='Pending'",[user_id]
        )
        res.json(request.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/myacceptRequests/:user_id",async (req,res) => {
    try{
        const{user_id} = req.params;
        const request = await pool.query(
            "SELECT * FROM USER_REQUEST UR JOIN REQUEST_BOOK_RELATION RBR ON (UR.USER_REQUEST_ID=RBR.USER_REQUEST_ID) JOIN BOOKS B ON (B.BOOK_ID=RBR.BOOK_ID) JOIN USER_BORROW_RELATION UBR ON (UR.USER_ID=UBR.USER_ID AND UBR.BOOK_ID=RBR.BOOK_ID) WHERE UR.USER_ID=$1 AND RBR.REQUEST_STATUS='Accepted'",[user_id]
        )
        res.json(request.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/myrejectedRequests/:user_id",async (req,res) => {
    try{
        const{user_id} = req.params;
        const request = await pool.query(
            "SELECT * FROM USER_REQUEST UR JOIN REQUEST_BOOK_RELATION RBR ON (UR.USER_REQUEST_ID=RBR.USER_REQUEST_ID) JOIN BOOKS B ON (B.BOOK_ID=RBR.BOOK_ID) WHERE USER_ID=$1 AND RBR.REQUEST_STATUS='Rejected'",[user_id]
        )
        res.json(request.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.post("/feedback",authorization,async (req,res) => {
    try{
        console.log("feedback");
        const user_id=req.user;
        const {title, author, publisher, description}=req.body;
        const response= await pool.query("INSERT INTO SUGGESTED_BOOKS (USER_ID,TITLE,AUTHORS,PUBLISHER,DESCRIPTION) VALUES ($1,$2,$3,$4,$5)",[user_id,title,author,publisher,description]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})

app.get("/suggestedBooks",async (req,res) => {
    try{
        const response = await pool.query("SELECT * FROM SUGGESTED_BOOKS SB JOIN USERS U ON (U.USER_ID=SB.USER_ID)");
        res.json(response.rows);
    }catch(err){
        console.error(err.message);
    }
})

app.delete("/deleteSuggestedBook/:id",async (req,res) => {
    try{
        const {id}=req.params;
        const response=await pool.query("DELETE FROM SUGGESTED_BOOKS WHERE SUGGESTION_ID=$1",[id]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
})



app.post("/deleteRequest/:book_id",authorization,async (req,res) =>{
    try{        
        const user_id=req.user;
        const {book_id} = req.params;
        console.log(book_id);
        // console.log(user_id,book_id);
        const response = await pool.query("CALL DELETE_REQUEST($1,$2)",[user_id,book_id]);
        res.json(response);
    }catch(err){
        console.error(err.message);
    }
});


app.listen(5000, () => {
    console.log("server has started on port 5000");
})