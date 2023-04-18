//make your routes here
//let Board;  //Make a global variable to store the game board for the server (removed because we save it to a session variable)

const { json } = require("body-parser");

exports.GenerateBoard = (req, res) => {
    console.log("\nGameLogicControllers.js file/GenerateBoard route");
    let Board = [
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null),
        Array(6).fill(null)
    ];  //makes a array that is 6 columns and 6 rows (only the middle cells will be displayed to the user)
    const Vowels = ['A', 'E', 'I', 'O', 'U'];
    const Consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    let LetterPool = ['V', 'V', 'V', 'V', 'V', 'V', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];  //Make a letter pool of 7 vowels and 9 consonants
    // for (let Row = 1; Row < Board.length - 1; Row++) {
    //     for (let Column = 1; Column < Board[Row].length - 1; Column++) {
    //         const RandSelector = Math.floor(Math.random() * LetterPool.length);  //Make a random selector to select from the LetterPool
    //         const VowOrConst = LetterPool.splice(RandSelector, 1);  //Both selects and removes the element from the LetterPool
    //         const Letter = VowOrConst == 'V' ? Vowels[Math.floor(Math.random() * Vowels.length)] : Consonants[Math.floor(Math.random() * Consonants.length)];
    //         Board[Row][Column] = Letter;  // Assign the letter to the Board

    //         // console.log(`LetterPool Length = ${LetterPool.length}
    //         // \rRandSelector = ${RandSelector}
    //         // \rVowel or Constant = '${VowOrConst}'
    //         // \rLetter selected = ${Letter}\n`);  // For debugging
    //     }
    // }

    // Only used for debugging to prevent dynamic board creation (makes it easer to debug because the board stays constant)
    //words that should fail: bob, kayak, peep, deed
    //words that should be accepted: boy, dead, pee, kay, bay
    Board[1] = [null, 'B', 'O', 'M', 'F', null];
    Board[2] = [null, 'K', 'A', 'Y', 'O', null];
    Board[3] = [null, 'P', 'E', 'V', 'U', null];
    Board[4] = [null, 'D', 'E', 'A', 'D', null];

    // console.log("Game board:");
    // Board.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
    //     console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    // });

    req.session.Score = 0;  //Set the starting score for the server and client cookie
    req.session.PreviousWords = [];  //clears/makes a session variable for the previous word the user has guessed
    req.session.Board = Board;  //Save the board to the session
    req.session.save(function(err) {  //saves the session and cookie for both the client and server
        if(err) {
            console.log(`The following error occurred in saving the session:\n\r\t${err}`);
        }
        else {
            console.log("The session is now " + JSON.stringify(req.session));
        }
    });

    res.json({
        Board,  //This does the same thing as "Board: Board"
        Score: req.session.Score,
    });
};

//This function the programmer will call if they want to find a word on the board
function FindWord(Word, Board) {
    // console.log("Server game board:");
    // Board.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
    //     console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    // });
    console.log(`Launching starter for the recursion FindWordRecursion() with the arguments:
    \r\tWord: ${Word}
    \r\tBoard: ${JSON.stringify(Board)}`);
    // console.log(`Searching for the word "${Word}".  Looking for character "${Word[0]}".`)
    let WordFound = false;
    for(let Row = 1; Row <= 4; Row++) {
        if(WordFound) {break;}
        // console.log(`checking row ${Board[Row]}`);
        for(let Column = 1; Column <= 4; Column++) {
            if(WordFound) {break;}
            // console.log(`accessing cell "${Board[Row][Column]}" at row ${Row} column ${Column}`);
            if(Word[0] === Board[Row][Column]) {  //If the first character was found and the recursion found the word, then return true.
                console.log(`Found a "${Word[0]}" at row ${Row} column ${Column}`);
                WordFound = WordFound | FindWordRecursion(Word.slice(1, Word.length), Board, Row + 1, Column + 1, [{"Row": Row, "Column": Column}]);  //makes use of bitwise OR assignment so it can search the entire game board for the word instead of just the first instance of the letter, however it will return a 0 for false and a 1 for true.
            }
        }     
    }
    if(!WordFound) {console.log(`Unable to find the word "${Word}" on the board`);}
    else {console.log(`Found the word "${Word}" on the board`);}
    return WordFound;  //The word was not found
};

//This function will always start at the bottom right cell connected to the letter of the first word 
function FindWordRecursion(Word, Board, Row, Column, SelectedCells) {
    // console.log(`SelectedCells = ${JSON.stringify(SelectedCells)}`);
    let RowMultiplier = -1;
    let ColumnMultiplier = -1;
    let WordFound = false;

    console.log(`New instance of FindWordRecursion() with the arguments:
    \r\tWord: ${Word}
    \r\tBoard: ${JSON.stringify(Board)}
    \r\tRow: ${Row}
    \r\tColumn: ${Column}
    \r\tSelectedCells: ${JSON.stringify(SelectedCells)}`);                

    // base case
    if(Word == null || Word == '') {  // We consumed all the characters for the word, meaning the word is on the board.
        console.log("Found all the letters for the word on the board.");
        return true;
    }

    //recursion
    for (let Side = 0; Side < 4; Side++) {
        if(WordFound) { break; }  // If the word is found, then just "tunnel" back out of the recursion and return the results to the client.
        if (Side % 2 == 0) { //We are moving vertically
            if(WordFound) { break; }  // If the word is found, then just "tunnel" back out of the recursion and return the results to the client.
            // console.log(`Moving vertically in the ${RowMultiplier} direction`)  //For debugging
            for (let Run = 1; Run < 3; Run++) {
                if(WordFound) { break; }  // If the word is found, then just "tunnel" back out of the recursion and return the results to the client.
                Row += 1 * RowMultiplier;
                
                // console.log(`Accessing cell in row ${Row} column ${Column}`);
                if(Word[0] === Board[Row][Column] && CellNotUsed({"Row": Row, "Column": Column}, SelectedCells)) {
                    console.log(`Valid cell found on row ${Row} column ${Column}`);
                    SelectedCells.push({"Row": Row, "Column": Column});
                    WordFound |= FindWordRecursion(Word.slice(1, Word.length), Board, Row + 1, Column + 1, structuredClone(SelectedCells));  //structeredClone() function makes a deep copy of the SelectedCells array (This is done because objects are always passed by reference normally) Solution source https://stackoverflow.com/questions/14491405/javascript-passing-arrays-to-functions-by-value-leaving-original-array-unaltere
                    // console.log(`WordFound is now ${WordFound}`);
                }
            }
            RowMultiplier *= -1;  //Reverse the direction for when it moves down the other side
        }
        else {   //We are moving horizontally
            if(WordFound) { break; }  // If the word is found, then just "tunnel" back out of the recursion and return the results to the client.
            // console.log(`Moving horizontally in the ${ColumnMultiplier} direction`)
            for (let Run = 1; Run < 3; Run++) {
                if(WordFound) { break; }  // If the word is found, then just "tunnel" back out of the recursion and return the results to the client.
                Column += 1 * ColumnMultiplier;
                
                // console.log(`Accessing cell in row ${Row} column ${Column}`);
                if(Word[0] === Board[Row][Column] && CellNotUsed({"Row": Row, "Column": Column}, SelectedCells)) {
                    console.log(`A valid cell found on row ${Row} column ${Column}`);
                    SelectedCells.push({"Row": Row, "Column": Column});
                    WordFound |= FindWordRecursion(Word.slice(1, Word.length), Board, Row + 1, Column + 1, structuredClone(SelectedCells));  //structeredClone() function makes a deep copy of the SelectedCells array (This is done because objects are always passed by reference normally) Solution source https://stackoverflow.com/questions/14491405/javascript-passing-arrays-to-functions-by-value-leaving-original-array-unaltere
                    // console.log(`WordFound is now ${WordFound}`);
                }
            }
            ColumnMultiplier *= -1;  //Reverse the direction for when it moves right to the other side
        }
    }
    return WordFound;  //returns a 0 (false) or 1 (true) back up to the calling function
};

//determines if the cell was selected from a previous step.
function CellNotUsed(CurrentCell, PastCells) {
    // const Result = PastCells.find((SelectedCell) => {  //This finds the first instance inside the PastCells that match the contents of the CurrentCell, if it doesn't find one, the variable will be undefined.
    //     CurrentCell.Row === SelectedCell.Row && CurrentCell.Column === SelectedCell.Column
    // });
    let NotUsed = false;
    PastCells.forEach((SelectedCell) => {
        NotUsed |= CurrentCell.Row === SelectedCell.Row && CurrentCell.Column === SelectedCell.Column;
    });
    // console.log(`PastCells = ${JSON.stringify(PastCells)}
    // \rCurrentCell = ${JSON.stringify(CurrentCell)}
    // \rResult for CellNotUsed() = ${NotUsed ? false : true}`);
    return NotUsed ? false : true;
}

exports.IsValidWord = async (req, res) => {
    console.log("\nGameLogicControllers.js file/IsValidWord route");
    let Word = req.params.Word
    console.log(`Determining if the word "${Word}" is a valid word`);
    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${Word}`);
    const dataj = await data.json();

    let WordFound = false;  //Default value for the variable WordFound
    let WordNotGuessed = !req.session.PreviousWords.includes(Word)
    if (dataj[0] && Word.length >= 3 && WordNotGuessed) { //if the word has a definition and it is at least 3 characters long, then check to make sure it is on the board
            console.log("The word has a definition, now checking to see if it on the board");
            WordFound = Boolean(FindWord(Word.toUpperCase(), req.session.Board));  //What will be return is a 0 for false or a 1 for true, because we use a bitwise or operator inside this function.  This is why we have Boolean() around the return, it will convert it into a true/false condition.
    }
    else {
        console.log(`\nSee the below summary for why the word "${Word}" was rejected:
        \rHas a definition: ${dataj[0] ? true : false}
        \rMeets minimum length: ${Word.length >= 3}
        \rWord not been used before: ${WordNotGuessed} (if this is false, you can ignore the below condition)
        \rWord on the board: ${WordFound}`);
    }


    //the following console.log is for debugging purposes
    // console.log(`\nHas a definition: ${dataj[0] ? true : false}
    // \rMeets minimum length: ${Word.length >= 3}
    // \rWord not been used before: ${WordNotGuessed} (if this is false, you can ignore the below condition)
    // \rWord on the board: ${WordFound}`);
    let MeetsRequirements = (dataj[0] && Word.length >= 3 && WordNotGuessed && WordFound); 
    if(MeetsRequirements) {  //if the word supplied is a word, it has a length of at least 3, the word was on the board, and the word was not previously guessed, then add the required points to the session to be sent to the client.
        let WordLength = Word.length;
        //Depending on the word length, add the required points to their score
        if(WordLength == 3) {req.session.Score += 1;}
        if(WordLength == 4) {req.session.Score += 2;}
        if(WordLength == 5) {req.session.Score += 4;}
        if(WordLength == 6) {req.session.Score += 7;}
        if(WordLength == 7) {req.session.Score += 11;}
        if(WordLength == 8) {req.session.Score += 16;}
        if(WordLength >= 9) {req.session.Score += 22;}

        req.session.PreviousWords.push(Word);  //Add the guessed word the session so the user can't guess it again.
        req.session.save(function(err) {  //saves the session and cookie for both the client and server
            if(err) {
                console.log(`The following error occurred in saving the session:\n\r\t${err}`);
            }
            else {
                console.log("The session is now " + JSON.stringify(req.session));
            }
        });
    }
    
    res.json({
        IsValid: MeetsRequirements ? true : false,  //formatted this way so it will always return a true/false statement
        NewScore: req.session.Score,
    });
};
