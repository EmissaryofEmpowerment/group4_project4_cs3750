import { React, useState, useEffect } from 'react';

export function GameScreen() {
    const [PlayerWord, SetPlayerWord] = useState("");

    useEffect(() => {
        const handleKeyDown = (e) => {
            // e.preventhefault();  // documentation for object model events https://www.w3.org/TR/DOM-Level-2-Events/events.html
            const PressedKey = e.key;  // Extract the key and keycode of the pressed key

            const re = new RegExp(/^[A-Z]$/, "i");  // Makes a regular expression that is used to determine if the key pressed is a valid character (a-z and A-Z)

            if (re.exec(PressedKey) !== null) {
                SetPlayerWord(PlayerWord.concat(PressedKey.toUpperCase()));  // Adds the letter to the PlayerWord
            }
            else if (PressedKey === "Backspace") {
                SetPlayerWord(PlayerWord.slice(0, -1));  // Removes the last letter from PlayerWord.  Source https://masteringjs.io/tutorials/fundamentals/remove-last-character
            }
            else if (PressedKey === "Enter") {
                // See if the player's word is a actual word
                SetPlayerWord("");  //Then reset the word so they can find a new word
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);  // This return keeps the event listener from chaining for multiple times.
    }, [PlayerWord]);

    return (
        <>
            <p>WIP</p>
            {/* The following table is hardcoded for how, but will be made enumerable later and the supplied inline-styles is how we could highlight the word */}
            <table>
                <tbody>
                    <tr>
                        <th style={{backgroundColor:'aqua'}}>1</th>
                        <th style={{backgroundColor:'aqua'}}>2</th>
                        <th style={{backgroundColor:'aqua'}}>3</th>
                        <th>4</th>
                    </tr>
                    <tr>
                        <th>5</th>
                        <th style={{backgroundColor:'aqua'}}>6</th>
                        <th style={{backgroundColor:'aqua'}}>7</th>
                        <th>8</th>
                    </tr>
                    <tr>
                        <th>9</th>
                        <th>10</th>
                        <th style={{backgroundColor:'aqua'}}>11</th>
                        <th>12</th>
                    </tr>
                    <tr>
                        <th>13</th>
                        <th>14</th>
                        <th style={{backgroundColor:'aqua'}}>15</th>
                        <th style={{backgroundColor:'aqua'}}>16</th>
                    </tr>
                </tbody>
            </table>
            <p>
                Current Word<br />
                {PlayerWord}
            </p>
        </>
    );
}

export default GameScreen;