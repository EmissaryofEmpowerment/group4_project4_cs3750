import { useContext, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "../../util/axios"
import { UserContext } from "../../index";

function WaitingRoom(props) {
    const [status, setStatus] = useState('');
    const [start, setStart] = useState(false);
    const [time, setTime] = useState('');
    const navigate = useNavigate();
    const mode = 1; // tells the server to start the 3 second timer
    const IsAuth = useContext(UserContext);

    let intervalId;

    const handleStartGame = () => {
        setStart(true);
        intervalId = setInterval(checkReady, 500); // Run checkStartGameTimer every 500ms
        setTimeout(() => {
            clearInterval(intervalId); // Stop the loop after 2 minutes
        }, 120000);
    };

    const checkReady = () => {
    axios.put("/api/StartGame/", { mode })
    .then((res) => {
        setStatus(res.data);
        if (res.data === 'Game ready') {
            setStart(true);
            clearInterval(intervalId);
            StartTimer();
            console.log("game started");
        }
    })
    .catch((err) => {
        console.log(err);
    });
    };
 
    function StartTimer() {
        console.log('3 sec Timer started');
        setTime(3); // Set initial value of timer
        const intervalId = setInterval(() => { // Use setInterval instead of setTimeout
            setTime((time) => time - 1); // Decrease the timer by 1 every second
        }, 1000);
    
        setTimeout(() => {
            console.log('Timer ended');
            clearInterval(intervalId); // Clear the interval
            navigate('/Game');
        }, 3000);
    }


    return (
        <>
            {!IsAuth ?
            <Navigate to="/" replace={true} />
            :
            <div className="container">
                <h1>Waiting Room</h1>
                <h1>{status}</h1>
                {start ? <h2>You are in the queue</h2> : <h2>You are NOT in the queue</h2>}
                <p>The game will start in {time}</p>
                <button onClick={handleStartGame}>Start Game</button>
            </div>
            }
        </>
    );

}

export default WaitingRoom;
