const {
    AppGameLogic
} = require("../../models/models");  //include our "models.js" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

//make your routes here
exports.ControllerToRead = (req, res) => {
    //inside the {} you can filter results that are returned by using the syntax "fieldName: value" with a comma between each condition
    //This can be further filtered by after the {}, you can add the following code ", 'FieldName1 FieldName2 ect.'".  This will only return the fields you specified inside the ''.
    const {UserGuess} = req.body;
    AppGameLogic.find({})
        .then((ReturnedData) => {
            //Check against the word URL
            let Valid_Word = false;
            Valid_Word ? '' : ''
            console.log({ ReturnedData });
            res.json(ReturnedData);
        })
        .catch((err) => {
            console.log(`The following error occurred with reading the data:\n${err}`);
            res.status(404).json({
                message: "There isn't any data available",
                error: err.message,
            });
        });
};
{/* 
exports.ControllerToCreate = (req, res) => {
    <AppRenameMe>.create(req.body)  //req.body contains all the data that will be used to create a new entry for the DB
        .then((createdData) => {
            console.log({ createdData });
            res.json({
                message: "Cheers!! You have successfully added your data",
                createdData,
            });
        })
        .catch((err) => {
            console.log(`The following error occurred with creating the data:\n${err}`);
            re.status(404).json({
                message: "Sorry your data cannot be added",
                error: err.message,
            });
        });
};

exports.ControllerToUpdate = (req, res) => {
    <AppRenameMe>.findByIdAndUpdate(req.params.id, req.body)
        .then((dataBeingUpdated) => {
            console.log({ dataBeingUpdated });
            res.json({
                message: "Cheers!! You have successfully updated the targeted data",
                dataBeingUpdated,
            });
        })
        .catch((err) => {
            console.log(`The following error occurred for updating the data:\n${err}`);
            res.status(404).json({
            message: "Sorry your the targeted data cannot be updated",
            error: err.message,
            });
        });
};

exports.ControllerToDelete = (req, res) => {
    <AppRenameMe>.findByIdAndRemove(req.params.id, req.body)
        .then((deletedData) => {
            console.log({ deletedData });
            res.json({
            message: "Cheers!! You have successfully deleted the targeted data",
            deletedData,
            });
        })
        .catch((err) => {
            console.log(`The following error occurred for deleting the data:\n${err}`);
            res.status(404).json({
            message: "Sorry your targeted data is not there",
            error: err.message,
            });
        });
}; */}