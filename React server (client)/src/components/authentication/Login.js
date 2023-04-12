import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../util/axios";
import CryptoJS from "crypto-js";

export function LoginForm(props) {
    const [Credentials, SetCredentials] = useState({});
    const [ErrorMsg, SetErrorMsg] = useState("");
    const Navigate = useNavigate();  //makes a variable that we can use to navigate from one page to another when a condition is met

    async function HandleSubmit(e) {
        e.preventDefault();
        axios.get(`/api/SaltForUser/${Credentials.Username}`)
            .then((res) => {
                if (res.data.Salt) {
                    const HashedPassword = CryptoJS.SHA256(Credentials.Password + res.data.Salt).toString();
                    // console.log(`HashedPassword: ${HashedPassword}`);

                    axios.post("/api/Login", { Username: Credentials.Username, HashedPassword: HashedPassword })
                        .then((res) => {
                            if (res.data.IsAuth) {
                                // alert("Login successful");
                                props.SetIsAuth(res.data.IsAuth);  //store the logged in state to the index.js state variable.
                                // setTimeout(() => {  //waits a half a second before redirecting
<<<<<<< Updated upstream
                                Navigate("/Game");
=======
                                // PNavigate("/Game");
                                PNavigate("/WaitingRoom");
>>>>>>> Stashed changes
                                // }, 250);
                            }
                            else {
                                console.log(JSON.stringify(res.data));
                                throw new Error(res.data.error);
                            }
                        })
                        .catch((err) => {
                            //alert("Login unsuccessful (bad password)");
                            SetErrorMsg(err.response.data.message);
                            console.log(`Unable to login because of the below reason:\n${err.message}`);
                        });
                }
                else {
                    console.log(JSON.stringify(res.data));
                    throw new Error(res.data.error);
                }
            })
            .catch((err) => {
                SetErrorMsg(err.response.data.message);
                // alert("Login unsuccessful (bad username)");
                console.log(`Unable to login because of the below reason:\n${err.message}`);
            });
    };

    function HandleChange(e) {
        SetErrorMsg("");  //clears any error messages that were produced
        SetCredentials({ ...Credentials, [e.target.id]: e.target.value });  //the ...Credentials takes the Credentials into decompose it, gets all keys and values, and updates the data inside the [], with the data being supplied, what is after the :
        // SetCredentials({ Username: "User123456", Password: "Password976431", UserName: "NewUsername"});  //here is a good example of what this is doing, the first two here would be the ...Credentials and the third will
        // be [e.target.name]: e.target.value, the third argument will override what was opened before
    };

    return (
        <>
<<<<<<< Updated upstream
            <h1>Welcome to Grid Word Finder!</h1>
            <h2>Login or Create a New Account</h2>
            <br />
            <form action="/" onSubmit={HandleSubmit}>
                <label htmlFor="Username">Username:  </label>
                <input
                    type="text"
                    id="Username"
                    onChange={HandleChange}
                    required
                />
=======
            {IsAuth ? 
            // <Navigate to="/Game" replace={true} /> :
            <Navigate to="/WaitingRoom" replace={true} /> :
            <>
                <h1>Welcome to Grid Word Finder!</h1>
                <h2>Login or Create a New Account</h2>
>>>>>>> Stashed changes
                <br />
                <label htmlFor="Password">Password:  </label>
                <input
                    type="password"
                    id="Password"
                    onChange={HandleChange}
                    required
                />
                <br />
                <p>{ErrorMsg}</p>
                <button type="submit" className='MarginTop8'>Login</button>
            </form>
            <Link to="/NewUser">
                Create New Account
            </Link>
        </>
    );
}

export default LoginForm;