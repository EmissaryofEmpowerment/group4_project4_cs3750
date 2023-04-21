import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../util/axios";
import CryptoJS from "crypto-js";

export function NewUserForm(props) {
    const [Credentials, SetCredentials] = useState({Username: "", Password1: "", Password2: ""});
    const [ErrorMessage, SetErrorMessage] = useState("");

    const Navigate = useNavigate();  //makes a variable that we can use to navigate from one page to another when a condition is met

    function HandleSubmit(e) {
        e.preventDefault();

        axios.get(`/api/UsernameUsed/${Credentials.Username}`)
            .then((res) => {
                if (res.data.used && Credentials.Password1 !== Credentials.Password2) {
                    SetErrorMessage(`${res.data.message}<br/>
                    Your passwords don't match, please make sure they do.`);
                }
                else if (res.data.used) {
                    SetErrorMessage(res.data.message);
                }
                else if (Credentials.Password1 !== Credentials.Password2) {
                    SetErrorMessage("Your passwords don't match, please make sure they do.");
                }
                else {
                    const Salt = CryptoJS.lib.WordArray.random(64).toString();  //Creates a salt value that is 64*2 hex (default encoder for toString()) values long (this is because hex uses 1/2 of the byte while a character uses the full byte)
                    const HashedPassword = CryptoJS.SHA256(Credentials.Password1 + Salt).toString();
                    console.log(Credentials.Password + Salt)
                    console.log(`Hashed Password: ${HashedPassword}`);

                    axios.post("/api/CreateUser", { Username: Credentials.Username, Salt: Salt, HashedPassword: HashedPassword })
                        .then((res) => {
                            console.log(res.data.message);
                            // alert("Account creation successful");
                            props.SetIsAuth(res.data.IsAuth);  //store the logged in state to the index.js state variable.
                            // setTimeout(() => {  //waits a half a second before redirecting
                                Navigate("/WaitingRoom");
                            // }, 250);
                        })
                        .catch((err) => {
                            // alert("Account creation unsuccessful");
                            console.log(`Unable to create your account for the below reason:\n${err.message}`);
                        });
                }
            })
            .catch((err) => {
                // alert("Account creation unsuccessful");
                console.log(`Unable to validate username because of the below reason:\n${err.message}`);
            });
    }

    function HandleChange(e) {
        SetCredentials({ ...Credentials, [e.target.id]: e.target.value });  //the ...Credentials takes the Credentials into decompose it, gets all keys and values, and updates the data inside the [], with the data being supplied, what is after the :
        // SetCredentials({ Username: "User123456", Password: "Password976431", UserName: "NewUsername"});  //here is a good example of what this is doing, the first two here would be the ...Credentials and the third will
        // be [e.target.name]: e.target.value, the third argument will override what was opened before
    }

    return (
        <>
            <div className="container">
                <form action="/" onSubmit={HandleSubmit}>
                    <label htmlFor="Username">Username:  </label>
                    <input
                        type="text"
                        id="Username"
                        onChange={HandleChange}
                        required
                    />
                    <br />
                    <label htmlFor="Password1">Password:  </label>
                    <input
                        type="password"
                        id="Password1"
                        onChange={HandleChange}
                        required
                    />
                    <br />
                    <label htmlFor="Password2">Confirm Password:  </label>
                    <input
                        type="password"
                        id="Password2"
                        onChange={HandleChange}
                        required
                    />
                    <br />
                    {/* Need some system to allow the user to return to the home screen */}
                    <button type="submit" className='MarginTop8'>Create Account</button>
                </form>
                <p dangerouslySetInnerHTML={{__html: ErrorMessage}}/>  {/* This solution was found here https://blog.logrocket.com/using-dangerouslysetinnerhtml-in-a-react-application/ */}
            </div>
        </>
    );
}

export default NewUserForm;