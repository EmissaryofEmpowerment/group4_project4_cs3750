import { useContext, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "../../index";

//TODO: either pass the score and results (won/loss) in a prop, or API call
//      set the values



export function ResultScreen() {
    const [results, SetResults] = useState(false);
    const [score, SetScore] = useState(0);
    const [foundWords, SetFoundWords] = useState(["Apple", "chicker"]);
    const IsAuth = useContext(UserContext);


    const Contruct = (newWord, fScore, gResults) => {
        SetFoundWords(prevWords => [...prevWords, newWord]);
        SetScore(fScore);
        SetResults(gResults);
    };

    return (
        <>
        <p> TODO: once we handle the passing of the words found, score and result, we also need to put the player back inline
            by req.session.Inline = false and waitingPlayers++;
        </p>
            {!IsAuth ?
                <Navigate to="/" replace={true} /> :
                <>
                    <h1>{results ? `Congrats! you won!` : `Sorry you lost. `}</h1>
                    <h2>Your score is: {score}</h2>
                    <h2>Words you found:</h2>
                    <ul>
                        {foundWords.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                    <h2>Would you like to play again?</h2>
                    <Link to="/WaitingRoom">
                        <button>Go to Waiting Room</button>
                    </Link>

                </>}
        </>
    );
}
export default ResultScreen;