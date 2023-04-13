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
    //words that should fail bob, kayak, peep, deed
    ServerGameBoard[1] = [null, 'B', 'O', 'M', 'F', null];
    ServerGameBoard[2] = [null, 'K', 'A', 'Y', 'O', null];
    ServerGameBoard[3] = [null, 'P', 'E', 'V', 'U', null];
    ServerGameBoard[4] = [null, 'D', 'E', 'P', 'D', null];

    let ClientGameBoard = JSON.parse(JSON.stringify(ServerGameBoard));  //Make a COPY (by using the JSON.parse() and JSON.stringify() functions, other wise it just creates a pointer to both degrees of the 2d array ServerGameBoard) of the ServerGameBoard to modify and send to the client
    ClientGameBoard.splice(0, 1);  //Removes the first row from the Board
    ClientGameBoard.splice(ClientGameBoard.length - 1, 1);  //Removes the last row from the Board
    ClientGameBoard.forEach((Row, Index) => {
        ClientGameBoard[Index].splice(0, 1);  //Removes the first column from the Board
        ClientGameBoard[Index].splice(ClientGameBoard[Index].length - 1, 1)  //Removes the last column from the Board
    });
    // console.log("Server game board:");
    // ServerGameBoard.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
    //     console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    // });
    // console.log("Client game board:");
    // ClientGameBoard.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
    //     console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    // });

    res.json({
        Board: ClientGameBoard,
    });
};

//Recursion function to help with the IsValidWord route
function FindWord(Word) {
    // console.log("Server game board:");
    // ServerGameBoard.map((Row, RowIndex) => {  //for debugging/displaying the Server's game board
    //     console.log(`Row ${RowIndex}: ${JSON.stringify(Row)}`);
    // });
    console.log(`Searching for the word "${Word}".  Looking for character "${Word[0]}".\n`)
    let WordFound = false;
    for(let Row = 1; Row <= 4; Row++) {
        // console.log(`checking row ${ServerGameBoard[Row]}`);
        for(let Column = 1; Column <= 4; Column++) {
            // console.log(`accessing cell "${ServerGameBoard[Row][Column]}" at row ${Row} column ${Column}`);
            if(Word[0] == ServerGameBoard[Row][Column]) {  //If the first character was found and the recursion found the word, then return true.
                console.log(`Found a "${Word[0]}" at row ${Row} column ${Column}`);
                WordFound = WordFound | FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, [{"Row": Row, "Column": Column}]);  //makes use of bitwise OR assignment so it can search the entire game board for the word instead of just the first instance of the letter, however it will return a 0 for false and a 1 for true.
            }
        }     
    }
    return WordFound;  //The word was not found
};

function CellNotUsed(CurrentCell, PastCells) {
    // const Result = PastCells.find((SelectedCell) => {  //This finds the first instance inside the PastCells that match the contents of the CurrentCell, if it doesn't find one, the variable will be undefined.
    //     CurrentCell.Row === SelectedCell.Row && CurrentCell.Column === SelectedCell.Column
    // });
    let NotUsed = false;
    PastCells.forEach((SelectedCell) => {
        NotUsed |= CurrentCell.Row === SelectedCell.Row && CurrentCell.Column === SelectedCell.Column;
    });
    console.log(`PastCells = ${JSON.stringify(PastCells)}`);
    console.log(`CurrentCell = ${JSON.stringify(CurrentCell)}`);
    console.log(`Result for CellNotUsed() = ${NotUsed ? false : true}`);  //JSON.stringify(Result)
    return NotUsed ? false : true;
}

//This function will always start at the bottom right cell connected to the letter of the first word 
function FindWordRecursion(Word, Row, Column, SelectedCells) {  //Need to keep some track of the cells we have gone through to prevent us from moving backwards and selecting a previously selected cell.
    // console.log(`SelectedCells = ${JSON.stringify(SelectedCells)}`);
    let RowMultiplier = -1;
    let ColumnMultiplier = -1;
    let WordFound = false;

    // base case
    if(Word == null || Word == '') {  // We consumed all the characters for the word, meaning the word is on the board.
        console.log("Found all the letters for the word on the board.");
        return true;
    }

    console.log(`Searching for the word portion "${Word}".  Looking for character "${Word[0]}".`)
    //recursion
    for (let Side = 0; Side < 4; Side++) {
        if (Side % 2 == 0) { //We are moving vertically
            console.log(`moving vertically in the ${RowMultiplier} direction`)
            for (let Run = 1; Run < 3; Run++) {
                Row += 1 * RowMultiplier;
                
                console.log(`Accessing cell in row ${Row} column ${Column}`);
                if(Word[0] === ServerGameBoard[Row][Column] && CellNotUsed({"Row": Row, "Column": Column}, SelectedCells)) {
                    console.log(`Valid cell found on row ${Row} column ${Column}`);
                    SelectedCells.push({"Row": Row, "Column": Column});
                    WordFound |= FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, structuredClone(SelectedCells));
                    console.log(`WordFound is now ${WordFound}`);
                    console.log(`Searching for the word portion "${Word}".  Looking for character "${Word[0]}".`)
                }
            }
            RowMultiplier *= -1;  //Reverse the direction for when it moves down the other side
        }
        else {   //We are moving horizontally
            console.log(`moving horizontally in the ${ColumnMultiplier} direction`)
            for (let Run = 1; Run < 3; Run++) {
                Column += 1 * ColumnMultiplier;
                
                if(WordFound) { break; }  //WIP

                console.log(`Accessing cell in row ${Row} column ${Column}`);
                if(Word[0] === ServerGameBoard[Row][Column] && CellNotUsed({"Row": Row, "Column": Column}, SelectedCells)) {
                    console.log(`A valid cell found on row ${Row} column ${Column}`);
                    SelectedCells.push({"Row": Row, "Column": Column});
                    WordFound |= FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, structuredClone(SelectedCells));
                    console.log(`WordFound is now ${WordFound}`);
                    console.log(`Searching for the word portion "${Word}".  Looking for character "${Word[0]}".`)
                }
            }
            ColumnMultiplier *= -1;  //Reverse the direction for when it moves right to the other side
        }
    }
    // console.log(`Couldn't find a "${Word[0]}" next to row ${Row - 1} column ${Column - 1}`);
    return false;  //None of the adjacent cells have the next letter
};

exports.IsValidWord = async (req, res) => {
    console.log("\nGameLogicControllers.js file/IsValidWord route");
    let Word = req.params.Word
    console.log(`Determining if the word "${Word}" is a valid word`);
    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${Word}`);
    const dataj = await data.json();

    if (dataj[0]) { //if the word has a definition, then check to make sure it is on the board
        console.log("The word has a definition, now checking to see if it on the board\n");
        WordFound = FindWord(Word.toUpperCase());  //What will be return is a 0 for false or a 1 for true, because we use a bitwise or operator inside this function.
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
};
