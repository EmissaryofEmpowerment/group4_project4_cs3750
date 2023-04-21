import { Link } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from "../../index";

const NavBar = () => {
    const IsAuth = useContext(UserContext);

    return (
        <nav>
            {IsAuth ?
            <div className="d-flex justify-content-end">
                <Link to="/Logout" className="btn">
                    <button>Log out</button>
                </Link>
            </div>
            :
            <></>}
        </nav>
    );
};

export default NavBar;