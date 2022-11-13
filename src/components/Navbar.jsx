import React, { useRef, useState, useEffect } from "react";
import SettingsButton from "./SettingsButton";
import { useNavigate } from "react-router-dom";

const Navbar = ({ handleHeight }) => {

    const navigate = useNavigate();
    const navRef = useRef(null);

    // Navigate to home screen
    const returnToHome = () => {
        navigate("/");
    }

    useEffect(() => {
        console.log(navRef.current.clientHeight);
        handleHeight(navRef.current.clientHeight);
    })

    return (
        // Div to contain all nav elements
        <div ref={navRef} className="flex items-center justify-center bg-light top-0 z-50 sticky border-b bg-lightColour border-darkColour">
            <h1 className="text-darkColour text-3xl font-black font-roboto px-4 select-none hover:cursor-pointer" onClick={returnToHome}>YourBarCart</h1>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            {/* Settings button, this is a dropdown of options */}
            <SettingsButton />
        </div>
    )
}

export default Navbar