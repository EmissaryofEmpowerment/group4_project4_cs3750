import React, { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../util/ProtectedRoute';
import axios from "../../util/axios"
import GameScreen from './GameScreen';

function WaitingRoom() {
    const [status, setStatus] = useState('');
    const [start, setStart] = useState(0);
    const navigate = useNavigate();
    let intervalId;
    const handleStartGame = () => {
        if (Number(start) === 0) {
            setStart(-1)
        }
        else if (Number(start) === -1) {
            setStart(1)
        }
        else if (Number(start) === 1) {
            setStart(0)
        }
        console.log(start);
        axios.put("/api/startGame/", { start })
            // axios.get(`http://localhost:4000/api/user/${UserName}`);
            .then((res) => {
                setStatus(res.data);
                console.log(res.data); // access the data property of the response object
                if (res.data === 'Game started') {
                    // setIsWaiting(false);
                    intervalId = setInterval(checkStartGameTimer, 500); // Run checkStartGameTimer every 500ms
                    setTimeout(() => {
                        clearInterval(intervalId); // Stop the loop after 2 minutes
                    }, 120000);
                    console.log("game started");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };


    const checkStartGameTimer = () => {
        axios.get("/api/checkTimer")
            .then((res) => {
                console.log(res.data);
                if (res.data === 'Timer is finished') {
                    // Handle redirect to GameScreen component

                    console.log("redirecting to game");
                    navigate('/Game');

                    clearInterval(intervalId); // Stop the loop
                    console.log("Timer is finished");
                }
                else {
                    console.log("Timer is running");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };


    return (
        <div>
            <h1>Waiting Room</h1>
            <h1>{status}</h1>
            {start !== -1 ? <h2>You are NOT in que</h2> : <h2>You are in que</h2>}
        </div>
    );









    // return (
    //     <div >
    //         {/* <div className="WaitingRoom"> */}
    //         {isWaiting && (
    //             <>
    //                 <h1>Waiting Room</h1>
    //                 <h1>{status}</h1>
    //                 {start !=0} (<><h2>gee</h2></>)
    //                 <button onClick={handleStartGame}>Start Game</button>
    //             </>
    //         )}
    //     </div>
    // );
}

export default WaitingRoom;
