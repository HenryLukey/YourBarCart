import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

// Use react's createContext
const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    // Make a useState to keep track of the currently signed in user
    const [user, setUser] = useState({});

    // Use Firebase's Google login function to handle signing in with Google
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    // Use Firebase's signOut function to handle logging out, passing it the auth from
    // the firebase config file
    const logOut = () => {
        signOut(auth);
    }

    // Called upon the first render
    useEffect(() => {
        // If the user changes (logged in or logged out or swapped account) then set
        // the user to the new current user
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{googleSignIn, logOut, user}}>
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth = () => {
    return useContext(AuthContext);
};