// Package to run HTTP server
const express = require("express");

// This is a canonical alias to make your life easier, like jQuery to $.
const app = express();

// Using EJS Template to render view
app.set("view engine", "ejs");

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

//////////////////////////////////////// Getting Login Page ////////////////////////////////////////
app.get("/", function (req, res)
{
    res.render("loginSignup.ejs")
});

//////////////////////////////////////// Getting Todo Page ////////////////////////////////////////
app.get("/todo", function (req, res)
{
    // Update function is to get the latest data in the json file
    updateTodo(req, res)
});

////////////////////////////////////////////// Log Out ///////////////////////////////////////////
app.get("/logout", function (req, res) {
    fs.readFile(__dirname + "/data/session.json", (err, sessionData) => {
        if (err)
        {
            console.error("Error reading from session.json: ", err);
        }
        else
        {
            // Parse the session data and write nothing in it
            const currentSession = JSON.parse(sessionData);
            currentSession[0].loginEmail = "";
            fs.writeFile(__dirname + "/data/session.json", JSON.stringify(currentSession), err => {
                if (err)
                {
                 console.error("Error writing to session.json: ", err);
                }
                res.redirect('/');
            });
        }
    });
});

/////////////////////////////////////////// Login Page ///////////////////////////////////////////
app.post("/todo", function (req, res)
{
    fs.readFile(__dirname + "/data/users.json", (err, usersData) => {
        if (err)
        {
            console.error("Error reading from users.json: ", err);
        } 
        else
        {
            // Parsing User Data and checking if user's email and password match
            const users = JSON.parse(usersData);
            let userExists = false;
            for (let i = 0; i < users.length; i++)
            {
                if (users[i].email === req.body["loginEmail"] && users[i].password === req.body["loginPassword"])
                {
                    userExists = true;
                    fs.readFile(__dirname + "/data/session.json", (err, sessionData) => {
                        if (err)
                        {
                            console.error("Error reading from session.json: ", err);
                        } 
                        else 
                        {
                            // Also record the login email from the form to session.json
                            const session = JSON.parse(sessionData);
                            session[0].loginEmail = req.body["loginEmail"];
                            fs.writeFile(__dirname + "/data/session.json", JSON.stringify(session), err => {
                                if (err)
                                {
                                    console.error("Error writing to session.json: ", err);
                                }
                            });
                        }
                    });
                }
            }
            // If user exists admit to todo.ejs
            if (userExists)
            {
                updateTodo(req, res);
            }
            // else make them stay at the login page
            else
            {
                res.render("loginSignup.ejs");
            }
        }
    });
});

///////////////////////////////////////// Register Page //////////////////////////////////////////
app.post('/register', (req, res) => {
    fs.readFile(__dirname + "/data/users.json", (err, usersData) => {
        if (err)
        {
            console.error("Error reading from users.json: ", err);
        }
        else
        {
            // Parse users data and check if conidtions match or dont
            const users = JSON.parse(usersData);
            let userExists = false;
            for (let i = 0; i < users.length; i++)
            {
                // If email in the database
                if (users[i].email === req.body["registerEmail"])
                {
                    console.log("User already registered");
                    userExists = true;
                    break;  
                }

                // If email is empty
                if (req.body["registerEmail"] === '')
                {
                    console.log("Email is Empty");
                    userExists = true;
                    break;  
                }

                 // If password is empty
                if (req.body["registerPassword"] === '')
                {
                    console.log("Password is Empty");
                    userExists = true;
                    break;  
                }

                // If authentication is not done
                if (req.body["authentication"] != 'todo2023')
                {
                    console.log("Not Authenticated");   
                    userExists = true;
                    break;
                }
            }

            // Admit new user
            if (userExists === false)
            {
                // if database is empty
                if(users.length === 0)
                {
                    const newUser = {
                        id: 1,
                        email: req.body.registerEmail,
                        password: req.body.registerPassword
                    }
                    // push the user and write it in the json
                    users.push(newUser);
                }

                // if database has users
                else
                {
                    const newUser = {
                        id: users[users.length - 1].id + 1,
                        email: req.body.registerEmail,
                        password: req.body.registerPassword
                    };
                    users.push(newUser);
                }
                fs.writeFile(__dirname + "/data/users.json", JSON.stringify(users), err => {
                    if (err)
                    {
                        console.error("Error writiing to users.json: ", err);
                    }
                    res.redirect('/');
                });
            };
        };
    });
});

//////////////////////////////////////////// Add Task ////////////////////////////////////////////
app.post('/addTask', (req, res) => {
    // Reading task.json
    fs.readFile(__dirname + "/data/task.json", (err, taskData) => {
        if (err)
        {
            console.error("Error reading from task.json: ", err);
        }

        // Reading session.json
        fs.readFile(__dirname + "/data/session.json", (err, sessionData) => {
            if (err)
            {
                console.error("Error reading from session.json: ", err);
            }
            const username = JSON.parse(sessionData);
            const tasks = JSON.parse(taskData);
            console.log(tasks);

            // Task cant be empty
            if(req.body.addTask === "")
            {
                console.log("Task cant be empty");
            }

            // else add the task
            else
            {
                // Handling case where task.json is empty
                if( tasks.length === 0)
                {
                    const newTask = {
                        id: 1,
                        creator: username[0].loginEmail,
                        claimer: "",
                        taskText: req.body.addTask,
                        state: "unclaimed"
                    }
                    // push the task and write it in the json
                    tasks.push(newTask);
                }
                else
                {
                    const newTask = {
                        id: tasks[tasks.length - 1].id + 1,
                        creator: username[0].loginEmail,
                        claimer: "",
                        taskText: req.body.addTask,
                        state: "unclaimed"
                    };
                    // push the task and write it in the json
                    tasks.push(newTask);
                }

                fs.writeFile(__dirname + "/data/task.json", JSON.stringify(tasks), err => {
                    if (err)
                    {
                        console.error("Error writing to task.json: ", err);
                    }
                    res.redirect('/todo');
                });
            }
        });
    });
});

/////////////////////////////////////////// Claim Task ///////////////////////////////////////////
app.post('/claim', (req, res) => {
    fs.readFile(__dirname + "/data/task.json", (err, taskData) => {
        if (err)
        {
            console.error("Error reading from task.json: ", err);
        }

        // Checking to see if task mathces
        const tasks = JSON.parse(taskData);
        const taskId = req.body.taskId;
        console.log(taskId);
        let task = null;
        for (let i = 0; i < tasks.length; i++) {

            // Number is used to convert taskID into number from string
            if (tasks[i].id === Number(taskId)) {
                task = tasks[i];
                console.log(task)
                break;
            }
        }

        // If get a match change state to claimed
        task.state = "claimed";

        // Read session and update the claimer
        fs.readFile(__dirname + "/data/session.json", (err, sessionData) => {
            if (err)
            {
                console.error("Error reading from session.json: ", err);
            }
            const session = JSON.parse(sessionData);
            const currentSession = session[0].loginEmail;
            task.claimer = currentSession;

            fs.writeFile(__dirname + "/data/task.json", JSON.stringify(tasks), err => {
                if (err) 
                {
                    console.error("Error writing to task.json: ", err);
                }
                res.redirect('/todo');
            });
        });
    });
});

////////////////////////////////////// Abandon/Complete Task /////////////////////////////////////
app.post('/abandonorcomplete', (req, res) => {
    fs.readFile(__dirname + "/data/task.json", (err, taskData) => {
        if (err)
        {
            console.error("Error reading from task.json: ", err);
        }

        // looking for task id
        const tasks = JSON.parse(taskData);
        const taskId = Number(req.body.taskId);
        let taskcheck = null;
        for (let i = 0; i < tasks.length; i++)
        {
            if (tasks[i].id === taskId)
            {
                taskcheck = i;
                break; 
            }
        }

        // if found do this
        const task = tasks[taskcheck];
        const checkboxChecked = req.body.checkboxChecked === 'true';

        // if the box is checked ~ state to finish
        if (checkboxChecked) 
        {
            task.state = 'finished';
        }

        // else do the abandon button
        else
        {
            task.state = 'unclaimed';
            task.claimer = "";
        }
        fs.writeFile(__dirname + "/data/task.json", JSON.stringify(tasks), err => {
            if (err)
            {
                console.error("Error writing to task.json: ", err);
            }
            res.redirect('/todo');
        });
    });
});


////////////////////////////////////////// Unfinish Task /////////////////////////////////////////
app.post('/unfinish', (req, res) => {
    fs.readFile(__dirname + "/data/task.json", (err, taskData) => {
        if (err)
        {
            console.error("Error reading from task.json: ", err);
        }

        // Checking for task Id
        const tasks = JSON.parse(taskData);
        const taskId = req.body.taskId;
        let taskcheck = null;
        for (let i = 0; i < tasks.length; i++)
        {
            if (tasks[i].id === Number(taskId))
            {
                taskcheck = i;
                break;
            }
        }
        const task = tasks[taskcheck];
        const checkboxChecked = req.body.checkboxChecked === 'false';

        // If checkbox is not checked the state is claimed
        if (checkboxChecked)
        {
            task.state = 'claimed';
        }
        // stringify the tasks and write it in the json file
        fs.writeFile(__dirname + "/data/task.json", JSON.stringify(tasks), err => {
            if (err)
            {
                console.error("Error writing to task.json: ", err);
            }
            res.redirect('/todo');
        });
    });
});

//////////////////////////////////////////// Purge Task //////////////////////////////////////////
app.post('/purge', (req, res) => {
    fs.readFile(__dirname + "/data/task.json", (err, taskData) => {
        if (err)
        {
            console.error("Error reading from task.json: ", err);
        }
        const tasks = JSON.parse(taskData);

        // Store the unfinished tasks in different array
        const unfinishedTasks = [];

        // accessing individual task from tasks and pushing them into the array
        for (let task of tasks)
        {
            if (task.state !== "finished")
            {
                unfinishedTasks.push(task);
            }
        }

        // writing it to json
        fs.writeFile(__dirname + "/data/task.json", JSON.stringify(unfinishedTasks), err => {
            if (err) {
                console.error("Error writing to task.json:", err);
            }
            res.redirect('/todo');
        });
    });
});

////////////////////////////// Prototype and Defination of updatetodo ////////////////////////////
function updateTodo(req, res)
{
    fs.readFile(__dirname + "/data/task.json", (err, taskData) => {
        if (err)
        {
            console.error("Error reading from task.json: ", err);
        }
        fs.readFile(__dirname + "/data/session.json", (err, sessionData) => {
            if (err)
            {
                console.error("Error reading from session.json: ", err);
            }

            // Parsing both sessionData and Task Data to be passed
            const tasks = JSON.parse(taskData);
            const session = JSON.parse(sessionData);

            // This is session data access for just one user and contains one user
            const currentSession = session[0].loginEmail;

            // Arrays for different types of data to be stored depending on state or session information
            const unclaimedCurrentUserTasks = [];
            const unclaimedDifferentUserTasks = [];
            const createdCurrentUserClaimedCurrentUserTasks = [];
            const createdDifferentUserClaimedDifferentUserTasks = [];
            const createdCurrentUserClaimedDifferentUserTasks = [];
            const createdDifferentUserClaimedCurrentUserTasks = [];
            const createdCurrentUserFinishedCurrentUserTasks = [];
            const createdDifferentUserFinishedDifferentUserTasks = [];
            const createdCurrentUserFinishedDifferentUserTasks = [];
            const createdDifferentUserFinishedCurrentUserTasks = [];

            // looping though the whole data and assigning each array with different type of data ~ basically storing task ids
            for (let i = 0; i < tasks.length; i++)
            {
                if (tasks[i].creator === currentSession && tasks[i].state === "unclaimed")
                {
                    unclaimedCurrentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator !== currentSession && tasks[i].state === "unclaimed")
                {
                    unclaimedDifferentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator === currentSession && tasks[i].claimer === currentSession && tasks[i].state === "claimed")
                {
                    createdCurrentUserClaimedCurrentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator !== currentSession && tasks[i].claimer !== currentSession && tasks[i].state === "claimed")
                {
                    createdDifferentUserClaimedDifferentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator === currentSession && tasks[i].claimer !== currentSession && tasks[i].state === "claimed")
                {
                    createdCurrentUserClaimedDifferentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator !== currentSession && tasks[i].claimer === currentSession && tasks[i].state === "claimed")
                {
                    createdDifferentUserClaimedCurrentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator ===currentSession && tasks[i].claimer === currentSession && tasks[i].state === "finished")
                {
                    createdCurrentUserFinishedCurrentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator !== currentSession && tasks[i].claimer !== currentSession && tasks[i].state === "finished")
                {
                    createdDifferentUserFinishedDifferentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator === currentSession && tasks[i].claimer !== currentSession && tasks[i].state === "finished")
                {
                    createdCurrentUserFinishedDifferentUserTasks.push(tasks[i]);
                }
                if (tasks[i].creator !== currentSession && tasks[i].claimer === currentSession && tasks[i].state === "finished")
                {
                    createdDifferentUserFinishedCurrentUserTasks.push(tasks[i]);
                }
            }

            // passing this data to tot.ejs template for rendering
            res.render("todo.ejs", {
                username: currentSession,
                unclaimedCurrentUser: unclaimedCurrentUserTasks,
                unclaimedDifferentUser: unclaimedDifferentUserTasks,
                createdCurrentUserClaimedCurrentUser: createdCurrentUserClaimedCurrentUserTasks,
                createdDifferentUserClaimedDifferentUser: createdDifferentUserClaimedDifferentUserTasks,
                createdCurrentUserClaimedDifferentUser: createdCurrentUserClaimedDifferentUserTasks,
                createdDifferentUserClaimedCurrentUser: createdDifferentUserClaimedCurrentUserTasks,
                createdCurrentUserFinishedCurrentUser: createdCurrentUserFinishedCurrentUserTasks,
                createdDifferentUserFinishedDifferentUser: createdDifferentUserFinishedDifferentUserTasks,
                createdCurrentUserFinishedDifferentUser: createdCurrentUserFinishedDifferentUserTasks,
                createdDifferentUserFinishedCurrentUser: createdDifferentUserFinishedCurrentUserTasks
            });
        });
    });
}