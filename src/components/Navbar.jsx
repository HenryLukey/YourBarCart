import React from "react";
import SettingsButton from "./SettingsButton";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    // Navigate to home screen
    const returnToHome = () => {
        navigate("/");
    }

    return (
        // Div to contain all nav elements
        <div className="flex items-center justify-center bg-light top-0 z-50 sticky border-b bg-lightColour border-darkColour">
            <h1 className="text-darkColour text-3xl font-black font-roboto px-4 select-none" onClick={returnToHome}>YourBarCart</h1>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            {/* Settings button, this is a dropdown of options */}
            <SettingsButton />
        </div>
    )
}

export default Navbar