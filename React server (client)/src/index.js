import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles.css'
/*
Import your components from the components folder

Examples (the .js at the end is optional):
import DisplayGame from './components/DisplayGame.js';
import DisplayGameResults from './components/DisplayGameResults.js';
*/
import Template from './components/Template'  //This can be removed for your project
import LogIn from './components/LogIn' 

function App() {
    return (
        <div>
            <Routes>
                {/*
                    TODO: create react routes and component 

                    Example (The first is the root domain and the second is one of possibly many sub-domains):
                    <Route exact path="/" element={<DisplayGame />} />
                    <Route exact path="/game-result" element={<DisplayGameResults />} />
                */}
                <Route exact path="/" element={<LogIn />} />  {/*This can be removed for your project*/}
                {/* <Route path="/Login" element={<LogIn />} /> */}
            </Routes>
        </div>
    );
}

// defines root
const root = createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);