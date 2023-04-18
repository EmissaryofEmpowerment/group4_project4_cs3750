import { React, useState, useEffect } from 'react';
import axios from "../../util/axios"

export function GameScreen() {
    const [PlayerWord, SetPlayerWord] = useState("");
    const [GameBoard, SetGameBoard] = useState([]);
    const [Score, SetScore] = useState(0);

    //Run this useEffect only when the page loads (need to see about if I should prevent the page from being reloaded after initial load?)
    useEffect(() => {
        axios.get("/api/GenerateBoard")
        .then((res) => {
            // console.log(JSON.stringify(res.data));
            SetGameBoard(res.data.Board);
            SetScore(res.data.Score);
        })
        .catch((err) => {
            console.log(`Unable to fetch the game board for the below reason\n${err.message}`);
        });
    }, [])

    //Run this useEffect every time the PlayerWord changes
    useEffect(() => {
        const handleKeyDown = (e) => {
            // e.preventDefault();  // documentation for object model events https://www.w3.org/TR/DOM-Level-2-Events/events.html
            // console.log("Event listener active");
            const PressedKey = e.key;  // Extract the key and keycode of the pressed key

            if (PressedKey.match(/^[A-Z]$/i)) {  // If the key pressed is A-Z, case insensitive
                SetPlayerWord(PlayerWord.concat(PressedKey.toUpperCase()));  // Adds the letter to the PlayerWord
            }
            else if (PressedKey === "Backspace") {
                SetPlayerWord(PlayerWord.slice(0, -1));  // Removes the last letter from PlayerWord.  Source https://masteringjs.io/tutorials/fundamentals/remove-last-character
            }
            else if (PressedKey === "Enter") {
                console.log(`"${PlayerWord}" will now be sent to the server`);
                axios.get(`api/IsValidWord/${PlayerWord}`)
                .then((res) => {
                    console.log(`"${PlayerWord}" is a valid word:  ${res.data.IsValid}`);
                    SetScore(res.data.NewScore);
                    document.getElementById("server_response").innerText = res.data.IsValid;
                })
                .catch((err) => {
                    console.log(`Is valid word failed for this reason:\n${err.message}\n`);
                });
                SetPlayerWord("");  //Then reset the word so they can find a new word
        }}
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);  // This return keeps the event listener from chaining for multiple times.
    }, [PlayerWord, GameBoard]);


    const Board = () => {
        let ValidPaths = FindWordOnBoard(PlayerWord);
        let ValidPathCells = [];  //Or a Set (Need to decide how to implement before choosing)
        console.log(`Valid Paths`)
        ValidPaths.map((Path, PathIndex) => {
            console.log(`Path option ${PathIndex}: ${JSON.stringify(Path)}`);  //for debugging/displaying the valid paths to the client

            //TODO:  Process the 2d array ValidPaths into a UNIQUE array of items for performance reasons (Need to compare object key values to each other).
        });

        return (
            GameBoard.map((Row, RowIndex) => (
                JSON.stringify(Row) !== JSON.stringify(Array(6).fill(null)) ?  //If it is not the top or bottom of the game board.
                <tr key={RowIndex}>
                    {Row.map((Cell, CellIndex) => (
                            Cell !== null ?  //if it is the left or right of the game board.
                            <th key={CellIndex}>{Cell}</th> :
                            ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."  Source https://stackoverflow.com/questions/15009194/assign-only-if-condition-is-true-in-ternary-operator-in-javascript
                        //<th style={{backgroundColor:'aqua'}}>M</th>
                    ))}
                </tr> :
                ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."  Source https://stackoverflow.com/questions/15009194/assign-only-if-condition-is-true-in-ternary-operator-in-javascript
            ))
        );
    }

    function FindWordOnBoard(Word) {
        console.log(`Launching starter for the recursion FindWordRecursion() with the argument:
        \r\tWord: ${Word}`);
        // console.log(`Searching for the word "${Word}".  Looking for character "${Word[0]}".`)
        let ValidPaths = []
        for(let Row = 1; Row <= GameBoard.length - 2; Row++) {
            for(let Column = 1; Column <= GameBoard[Row].length - 2; Column++) {
                if(GameBoard[Row][Column] === Word[0]) {
                    console.log(`Found a "${Word[0]} at row ${Row} column ${Column}"`);
                    let Results = FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, [{Row, Column}])  //Call recursion
                    if (Results) {   //if the results returned something
                        Results.forEach((Result) => {
                            ValidPaths.push(Result);  //push the result to the ValidPaths array
                        });
                    }
                }
            }
        }
        return ValidPaths;
    }

    function FindWordRecursion(Word, Row, Column, SelectedCells) {
        let RowMultiplier = -1;
        let ColumnMultiplier = -1;
        let PathsFound = [];
        
        // base case
        if(Word == null || Word == '') {  // We consumed all the characters for the word, meaning the word is on the board.
            console.log("Found all the letters for the word on the board.");
            let LastCell = SelectedCells.pop();  //Select the last cell from the array to modify it to tell the user where they are on the board.
            LastCell.LastCharacter = true;
            SelectedCells.push(LastCell);
            PathsFound.push(SelectedCells);
            return PathsFound;
        }

        //recursion
        for (let Side = 0; Side < 4; Side++) {
            if (Side % 2 == 0) { //We are moving vertically
                // console.log(`Moving vertically in the ${RowMultiplier} direction`)  //For debugging
                for (let Run = 1; Run < 3; Run++) {
                    Row += 1 * RowMultiplier;
                    
                    // console.log(`Accessing cell in row ${Row} column ${Column}`);
                    if(Word[0] === GameBoard[Row][Column] && CellNotUsed({"Row": Row, "Column": Column}, SelectedCells)) {
                        console.log(`Found a "${Word[0]}" found on row ${Row} column ${Column}`);
                        SelectedCells.push({Row, Column})  //Push the current cell to the SelectedCells array before starting a new recursion
                        let Results = FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, structuredClone(SelectedCells));  //structeredClone() function makes a deep copy of the SelectedCells array (This is done because objects are always passed by reference normally) Solution source https://stackoverflow.com/questions/14491405/javascript-passing-arrays-to-functions-by-value-leaving-original-array-unaltere
                        SelectedCells.pop();  //Pop the push from before so we can continue to search without it being added the PathsFound array during the next recursion of this function.
                        if(Results) {  //if the results returned something
                            Results.forEach((Result) => {
                                PathsFound.push(Result);
                            });
                        }
                    }
                }
                RowMultiplier *= -1;  //Reverse the direction for when it moves down the other side
            }
            else {   //We are moving horizontally
                // console.log(`Moving horizontally in the ${ColumnMultiplier} direction`)
                for (let Run = 1; Run < 3; Run++) {
                    Column += 1 * ColumnMultiplier;
                    
                    // console.log(`Accessing cell in row ${Row} column ${Column}`);
                    if(Word[0] === GameBoard[Row][Column] && CellNotUsed({"Row": Row, "Column": Column}, SelectedCells)) {
                        console.log(`Found a "${Word[0]}" found on row ${Row} column ${Column}`);
                        SelectedCells.push({Row, Column})  //Push the current cell to the SelectedCells array before starting a new recursion
                        let Results = FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, structuredClone(SelectedCells));  //structeredClone() function makes a deep copy of the SelectedCells array (This is done because objects are always passed by reference normally) Solution source https://stackoverflow.com/questions/14491405/javascript-passing-arrays-to-functions-by-value-leaving-original-array-unaltere
                        SelectedCells.pop();  //Pop the push from before so we can continue to search without it being added the PathsFound array during the next recursion of this function.
                        if(Results) {  //if the results returned something
                            Results.forEach((Result) => {
                                PathsFound.push(Result);
                            });
                        }
                    }
                }
                ColumnMultiplier *= -1;  //Reverse the direction for when it moves right to the other side
            }
        }
        return PathsFound;
    }

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
    

    return (
        <>
            <p>WIP</p>
            <p>Your Score: {Score}</p>
            {/* The following table is hardcoded for how, but will be made enumerable later and the supplied inline-styles is how we could highlight the word */}
            <table>
                <tbody>
                    {/* This section will parse the outer ring from the board and only render the center of the board
                    {GameBoard.map((Row, RowIndex) => (
                        JSON.stringify(Row) !== JSON.stringify(Array(6).fill(null)) ?  //If it is not the top or bottom of the game board.
                        <tr key={RowIndex}>
                            {Row.map((Cell, CellIndex) => (
                                    Cell !== null ?  //if it is the left or right of the game board.
                                    <th key={CellIndex}>{Cell}</th> :
                                    ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."  Source https://stackoverflow.com/questions/15009194/assign-only-if-condition-is-true-in-ternary-operator-in-javascript
                                //<th style={{backgroundColor:'aqua'}}>M</th>
                            ))}
                        </tr> :
                        ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."  Source https://stackoverflow.com/questions/15009194/assign-only-if-condition-is-true-in-ternary-operator-in-javascript
                    ))} */}
                    <Board />
                </tbody>
            </table>
            <p>
                Current Word<br />
                {PlayerWord}
            </p>
            <p id="server_response"></p>
        </>
    );
}

export default GameScreen;