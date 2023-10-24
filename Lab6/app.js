// Package to run HTTP server
const express = require("express");

// This is a canonical alias to make your life easier, like jQuery to $.
const app = express();

// File System Module
const fs = require("fs");

// Host static resources, like js and css ~ also included html since it worked
app.use(express.static("public"));

// Configure express to access variables in req.body object when submitting forms
app.use(express.urlencoded({ extended: true }));

// A common localhost test port
const port = 3000;

// Simple server operation
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Code you wish to run when the user get's the route must be in here!
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/loginSignup.html");
    console.log("A user requested the Login and Signup page");
});

// This code will run only if a user submits a form to the `/` route
app.post("/", (req, res) => {

    // If error throw an error ~ err & if not error aka data read the data. Source from: https://www.geeksforgeeks.org/node-js-fs-read-method/
    fs.readFile(__dirname + "/public/data/users.json", (err, data) => {
        if (err)
        {
            console.error("Json file not being read and the error is ", err);
        }
        else
        {
            // Parse the JSON data to get a JavaScript object. Comes out as an array
            const users = JSON.parse(data);
            // Bool Function
            let userExists = false;
            // Simple For loop reads the size of an array and compares form data to json data
            for (let i = 0; i < users.length; i++)
            {
                if (users[i].email === req.body["loginEmail"] && users[i].password === req.body["loginPassword"])
                {
                    // if check is mateched. Set bool to true and break it from the loop
                    userExists = true;
                    break;
                }
        }
        // If bool is true head to the restricted page ~ todo.html
        if (userExists)
        {
            res.redirect("/html/todo.html");
        }
        // If bool not true head to the same root page ~ loginSignup.html
        else
        {
            res.redirect("/");
        }
    }
    });
});