import React from "react";
import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router-dom";

/**
 * Checks if the user is logged in before allowing access.
 */
const PrivateRoute = ({children}: { children: React.ReactNode }) => {
    const {user, loading} = useAuth();

    if (loading) return null;


    if (!user) return <Navigate to="/login" replace/>;

    return <>{children}</>;
};

export default PrivateRoute;
