import { React, useState, useEffect } from 'react';
import axios from "../../util/axios"
import { Link, useNavigate, Navigate } from "react-router-dom";

export function GameScreen() {
    const [PlayerWord, SetPlayerWord] = useState("");
    const [PlayerWordIsWord, SetPlayerWordIsWord] = useState(false);
    const [GameBoard, SetGameBoard] = useState([]);
    const [GuessedWords, SetGuessedWords] = useState([]);
    const [Score, SetScore] = useState(0);
    const [PlayersScores, SetPlayersScores] = useState([]);
    const [time, setTime] = useState('');
    const navigate = useNavigate();
    let storedTime;
    let GameTimer;
    let ScoreUpdateTimer;

    //Run this useEffect only when the page loads (need to see about if I should prevent the page from being reloaded after initial load?)
    useEffect(() => {
        axios.get("/api/GetBoard")
            .then((res) => {
                // console.log(JSON.stringify(res.data));
                SetGameBoard(res.data.Board);
                SetScore(res.data.Score);
                handleStartGame();  // start the 60 sec timer on the server (Disable to prevent the timer from starting)
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
                CheckWordIsGameWord(PlayerWord.concat(PressedKey.toUpperCase()));
                SetPlayerWord(PlayerWord.concat(PressedKey.toUpperCase()));  // Adds the letter to the PlayerWord
            }
            else if (PressedKey === "Backspace") {
                CheckWordIsGameWord(PlayerWord.slice(0, -1));
                SetPlayerWord(PlayerWord.slice(0, -1));  // Removes the last letter from PlayerWord.  Source https://masteringjs.io/tutorials/fundamentals/remove-last-character
            }
            else if (PressedKey === "Enter") {
                console.log(`"${PlayerWord}" will now be sent to the server`);
                axios.get(`api/IsValidWord/${PlayerWord}`)
                    .then((res) => {
                        console.log(`"${PlayerWord}" is a valid word:  ${res.data.IsValid}`);
                        SetScore(res.data.NewScore);
                        SetGuessedWords(res.data.GuessedWords);
                        document.getElementById("server_response").innerText = `${PlayerWord} is ${res.data.IsValid?'': 'not'} a valid word`;
                    })
                    .catch((err) => {
                        console.log(`Is valid word failed for this reason:\n${err.message}\n`);
                    });
                SetPlayerWord("");  //Then reset the word so they can find a new word
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);  // This return keeps the event listener from chaining for multiple times.
    }, [PlayerWord, GameBoard]);


    const handleStartGame = () => {
        console.log('60 sec Timer started');

        // Check if there's an initial time saved in local storage
        storedTime = localStorage.getItem('initialTime');

        let remainingTime;
        if (storedTime) {
            // Calculate the remaining time based on the difference between the start time and the current time
            const initialTime = parseInt(storedTime);
            const startTime = parseInt(localStorage.getItem('startTime'));
            const currentTime = new Date().getTime();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed seconds
            remainingTime = Math.max(0, initialTime - elapsedTime);
        } else {
            remainingTime = 60; // Default value
            localStorage.setItem('initialTime', remainingTime.toString());
            localStorage.setItem('startTime', new Date().getTime().toString());
        }

        setTime(remainingTime); // Set remaining value of timer

        GameTimer = setInterval(() => { // Use setInterval instead of setTimeout
            setTime((time) => time - 1); // Decrease the timer by 1 every second
        }, 1000);

        UpdatePlayerScores();  //This is called so on page loads it displays the game board because the setInterval doesn't call the function when it is started.
        ScoreUpdateTimer = setInterval(UpdatePlayerScores, 5000);  //Every 5 seconds run this function to see if the scores changed on the server

        setTimeout(() => {
            console.log('Timer ended');
            clearInterval(GameTimer); // Clear the GameTimer
            clearInterval(ScoreUpdateTimer);  //Clear the ScoreUpdateTimer
            localStorage.removeItem('initialTime');
            localStorage.removeItem('startTime'); // Remove the start time as well
            navigate('/ResultScreen');
        }, remainingTime * 1000);
    }

    function UpdatePlayerScores() {
        axios.get('api/FetchPlayersScores')
            .then((res) => {
                SetPlayersScores(res.data.PlayersScores)
            })
            .catch((err) => {
                console.log(`Fetching scores from the server failed for this reason:\n${err.message}\n`);
            });
    }

    //Function for common code used in the above useEffect
    function CheckWordIsGameWord(Word) {
        axios.get(`api/IsGameWord/${Word}`)
            .then((res) => {
                console.log(`"${Word}" is a valid game word:  ${res.data.IsWord}`);
                SetPlayerWordIsWord(res.data.IsWord);
            })
            .catch((err) => {
                console.log(`Is word failed for this reason:\n${err.message}\n`);
            });
    }

    function FindWordOnBoard(Word) {
        // console.log(`Launching starter for the recursion FindWordRecursion() with the argument:
        // \r\tWord: ${Word}`);
        // console.log(`Searching for the word "${Word}".  Looking for character "${Word[0]}".`)
        let ValidPaths = []
        for (let Row = 1; Row <= GameBoard.length - 2; Row++) {
            for (let Column = 1; Column <= GameBoard[Row].length - 2; Column++) {
                if (GameBoard[Row][Column] === Word[0]) {
                    console.log(`Found a "${Word[0]} at row ${Row} column ${Column}"`);
                    let Results = FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, [{ Row, Column }])  //Call recursion
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
        if (Word == null || Word == '') {  // We consumed all the characters for the word, meaning the word is on the board.
            // console.log("Found all the letters for the word on the board.");
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
                    if (Word[0] === GameBoard[Row][Column] && CellNotUsed({ "Row": Row, "Column": Column }, SelectedCells)) {
                        // console.log(`Found a "${Word[0]}" found on row ${Row} column ${Column}`);
                        SelectedCells.push({ Row, Column })  //Push the current cell to the SelectedCells array before starting a new recursion
                        let Results = FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, structuredClone(SelectedCells));  //structeredClone() function makes a deep copy of the SelectedCells array (This is done because objects are always passed by reference normally) Solution source https://stackoverflow.com/questions/14491405/javascript-passing-arrays-to-functions-by-value-leaving-original-array-unaltere
                        SelectedCells.pop();  //Pop the push from before so we can continue to search without it being added the PathsFound array during the next recursion of this function.
                        if (Results) {  //if the results returned something
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
                    if (Word[0] === GameBoard[Row][Column] && CellNotUsed({ "Row": Row, "Column": Column }, SelectedCells)) {
                        // console.log(`Found a "${Word[0]}" found on row ${Row} column ${Column}`);
                        SelectedCells.push({ Row, Column })  //Push the current cell to the SelectedCells array before starting a new recursion
                        let Results = FindWordRecursion(Word.slice(1, Word.length), Row + 1, Column + 1, structuredClone(SelectedCells));  //structeredClone() function makes a deep copy of the SelectedCells array (This is done because objects are always passed by reference normally) Solution source https://stackoverflow.com/questions/14491405/javascript-passing-arrays-to-functions-by-value-leaving-original-array-unaltere
                        SelectedCells.pop();  //Pop the push from before so we can continue to search without it being added the PathsFound array during the next recursion of this function.
                        if (Results) {  //if the results returned something
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

    const Board = () => {
        let ValidPaths = FindWordOnBoard(PlayerWord);
        let ValidPathCells = [];

        // This section is for debugging by displaying the valid paths that was found
        console.log(`Valid Paths:`)
        ValidPaths.map((Path, PathIndex) => {
            console.log(`Path option ${PathIndex}: ${JSON.stringify(Path)}`);  //for debugging/displaying the valid paths to the client
        });

        //This will add the last cell to be selected for the word supplied.  This is because we will be making it a different color to tell the client where they are on the board and it will make it so it is always added because of the following for loop logic.
        for (let PathIndex = 0; PathIndex < ValidPaths.length; PathIndex++) {
            // console.log(`Processing path ${JSON.stringify(ValidPaths[PathIndex])}`);
            let LastCellIndex = ValidPaths[PathIndex].length - 1;
            if (!ValidPathCells.some((Entry) => { return JSON.stringify(Entry) === JSON.stringify(ValidPaths[PathIndex][LastCellIndex]) })) {  //Learned about this method from these two sites https://stackoverflow.com/questions/45895129/how-to-check-if-a-specific-object-already-exists-in-an-array-before-adding-it and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                ValidPathCells.push(ValidPaths[PathIndex][LastCellIndex]);
            }
        }

        //If the cell hasn't been added to the ValidPathCells array (Row and Column combination), then add it to the array.
        for (let PathIndex = 0; PathIndex < ValidPaths.length; PathIndex++) {
            // console.log(`Processing path ${JSON.stringify(ValidPaths[PathIndex])}`);
            for (let CellIndex = 0; CellIndex < ValidPaths[PathIndex].length; CellIndex++) {
                // console.log(`Processing cell "${JSON.stringify(ValidPaths[PathIndex][CellIndex])}" from above path`);
                if (!ValidPathCells.some((Entry) => { return Entry.Row === ValidPaths[PathIndex][CellIndex].Row && Entry.Column === ValidPaths[PathIndex][CellIndex].Column })) {  //Learned about this method from these two sites https://stackoverflow.com/questions/45895129/how-to-check-if-a-specific-object-already-exists-in-an-array-before-adding-it and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                    ValidPathCells.push(ValidPaths[PathIndex][CellIndex]);
                }
            }
        }

        console.log(`Valid Paths Cells:
        \r${JSON.stringify(ValidPathCells)}`);

        const MakeCell = (CellContent, Location, CellIndex) => {
            let CellEntry = ValidPathCells.find(Entry => Entry.Row === Location.Row && Entry.Column === Location.Column);
            if (!CellEntry) {  //It is a cell that is not selected
                return <th key={CellIndex}>{CellContent}</th>
            }
            else if (CellEntry.LastCharacter && PlayerWordIsWord) {  //It is a cell that is the last character in the word and the word is a word
                return <th key={CellIndex} className='ValidLastCell'>{CellContent}</th>
            }
            else if (!CellEntry.LastCharacter && PlayerWordIsWord) {  //It is a cell that is not last character in the word and the word is a word
                return <th key={CellIndex} className='ValidCell'>{CellContent}</th>
            }
            else if (CellEntry.LastCharacter && !PlayerWordIsWord) {  //It is a cell that is the last character in the word however, the word is not a word
                return <th key={CellIndex} className='InvalidLastCell'>{CellContent}</th>
            }
            else {  //It is a cell that is not last character in the word and the word is not a word
                return <th key={CellIndex} className='InvalidCell'>{CellContent}</th>
            }
        }

        return (
            <table id='GameBoard'>
                <tbody>
                    {GameBoard.map((Row, RowIndex) => (
                        JSON.stringify(Row) !== JSON.stringify(Array(6).fill(null)) ?  //If it is not the top or bottom of the game board.
                            <tr key={RowIndex}>
                                {Row.map((Cell, CellIndex) => (
                                    Cell !== null ? //if it is NOT the left or right of the game board.
                                        MakeCell(Cell, { Row: RowIndex, Column: CellIndex }, CellIndex) :
                                        ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."  Source https://stackoverflow.com/questions/15009194/assign-only-if-condition-is-true-in-ternary-operator-in-javascript
                                ))}
                            </tr> :
                            ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."  Source https://stackoverflow.com/questions/15009194/assign-only-if-condition-is-true-in-ternary-operator-in-javascript
                    ))}
                </tbody>
            </table>
        );
    }

    const PlayerScores = () => {
        let SortResults = PlayersScores.sort((Item1, Item2) => {  //Sorts the array by descending score.  Source https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
            return Item2.Score - Item1.Score;
        });

        return (
            <table id='PlayerScores'>
                <caption>
                    Score Board
                </caption>
                <tbody>
                    <tr>
                        <td>Player Name</td>
                        <td>Player Score</td>
                    </tr>
                    {SortResults.map((Entry, EntryIndex) => (
                        <tr key={EntryIndex}>
                            {Object.keys(Entry).map((Key, KeyIndex) => (  //Source to iterate over an object's key to render the <td> found here https://bobbyhadz.com/blog/react-loop-through-object
                                // console.log(`Adding td with a key of "${KeyIndex}" with contents "${Entry[Key]}"`)
                                <td key={KeyIndex}>{Entry[Key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
                    <h1>Your Score: <span id="round_score">{Score}</span></h1>
                </div>
                <div className='col-md-6'>
                    <h1>Time Left: {time}</h1>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <Board />
                    <br />
                    <p>
                        Current Word: {PlayerWord}
                    </p>
                </div>
                <div className='col-md-6'>
                    <p id="server_response"></p>
                    <PlayerScores />
                </div>
            </div>
            <div className='row'>
                <p>
                    Guessed Words:  {GuessedWords.map((Word, WordIndex) => (
                        GuessedWords.length - 1 !== WordIndex ?
                        Word + ", " :
                        Word
                    ))}
                </p>
            </div>
            {/* <div className='row'>
                {/* <ul className='list-group'>
                    {GuessedWords.map(Word => <li key={Word} className='list-group-item'>{Word}</li>)}
                </ul> 
                {GuessedWords.map(Word => <div key={Word} className='col-md-2'>{Word}</div>)}  {/* The col-md-2 will make it so that there will be 6 words per line before it overflows onto a new line 
            </div> */}
        </div>
    );
}

export default GameScreen;