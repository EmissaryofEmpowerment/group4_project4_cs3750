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

    function updateStart(start) {
        if (start === 0) {
            return -1;
        } else if (start === -1) {
            return 1;
        } else if (start === 1) {
            return 0;
        } else {
            return start;
        }
    }

    const handleStartGame = () => {
        setStart(updateStart(start));
        // console.log(start);
        axios.put("/api/StartGame/", { mode })
            .then((res) => {
                setStatus(res.data);
                // console.log(res.data); // access the data property of the response object
                if (res.data === 'Game started') {
                    setStart(true);
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
        setTime(3 - elapsedTime);
    }

    function checkStartGameTimer() {
        axios.get("/api/CheckTimer")
            .then((res) => {
                const { Timer, elapsedTime } = res.data;
                displayCountDown(elapsedTime);
                // console.log("message from server " + Timer);
                // console.log(elapsedTime);
                if (Timer === false) {
                    // Handle redirect to GameScreen component

                    // console.log("redirecting to game");
                    navigate('/Game');

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
            {!IsAuth ?
                <Navigate to="/" replace={true} /> :
                <>
                    <div>
                        <h1>Waiting Room</h1>
                        <h1>{status}</h1>
                        {start ? <h2>You are in the queue</h2> : <h2>You are NOT in the queue</h2>}
                        <p>The game will start in {time}</p>
                        <button onClick={handleStartGame}>Start Game</button>
                    </div>
                </>}
        </>
    );

}

export default WaitingRoom;
