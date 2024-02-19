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

        // Insert the book into the BOOKS table
        const book = await pool.query(
            "INSERT INTO BOOKS (TITLE, CATEGORY, PUBLISHER_ID, SHELF_ID) VALUES ($1, $2, $3, $4) RETURNING *",
            [TITLE, CATEGORY, PUBLISHER, SHELF_ID]
        );

        const bookId = book.rows[0].book_id;

        // Insert the book-author relationships into the BOOK_AUTHOR_RELATION table
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
        const books = await pool.query("SELECT BOOK_ID,COPIES_AVAILABLE(BOOK_ID) COPY,TITLE,CATEGORY,(SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID=B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B ORDER BY TITLE");
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/showBooksByCategory", async (req, res) => {
    try {
        const { title, category } = req.query; // Destructure title and category from query parameters
        const books = await pool.query("SELECT BOOK_ID,COPIES_AVAILABLE(BOOK_ID) COPY, TITLE, CATEGORY, (SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID = B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B WHERE B.CATEGORY = $1 AND LOWER(B.TITLE) LIKE $2 ORDER BY BOOK_ID", [category, `%${title.toLowerCase()}%`]); // Adjusted query to use LIKE for case-insensitive title search
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Respond with an error status
    }
});



app.get("/myProfile/:id",async (req,res) =>{
    try{
        const staff = await pool.query("SELECT ST.STAFF_ID, U.FIRST_NAME||' '|| U.LAST_NAME AS NAME, U.PHONE_NUMBER, SH.SHELF_ID, SH.CATEGORY FROM USERS U JOIN STAFFS ST ON(U.USER_ID=ST.STAFF_ID) JOIN SHELVES SH ON(ST.STAFF_ID=SH.STAFF_ID) WHERE U.USER_ID=$1",[req.params.id]);
        res.json(staff.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/searchBooks/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const searchResults = await pool.query(
            "SELECT BOOK_ID,COPIES_AVAILABLE(BOOK_ID) COPY, TITLE, CATEGORY, (SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID = B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B WHERE LOWER(TITLE) LIKE $1 ORDER BY BOOK_ID",
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
            ("SELECT B.BOOK_ID,COPIES_AVAILABLE(B.BOOK_ID) COPY, B.TITLE, B.CATEGORY, AU.AUTHOR_NAME, PB.PUBLICATION_NAME, B.SHELF_ID FROM BOOKS B JOIN BOOK_AUTHOR_RELATION BAR ON(B.BOOK_ID=BAR.BOOK_ID) JOIN AUTHORS AU ON(BAR.AUTHOR_ID=AU.AUTHOR_ID) JOIN PUBLISHERS PB ON(B.PUBLISHER_ID=PB.PUBLISHER_ID) WHERE B.BOOK_ID=$1", [req.params.id]);
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/studentborrowRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const students = await pool.query(
            "SELECT B.BOOK_ID,U.USER_ID AS STUDENT_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STUDENTS ST ON (ST.STUDENT_ID = U.USER_ID) WHERE US.USER_ID=$1",[req.params.id]);
        res.json(students.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/teacherborrowRequests/:id",async (req,res) =>{
    try{
        //const user_id=req.user;
        const teachers = await pool.query(
            "SELECT B.BOOK_ID,U.USER_ID AS TEACHER_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN TEACHERS T ON (T.TEACHER_ID = U.USER_ID) WHERE US.USER_ID=$1",[req.params.id]);
        res.json(teachers.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/staffborrowRequests/:id",async (req,res) =>{
    try{
        const staffs = await pool.query(
            "SELECT B.BOOK_ID,U.USER_ID AS STAFF_ID,U.FIRST_NAME || ' ' || U.LAST_NAME AS NAME,B.TITLE AS TITLE,UR.REQUEST_DATE AS DATE_BORROWED, RBR.REQUEST_STATUS AS REQUEST_STATUS FROM USER_REQUEST UR JOIN USERS U ON(UR.USER_ID=U.USER_ID) JOIN REQUEST_BOOK_RELATION RBR ON (RBR.USER_REQUEST_ID= UR.USER_REQUEST_ID) JOIN BOOKS B ON (RBR.BOOK_ID = B.BOOK_ID) JOIN SHELVES S ON (S.SHELF_ID=B.SHELF_ID) JOIN USERS US ON(US.USER_ID=S.STAFF_ID) JOIN STAFFS STA ON (STA.STAFF_ID = U.USER_ID) WHERE US.USER_ID=$1",[req.params.id]);
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
        const user_id = req.user;
        const book = await pool.query("DELETE FROM CART WHERE USER_ID = $1 AND BOOK_ID = $2", [user_id, id]);
        res.json({ message: "Book deleted from cart" });
    } catch (err) {
        console.error(err.message);
    }
})


app.listen(5000, () => {
    console.log("server has started on port 5000");
})