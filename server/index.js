const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const authorization = require("./middleware/authorization");
const jwtGenerator = require("./jwtGenerator");

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

app.post("/LogIn", async (req,res) => {
    try{
        const { PHONE, PASSWORD } = req.body;
        const user = await pool.query("SELECT * FROM USERS WHERE PHONE_NUMBER=$1 AND LIBRARY_PASSWORD=$2",[PHONE,PASSWORD]);
        if(user.rows.length >0 ){
            
            const token = jwtGenerator(user.rows[0].user_id);
            
            res.json({token});
            //res.json(user.rows[0]);
        }
        else{
            res.status(401).json({ message: "Invalid credentials" }); 
        }
    }catch(err){
        console.log(err.message);
    }
});

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
        const { TITLE, CATEGORY, AUTHORS, PUBLISHER, SHELF_ID } = req.body;

        const book = await pool.query(
            "INSERT INTO BOOKS (TITLE, CATEGORY, PUBLISHER_ID, SHELF_ID) VALUES ($1, $2, $3, $4) RETURNING *",
            [TITLE, CATEGORY, PUBLISHER, SHELF_ID]
        );

        const bookId = book.rows[0].book_id;

        const authorPromises = AUTHORS.map(async (authorId) => {
            const bookAuthorRelation = await pool.query(
                "INSERT INTO BOOK_AUTHOR_RELATION (BOOK_ID, AUTHOR_ID) VALUES ($1, $2) RETURNING *",
                [bookId, authorId]
            );
            return bookAuthorRelation.rows[0];
        });

        const bookAuthorRelations = await Promise.all(authorPromises);

        res.json({ book: book.rows[0], authors: bookAuthorRelations });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/authors",async(req,res)=>{
    try{
        const authors= await pool.query("SELECT * FROM AUTHORS ORDER BY AUTHOR_NAME");
        res.json(authors.rows);
    }catch(err){
        console.log(err.message);
    }
});

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
        const publishers= await pool.query("SELECT * FROM PUBLISHERS ORDER BY PUBLICATION_NAME");
        res.json(publishers.rows);
    }catch(err){
        console.log(err.message);
    }
})

app.get("/showBooks", async (req, res) => {
    try {
        const books = await pool.query("SELECT BOOK_ID,IMAGE(B.BOOK_ID) IMAGE_URL,COPIES_AVAILABLE(BOOK_ID) COPY,TITLE,CATEGORY,(SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID=B.PUBLISHER_ID) AS PUBLICATION_NAME FROM BOOKS B ORDER BY TITLE");
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/showBooksByCategory", async (req, res) => {
    try {
        const { title, category } = req.query; 
        const books = await pool.query("SELECT BOOK_ID,IMAGE(B.BOOK_ID) IMAGE_URL,COPIES_AVAILABLE(BOOK_ID) COPY, TITLE, CATEGORY, (SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID = B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B WHERE B.CATEGORY = $1 AND LOWER(B.TITLE) LIKE $2 ORDER BY BOOK_ID", [category, `%${title.toLowerCase()}%`]); // Adjusted query to use LIKE for case-insensitive title search
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

app.get("/studentProfile/:id",async (req,res) => {
    try{
        const student = await pool.query("SELECT S.STUDENT_ID,U.FIRST_NAME||' '||LAST_NAME NAME,U.PHONE_NUMBER,S.CURRENT_LEVEL,S.CURRENT_TERM,D.DEPARTMENT_NAME,TOTAL_DUE(U.USER_ID) DUE FROM STUDENTS S JOIN USERS U ON(U.USER_ID=S.STUDENT_ID) JOIN DEPARTMENTS D ON (S.DEPARTMENT_CODE=D.DEPARTMENT_CODE) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(student.rows);
    }catch (err) {
        console.error(err.message);
    }
})


app.get("/teacherProfile/:id",async (req,res) =>{
    try{
        //const teacher = await pool.query("SELECT S.STUDENT_ID ID, U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME, U.PHONE_NUMBER PN, S.CURRENT_LEVEL Cl, S.CURRENT_TERM CT,TOTAL_DUE(2105128) AS DUE FROM STUDENTS S JOIN USERS U ON (U.USER_ID=S.STUDENT_ID) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(teacher.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffProfile/:id",async (req,res) => {
    try{
        const staff = await pool.query("SELECT ST.STAFF_ID, U.FIRST_NAME||' '|| U.LAST_NAME AS NAME, U.PHONE_NUMBER, SH.SHELF_ID,TOTAL_DUE(U.USER_ID) DUE, SH.CATEGORY FROM USERS U JOIN STAFFS ST ON(U.USER_ID=ST.STAFF_ID) JOIN SHELVES SH ON(ST.STAFF_ID=SH.STAFF_ID) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(staff.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/searchBooks/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const searchResults = await pool.query(
            "SELECT IMAGE(B.BOOK_ID) IMAGE_URL, COPIES_AVAILABLE(B.BOOK_ID) COPY, B.TITLE, B.CATEGORY, P.PUBLICATION_NAME, B.BOOK_ID FROM BOOKS B JOIN PUBLISHERS P ON (B.PUBLISHER_ID = P.PUBLISHER_ID) JOIN BOOK_AUTHOR_RELATION BAR ON (B.BOOK_ID = BAR.BOOK_ID) JOIN AUTHORS A ON (BAR.AUTHOR_ID = A.AUTHOR_ID) WHERE LOWER(A.AUTHOR_NAME) LIKE $1 UNION SELECT IMAGE(B2.BOOK_ID) IMAGE_URL, COPIES_AVAILABLE(B2.BOOK_ID), B2.TITLE, B2.CATEGORY, P2.PUBLICATION_NAME, B2.BOOK_ID FROM BOOKS B2 JOIN PUBLISHERS P2 ON (B2.PUBLISHER_ID = P2.PUBLISHER_ID) WHERE LOWER (P2.PUBLICATION_NAME) LIKE $1 UNION SELECT IMAGE(B3.BOOK_ID) IMAGE_URL, COPIES_AVAILABLE(B3.BOOK_ID), B3.TITLE, B3.CATEGORY, P3.PUBLICATION_NAME, B3.BOOK_ID FROM BOOKS B3 JOIN PUBLISHERS P3 ON (B3.PUBLISHER_ID = P3.PUBLISHER_ID) WHERE LOWER(B3.TITLE) LIKE $1 UNION SELECT IMAGE(B4.BOOK_ID) IMAGE_URL, COPIES_AVAILABLE(B4.BOOK_ID), B4.TITLE, B4.CATEGORY, P4.PUBLICATION_NAME, B4.BOOK_ID FROM BOOKS B4  JOIN PUBLISHERS P4 ON (B4.PUBLISHER_ID = P4.PUBLISHER_ID) WHERE LOWER(B4.CATEGORY) LIKE $1 ORDER BY TITLE", [`%${title.toLowerCase()}%`]
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
            ("SELECT IMAGE(B.BOOK_ID) IMAGE_URL, B.BOOK_ID,COPIES_AVAILABLE(B.BOOK_ID) COPY, B.TITLE, B.CATEGORY, AU.AUTHOR_NAME, PB.PUBLICATION_NAME, B.SHELF_ID FROM BOOKS B JOIN BOOK_AUTHOR_RELATION BAR ON(B.BOOK_ID=BAR.BOOK_ID) JOIN AUTHORS AU ON(BAR.AUTHOR_ID=AU.AUTHOR_ID) JOIN PUBLISHERS PB ON(B.PUBLISHER_ID=PB.PUBLISHER_ID) WHERE B.BOOK_ID=$1", [req.params.id]);
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

app.get("/staffborrowRequests/:id",async (req,res) =>{
    try{
        const staffs = await pool.query(
            "SELECT RBR.USER_REQUEST_ID AS REQUEST_ID,B.BOOK_ID,U.USER_ID AS STAFF_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STAFFS STA ON (STA.STAFF_ID = U.USER_ID) WHERE US.USER_ID=$1 AND RBR.REQUEST_STATUS='Pending'",[req.params.id]);
        res.json(staffs.rows);
    }catch (err) {
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
        const response = await pool.query("INSERT INTO SHELVES (CATEGORY,STAFF_ID) VALUES ($1,$2) RETURNING *",['Knowledge',newShelf]);
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

app.listen(5000, () => {
    console.log("server has started on port 5000");
})