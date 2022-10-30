import React, { Children } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

// Protected component - used to wrap routes that need to be protected. This was initially used
// because the program only functioned when a user was logged in, this has now changed, so this will
// be used in the future for "account" page, etc.
const Protected = ({children}) => {
    // If there is no user logged in then navigate to the signin page
    const {user} = UserAuth();
    if (!user) {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default Protected;