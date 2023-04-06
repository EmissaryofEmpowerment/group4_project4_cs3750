const mongoose = require("mongoose");  //includes the "mongoose" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

//build your schemas here
const PlayerEntrySchema = new mongoose.Schema({
    Player: {
        type: String,
        require: true,
    },
    Score: {
        type: Number,
        require: true,
    },
    DateStamp: {
        type: Date,
        require: true,
    },
});

const PlayerLoginInfoSchema = new mongoose.Schema({
    Username: {
        type: String,
        unique: true,
        require: true,
    },
    Salt: {
        type: String,
        require: true,
    },
    HashedPassword: {
        type: String,
        require: true,
    },
});

//Compiles the model we defined inside the constants above and assigns them a name of what is inside the first argument (this is the name of the collection/table inside the DB)
const AppPlayerEntry = mongoose.model("PlayerEntry", PlayerEntrySchema);
const AppPlayerLoginInfo = mongoose.model("LoginInfo", PlayerLoginInfoSchema);

//exports the constants above so that we can make use of them outside this file, you can enclose the <AppRenameMe> inside a set of {} and add the models inside of it with a comma between each one to allow multiple models to be exported.  However, if are having issues with the exported models such as "TypeError: Cannot read properties of undefined ( reading find/create/findByIdAndUpdate/findByIdAndRemove )" try enclosing the <AppRenameMe> inside a set of {} and it should fix it.
module.exports = { AppPlayerEntry, AppPlayerLoginInfo };