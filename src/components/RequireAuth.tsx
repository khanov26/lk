import React from 'react';
import {useAuth} from "../useAuth";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const RequireAuth = () => {
    const {user} = useAuth();
    const location = useLocation();

    return (
        user ? <Outlet/> : <Navigate to="/login" state={{from: location}} replace />
    );
};

export default RequireAuth;