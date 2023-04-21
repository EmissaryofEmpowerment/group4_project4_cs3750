import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "../../util/axios"
import { UserContext } from "../../index";

//TODO: either pass the score and results (won/loss) in a prop, or API call
//      set the values

// make API call to increment waiting players and set req.session.Inline = true;


export function ResultScreen() {
    const [results, SetResults] = useState(false);
    const [score, SetScore] = useState(0);
    const [foundWords, SetFoundWords] = useState([]);
    const [PlayersGameInfo, SetPlayersGameInfo] = useState([]);

    const IsAuth = useContext(UserContext);

    //Run this useEffect only when the page loads
    useEffect(() => {
        axios.get("/api/FetchPlayersGameInfo")
            .then((res) => {
                // console.log(JSON.stringify(res.data));
                SetPlayersGameInfo(res.data.PlayersGameInfo);
            })
            .catch((err) => {
                console.log(`Unable to fetch the Players game info for the below reason\n${err.message}`);
            });
    }, []);

    const Contruct = (newWord, fScore, gResults) => {
        SetFoundWords(prevWords => [...prevWords, newWord]);
        SetScore(fScore);
        SetResults(gResults);
    };

    //Contruct()
    let Score = sessionStorage.getItem("player1");
    // SetScore(Score);

    const PlayersScores = () => {
        let SortResults = PlayersGameInfo.sort((Item1, Item2) => {  //Sorts the array by descending score.  Source https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
            return Item2.Score - Item1.Score;
        });

        //TODO: Sort by word in ascending order for each player

        return (
            <>
                <p>Game Results</p>
                <ol>
                {SortResults.map((Entry, EntryIndex) => (
                    <>
                        <li key={Entry.Username}>
                            {Entry.Username} with a score of {Entry.Score}
                        </li>
                        {/* TODO: Display the words the user has guessed to the client */}
                        {/* <p key={Entry.GuessedWords}>
                            Words Player Found:
                            {Entry.GuessedWords.map((CurrentWord) => (
                                Entry.GuessedWords[Entry.GuessedWords.length - 1] === {CurrentWord} ?
                                <span key={CurrentWord}> {CurrentWord} </span> :
                                <span key={CurrentWord}> {CurrentWord},</span>
                            ))}
                        </p> */}
                    </>
                ))}
                </ol>
            </>
        );
    }


    return (
        <div className="container">
            <p>
                TODO: once we handle the passing of the words found, score and result, we also need to put the player back inline
                by req.session.Inline = false and waitingPlayers++;
            </p>
            {!IsAuth ?
                <Navigate to="/" replace={true} />
                : <>
                    <h1>{results ? `Congrats! you won!` : `Sorry you lost. `}</h1>
                    <h2>Your score is: {Score}</h2>
                    <h2>Words you found:</h2>
                    <ul>
                        {foundWords.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                    <PlayersScores />
                    <h2>Go to Waiting Room to play again.</h2>
                    <Link to="/WaitingRoom">
                        <button>Go to Waiting Room</button>
                    </Link>
                </>}
        </div>
    );
}
export default ResultScreen;