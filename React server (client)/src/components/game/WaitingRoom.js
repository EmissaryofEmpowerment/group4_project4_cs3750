import React, { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../util/ProtectedRoute';
import axios from "../../util/axios"
import GameScreen from './GameScreen';

function WaitingRoom() {
    const [isWaiting, setIsWaiting] = useState(true);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleStartGame = () => {
        axios.get("/api/startGame")
            .then((res) => {
                setStatus(res.data);
                console.log(res.data); // access the data property of the response object
                if (res.data === 'Game started') {
                    // setIsWaiting(false);
                    const intervalId = setInterval(checkStartGameTimer, 500); // Run checkStartGameTimer every 500ms
                    // setTimeout(() => {
                    //     clearInterval(intervalId); // Stop the loop after 2 minutes
                    // }, 120000);
                    console.log("game started");
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };


    // const checkStartGameTimer = () => {
    //     axios.post("/api/checkTimer")
    //         .then((res) => {
    //             console.log(res.data); // access the data property of the response object
    //         })
    //         .then((res) => {
    //             if (res.data === 'Game started') {
    //                 handleRedirectToGameScreen();
    //                 console.log("game started");
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         });
    // };

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
        <div >
            {/* <div className="WaitingRoom"> */}
            {isWaiting && (
                <>
                    <h1>Waiting Room</h1>
                    <h1>{status}</h1>
                    <button onClick={handleStartGame}>Start Game</button>
                </>
            )}
            {/* <Route element={<ProtectedRoute />}>
                <Route
                    exact
                    path="/Game"
                    element={<GameScreen redirectToGameScreen={handleRedirectToGameScreen} />}
                />
            </Route> */}
        </div>
    );
}

export default WaitingRoom;
