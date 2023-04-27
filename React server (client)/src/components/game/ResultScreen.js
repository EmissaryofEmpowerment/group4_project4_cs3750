import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "../../util/axios"
import { UserContext } from "../../index";

//TODO: either pass the score and results (won/loss) in a prop, or API call
//      set the values

// make API call to increment waiting players and set req.session.Inline = true;

export function ResultScreen() {
    const [foundWords, SetFoundWords] = useState([]);
    const [PlayersGameInfo, SetPlayersGameInfo] = useState([]);
    const navigate = useNavigate();

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


    const GoToWaitingRoom = () => {
        axios.get("/api/Restart")
          .then((res) => {
            navigate('/WaitingRoom');
   
          })
          .catch((error) => {
            console.log(error);
          });
          
    };



    //Contruct()
    let Score = sessionStorage.getItem("player1");
    console.log(`Value of Score${Score}`);
    // SetScore(Score);

    const PlayersScores = () => {
        // console.log(`Raw Data: ${JSON.stringify(PlayersGameInfo)}`)
        let SortResults = PlayersGameInfo.sort((Item1, Item2) => {  //Sorts the array by descending score.  Source https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
            return Item2.Score - Item1.Score;
        });

        // console.log(`Data sorted by score: ${JSON.stringify(SortResults)}`)

        SortResults.forEach((Entry) => {
            Entry.GuessedWords = Entry.GuessedWords.sort();  //Sorts the array of words found by descending order
        });

        // console.log(`Word sorted in alphabetic order: ${JSON.stringify(SortResults)}`)

        return (
            <>
                <p>Game Results</p>
                <ol>
                    {SortResults.map((Entry, EntryIndex) => (
                        <li key={Entry.Username}>
                            {Entry.Username} with a score of {Entry.Score}<br/>
                            Words Found: {Entry.GuessedWords.map((Word, WordIndex) => (
                                Entry.GuessedWords.length - 1 !== WordIndex ?
                                Word + ", " :
                                Word
                            ))}
                        </li>
                    ))}
                </ol>
            </>
        );
    }

    return (
        <div className="container">
            {!IsAuth ?
                <Navigate to="/" replace={true} />
                : <>
                    <h2>Your score is: {Score}</h2>
                    <h2>Words you found:</h2>
                    <ul>
                        {foundWords.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                    <PlayersScores />
                    <h2>Go to Waiting Room to play again.</h2>
                    <button onClick={GoToWaitingRoom}>Go to Waiting Room</button>
                    {/* <Link to="/WaitingRoom">
                        <button>Go to Waiting Room</button>
                    </Link> */}
                </>}
        </div>
    );
}
export default ResultScreen;