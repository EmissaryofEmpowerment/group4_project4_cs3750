const {
    AppPlayerLoginInfo,
} = require("../../models/models");  //include our "models.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

let waitingPlayers = 0; // when a user signs in, this count will be incremented and decremented on logout
let timerRunning = false;


//make your routes here
exports.UsernameUsed = (req, res) => {
    console.log("\nAccountControllers.js file/UsernameBeingUsed route");
    AppPlayerLoginInfo.findOne({ Username: req.params.Username })
        .then((Account) => {
            if (Account !== null) {
                console.log("Username is being used");
                res.json({
                    message: "The supplied username is already being used, choose another.",
                    used: true,
                });
            }
            else {
                console.log("Username not used");
                res.json({
                    used: false,
                })
            }
        })
        .catch((err) => {
            console.log(`The following error occurred in seeing if username exists:\n\r\t${err}`);
            res.status(404).json({
                message: "Can't validate if the username is being used",
                error: err.message,
            })
        });
};

exports.CreateUser = (req, res) => {
    console.log("\nAccountControllers.js file/CreateUser route");
    // console.log(`\tUsername: ${req.body.Username}
    //     \r\tSalt:  ${req.body.Salt}
    //     \r\tHashedPassword:  ${req.body.HashedPassword}`)
    AppPlayerLoginInfo.create(req.body)
        .then((CreatedUser) => {
            console.log({ CreatedUser });
            req.session.IsAuth = true;
            req.session.Inline = true;
            waitingPlayers++;
            req.session.User = CreatedUser.Username;
            req.session.save(function (err) {  //saves the session and cookie for both the client and server
                if (err) {
                    console.log(`The following error occurred in saving the session:\n\r\t${err}`);
                    res.send({
                        IsAuth: false,
                    });
                }
                else {
                    console.log("The session is now " + JSON.stringify(req.session));
                    // res.send(JSON.stringify(req.session));  //only for debugging
                    res.json({
                        message: "Cheers!! You have successfully created a new user",
                        IsAuth: true,
                    });
                }
            });

        })
        .catch((err) => {
            console.log(`The following error occurred in creating the new user:\n\r\t${err}`)
            res.status(404).json({
                message: "Sorry, your account can't be created",
                error: err.message,
            });
        });
};

exports.GetSaltForUser = (req, res) => {
    console.log("\nAccountControllers.js file/GetSaltForUser route");
    // console.log(req.params);
    AppPlayerLoginInfo.findOne({ Username: req.params.Username })
        .then((Account) => {
            if (Account !== null) {
                console.log({ Account });
                res.json({
                    Salt: Account.Salt,
                });
            }
            else {
                console.log("There is no user with that username");
                res.status(400).json({
                    message: "There is no user with that username",
                });
            }
        })
        .catch((err) => {
            console.log(`The following error occurred in authenticating the user:\n\r\t${err}`);
            res.status(404).json({
                message: "The salt value can't be fetched",
                error: err.message,
            })
        });
};

exports.Login = (req, res) => {
    console.log("\nAccountControllers.js file/Login route");
    const { Username, HashedPassword } = req.body;  //Extract the information from the req.body
    AppPlayerLoginInfo.findOne({ Username: Username, HashedPassword: HashedPassword }, "-_id Username HashedPassword")  //selects only the UserName and HashedPassword fields from the result (for readability inside the console)
        .then((User) => {
            console.log(`DB info:     ${JSON.stringify(User)}
                \rClient info: ${JSON.stringify(req.body)}`);
            if (User) {
                console.log("Login valid");
                //make the session with two variables
                req.session.IsAuth = true;
                req.session.Inline = true;
                waitingPlayers++;
                req.session.User = User.Username;
                console.log("waitingPlayers before " + waitingPlayers);
                waitingPlayers++;
                console.log("waitingPlayers after " + waitingPlayers);
                req.session.save(function (err) {  //saves the session and cookie for both the client and server
                    if (err) {
                        console.log(`The following error occurred in saving the session:\n\r\t${err}`);
                    }
                    else {
                        console.log("The session is now " + JSON.stringify(req.session));
                        // res.send(JSON.stringify(req.session));  //only for debugging
                        res.json({
                            IsAuth: true,
                        });
                    }
                });
            }
            else {
                console.log("Password incorrect for that username");
                res.status(400).json({
                    message: "Password incorrect for that username",
                    IsAuth: false,
                });
            }
        })
        .catch((err) => {
            console.log(`The following error occurred in authenticating the user:\n\r\t${err}`)
            res.status(404).json({
                message: "There isn't any users available",
                error: err.message,
            });
        });
};

exports.Logout = (req, res) => {
    console.log("\nAccountControllers.js file/Logout route");
    // Now destroy the session inside the DB/memory and unset the req.session property.
    req.session.destroy((err) => {
        if (err) {
            console.log("Some error occurred to prevent you from logging out");
            res.status(404).json({
                message: "Something occurred to prevent you from logging out",
                error: err.message,
            });
        }
        else {
            if (waitingPlayers > 0) { waitingPlayers--; }
            else if (waitingPlayers === 0 || waitingPlayers < 0) { waitingPlayer = 0; }
            console.log("waitingPlayers " + waitingPlayers);
            console.log("Logout successful");
            // res.clearCookie(process.env.COOKIE_NAME);  // (not used because the moment they reload any page it is recreated) Deletes the cookie from the client.  Solution source https://www.geeksforgeeks.org/express-js-res-clearcookie-function/
            console.log("The session is now " + JSON.stringify(req.session));
            timerRunning = false;
            timerValue = null;
           waitingPlayers--;
            res.json({
                IsAuth: false,
            });
        }
    });
};

exports.IsAuth = (req, res) => {
    console.log("\nAccountControllers.js file/IsAuth route");
    console.log(`Current Session:\n\t${JSON.stringify(req.session)}`);
    if (req.session.IsAuth) {
        console.log("User logged in");
        res.json({
            IsAuth: true
        });
    }
    else {
        console.log("User not logged in");
        res.json({
            IsAuth: false
        });
    }
};


// start game from waiting room
// mode 1 = (3) second game start timer 
// mode 2 = (60) second game start timer 
// the timer starts when there are two plays in the room ready to play
exports.StartGame = async (req, res) => {
    console.log(req.body.mode);
    if ( req.session.Inline === true) {
        waitingPlayers--; // the user is either added or removed from que
        req.session.Inline = false;
    }
    console.log("waitingPlayers " + waitingPlayers);
    if (req.body.mode === 2) {
        console.log("the mode is: " + req.body.mode);
        res.send('Game started');
        startTimer(2);
    }
    else if (waitingPlayers === 0 && req.body.mode === 1) {
        console.log("the mode is: " + req.body.mode);
        // Send start game signal to both players
        res.send('Game started');
        startTimer(1);
    } else {
        res.send('Waiting for another player');
    }
};

// mode 1 = (3) second game start timer 
// mode 2 = (60) second game start timer 
// the timer starts when there are two plays in the room ready to play
function startTimer(mode) {
    if (mode === 1) {
        if (!timerRunning) {
            console.log('3 sec Timer started');
            timerRunning = true;
            timerValue = Date.now();
            setTimeout(() => {
                console.log('Timer ended');
                timerRunning = false;
                timerValue = null;
            }, 3000);
        } else {
            console.log('Timer is already running');
        }
    } else if (mode === 2) {
        if (!timerRunning) {
            console.log('60 sec Timer started');
            timerRunning = true;
            timerValue = Date.now();
            setTimeout(() => {
                console.log('Timer ended');
                timerRunning = false;
                timerValue = null;
            }, 60000);
        } else {
            console.log('Timer is already running');
        }
    }
}

exports.checkTimer = async (req, res) => {
    if (timerRunning) {
        const elapsedTime = Math.floor((Date.now() - timerValue) / 1000);
        console.log(`Timer is currently running. Elapsed time: ${elapsedTime} s`);
        res.send({ Timer: true, elapsedTime });
    } else if (!timerRunning && waitingPlayers === 0) {
        console.log('Timer has finished');
        res.send({ Timer: false, elapsedTime: null });
    } else {
        console.log('Game not ready');
        res.send({ message: 'Game not ready', elapsedTime: null });
    }
}




// function startTimer(mode) {
//     if (mode === 1) {
//         if (!timerRunning) {
//             console.log('3 sec Timer started');
//             timerRunning = true;
//             setTimeout(() => {
//                 console.log('Timer ended');
//                 timerRunning = false;
//             }, 3000);
//         } else {
//             console.log('Timer is already running');
//         }
//     }
//     else if (mode === 2) {
//         if (!timerRunning) {
//             console.log('60 sec Timer started');
//             timerRunning = true;
//             setTimeout(() => {
//                 console.log('Timer ended');
//                 timerRunning = false;
//             }, 6000);
//         } else {
//             console.log('Timer is already running');
//         }
//     }
// }

// exports.checkTimer = async (req, res) => {
//     if (timerRunning) {
//         console.log('Timer is currently running');
//         res.send('Timer is currently running');
//     }
//     if (!timerRunning && waitingPlayers === 0) {
//         console.log('Timer is finished');
//         res.send('Timer is finished');
//     }
//     else {
//         //res.send('Game not ready');
//     }

// };