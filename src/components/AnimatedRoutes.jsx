import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthContextProvider } from "../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { UserAuth } from "../context/AuthContext";
import CocktailPage from '../pages/CocktailPage';
import Home from "../pages/Home"
import Signin from "../pages/Signin";
import Articles from "../pages/Articles";
import Article from "../pages/Article";
import Navbar from "./Navbar";
import Protected from "./Protected";
import CreateArticle from "../pages/CreateArticle";
import TestComponent from "./TestComponent";

const AnimatedRoutes = () => {

    // Get the current page location from router dom
    const location = useLocation();

    // Get the current user
    const {user} = UserAuth();

    const [navHeight, setNavHeight] = useState(0);

    const HandleNavHeight = (height) => {
        setNavHeight(height);
    }

    useEffect(() => {
        document.body.classList.add("min-h-screen");
    },[]);

    console.log("USER: " + user);

    return (
        // AnimatePresence wrapper so there can be transitions when navigating
        <AnimatePresence>
            {/* Render the navbar on all pages except the signin page */}
            {location.pathname !== "/signin" && <Navbar handleHeight={HandleNavHeight} id="navbar"/>}
            {/* Routes for all the pages */}
            <Routes location={location} key={location.pathname}>
                {/* All routes except signin are protected */}
                <Route path="/signin" element={<Signin />} />
                <Route path="/" element={<Home navHeight={navHeight} />} />
                <Route path="/cocktails/:name" element={<CocktailPage />} />
                {user && user?.email === "yourbarcartonline@gmail.com" && user?.uid === "dezOaxrrmadL7DP0H8GqHeNkrYA3" && (
                    <Route path="/createArticle" element={<CreateArticle />} />
                )}
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:id" element ={<Article />} />
                <Route path="/testing" element={<TestComponent />} />
            </Routes>
        </AnimatePresence>
    );
}

export default AnimatedRoutes;