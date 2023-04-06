//make your routes here
exports.ControllerToRead2 = (req, res) => {
    
};
{/* 
exports.ControllerToCreate = (req, res) => {
    AppPlayerLoginInfo.create(req.body)  //req.body contains all the data that will be used to create a new entry for the DB
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
    AppPlayerLoginInfo.findByIdAndUpdate(req.params.id, req.body)
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
    AppPlayerLoginInfo.findByIdAndRemove(req.params.id, req.body)
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