import { Link } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from "../../index";

const NavBar = () => {
    const IsAuth = useContext(UserContext);

    return (
        <nav>
            {IsAuth ? <Link to="/Logout"><button>Log out</button></Link> : <></>}
        </nav>
    );
};

export default NavBar;