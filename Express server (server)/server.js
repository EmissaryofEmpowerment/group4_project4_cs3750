const express = require("express");  //includes the "express" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
const cors = require("cors");  //includes the "cors" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
require("dotenv").config();  //makes it so that we require and configure the package so that we can use the .env file

const ConnectToDB = require("./configurations/database");  //include our "database.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
const ExternalRoutes = require("./routes/routes");  //include our "routes.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

const app = express();
const PORT = process.env.PORT || 3001;

ConnectToDB();  //connect to the mongodb database

// add the middleware for providing a connect/express that is used for Cross-Origin Resource Sharing
app.use(cors({
    origin: true,
    credentials: true
}));

// add the middleware so express can parse incoming JSON payloads, if any, in any incoming API requests
app.use(express.json({
    extended: false
}));

app.get("/", (req, res) =>  //this is the root url for the server
    res.send("Hello there!! Cheers !! The server is up and running")
);

// using our routes we defined inside our "routes.js" file
app.use("/api", ExternalRoutes);  //adds our custom http responses from the file specified for "ExternalRoutes"

// listen
app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
);