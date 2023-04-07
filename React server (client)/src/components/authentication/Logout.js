import axios from "../../util/axios";
import { useNavigate } from "react-router-dom";

export function Logout(props) {
    const Navigate = useNavigate();
    axios.post("/api/Logout")
    .then((res) => {
        //alert("Logout successful");
        props.SetIsAuth(res.data.IsAuth);  //store the logged in state to the index.js state variable.
        Navigate("/");
    })
    .catch((err) => {
        //alert("Logout Unsuccessful");
        console.log(`Unable to logout because of the below reason:\n${err.message}`);
    });
}

export default Logout;