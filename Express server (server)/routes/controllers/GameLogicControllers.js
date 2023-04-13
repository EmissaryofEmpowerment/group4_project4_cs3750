//make your routes here
let ServerGameBoard;  //Make a global variable to store the game board fro the server
let waitingPlayers = []; // track number of players ready to play
let timerRunning = false;

exports.GenerateBoard = (req, res) => {
    console.log("\nGameLogicControllers.js file/GenerateBoard route");
    ServerGameBoard = [
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null)
    ];  //makes a array that is 6 columns and 6 rows (only the middle will be displayed to the user)
    const Vowels = ['A', 'E', 'I', 'O', 'U'];
    const Consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    let LetterPool = ['V', 'V', 'V', 'V', 'V', 'V', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];  //Make a letter pool of 7 vowels and 9 consonants
    for (let Row = 1; Row < ServerGameBoard.length - 1; Row++) {
        for (let Column = 1; Column < ServerGameBoard[Row].length - 1; Column++) {
            const RandSelector = Math.floor(Math.random() * LetterPool.length);  //Make a random selector to select from the LetterPool
            const VowOrConst = LetterPool.splice(RandSelector, 1);  //Both selects and removes the element from the LetterPool
            const Letter = VowOrConst == 'V' ? Vowels[Math.floor(Math.random() * Vowels.length)] : Consonants[Math.floor(Math.random() * Consonants.length)];
            ServerGameBoard[Row][Column] = Letter;  // Assign the letter to the ServerGameBoard

            // console.log(`LetterPool Length = ${LetterPool.length}
            // \rRandSelector = ${RandSelector}
            // \rVowel or Constant = '${VowOrConst}'
            // \rLetter selected = ${Letter}\n`);  // For debugging
        }
    }

    let ClientGameBoard = ServerGameBoard;  //Make a copy of the ServerGameBoard to modify and send to the client
    // console.log(JSON.stringify(ClientGameBoard));
    ClientGameBoard.splice(0, 1);  //Removes the first row from the Board
    ClientGameBoard.splice(ClientGameBoard.length - 1, 1);  //Removes the last row from the Board
    ClientGameBoard.forEach((Row, Index) => {
        ClientGameBoard[Index].splice(0, 1);  //Removes the first column from the Board
        ClientGameBoard[Index].splice(ClientGameBoard[Index].length - 1, 1)  //Removes the last column from the Board
    });
    // console.log(JSON.stringify(ClientGameBoard));

    res.json({
        Board: ClientGameBoard,
    });
};

//Recursion function to help with the IsValidWord route
function FindWord(Word) {
    ServerGameBoard.map((Row, RowIndex) => {
        Row.map((Cell, ColumnIndex) => {
            if (Cell == Word[0]) {  //If the first character was found and the recursion found the word, then return true.
                console.log(`Found a "${Word[0]}" at row ${RowIndex} column ${ColumnIndex}`);
                if (FindWordRecursion(Word.splice(1, Word.length), RowIndex + 1, ColumnIndex + 1)) {  //Moved for debugging only
                    return true;
                }
            }
        });
    });
    return false;  //The word was not found
};

//This function will always start at the bottom right cell connected to the letter of the first word 
function FindWordRecursion(Word, _Row, _Column) {  //Need to keep some track of the cells we have gone through to prevent us from moving backwards and selecting a previously selected cell.
    let CurrentRow = _Row;
    let RowMultiplier = -1;
    let CurrentColumn = _Column;
    let ColumnMultiplier = -1;

    // base case
    if (Word == '') {  // We consumed all the characters for the word, meaning the word is on the board.
        return true;
    }

    //recursion
    for (let Side = 0; Side < 4; Side++) {
        if (Side % 2 == 0) { //We are moving vertically
            for (let Run = 1; Run < 3; Run++) {
                CurrentRow += Run * RowMultiplier;
                if (Word[0] == ServerGameBoard[CurrentRow][CurrentColumn]) {  // If we found the letter
                    return FindWordRecursion(Word.splice(1, Word.length), CurrentRow + 1, CurrentColumn + 1);
                }
            }
            RowMultiplier *= -1;  //Reverse the direction for when it moves down the other side
        }
        else {   //We are moving horizontally
            for (let Run = 1; Run < 3; Run++) {
                CurrentColumn += Run * ColumnMultiplier;
                if (Word[0] == ServerGameBoard[CurrentRow][CurrentColumn]) {  // If we found the letter
                    return FindWordRecursion(Word.splice(1, Word.length), CurrentRow + 1, CurrentColumn + 1);
                }
            }
            ColumnMultiplier *= -1;  //Reverse the direction for when it moves right to the other side
        }
    }
    return false;  //None of the adjacent cells have the next letter
};

exports.IsValidWord = async (req, res) => {
    console.log("\nGameLogicControllers.js file/IsValidWord route");
    console.log(`Determining if the word "${req.params.Word}" is a valid word`);
    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${req.params.Word}`);
    const dataj = await data.json();

    if (dataj[0] && dataj[0].word) { //if the word is a word with a definition, then check to make sure it is on the board
        console.log("The word has a definition, now checking to see if it on the board");
        WordFound = FindWord(req.params.Word);  //need to debug because it is saying it can't find a word when it is on the board.
        console.log(`Word on the board: ${WordFound}`);
    }
    else {
        console.log("The word doesn't have a definition");
    }

    res.json({
        IsWord: dataj[0].word ? true : false,
        WordOnBoard: WordFound,
    })
};

exports.StartGame = async (req, res) => {
    console.log("got here");
    // Handle start game request
    // Add player to waiting list
    if (waitingPlayers.indexOf(req.session.User) !== -1) {
        // Send a response back to the client if the IP is found
        //res.send("You are already in the waiting list.");
    } else {
        // Add the IP address of the new player to the waitingPlayers array if not found
        waitingPlayers.push(req.session.User);

        // Send a response back to the client
        //res.send("You have been added to the waiting list.");
    }
    console.log(waitingPlayers);

    if (waitingPlayers.length === 2) {
        // Send start game signal to both players
        res.send('Game started');
        startTimer();
        // Remove both players from waiting list
        waitingPlayers = [];
    } else {
        res.send('Waiting for another player');
    }
};

// the timer starts when there are two plays in the room ready to play
function startTimer() {
    if (!timerRunning) {
        console.log('Timer started');
        timerRunning = true;
        setTimeout(() => {
            console.log('Timer ended');
            timerRunning = false;
        }, 3000);
    } else {
        console.log('Timer is already running');
    }
}



exports.checkTimer = async (req, res) => {
    if (timerRunning) {
        console.log('Timer is currently running');
        res.send('Timer is currently running');
    } 
    if (!timerRunning) {
        console.log('Timer is finished');
        res.send('Timer is finished');
    }
       
    else {
        console.log('Timer is finished');
        if (waitingPlayers.length === 2) {
            res.send('Timer is finished');
        }
    }
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