import React from "react";
import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router-dom";

/**
 * Checks if the user is logged in before allowing access.
 */
const PrivateRoute = ({children, allowdRoles}: { children: React.ReactNode, allowdRoles? : string[]}) => {
    const {authToken, loading} = useAuth();

    if (loading) return null;

    if (!authToken) return <Navigate to="/login" replace/>;

    if(allowdRoles && !allowdRoles.includes( authToken.role  || ""))
        return <Navigate to="/" replace/>
    
    return <>{children}</>;
};

export default PrivateRoute;
