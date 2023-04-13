//make your routes here
let ServerGameBoard;  //Make a global variable to store the game board fro the server

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
    // for (let Row = 1; Row < ServerGameBoard.length - 1; Row++) {
    //     for (let Column = 1; Column < ServerGameBoard[Row].length - 1; Column++) {
    //         const RandSelector = Math.floor(Math.random() * LetterPool.length);  //Make a random selector to select from the LetterPool
    //         const VowOrConst = LetterPool.splice(RandSelector, 1);  //Both selects and removes the element from the LetterPool
    //         const Letter = VowOrConst == 'V' ? Vowels[Math.floor(Math.random() * Vowels.length)] : Consonants[Math.floor(Math.random() * Consonants.length)];
    //         ServerGameBoard[Row][Column] = Letter;  // Assign the letter to the ServerGameBoard

    //         // console.log(`LetterPool Length = ${LetterPool.length}
    //         // \rRandSelector = ${RandSelector}
    //         // \rVowel or Constant = '${VowOrConst}'
    //         // \rLetter selected = ${Letter}\n`);  // For debugging
    //     }
    // }

    // Only used for debugging to prevent dynamic board creation (makes it easer to debug because the board is constant)
    ServerGameBoard[1] = [null, 'B', 'O', 'M', 'F', null];
    ServerGameBoard[2] = [null, 'C', 'N', 'K', 'O', null];
    ServerGameBoard[3] = [null, 'T', 'H', 'V', 'U', null];
    ServerGameBoard[4] = [null, 'S', 'B', 'A', 'D', null];

    let ClientGameBoard = JSON.parse(JSON.stringify(ServerGameBoard));  //Make a COPY (by using the JSON.parse() and JSON.stringify() functions, other wise it just creates a pointer to both degrees of the 2d array ServerGameBoard) of the ServerGameBoard to modify and send to the client
    ClientGameBoard.splice(0, 1);  //Removes the first row from the Board
    ClientGameBoard.splice(ClientGameBoard.length - 1, 1);  //Removes the last row from the Board
    ClientGameBoard.forEach((Row, Index) => {
        ClientGameBoard[Index].splice(0, 1);  //Removes the first column from the Board
        ClientGameBoard[Index].splice(ClientGameBoard[Index].length - 1, 1)  //Removes the last column from the Board
    });
    console.log("Server game board:");
    ServerGameBoard.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
        console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    });
    console.log("Client game board:");
    ClientGameBoard.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
        console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    });

    res.json({
        Board: ClientGameBoard,
    });
};

//Recursion function to help with the IsValidWord route
function FindWord(Word) {
    console.log("Server game board:");
    ServerGameBoard.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
        console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    });
    console.log(`Searching for the word "${Word}".  Looking for character "${Word[0]}".`)
    let WordFound = false;
    for(let Row = 1; Row <= 4; Row++) {
        // console.log(`checking row ${ServerGameBoard[Row]}`);
        for(let Column = 1; Column <= 4; Column++) {
            // console.log(`accessing cell "${ServerGameBoard[Row][Column]}" at row ${Row} column ${Column}`);
            if(Word[0] == ServerGameBoard[Row][Column]) {  //If the first character was found and the recursion found the word, then return true.
                console.log(`Found a "${Word[0]}" at row ${Row} column ${Column}`);
                WordFound = WordFound | FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1);  //makes use of bitwise OR assignment so it can search the entire game board for the word instead of just the first instance of the letter, however it will return a 0 for false and a 1 for true.
            }
        }     
    }
    return WordFound;  //The word was not found
};

//This function will always start at the bottom right cell connected to the letter of the first word 
function FindWordRecursion(Word, _Row, _Column) {  //Need to keep some track of the cells we have gone through to prevent us from moving backwards and selecting a previously selected cell.
    let CurrentRow = _Row;
    let RowMultiplier = -1;
    let CurrentColumn = _Column;
    let ColumnMultiplier = -1;

    // base case
    if(Word == null || Word == '') {  // We consumed all the characters for the word, meaning the word is on the board.
        console.log("Found all the letters for the word on the board.");
        return true;
    }

    console.log(`Searching for the word portion "${Word}".  Looking for character "${Word[0]}".`)
    //recursion
    for (let Side = 0; Side < 4; Side++) {
        if (Side % 2 == 0) { //We are moving vertically
            for (let Run = 1; Run < 3; Run++) {
                CurrentRow += 1 * RowMultiplier;
                // console.log(`accessing cell "${ServerGameBoard[CurrentRow][CurrentColumn]}" at row ${CurrentRow} column ${CurrentColumn}`);
                if (Word[0] == ServerGameBoard[CurrentRow][CurrentColumn]) {  // If we found the letter
                    console.log(`Found a "${Word[0]}" at row ${CurrentRow} column ${CurrentColumn}`);
                    return FindWordRecursion(Word.slice(1, Word.length), CurrentRow + 1, CurrentColumn + 1);
                }
            }
            RowMultiplier *= -1;  //Reverse the direction for when it moves down the other side
        }
        else {   //We are moving horizontally
            for (let Run = 1; Run < 3; Run++) {
                CurrentColumn += 1 * ColumnMultiplier;
                // console.log(`accessing cell "${ServerGameBoard[CurrentRow][CurrentColumn]}" at row ${CurrentRow} column ${CurrentColumn}`);
                if (Word[0] == ServerGameBoard[CurrentRow][CurrentColumn]) {  // If we found the letter
                    console.log(`Found a "${Word[0]}" at row ${CurrentRow} column ${CurrentColumn}`);
                    return FindWordRecursion(Word.slice(1, Word.length), CurrentRow + 1, CurrentColumn + 1);
                }
            }
            ColumnMultiplier *= -1;  //Reverse the direction for when it moves right to the other side
        }
    }
    console.log(`Couldn't find a "${Word[0]}" next to row ${CurrentRow - 1} column ${CurrentColumn - 1}`);
    return false;  //None of the adjacent cells have the next letter
};

exports.IsValidWord = async (req, res) => {
    console.log("\nGameLogicControllers.js file/IsValidWord route");
    console.log(`Determining if the word "${req.params.Word}" is a valid word`);
    console.log("The word is " + req.params.Word + " which is:" + req.params.Word == ':VALID'? 'VALID' : 'NOT VALID');
    req.params.Word == ":VALID" ? res.json({valid:"true"}) : res.json({valid:"false"});
    // const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${req.params.Word}`);
    // const dataj = await data.json();

<<<<<<< HEAD
    // if (dataj[0] && dataj[0].word) { //if the word is a word with a definition, then check to make sure it is on the board
    //     console.log("The word has a definition, now checking to see if it on the board");
    //     WordFound = FindWord(req.params.Word);  //need to debug because it is saying it can't find a word when it is on the board.
    //     console.log(`Word on the board: ${WordFound}`);
    // }
    // else {
    //     console.log("The word doesn't have a definition");
    // }

    // res.json({
    //     IsWord: dataj[0].word ? true : false,
    //     WordOnBoard: WordFound,
    // })
=======
    if (dataj[0]) { //if the word is a word with a definition, then check to make sure it is on the board
        console.log("The word has a definition, now checking to see if it on the board\n");
        WordFound = FindWord(req.params.Word.toUpperCase());  //What will be return is a 0 for false or a 1 for true, because we use a bitwise or operator inside this function.
    }
    else {
        console.log("The word doesn't have a definition");
    }

    if (dataj[0]) {  //For debugging only
        console.log(`\nWord is a Word: true`);
        console.log(`Word on the board: ${WordFound} (0 = false and 1 = true)`);
    }
    else {
        console.log(`\nWord is a Word: false`);
    }
    
    res.json({
        IsValid: dataj[0] && WordFound ? true : false,
    });
>>>>>>> a989973f301db6d540f8d600c74a90a1f0e1c083
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