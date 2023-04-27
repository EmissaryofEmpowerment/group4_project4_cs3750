const express = require("express");  //includes the "express" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
const cors = require("cors");  //includes the "cors" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
require("dotenv").config();  //makes it so that we require and configure the package so that we can use the .env file

const ConnectToDB = require("./configurations/database");  //include our "database.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
const ExternalRoutes = require("./routes/routes");  //include our "routes.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

// The two below variables are used for making sessions with the client
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const PORT = process.env.PORT || 3001;

ConnectToDB();  //connect to the mongodb database

// add the middleware for providing a connect/express that is used for Cross-Origin Resource Sharing
app.use(cors({
    origin: "http://localhost:3000",  //added with professor (allows the supplied url to talk to the server)
    credentials: true  // Allows credentials from the origin
}));

// add the middleware so express can parse incoming JSON payloads, if any, in any incoming API requests
app.use(express.json({
    extended: false
}));

// add the middleware so that we can make sessions
const store = new MongoDBStore({
    uri: process.env.MONGO_DB_URL,
    collection: "sessions"
});

// Catch errors
store.on('error', function(error) {
    console.log(error);
});

app.use(session({
    name: process.env.COOKIE_NAME,  // The name of the cookie
    secret: process.env.SESS_SECRET,  // a secret set of characters used to sign the cookie
    // Boilerplate options, see:
    // https://www.npmjs.com/package/express-session#resave
    // https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,  // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: true,  // Forces a session that is "uninitialized" to be saved to the store.
    store: store,  // Saves the cookie to the Mongo DB instead of memory
    cookie: {
        maxAge: 1000 * 60 * 60 * 3,  // cookie expires in 3 hours
    }
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