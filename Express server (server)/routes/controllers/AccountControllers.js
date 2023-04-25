const {
    AppPlayerLoginInfo,
} = require("../../models/models");  //include our "models.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

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
            req.session.Username = CreatedUser.Username;
            req.session.Inline = true;
            WaitingPlayers++;
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
                req.session.Username = User.Username;
                WaitingPlayers++;
                console.log(`Waiting players is now ${WaitingPlayers}`);
                req.session.save(function (err) {  //saves the session and cookie for both the client and server
                    if (err) {
                        console.log(`The following error occurred in saving the session:\n\r\t${err}`);
                    }
                    else {
                        console.log("Inside AccountControllers.js: The session is now " + JSON.stringify(req.session));
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
    const Inline = req.session.Inline;

    req.session.destroy((err) => {
        if (err) {
            console.log("Some error occurred to prevent you from logging out");
            res.status(404).json({
                message: "Something occurred to prevent you from logging out",
                error: err.message,
            });
        }
        else {
            console.log("Logout successful");
            // res.clearCookie(process.env.COOKIE_NAME);  // (not used because the moment they reload any page it is recreated) Deletes the cookie from the client.  Solution source https://www.geeksforgeeks.org/express-js-res-clearcookie-function/
            console.log("The session is now " + JSON.stringify(req.session));
            if (Inline) { // only decrements the WaitingPlayers, if the player is inline, if in game, they're not inline
                WaitingPlayers--;
                console.log(`Waiting players is now ${WaitingPlayers}`);
            }
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
        // WaitingPlayers++;
        res.json({
            IsAuth: true
        });
    }
    else {
        console.log("User not logged in");
        // WaitingPlayers--;
        res.json({
            IsAuth: false
        });
    }
};