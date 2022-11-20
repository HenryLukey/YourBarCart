import React, { useRef, useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { ReactComponent as Cog } from "../icons/cog.svg";
import { useNavigate } from "react-router-dom";
import { ref } from "firebase/storage";

const SettingsButton = ({ icon }) => {
    // Get access to the logOut function from UserAuth
    const {user, logOut} = UserAuth();
    // Make a useState to keep track of whether the dropdown is open
    const [open, setOpen] = useState(false);
    // Tracks whether the user is in darkmode or lightmode
    const [isDark, setIsDark] = useState(false);
    // Use ref variable used to reference the settings button and dropdown
    const settingsContainer = useRef(null);

    const navigate = useNavigate();

    // When toggled set open to be the opposite of what it currently is
    const handleOpen = () => {
        setOpen(!open);
    };

    // When toggled set isDark to be the opposite of what it currently is
    const toggleDarkMode = () => {
        localStorage.setItem("dark-mode", JSON.stringify(!isDark))
        setIsDark(!isDark);
    };

    useEffect(() => {
        const bodyClass = window.document.body.classList;
        if (isDark) {
            bodyClass.remove("bg-lightColour");
            bodyClass.add("dark", "bg-darkModeMain");
        } else {
            bodyClass.remove("dark", "bg-darkModeMain");
            bodyClass.add("bg-lightColour");
        }
    },[isDark])

    useEffect(() => {
        if (localStorage.getItem("dark-mode") !== null) {
            console.log("SOMETHING IN STORAGE");
            if (localStorage.getItem("dark-mode") === "true") {
                console.log("SETTING TRUE");
                setIsDark(true);
            } else if (localStorage.getItem("dark-mode") === "false") {
                console.log("SETTING FALSE");
                setIsDark(false);
            }
            console.log("here it is:", localStorage.getItem("dark-mode"))
        } else {
            localStorage.setItem("dark-mode", JSON.stringify(false))
        }
    },[]);

    // Attempt to logout, if it fails then log the error
    const handleClick = async () => {
        if (user?.uid) {
            try {
                await logOut();
                setOpen(false);
            } catch (error) {
                console.log(error);
            }
        } else {
            navigate("/signin");
        }   
    }

    //Checks if the user clicked anywhere other than the settings button or its dropdown, and closes the dropdown if so
    const closeOpenMenus = (e) => {
        if (settingsContainer.current && open && !settingsContainer.current.contains(e.target)) {
            setOpen(false);
        }
    }

    // Add userEffect to add an event listener to close open menus when the user clicks
    useEffect(() => {
        document.addEventListener("mousedown", closeOpenMenus);
        return () => {
            document.removeEventListener("mousedown", closeOpenMenus);
        }
    },[closeOpenMenus]);
    
    return (
        // Create a div to contain both the button and it's dropdown
        <div ref={settingsContainer} className={"relative inline-block m-1"}>
            {/* When clicked call handleOpen */}
            <div onClick={handleOpen} className=" m-1 navbar-icon border border-darkColour">
                <Cog className={`${open ? "rotate-60 transition-all duration-200 ease-linear" : "-rotate-60 transition-all duration-200 ease-linear"}`}/>
            </div>
            {/* If open is true then render the dropdown */}
            {open ? (
                // The dropdown is contained in an unordered list
                <ul className="absolute right-0 z-30 w-48 origin-top-right bg-lightColour dark:bg-darkModeMain border border-darkColour hover-rounded-xl text-darkColour text-xl font-cormorant mt-2">
                    {/* Call handleSignOut if someone clicks the signout button */}
                    <li onClick={handleClick} className="mx-2 my-3 border border-darkColour hover-rounded-lg select-none bg-primary hover:bg-primaryVariant">
                        {user?.uid ? <div>Sign out</div> : <div>Sign in</div>}
                    </li>
                    {/* Dark mode toggle */}
                    <li onClick={toggleDarkMode} className="mx-2 my-3 hover:rounded-lg border border-darkColour transition-all duration-200 ease-linear select-none bg-primary hover:bg-primaryVariant">
                        <button>Dark mode</button>
                    </li>
                </ul>
            // If it's not open then render nothing
            ) : null}
        </div>
    );
}

export default SettingsButton;