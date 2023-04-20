// This solution was found here https://www.robinwieruch.de/react-router-private-routes/
import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../index';

const ProtectedRoute = () => {
    const IsAuth = useContext(UserContext);

    return (
        IsAuth ? <Outlet /> : <Navigate to='/' replace />
    );
};

export default ProtectedRoute;