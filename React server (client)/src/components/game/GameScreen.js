import { React, useState, useEffect, useSyncExternalStore } from 'react';
import axios from "../../util/axios"

export function GameScreen() {
    const [PlayerWord, SetPlayerWord] = useState("");
    const [GameBoard, SetGameBoard] = useState([]);
    const [Score, SetScore] = useState(0);

    //Run this useEffect only when the page loads (need to see about if I should prevent the page from being reloaded after inital load?)
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
    }, [PlayerWord]);

    return (
        <>
            <p>WIP</p>
            <p>Your Score: {Score}</p>
            {/* The following table is hardcoded for how, but will be made enumerable later and the supplied inline-styles is how we could highlight the word */}
            <table>
                <tbody>
                    {GameBoard.map((Row, RowIndex) => (
                        <tr key={RowIndex}>
                            {Row.map((Cell, CellIndex) => (
                                <th key={CellIndex}>{Cell}</th>
                                //<th style={{backgroundColor:'aqua'}}>M</th>

                            ))}
                        </tr>
                    ))}
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