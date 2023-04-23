const express = require("express");  //includes the "express" module so we can use it inside this file.  Module documentation https://www.w3schools.com/nodejs/nodejs_modules.asp

const router = express.Router();  //create a new router object named "router" so we can use http requests in this file

const {
    UsernameUsed,
    CreateUser,
    GetSaltForUser,
    Login,
    Logout,
    IsAuth,
} = require("./controllers/AccountControllers");  //imports everything from inside the {} from the AccountControllers.js file

const {
    ControllerToRead1,
    ControllerToCreate1,
    ControllerToUpdate1,
    ControllerToDelete1,
} = require("./controllers/PlayerEntryControllers");  //imports everything from inside the {} from the AccountControllers.js file

const {
    GetBoard,
    IsValidWord,
    IsGameWord,
    IsGameWordEmpty,
    EnqueuePlayer,
    DequeuePlayer,
    StartGame,
    Restart,
    FetchPlayersScores,
    FetchPlayersGameInfo,
} = require("./controllers/GameLogicControllers");  //imports everything from inside the {} from the AccountControllers.js file


//This is used to validate that the api route is working, it has no functional purposes other then that
router.get("/", (req, res) => {
    res.send("api route working");
});

// build your routes here (<URL> is replaced with the URL you want to have the route connected to, the root route is simply "/")
//#region route templates for CRUD operations
// router.get("/get", ControllerToRead1);  //links the get http response (Read) to the controller defined inside the controllers.js file

// router.post("/post", ControllerToCreate1);  //links the post http (Create) response to the controller defined inside the controllers.js file

// router.put("put/:id", ControllerToUpdate1);  //links the put http response (Update) to the controller defined inside the controllers.js file
// or another method that does the same thing
// router.post("<URL>/:id", ControllerToUpdate);

// router.delete("delete/:id", ControllerToDelete1);  //links the delete http response (Delete) to the controller defined inside the controllers.js file
// or another method that does the same thing
// router.post("<URL>/:id", ControllerToDelete);
//#endregion

//#region Account routes
router.get("/UsernameUsed/:Username", UsernameUsed);

router.post("/CreateUser", CreateUser);

router.get("/SaltForUser/:Username", GetSaltForUser);

router.post("/Login", Login);

router.post("/Logout", Logout);

router.get("/IsAuth", IsAuth);
//#endregion

//#region PlayerEntry routes
//#endregion

//#region GameLogic routes
router.get("/GetBoard", GetBoard);

router.get("/IsValidWord/:Word", IsValidWord);

router.get("/IsGameWord/:Word", IsGameWord);

router.get("/IsGameWord", IsGameWordEmpty);

router.put('/EnqueuePlayer', EnqueuePlayer);

router.put('/DequeuePlayer', DequeuePlayer);

router.put("/StartGame", StartGame);

router.get("/Restart", Restart);

router.get('/FetchPlayersScores', FetchPlayersScores)

router.get('/FetchPlayersGameInfo', FetchPlayersGameInfo);
//#endregion

module.exports = router;  //export the constant "router" (which contains the get, post, put, and delete http responses) so that we can make use of it outside this file