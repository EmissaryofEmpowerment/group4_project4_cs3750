import React, { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../util/ProtectedRoute';
import axios from "../../util/axios"
import GameScreen from './GameScreen';

function WaitingRoom() {
    const [isWaiting, setIsWaiting] = useState(true);
    const navigate = useNavigate();

    const handleStartGame = () => {
        axios.get("/api/startGame")
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Game started') {
                    setIsWaiting(false);
                }
            })
            .catch((err) => {
                console.log(`Unable to determine what to do with the player once they have guessed the word for the below reason\n${err.message}`);
            });
    };


    // Handle redirect to GameScreen component
    const handleRedirectToGameScreen = () => {
        navigate('/Game');
    };

    return (
        <div >
            <h1>Waiting room</h1>
            {/* <div className="WaitingRoom"> */}
            {isWaiting && (
                <>
                    <h1>Waiting Room</h1>
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
