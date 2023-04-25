import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "../../util/axios"
import { UserContext } from "../../index";

function WaitingRoom() {
    const [status, setStatus] = useState('');
    const [start, setStart] = useState(false);
    const [time, setTime] = useState('');
    const navigate = useNavigate();
    const IsAuth = useContext(UserContext);

    let intervalId;

    const handleStartGame = (e) => {
        console.log()
        setStart(true);
        document.getElementById("StartButton").disabled = true;
        intervalId = setInterval(checkReady, 500); // Run checkStartGameTimer every 500ms

        // When the user switches away from the current tab, clear the interval
        // window.addEventListener('blur', () => {
        //     clearInterval(intervalId);
        // });

        axios.put('api/EnqueuePlayer')
        .catch((err) => {
            console.log(`Unable to enqueue the player for the below reason\n${err.message}`);
        });

        // When the user returns to the tab, start the interval again
        // window.addEventListener('focus', () => {
        //     intervalId = setInterval(checkReady, 500);
        // });

        setTimeout(() => {
            clearInterval(intervalId); // Stop the loop after 2 minutes
            console.log(`The remaining players didn't click start`);
        }, 120000);
    };


    const checkReady = () => {
        axios.put("/api/StartGame/")
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
                    {start ? <h2>You are in the queue</h2> : <h2>Click 'Start Game' to be added to the queue</h2>}
                    <p>The game will start in {time}</p>
                    <button onClick={handleStartGame} id="StartButton">Start Game</button>
                </div>
            }
        </>
    );

}

export default WaitingRoom;
