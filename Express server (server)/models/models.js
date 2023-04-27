const mongoose = require("mongoose");  //includes the "mongoose" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

//build your schemas here
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

const DictionarySchema = new mongoose.Schema({
    Word: {
        type: String,
        unique: true,
        require: true,
    },
});

//Compiles the model we defined inside the constants above and assigns them a name of what is inside the first argument (this is the name of the collection/table inside the DB)
const AppPlayerLoginInfo = mongoose.model("LoginInfo", PlayerLoginInfoSchema);
const AppDictionary = mongoose.model("Dictionary", DictionarySchema);

//exports the constants above so that we can make use of them outside this file, you can enclose the <AppRenameMe> inside a set of {} and add the models inside of it with a comma between each one to allow multiple models to be exported.  However, if are having issues with the exported models such as "TypeError: Cannot read properties of undefined ( reading find/create/findByIdAndUpdate/findByIdAndRemove )" try enclosing the <AppRenameMe> inside a set of {} and it should fix it.
module.exports = { AppPlayerLoginInfo, AppDictionary };