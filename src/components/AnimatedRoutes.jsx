import React from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthContextProvider } from "../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import CocktailPage from '../pages/CocktailPage';
import Home from "../pages/Home"
import Signin from "../pages/Signin";
import Navbar from "./Navbar";
import Protected from "./Protected";

const AnimatedRoutes = () => {

    // Get the current page location from router dom
    const location = useLocation();

    return (
        // Must be wrapped in AuthContextProvider so some routes can be protected (redirect if not signed in)
        <AuthContextProvider>
            {/* AnimatePresence wrapper so there can be transitions when navigating */}
            <AnimatePresence>
                {/* Render the navbar on all pages except the signin page */}
                {location.pathname !== "/signin" && <Navbar id="navbar"/>}
                {/* Routes for all the pages */}
                <Routes location={location} key={location.pathname}>
                    {/* All routes except signin are protected */}
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/cocktailPage" element={<CocktailPage />} />
                </Routes>
            </AnimatePresence>
        </AuthContextProvider>
    );
}

export default AnimatedRoutes;