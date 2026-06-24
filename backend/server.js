const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running");
});


// REGISTER
app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    db.query(
        "INSERT INTO users(name,email,password) VALUES(?,?,?)",
        [name, email, password],
        (err, result) => {

            if(err){
                console.log(err);
                return res.status(500).send("Database Error");
            }

            res.send("User Registered Successfully");
        }
    );
});


// LOGIN
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {

            if(err){
                return res.status(500).send("Database Error");
            }

            if(result.length > 0){
                res.json({
                    success:true,
                    userId:result[0].id,
                    name:result[0].name
                });
            }
            else{
                res.json({
                    success:false,
                    message:"Invalid Email or Password"
                });
            }

        }
    );
});


// CREATE NOTE
app.post("/createnote", (req, res) => {

    const { title, content, user_id } = req.body;

    db.query(
        "INSERT INTO notes(title,content,user_id) VALUES(?,?,?)",
        [title, content, user_id],
        (err, result) => {

            if(err){
                console.log(err);
                return res.status(500).send("Database Error");
            }

            res.send("Note Created Successfully");
        }
    );
});


// VIEW NOTES OF USER
app.get("/notes/:userId", (req, res) => {

    const userId = req.params.userId;

    db.query(
        "SELECT * FROM notes WHERE user_id=? ORDER BY id DESC",
        [userId],
        (err, result) => {

            if(err){
                return res.status(500).send("Database Error");
            }

            res.json(result);
        }
    );
});


// UPDATE NOTE
app.put("/updatenote", (req, res) => {

    const { id, title, content } = req.body;

    db.query(
        "UPDATE notes SET title=?, content=? WHERE id=?",
        [title, content, id],
        (err, result) => {

            if(err){
                return res.status(500).send("Database Error");
            }

            res.send("Note Updated Successfully");
        }
    );
});


// DELETE NOTE
app.delete("/deletenote/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM notes WHERE id=?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).send("Database Error");
            }

            res.send("Note Deleted Successfully");
        }
    );
});


// LOGOUT
app.get("/logout", (req, res) => {
    res.send("Logout Success");
});


app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});