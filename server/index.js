const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.post("/studentLogIn", async (req, res) => {
    try {
        const { PHONE, PASSWORD } = req.body;
        const staff = await pool.query("SELECT * FROM STUDENTS WHERE PHONE_NUMBER=$1 AND LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
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
        const staff = await pool.query("SELECT * FROM TEACHERS WHERE PHONE_NUMBER=$1 AND LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
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

app.post("/staffLogIn", async (req, res) => {
    try {
        const { PHONE, PASSWORD } = req.body;
        const staff = await pool.query("SELECT * FROM STAFFS WHERE PHONE_NUMBER=$1 AND LIBRARY_PASSWORD=$2", [PHONE, PASSWORD]);
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
        const {PHONE} = req.params;
        const staff = await pool.query("SELECT * FROM STAFFS WHERE PHONE_NUMBER=$1", [PHONE]);
        res.json(staff.rows)
    }catch(err){
        console.log(err.message);
    }
})

app.post("/addBooks", async (req, res) => {
    try {
        const { TITLE, CATEGORY, AUTHOR, PUBLISHER, SHELF_ID } = req.body;

        /*const checkAuthor = await pool.query("SELECT * FROM AUTHORS WHERE AUTHOR_NAME=$1", [AUTHOR]);
        const checkPublisher = await pool.query("SELECT * FROM PUBLISHERS WHERE PUBLICATION_NAME = $1", [PUBLISHER]);

        let author = undefined;
        if (checkAuthor.rows.length > 0) {
            //author = checkAuthor.rows[0];
            console.log("check author");
        }
        else {
            let count = await pool.query("SELECT COUNT(*) FROM AUTHORS");
            author = await pool.query("INSERT INTO AUTHORS (AUTHOR_ID,AUTHOR_NAME) VALUES ($1,$2) RETURNING *", [parseInt(count.rows[0].count) + 1, AUTHOR]);
        }

        let publisher = undefined;
        if (checkPublisher.rows.length > 0) {
            publisher = checkPublisher.rows[0];
            console.log("check publisher");
        }
        else {
            let count = await pool.query("SELECT COUNT(*) FROM PUBLISHERS")
            publisher = await pool.query("INSERT INTO PUBLISHERS (PUBLISHER_ID,PUBLICATION_NAME) VALUES ($1,$2) RETURNING *", [parseInt(count.rows[0].count) + 1, PUBLISHER]);
            console.log("write publisher");
        }*/

        const book = await pool.query("INSERT INTO BOOKS (TITLE, CATEGORY,PUBLISHER_ID,SHELF_ID) VALUES ($1, $2, $3, $4) RETURNING *", [TITLE, CATEGORY, PUBLISHER, SHELF_ID]);
        const book_author = await pool.query("INSERT INTO BOOK_AUTHOR_RELATION (BOOK_ID,AUTHOR_ID) VALUES($1,$2) RETURNING *", [book.rows[0].book_id, AUTHOR]);
        res.json(book_author.rows[0]);

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
        const books = await pool.query("SELECT BOOK_ID,TITLE,CATEGORY,(SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID=B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B ORDER BY BOOK_ID");
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/myProfile/:id",async (req,res) =>{
    try{
        const staff = await pool.query("SELECT S.STAFF_ID,S.FIRST_NAME ||' '|| S.LAST_NAME AS NAME,S.PHONE_NUMBER,SH.SHELF_ID,SH.CATEGORY FROM STAFFS S JOIN SHELVES SH ON (S.STAFF_ID=SH.STAFF_ID) WHERE S.STAFF_ID=$1",[req.params.id]);
        res.json(staff.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.get("/searchBooks/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const searchResults = await pool.query(
            "SELECT BOOK_ID, TITLE, CATEGORY, (SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID = B.PUBLISHER_ID) AS PUBLICATION FROM BOOKS B WHERE LOWER(TITLE) LIKE $1 ORDER BY BOOK_ID",
            [`${title.toLowerCase()}%`]
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
            ("SELECT B.BOOK_ID,B.TITLE,B.CATEGORY,A.AUTHOR_NAME,(SELECT PUBLICATION_NAME FROM PUBLISHERS WHERE PUBLISHER_ID=B.PUBLISHER_ID) AS PUBLICATION, B.SHELF_ID FROM BOOK_AUTHOR_RELATION BA JOIN AUTHORS A ON(BA.AUTHOR_ID=A.AUTHOR_ID) JOIN BOOKS B ON (B.BOOK_ID=BA.BOOK_ID) WHERE BA.BOOK_ID=$1", [req.params.id]);
        res.json(books.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/borrowRequests/:id",async (req,res) =>{
    try{
        const students = await pool.query("SELECT ST.STUDENT_ID,B.BOOK_ID,SBR.DATE_BORROWED, ST.FIRST_NAME||' '||ST.LAST_NAME AS STUDENT,B.TITLE,SBR.REQUEST_STATUS FROM STUDENT_BORROW_RELATION SBR JOIN BOOKS B ON (SBR.BOOK_ID=B.BOOK_ID) JOIN SHELVES S ON (B.SHELF_ID=S.SHELF_ID) JOIN STUDENTS ST ON (SBR.STUDENT_ID= ST.STUDENT_ID) WHERE SBR.REQUEST_STATUS='Pending' AND S.STAFF_ID=$1",[req.params.id]);
        res.json(students.rows);
    }catch (err) {
        console.error(err.message);
    }
})

app.listen(5000, () => {
    console.log("server has started on port 5000");
})