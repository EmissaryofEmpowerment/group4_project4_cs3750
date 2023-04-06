const mongoose = require("mongoose");  //includes the "mongoose" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp
require("dotenv").config();  //makes it so that we require and configure the package so that we can use the .env file

const dbURL = process.env.MONGO_DB_URL;  //make a local variable of what is inside the .env file for the MONGO_DB_URL variable

const ConnectToDB = async () => {
    try {
        await mongoose.connect(dbURL, {  //wait until a connection to the DB is established 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    console.log("Database connected");
    }
    catch (err) {  //if an error occurred, display the error and quit the process of connecting to the db
        console.log(err);
        process.exit(1);  //documentation can be found here for this function https://nodejs.org/api/process.html#process_process_exit_code
    }
};

module.exports = ConnectToDB;  //export the constant "configDatabase" so that we can make use of it outside this file