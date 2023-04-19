import { React, useState, useEffect } from 'react';
import axios from "../../util/axios";
import { Link, useNavigate, Navigate } from "react-router-dom";

export function GameScreen() {
    const [PlayerWord, SetPlayerWord] = useState("");
    const [GameBoard, SetGameBoard] = useState([]);
    const [status, setStatus] = useState('');
    const [time, setTime] = useState('');
    const navigate = useNavigate();
    const mode = 2; // tells the server to start the 60 second timer
    let intervalId;

    //Run this useEffect only when the page loads (need to see about if I should prevent the page from being reloaded after inital load?)
    useEffect(() => {
        axios.get("/api/GenerateBoard")
            .then((res) => {
                // console.log(JSON.stringify(res.data.Board));
                SetGameBoard(res.data.Board);
                handleStartGame();// start the 60 sec timer on the server
            })
            .catch((err) => {
                console.log(`Unable to determine what to do with the player once they have guessed the word for the below reason\n${err.message}`);
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
                console.log("\n" + PlayerWord + " will now be sent to the server\n");
                axios.get("api/IsValidWord/" + PlayerWord)
                    .then((res) => {
                        console.log(`\n ${PlayerWord} returned this from the server: ${res.data.IsValid}\n`);
                        document.getElementById("server_response").innerText = JSON.stringify(res.data);
                    })
                    .catch((err) => {
                        console.log("\n Is valid word failed. for this reason: " + err.message + "\n");
                    });
                SetPlayerWord("");  //Then reset the word so they can find a new word
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);  // This return keeps the event listener from chaining for multiple times.
    }, [PlayerWord]);

    const handleStartGame = () => {
        axios.put("/api/startGame/", { mode })
            .then((res) => {
                setStatus(res.data);
                // console.log(res.data); // access the data property of the response object
                if (res.data === 'Game started') {
                    // setIsWaiting(false);
                    intervalId = setInterval(checkStartGameTimer, 500); // Run checkStartGameTimer every 500ms
                    setTimeout(() => {
                        clearInterval(intervalId); // Stop the loop after 2 minutes
                    }, 120000);
                    // console.log("game started");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    function displayCountDown(elapsedTime) {
        setTime(60 - elapsedTime);
    }

    const checkStartGameTimer = () => {
        axios.get("/api/checkTimer")
            .then((res) => {
                const { Timer, elapsedTime } = res.data;
                displayCountDown(elapsedTime);
                // console.log("message from server " + Timer);
                // console.log(elapsedTime);
                if (!Timer) {
                    // Handle redirect to GameScreen component

                    // console.log("redirecting to game");
                    navigate('/ResultScreen');

                    clearInterval(intervalId); // Stop the loop
                    // console.log("Timer is finished");
                }
                else {
                    // console.log("Timer is running");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <>
            <p>WIP</p>
            <h1>Time Left: {time}</h1>
            {/* The following table is hardcoded for how, but will be made enumerable later and the supplied inline-styles is how we could highlight the word */}
            <table>
                <tbody>
                    {/* This section will parse the outer ring from the board and only render the center of the board */}
                    {GameBoard.map((Row, RowIndex) => (
                        JSON.stringify(Row) !== JSON.stringify(Array(6).fill(null)) ?  //If it is not the top or bottom of the game board.
                        <tr key={RowIndex}>
                            {Row.map((Cell, CellIndex) => (
                                    Cell !== null ?  //if it is the left or right of the game board.
                                    <th key={CellIndex}>{Cell}</th> :
                                    ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."
                                //<th style={{backgroundColor:'aqua'}}>M</th>
                            ))}
                        </tr> :
                        ''  //this is '' instead of <></> because it prevents the error that says that "Each child in a list should have a unique "key" prop."
                    ))}
                </tbody>
            </table>
            <p>
                Current Word<br />
                {PlayerWord}
            </p>This is the response from the Server:
            <p id="server_response"> </p>
        </>
    );
}

export default GameScreen;