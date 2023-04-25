import { React, createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "./util/axios"
import './styles.css'
// Authentication components
import LogInForm from './components/authentication/Login';
import NewUserForm from './components/authentication/NewUser';
import Logout from './components/authentication/Logout';
// Game components
import GameScreen from './components/game/GameScreen'
import WaitingRoom from './components/game/WaitingRoom'
import ResultScreen from './components/game/ResultScreen'
// template components
import Navbar from './components/template/Navbar'
// Utility tools
import ProtectedRoute from './util/ProtectedRoute';

export const UserContext = createContext({});

function App() {
    axios.defaults.withCredentials = true;  //added with professor (makes axios send credentials for every axios request)

    const [Loading, SetLoading] = useState(true);  //used to prevent the page from being displaying until the client know if they are authenticated (to prevent the client from reloading the page and being displayed the login screen for a second)
    const [IsAuth, SetIsAuth] = useState(false);  //stores if the user is authenticated.

    useEffect(() => {
        const FetchUserAuth = async () => {
            try {
                SetLoading(true);
                const IsAuthResponse = await axios.get("/api/IsAuth");
                SetIsAuth(IsAuthResponse.data.IsAuth);
                SetLoading(false);
            }
            catch (err) {
                SetLoading(false);
                console.log(`The following error occurred in checking authentication\n${err}`)
            }
        }
        FetchUserAuth();
    }, []);

    return (
        <>
            <UserContext.Provider value={IsAuth}>
                {Loading ?  //If the page is loading, display nothing until it is not loading
                <></> :
                <>
                    <Navbar />
                    <Routes>
                        <Route exact path="/" element={<LogInForm SetIsAuth={SetIsAuth} />} />
                        <Route exact path="/NewUser" element={<NewUserForm SetIsAuth={SetIsAuth} />} />  {/* This is the page that will allow new users to create an account */}
                        <Route exact path="/Logout" element={<Logout SetIsAuth={SetIsAuth} />} />
                        <Route element={<ProtectedRoute />}>  {/* Place the routes you wish to be protected (require someone to be logged in to view) in here */}
                            <Route exact path="/WaitingRoom" element={<WaitingRoom />} />
                            <Route exact path="/Game" element={<GameScreen />} />  {/* This is the game board the user plays the game on */}
                            <Route exact path="/ResultScreen" element={<ResultScreen />} />
                        </Route>
                    </Routes>
                </>}
            </UserContext.Provider>
        </>
    );
}

// defines root
const root = createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);