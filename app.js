const express = require('express');
const app = express();
const users = require("./controllers/users");

const db = require("./db/models");

app.use(express.json());
app.use("/users", users);


app.get("/", (req, res) => {
    res.send("Hello World");
});




app.listen(8080, () => {
    console.log("Server is running on port 8080");
})